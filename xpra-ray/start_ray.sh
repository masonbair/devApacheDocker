#!/bin/bash
micromamba activate pyimagej
rm /tmp/.X80-lock
XPRA_PASSWORD=$XPRA_PASSWORD
xpra start :80 --daemon=yes --open-files=off --file-transfer=off --clipboard=no --encryption-keyfile=/xpra.txt

# Starts ray 
ray start --head --dashboard-host=0.0.0.0 --block #--port 6379 --num-cpus=1 --num-gpus=0 


#Define cleanup procedure
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









