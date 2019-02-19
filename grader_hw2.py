import argparse

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
parser.add_argument('--handin_dir', type=str, default='./submissions/HW2/')
args = parser.parse_args()
