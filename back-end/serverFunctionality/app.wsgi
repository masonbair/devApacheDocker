
##This file is important for running the production environment of WSGI

import sys
sys.path.insert(0, '/var/www/html/flask')

from app import app as application

print("WSGI script loaded successfully")
print("Application object:", application)

if __name__ == "__main__":
    app.run()
