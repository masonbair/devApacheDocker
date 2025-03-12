#!/bin/bash

#activates conda environment
micromamba activate pyimagej

# Some programs have a lock file, this helps tell a program when and when not to run. 
# So it is important to reset the lock files so all programs are able to start
rm /tmp/.X80-lock

# Sets the xpra password
XPRA_PASSWORD=$XPRA_PASSWORD
# starts xpra
xpra start :80 --daemon=yes --open-files=off --file-transfer=off --clipboard=no 
#--encryption-keyfile=/xpra.txt

# Starts ray 
ray start --head --dashboard-host=0.0.0.0 --block #--port 6379 --num-cpus=1 --num-gpus=0 


#This defines the cleanup procedure for when the container stops. Helps have an easy restart
cleanup() {
    echo "Container stopped, performing cleanup..."
    xpra stop
}

#Trap SIGTERM
trap 'true' SIGTERM

#Execute command
"${@}" &

#Wait
wait $!

#Cleanup
cleanup









