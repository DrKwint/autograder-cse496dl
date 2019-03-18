import argparse
import json
import os

import numpy as np

import util

parser = argparse.ArgumentParser(description='Grade homework 3.')
parser.add_argument(
    '--team_file',
    default='teams.json',
    type=str,
    help='json containing teams')
parser.add_argument(
    '--handin_dir', type=str, default='./submissions/hw2_public_handin/')
parser.add_argument('--path_prefix', type=str, default='homework_3')
parser.add_argument('--env', type=str, default='SeaquestNoFrameskip-v4')
args = parser.parse_args()

if __name__ == "__main__":
    with open(args.team_file, 'r') as team_file:
        team_list = json.load(team_file)['teams']

    team_dict = util.score_teams(
        'reinforcement_learning',
        team_list,
        args.handin_dir,
        args.path_prefix,
        env_name=args.env)

    # combine existing data with new
    if os.path.isfile('homework3_scores.json'):
        with open('homework3_scores.json', 'r') as json_file:
            leaderboard_dict = json.load(json_file)

        for team_key in team_dict.keys():
            # delete old confusion matrices
            for time_key in leaderboard_dict[team_key].keys():
                try:
                    del leaderboard_dict[team_key][time_key]['test'][
                        'episode_rewards']
                    del leaderboard_dict[team_key][time_key]['test'][
                        'episode_lengths']
                except KeyError as e:
                    pass
            # combine new and old dicts
            leaderboard_dict[team_key] = {
                **leaderboard_dict.get(team_key, dict()),
                **team_dict[team_key]
            }
    else:
        leaderboard_dict = team_dict

    # write data
    with open('homework3_scores.json', 'w') as json_file:
        new_json = json.dumps(leaderboard_dict, sort_keys=True)
        json_file.write(new_json)
    print(list(team_dict.keys()))
    print(team_dict)
