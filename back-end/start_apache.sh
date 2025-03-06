#!/bin/bash
# This starts the conda environment
micromamba activate pyimagej

# Installs a wsgi module for Apache
/opt/conda/envs/pyimagej/bin/mod_wsgi-express install-module

# Install Apache SSL module (correct package for Debian)
apt-get update
# In Debian, SSL module comes with the main apache2 package
apt-get install -y apache2-utils ssl-cert libssl-dev

if [ ! -f /etc/apache2/mods-available/ssl.load ]; then
  echo "LoadModule ssl_module /usr/lib/apache2/modules/mod_ssl.so" > /etc/apache2/mods-available/ssl.load
  echo "<IfModule mod_ssl.c>\n</IfModule>" > /etc/apache2/mods-available/ssl.conf
fi

# Handle module loading carefully to prevent duplicate loading errors
for module in ssl socache_shmcb rewrite headers proxy proxy_http proxy_wstunnel; do
  # Only enable if not already enabled
  if [ ! -L "/etc/apache2/mods-enabled/${module}.load" ] && [ -f "/etc/apache2/mods-available/${module}.load" ]; then
    ln -sf "/etc/apache2/mods-available/${module}.load" "/etc/apache2/mods-enabled/${module}.load"
    if [ -f "/etc/apache2/mods-available/${module}.conf" ]; then
      ln -sf "/etc/apache2/mods-available/${module}.conf" "/etc/apache2/mods-enabled/${module}.conf"
    fi
    echo "Enabled module: ${module}"
  else
    echo "Module ${module} is already enabled or not available"
  fi
done

# Optional: Clean up libraryfiles only if they exist
if [ -f /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28 ]; then
  rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.28
fi
if [ -f /usr/lib/x86_64-linux-gnu/libstdc++.so.6 ]; then
  rm /usr/lib/x86_64-linux-gnu/libstdc++.so.6
fi

chmod +x /var/www/html/flask/static/Fiji.app/ImageJ-linux64
ln -s /opt/conda/envs/pyimagej/lib/libstdc++.so.6 /usr/lib/x86_64-linux-gnu/libstdc++.so.6

# Remove index.html only if it exists
if [ -f /var/www/html/index.html ]; then
  rm /var/www/html/index.html
fi

# Only enable if not already enabled
if [ ! -L "/etc/apache2/sites-enabled/xpra-flask-apache.conf" ] && [ -f "/etc/apache2/sites-available/xpra-flask-apache.conf" ]; then
  a2ensite xpra-flask-apache.conf
else
  echo "Site xpra-flask-apache is already enabled"
fi

# Only disable if not already disabled
if [ -L "/etc/apache2/sites-enabled/000-default.conf" ]; then
  a2dissite 000-default.conf
else
  echo "Site 000-default is already disabled"
fi

# Start apache in the foreground
apachectl -D FOREGROUND