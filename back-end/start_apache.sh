#!/bin/bash
conda activate pyimagej
/opt/conda/envs/pyimagej/bin/mod_wsgi-express install-module
rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6
ln -s /opt/conda/envs/pyimagej/lib/libstdc++.so.6 /usr/lib/x86_64-linux-gnu/libstdc++.so.6
# Start Ray head in the foreground
apachectl -D FOREGROUND