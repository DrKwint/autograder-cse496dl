import argparse
import json
import os
import datetime
import sys

import tensorflow as tf

import mnist_reader

parser = argparse.ArgumentParser(description='Grade homework 1.')
parser.add_argument('--team_file',
                    default='teams.json',
                    type=str,
                    help='json containing teams')
parser.add_argument('--data_dir',
                    type=str,
                    default='./data/cifar/',
                    help='directory where data is located')
parser.add_argument('--handin_dir', type=str, default='/work/cse479/')
args = parser.parse_args()


def score_classification_accuracy(model_directory,
                                  data,
                                  labels,
                                  path_prefix='homework_2'):
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
        confusion_matrix_t = tf.confusion_matrix(labels=y,
                                                 predictions=predictions_t,
                                                 num_classes=100)

        accuracy, confusion_matrix = session.run(
            [accuracy_t, confusion_matrix_t], {
                x: data,
                y: labels
            })
        return accuracy, confusion_matrix


def score_teams_classification_accuracy():
    with open(args.team_file, 'r') as team_file:
        team_list = json.load(team_file)['teams']

    # load datasets
    X_train = np.load(os.path.join(args.data_dir, 'cifar_images_train.npy'))
    X_train = np.reshape(X_train, [-1, 32, 32, 3])
    y_train = np.load(os.path.join(args.data_dir, 'cifar_labels_train.npy'))
    X_test = np.load(os.path.join(args.data_dir, 'cifar_images_test.npy'))
    X_test = np.reshape(X_test, [-1, 32, 32, 3])
    y_test = np.load(os.path.join(args.data_dir, 'cifar_labels_test.npy'))

    # score assignments
    team_dict = dict()
    unix_now = datetime.datetime.now().timestamp()
    for team in team_list:
        team_name = list(team.keys())[0]
        print(team_name)
        for username in list(team.values())[0]:
            try:
                # train
                path = os.path.join(args.handin_dir, username, 'handin/')
                print(path)
                train_accuracy, train_confusion_matrix = score_classification_accuracy(
                    path, X_train, y_train)
                train_dict = {
                    'accuracy': float(train_accuracy),
                    'confusion_matrix': train_confusion_matrix.tolist()
                }
                # test
                test_accuracy, test_confusion_matrix = score_classification_accuracy(
                    os.path.join(args.handin_dir, username, 'handin/'), X_test,
                    y_test)
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
                print(e.message)
                train_dict = {
                    'accuracy': float(0.),
                    'confusion_matrix': [[0.]]
                }
                test_dict = {'accuracy': float(0.), 'confusion_matrix': [[0.]]}
                metadata_dict = {'error': e.message}
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
                break
            except:
                print(sys.exc_info()[0])
                train_dict = {
                    'accuracy': float(0.),
                    'confusion_matrix': [[0.]]
                }
                test_dict = {'accuracy': float(0.), 'confusion_matrix': [[0.]]}
                metadata_dict = {'error': str(sys.exc_info()[0])}
                score_dict = {
                    'train': train_dict,
                    'test': test_dict,
                    'metadata': metadata_dict
                }
                team_dict[team_name] = {str(unix_now): score_dict}
                break
    return team_dict


if __name__ == "__main__":
    team_dict = score_teams_classification_accuracy()

    # combine existing data with new
    if os.path.isfile('homework1_scores.json'):
        with open('homework1_scores.json', 'r') as json_file:
            leaderboard_dict = json.load(json_file)

        for key in team_dict.keys():
            leaderboard_dict[key] = {
                **leaderboard_dict.get(key, dict()),
                **team_dict[key]
            }
    else:
        leaderboard_dict = team_dict

    # write data
    with open('homework1_scores.json', 'w') as json_file:
        new_json = json.dumps(leaderboard_dict, sort_keys=True)
        json_file.write(new_json)
    print(list(team_dict.keys()))
    print(team_dict)
