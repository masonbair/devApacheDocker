# Flask-Angular application

The app.py is the main file for running an application called Flask
Flask is an app that allows for sending and recieving http requests and then doing something based on the request recieved
The main goal of this is to communcite with the front end.
The front end can be viewed by going to the "front-end" directory
In addition, the Flask app communciates with the front end via the "static" and "template" folder in the "back-end/serverfunctionality" folder
Inside the template folder is a production version of the front-end application. Angular is what we use for the front-end
and angular has a way to condense all the front-end code into smaller production files, which is seen by the index.html file in the templates folder
angular also has more files located in the "static" folder. This includes all the files located in the "static" folder:
to generate angular produciton code, you need to go to the angular folder and run "ng build" then once that is done, go to the front-end "/dist" folder, and 
this is your production code for angular.

# MacroManager.py file 
The macroManager.py file, located in the /macros folder: This file is responsible for sending requests to Ray for running macros.
The macro files: macros2d.py and macros3d.py: you do not have to worry too much about them
The only thing that might need to be changed is at the end of each macro, the images get saved to a specific folder
If in the future the folder gets changed, make sure to change the folder destination in each macro


# IMPORTANT for production Angular
if you generate new production code for angular, typically you only need to change 2** things****
1. you need to replace the "main" file in the "/static" folder, with the new "main" file generated from angular
2. In the index.html file, you need to change the name of the "main" file located in the <\script> tag on the bottom of the index.html file. Jusrt change the name of the main file.

Once these 2 things have been changed, you should be all good! If you make a lot of changes to the front-end you might need to change more files too. 
JUST LOOK TO SEE IF ANY FILE NAMES HAVE CHANGED. IF THEY HAVE CHANGED THEN REPLACE THEM!!


# Final notes:
The app.py file and the angular production files will be the files edited and changed the most when working on this application