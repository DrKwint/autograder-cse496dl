import argparse
import json
import os
import datetime

import tensorflow as tf

import mnist_reader

parser = argparse.ArgumentParser(description='Grade homework 1.')
parser.add_argument(
    '--team_file',
    default='teams.json',
    type=str,
    help='json containing teams')
parser.add_argument(
    '--data_dir',
    type=str,
    default='./data/fashion/',
    help='directory where data is located')
parser.add_argument('--handin_dir', type=str, default='./submissions/H1/')
args = parser.parse_args()


def score(model_directory, data, labels, path_prefix='homework_1'):
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
            labels=y, predictions=predictions_t, num_classes=10)

        accuracy, confusion_matrix = session.run(
            [accuracy_t, confusion_matrix_t], {
                x: data,
                y: labels
            })
        return accuracy, confusion_matrix


def unix_time_millis(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    return (dt - epoch).total_seconds() * 1000.0


def score_teams():
    with open(args.team_file, 'r') as team_file:
        team_list = json.load(team_file)['teams']

    # load datasets
    X_train, y_train = mnist_reader.load_mnist(args.data_dir, kind='train')
    X_test, y_test = mnist_reader.load_mnist(args.data_dir, kind='t10k')

    # score assignments
    team_dict = dict()
    unix_now = unix_time_millis(datetime.datetime.now())
    for team in team_list:
        team_name = list(team.keys())[0]
        for username in list(team.values())[0]:
            try:
                # train
                train_accuracy, train_confusion_matrix = score(
                    os.path.join(args.handin_dir, username), X_train, y_train)
                train_dict = {
                    'accuracy': float(train_accuracy),
                    'confusion_matrix': train_confusion_matrix.tolist()
                }
                # test
                test_accuracy, test_confusion_matrix = score(
                    os.path.join(args.handin_dir, username), X_test, y_test)
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
            except IOError:
                pass
    return team_dict


if __name__ == "__main__":
    team_dict = score_teams()

    # combine existing data with new
    if os.path.isfile('homework1_scores.json'):
        with open('homework1_scores.json', 'r') as json_file:
            leaderboard_dict = json.load(json_file)

        for key in leaderboard_dict.keys():
            leaderboard_dict[key] = {
                **leaderboard_dict.get(key, dict()),
                **team_dict[key]
            }
    else:
        leaderboard_dict = team_dict

    # write data
    with open('homework1_scores.json', 'w') as json_file:
        json.dump(leaderboard_dict, json_file, sort_keys=True)
    print(list(team_dict.keys()))
