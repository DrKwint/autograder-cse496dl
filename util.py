import datetime
import os
import json

import tensorflow as tf


def score_classification_teams(train_pair, test_pair, team_list, handin_dir,
                               path_prefix):
    # load datasets
    X_train, y_train = train_pair
    X_test, y_test = test_pair

    # score assignments
    team_dict = dict()
    unix_now = unix_time_millis(datetime.datetime.now())
    for team in team_list:
        team_name = list(team.keys())[0]
        for username in list(team.values())[0]:
            try:
                # train
                train_accuracy, train_confusion_matrix = score_classification(
                    os.path.join(handin_dir, username), X_train, y_train,
                    path_prefix)
                train_dict = {
                    'accuracy': float(train_accuracy),
                    'confusion_matrix': train_confusion_matrix.tolist()
                }
                # test
                test_accuracy, test_confusion_matrix = score_classification(
                    os.path.join(handin_dir, username), X_test, y_test,
                    path_prefix)
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
    return team_dict


def score_classification(model_directory, data, labels, path_prefix):
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

        accuracy, confusion_matrix = session.run(
            [accuracy_t, confusion_matrix_t], {
                x: data,
                y: labels
            })
        return accuracy, confusion_matrix


def unix_time_millis(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    return (dt - epoch).total_seconds() * 1000.0
