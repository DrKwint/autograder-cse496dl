CSEUSERNAME=$1

rsync -avz $WORK/handin/* ${CSEUSERNAME}@cse.unl.edu:/home/grad/Classes/cse496e/hw2_public_handin/${CSEUSERNAME}
