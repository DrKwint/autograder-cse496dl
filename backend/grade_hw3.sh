#!/bin/bash

cd /home/equint/autograder-cse496dl/
rsync -e 'ssh -p 22' -avz cse496e@cse.unl.edu:/home/grad/Classes/cse496e/hw3_public_handin /home/equint/autograder-cse496dl/submissions/
source /home/equint/autograder-cse496dl/venv/bin/activate
pip freeze
python /home/equint/autograder-cse496dl/backend/grader_hw3.py
rsync -e 'ssh -p 22' -avz /home/equint/autograder-cse496dl/homework3_scores.json pquint@cse.unl.edu:/home/ugrad/pquint/public_html/teaching/unl_classes/cse496dl/homework3_leaderboard/
