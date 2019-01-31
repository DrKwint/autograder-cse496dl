#!/bin/bash

rsync -e 'ssh -p 22' -avz cse496e@cse.unl.edu:/home/grad/Classes/cse496e/handin/H1 ./submissions/
source venv/bin/activate
python grader.py
rsync -e 'ssh -p 22' -avz ./homework1_score.json pquint@cse.unl.edu:/home/ugrad/pquint/public_html/teaching/unl_classes/cse496dl/homework1_leaderboard/