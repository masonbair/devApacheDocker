#!/bin/bash

#This starts the conda environment
micromamba activate pyimagej
# Installs a wsgi module for Apache
/opt/conda/envs/pyimagej/bin/mod_wsgi-express install-module
rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6
# allows the execution of the ImageJ-Linux file, this is useful for running ImageJ
chmod +x /var/www/html/flask/static/Fiji.app/ImageJ-linux64

ln -s /opt/conda/envs/pyimagej/lib/libstdc++.so.6 /usr/lib/x86_64-linux-gnu/libstdc++.so.6
rm /var/www/html/index.html
# Start apache in the foreground
apachectl -D FOREGROUND

#If you make a new apache configuration. make sure to use the command a2ensite to have apache use it
a2ensite xpra-flask-apache.conf
a2dissite 000-default.conf