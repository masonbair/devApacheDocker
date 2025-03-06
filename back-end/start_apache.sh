#!/bin/bash
# This starts the conda environment
micromamba activate pyimagej

# Installs a wsgi module for Apache
/opt/conda/envs/pyimagej/bin/mod_wsgi-express install-module

# Install Apache SSL module
apt-get update
apt-get install -y libapache2-mod-ssl
a2enmod ssl
a2enmod socache_shmcb  # Required by SSL module

rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6

# allows the execution of the ImageJ-Linux file, this is useful for running ImageJ
chmod +x /var/www/html/flask/static/Fiji.app/ImageJ-linux64
ln -s /opt/conda/envs/pyimagej/lib/libstdc++.so.6 /usr/lib/x86_64-linux-gnu/libstdc++.so.6
rm /var/www/html/index.html

# If you make a new apache configuration. make sure to use the command a2ensite to have apache use it
a2ensite xpra-flask-apache.conf
a2dissite 000-default.conf

# Enable required modules for HTTPS and WebSockets
a2enmod rewrite
a2enmod headers
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_wstunnel

# Start apache in the foreground
apachectl -D FOREGROUND