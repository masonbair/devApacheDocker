#!/bin/bash
# This starts the conda environment

# Set up logging
LOG_FILE="/var/log/startup.log"
exec > >(tee -a ${LOG_FILE}) 2>&1
echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting startup script" 

# Activate conda environment
echo "Activating pyimagej environment..."
if ! micromamba activate pyimagej; then
    echo "ERROR: Failed to activate pyimagej environment. Continuing anyway..." >&2
fi

# Install wsgi module for Apache
echo "Installing mod_wsgi module..."
if ! /opt/conda/envs/pyimagej/bin/mod_wsgi-express install-module; then
    echo "ERROR: Failed to install mod_wsgi module. Continuing anyway..." >&2
fi

# Remove libstdc++ files
echo "Removing libstdc++ files..."
if [ -f /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28 ]; then
    rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28 || echo "WARNING: Failed to remove libstdc++.so.6.0.28" >&2
else
    echo "WARNING: libstdc++.so.6.0.28 does not exist" >&2
fi

if [ -f /usr/lib/x86_64-linux-gnu/libstdc++.so.6 ]; then
    rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6 || echo "WARNING: Failed to remove libstdc++.so.6" >&2
else
    echo "WARNING: libstdc++.so.6 does not exist" >&2
fi

# Set execute permissions for ImageJ
echo "Setting executable permissions for ImageJ..."
if [ -f /var/www/html/flask/static/Fiji.app/ImageJ-linux64 ]; then
    chmod +x /var/www/html/flask/static/Fiji.app/ImageJ-linux64 || echo "ERROR: Failed to set executable permissions for ImageJ" >&2
else
    echo "ERROR: ImageJ executable not found" >&2
fi

# Create symbolic link
echo "Creating symbolic link for libstdc++..."
if [ -f /opt/conda/envs/pyimagej/lib/libstdc++.so.6 ]; then
    ln -s /opt/conda/envs/pyimagej/lib/libstdc++.so.6 /usr/lib/x86_64-linux-gnu/libstdc++.so.6 || echo "ERROR: Failed to create symbolic link" >&2
else
    echo "ERROR: Source libstdc++.so.6 not found in conda environment" >&2
fi

# Remove index.html
echo "Removing index.html..."
if [ -f /var/www/html/index.html ]; then
    rm /var/www/html/index.html || echo "WARNING: Failed to remove index.html" >&2
else
    echo "WARNING: index.html does not exist" >&2
fi

# Configure Apache sites
echo "Configuring Apache sites..."
if ! a2ensite xpra-flask-apache.conf; then
    echo "ERROR: Failed to enable xpra-flask-apache.conf" >&2
fi

if ! a2dissite 000-default.conf; then
    echo "ERROR: Failed to disable 000-default.conf" >&2
fi

# Start Apache
echo "Starting Apache in foreground..."
echo "$(date '+%Y-%m-%d %H:%M:%S') - Startup script completed, launching Apache" 
exec apachectl -D FOREGROUND