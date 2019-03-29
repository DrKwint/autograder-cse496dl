#!/bin/bash

cd /home/equint/autograder-cse496dl/
rsync -e 'ssh -p 22' -avz cse496e@cse.unl.edu:/home/grad/Classes/cse496e/hw2_public_handin /home/equint/autograder-cse496dl/submissions/
source /home/equint/autograder-cse496dl/venv/bin/activate
python /home/equint/autograder-cse496dl/grader_hw2.py
rsync -e 'ssh -p 22' -avz /home/equint/autograder-cse496dl/homework2_scores.json pquint@cse.unl.edu:/home/ugrad/pquint/public_html/teaching/unl_classes/cse496dl/homework2_leaderboard/
