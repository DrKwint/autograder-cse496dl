CRANE_USERNAME=$1
SOURCE_DIR=$2


rsync -avz $2 $1@crane.unl.edu:/work/scott/equint/autograder-cse496dl/homework1_submissions/$1/
