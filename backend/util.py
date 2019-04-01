import datetime
import json
import os

import gym
import numpy as np
import tensorflow as tf

import atari_wrappers

EP_STEP_LIMIT = 1000

def score_teams(task,
                team_list,
                handin_dir,
                path_prefix,
                batch_size=None,
                train_pair=None,
                test_pair=None,
                env_name=None):
    if task == 'classification':
        if batch_size is None:
            print("BATCH_SIZE CANNOT BE NONE FOR CLASSIFICATION")
            exit()
        # load datasets
        X_train, y_train = train_pair
        X_test, y_test = test_pair
    elif task == 'reinforcement_learning':
        if env_name is None:
            print("ENV_NAME CANNOT BE NONE FOR REINFORCEMENT LEARNING")
            exit()
        env = atari_wrappers.wrap_deepmind(
            atari_wrappers.make_atari(env_name), frame_stack=True)

    # score assignments
    team_dict = dict()
    unix_now = unix_time_millis(datetime.datetime.now())
    for team in team_list:
        team_name = list(team.keys())[0]
        for username in list(team.values())[0]:
            print("TEAM: {}\tUSERNAME: {}".format(team, username))
            try:
                model_directory = os.path.join(handin_dir, username)
                # train
                if task == 'classification':
                    train_accuracy, train_confusion_matrix = score_classification(
                        model_directory, X_train, y_train, path_prefix,
                        batch_size)
                    train_dict = {
                        'accuracy': float(train_accuracy),
                        'confusion_matrix': train_confusion_matrix.tolist()
                    }
                # test
                if task == 'reinforcement_learning':
                    total_reward, episode_rewards, episode_lengths = score_reward(
                        model_directory, env, path_prefix)
                    test_dict = {
                        'total_reward': float(total_reward),
                        'episode_rewards': episode_rewards,
                        'episode_lengths': episode_lengths
                    }
                elif task == 'classification':
                    test_accuracy, test_confusion_matrix = score_classification(
                        model_directory, X_test, y_test, path_prefix,
                        batch_size)
                    test_dict = {
                        'accuracy': float(test_accuracy),
                        'confusion_matrix': test_confusion_matrix.tolist()
                    }
                # metadata
                metadata_dict = {}
                # combined score dict
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
                break
            except IOError as e:
                print(e)
                train_dict = {
                    'accuracy': float(0.),
                    'confusion_matrix': [[0.]]
                }
                test_dict = {'accuracy': float(0.), 'confusion_matrix': [[0.]]}
                metadata_dict = {'error': str(e)}
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
            except KeyError as e:
                print(e)
                train_dict = {
                    'accuracy': float(0.),
                    'confusion_matrix': [[0.]]
                }
                test_dict = {'accuracy': float(0.), 'confusion_matrix': [[0.]]}
                metadata_dict = {'error': str(e)}
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
                break
            except tf.errors.InvalidArgumentError as e:
                print(e)
                train_dict = {
                    'accuracy': float(0.),
                    'confusion_matrix': [[0.]]
                }
                test_dict = {'accuracy': float(0.), 'confusion_matrix': [[0.]]}
                metadata_dict = {'error': str(e)}
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
                break
            except tf.errors.ResourceExhaustedError as e:
                print(e)
                train_dict = {
                    'accuracy': float(0.),
                    'confusion_matrix': [[0.]]
                }
                test_dict = {'accuracy': float(0.), 'confusion_matrix': [[0.]]}
                metadata_dict = {'error': str(e)}
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
                break
            except tf.errors.DataLossError as e:
                print(e)
                train_dict = {
                    'accuracy': float(0.),
                    'confusion_matrix': [[0.]]
                }
                test_dict = {'accuracy': float(0.), 'confusion_matrix': [[0.]]}
                metadata_dict = {'error': str(e)}
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
            
    return team_dict


def score_classification(model_directory, data, labels, path_prefix,
                         batch_size):
    tf.reset_default_graph()
    with tf.Session() as session:
        # load graph structure and weights
        saver = tf.train.import_meta_graph(
            os.path.join(model_directory, path_prefix + '.meta'))
        saver.restore(session, os.path.join(model_directory, path_prefix))

        # run model forward on test data
        y = tf.placeholder(tf.int64)
        x = session.graph.get_tensor_by_name('input_placeholder:0')
        output = session.graph.get_tensor_by_name('output:0')

        predictions_t = tf.argmax(output, axis=1)
        accuracy_t = tf.reduce_mean(
            tf.cast(tf.equal(predictions_t, y), tf.float32))
        confusion_matrix_t = tf.confusion_matrix(
            labels=y, predictions=predictions_t)

        n = data.shape[0]
        accuracies = []
        conf_matrices = []
        for i in range(n // batch_size):
            accuracy, confusion_matrix = session.run(
                [accuracy_t, confusion_matrix_t], {
                    x: data[i * batch_size:(i + 1) * batch_size],
                    y: labels[i * batch_size:(i + 1) * batch_size]
                })
            accuracies.append(accuracy)
            conf_matrices.append(confusion_matrix)

        return np.mean(accuracies), np.sum(conf_matrices, axis=0)


def play_episode(session, env, input_ph, q_vals):
    obs = env.reset()
    step = 0
    ep_reward = 0
    while step < EP_STEP_LIMIT:
        obs = np.expand_dims(obs, axis=0)
        q_vals_output = session.run(q_vals, {input_ph: obs})
        action = np.argmax(q_vals_output, axis=1)
        obs, reward, done, _ = env.step(action)
        ep_reward += reward
        step += 1
        if done: break
    return ep_reward, step


def score_reward(model_directory, env, path_prefix, episodes=100):
    tf.reset_default_graph()
    with tf.Session() as session:
        # load graph structure and weights
        saver = tf.train.import_meta_graph(
            os.path.join(model_directory, path_prefix + '.meta'))
        saver.restore(session, os.path.join(model_directory, path_prefix))

        x = session.graph.get_tensor_by_name('input_placeholder:0')
        output = session.graph.get_tensor_by_name('output:0')

        # run through the environment
        rewards = []
        steps = []
        for i in range(episodes):
            print('ep {}'.format(i))
            ep_reward, ep_step = play_episode(session, env, x, output)
            print('score {} @ {} steps'.format(ep_reward, ep_step))
            rewards.append(ep_reward)
            steps.append(ep_step)

        return np.sum(rewards), rewards, steps


def unix_time_millis(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    return (dt - epoch).total_seconds() * 1000.0
