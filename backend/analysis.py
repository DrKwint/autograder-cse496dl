import argparse
import json
from datetime import datetime
import operator

parser = argparse.ArgumentParser(description='Figure out how well teams did.')
parser.add_argument('score_file',
                    type=str,
                    help='file being sent from the grader to the frontend')
args = parser.parse_args()

if __name__ == "__main__":
    # load json
    with open(args.score_file, 'r') as score_file:
        score_dict = json.load(score_file)

    window_open = datetime(year=2019,
                           month=9,
                           day=24,
                           hour=0,
                           minute=0,
                           second=0).timestamp()
    window_close = datetime(year=2019,
                            month=9,
                            day=30,
                            hour=0,
                            minute=0,
                            second=0).timestamp()
    in_window = lambda x: x > window_open and x < window_close

    flatten = lambda l: [item for sublist in l for item in sublist]
    times = set(flatten([list(score_dict[k]) for k in score_dict.keys()]))
    teams = set(score_dict.keys())

    valid_times = [x for x in times if in_window(float(x) / 1000)]
    print("Total valid times: ", len(valid_times))

    places = [
        dict(zip(teams, [0] * 1000)),
        dict(zip(teams, [0] * 1000)),
        dict(zip(teams, [0] * 1000)),
        dict(zip(teams, [0] * 1000)),
        dict(zip(teams, [0] * 1000))
    ]
    submitted = dict(zip(teams, [0] * 1000))
    for time in valid_times:
        scores = {
            team: score_dict[team][str(time)]["train"]["accuracy"]
            for team in teams
        }
        sorted_scores = sorted(scores.items(),
                               key=operator.itemgetter(1),
                               reverse=True)
        for t in teams:
            if scores[t] > 0.1:
                submitted[t] += 1
        for i in range(5):
            if sorted_scores[i][1] > 0.1:
                places[i][sorted_scores[i][0]] += 1

    # total scores
    VALUES = [0.25, 0.2, 0.15, 0.1, 0.05]
    SUBMITTED_VALUE = 0.01

    for team in teams:
        bonus = 0.0
        for i, v in enumerate(VALUES):
            bonus += places[i][team] * VALUES[i]
        bonus += submitted[team] * SUBMITTED_VALUE
        print(team, bonus)
    #print(submitted)
