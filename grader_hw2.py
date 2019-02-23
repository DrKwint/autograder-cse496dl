import argparse
import json
import os

import numpy as np

import util

parser = argparse.ArgumentParser(description='Grade homework 2.')
parser.add_argument(
    '--team_file',
    default='teams.json',
    type=str,
    help='json containing teams')
parser.add_argument(
    '--data_dir',
    type=str,
    default='./data/cifar100/',
    help='directory where data is located')
parser.add_argument(
    '--handin_dir', type=str, default='./submissions/hw2_public_handin/')
parser.add_argument('--path_prefix', type=str, default='homework_2')
parser.add_argument('--batch_size', type=int, default=1000)
args = parser.parse_args()

if __name__ == "__main__":
    cifar100_train_data = np.load(
        os.path.join(args.data_dir, 'cifar_images.npy'))
    cifar100_train_data = np.reshape(cifar100_train_data, [-1, 32, 32, 3])
    cifar100_train_labels = np.load(
        os.path.join(args.data_dir, 'cifar_labels.npy'))
    cifar100_test_data = np.load(
        os.path.join(args.data_dir, 'cifar_images_test.npy'))
    cifar100_test_data = np.reshape(cifar100_test_data, [-1, 32, 32, 3])
    cifar100_test_labels = np.load(
        os.path.join(args.data_dir, 'cifar_labels_test.npy'))
    train_pair = (cifar100_train_data, cifar100_train_labels)
    test_pair = (cifar100_test_data, cifar100_test_labels)

    with open(args.team_file, 'r') as team_file:
        team_list = json.load(team_file)['teams']

    team_dict = util.score_classification_teams(
        train_pair, test_pair, team_list, args.handin_dir, args.path_prefix,
        args.batch_size)

    # combine existing data with new
    if os.path.isfile('homework2_scores.json'):
        with open('homework2_scores.json', 'r') as json_file:
            leaderboard_dict = json.load(json_file)

        for key in team_dict.keys():
            leaderboard_dict[key] = {
                **leaderboard_dict.get(key, dict()),
                **team_dict[key]
            }
    else:
        leaderboard_dict = team_dict

    # write data
    with open('homework2_scores.json', 'w') as json_file:
        new_json = json.dumps(leaderboard_dict, sort_keys=True)
        json_file.write(new_json)
    print(list(team_dict.keys()))
    print(team_dict)
