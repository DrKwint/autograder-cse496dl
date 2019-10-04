#!/bin/sh
#SBATCH --begin=now+6hours
#SBATCH --time=1:00:00           # Run time in hh:mm:ss
#SBATCH --mem=16000              # Maximum memory required (in megabytes)
#SBATCH --job-name=cse479_autograder
#SBATCH --partition=scott
#SBATCH --gres=gpu:1

module load tensorflow-gpu/py37/1.14
python ./backend/grader_hw2.py
rsync -e 'ssh -p 22' -avz ./homework2_scores.json equint@cse.unl.edu:/home/ugrad/equint/public_html/teaching/unl_classes/cse479/homework2_leaderboard/
sbatch ./run_autograder.sh
