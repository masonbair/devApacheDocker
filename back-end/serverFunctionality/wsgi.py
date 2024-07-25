
##This file is important for running the production environment of WSGI

import sys
sys.path.insert(0, '/home/mbair7/pyimagej-flask-server')

from app import app

if __name__ == "__main__":
    app.run()
