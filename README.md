# All three parts of the pyimagej application

This is the main github for all the necessary files for developing this pyimagej application. This github includes:
  1. The backend - Flask, WSGI, Apache
  2. The Frontend - Angular
  3. XPRA-ray - XPRA html display, and Ray

The Two containers for the application are used as follows:
  1. The first container is a combination of the back end and front end. When building this container, the Docker file is located in the backend folder, and how to include the frontend is described in more details in the backend folder
  2. The second container is just XPRA and Ray. There is a possibility to split this container up into 2 new containers. One with XPRA and one with Ray, but when Ray runs a macro, it sets a display number, and XPRA needs to access that display number in order to work properly. So maybe look for a way to send a display number to another container for this to work.

