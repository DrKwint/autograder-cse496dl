#!/bin/bash

#cd /home/equint/autograder-cse496dl/
#rsync -e 'ssh -p 22' -avz cse496e@cse.unl.edu:/home/grad/Classes/cse496e/handin/HW1 /home/equint/autograder-cse496dl/submissions/
#source ./env #/home/equint/autograder-cse496dl/venv/bin/activate
python grader_hw1.py
rsync -e 'ssh -p 22' -avz /home/equint/autograder-cse496dl/homework1_scores.json pquint@cse.unl.edu:/home/ugrad/pquint/public_html/teaching/unl_classes/cse479/homework1_leaderboard/
