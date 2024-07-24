#!/bin/bash
micromamba activate pyimagej
/opt/conda/envs/pyimagej/bin/mod_wsgi-express install-module
rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6
chmod +x /var/www/html/flask/static/Fiji.app/ImageJ-linux64
ln -s /opt/conda/envs/pyimagej/lib/libstdc++.so.6 /usr/lib/x86_64-linux-gnu/libstdc++.so.6
rm /var/www/html/index.html
# Start Ray head in the foreground
apachectl -D FOREGROUND
a2ensite xpra-flask-apache.conf
a2dissite 000-default.conf