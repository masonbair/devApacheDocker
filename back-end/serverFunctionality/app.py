from macros.MacroManager import MacroManager
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
from flask import Flask, render_template
from werkzeug.utils import secure_filename
import requests
import file_manager
import datetime
import random
import time
import os


app = Flask(__name__)

manager = file_manager.FileMaganer()
MacroManager = MacroManager()
directory = '/var/www/html/flask/static'
webAddress = os.environ["WEBADDRESS"]

ALLOWED_EXTENSIONS = {'jar'}
app.config['UPLOAD_FOLDER'] = directory+'/Fiji.app/plugins'


def findDirectories():
    directories = manager.loadDirectories(directory+"/biology-share/IMAGEJ_SERVER/Pending/")
    return(directories)

def runMacro(macroName, pFolders, pOffsetX, pOffsetY):
    resultList = []
    for folder in pFolders:
        result = MacroManager.runMacro(macroName,folder['Name'], folder["Id"], pOffsetX, pOffsetY)
        resultList.append({"Name":folder["Name"],"Id":folder["Id"], "Image":result})
        resultList.append({"Name": folder["Name"], "Id": folder["Id"], "Image": result})
    return resultList

#This flask route is specifically for sending the server address to Angular
@app.route('/webAddress/', methods = ['GET'])
def returnWebAddress():
    return jsonify({"address": webAddress})


#here we define the waiting function for loading the macro, both macro loading and macro are in charge oof showing the process loading
@app.route('/addMacroToQueue/',methods = ['POST', 'GET'])
#@cross_origin()
def macroqueue():
    if request.method == 'POST':
        data = request.get_json()
        folders = data["folders"]
        jobsList = []
        if data["name"] == "imagej":
            rNumber = datetime.datetime.now()
            jobId = int(str(int(rNumber.strftime('%Y%m%d%H%M%S'))) + str(random.randint(1000000000, 5000000000)))
            MacroManager.addMacroToList([str(jobId), data["name"], "/", 1, 1,''])
        for folder in folders:
            rNumber = datetime.datetime.now()
            jobId = int(str(int(rNumber.strftime('%Y%m%d%H%M%S'))) + str(random.randint(1000000000, 5000000000)))
            jobsList.append(str(jobId))
            offsetX = data["offsetX"]
            offsetY = data["offsetY"]
            macroName = data["name"]
            MacroManager.addMacroToList([str(jobId), macroName, folder['Name'], offsetX, offsetY,''])
        return jsonify({'message': jobsList})

@app.route('/directories/', methods=['GET'])
#@cross_origin()
def returnDirectories():
    tempDirectories = findDirectories()
    return jsonify({"directories": tempDirectories})

#Keeps track of the queue of jobs submitted to Ray
@app.route('/jobqueuepos/', methods=['GET'])
#@cross_origin()
def returnJobQueue():
    args = request.args
    jobId = args['jobid']
    position = MacroManager.getPositionOnQueue(jobId)
    if position < 0:
        position = 0
    return jsonify({"position": position})

@app.route('/macrosList/', methods=['GET'])
#@cross_origin()
def returnMacroList():
    return jsonify({"directories": MacroManager.getMacroList()})

@app.route('/macroStatus/', methods=['POST'])
#@cross_origin()
def returnMacroStatus():
    data = request.get_json()
    jobsId = data["jobs"]
    result = MacroManager.getMacrosStatus(jobsId)
    return jsonify({"message": result})

@app.route('/jobIdStatus/', methods=['POST'])
#@cross_origin()
def returnjobIdStatus():
    data = request.get_json()
    jobId = data["job"]
    result = MacroManager.getJobIdStatus(jobId)
    doneFolder = MacroManager.getDoneMacroData(jobId)
    return jsonify({"message": [jobId, result, doneFolder]})

#Send you to xpra
#Need to figure out a way to send you to the correct port number
#It currenly sends you to port 80, but it needs to send you to port 10000
@app.route('/xpraStation/', methods=['GET'])
@cross_origin()
def xpraStation():
    print("xpraStation")
    internal_url = webAddress+'/xpra/'
    # Forward the request with same method and data
    return redirect(internal_url)

# This 2 methods deals with the uploading of files, and makes sure only the request file type of .jar is uploaded:
#Checks the file extension to make sure it is of type jar
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
#Continuation of uploading a .jar file plugin
@app.route('/upload/', methods=["POST"])
def upload_file():
    #Error handling
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    #Error handling
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'success': 'File uploaded successfully'}), 200
    else:
        #Error handling
        return jsonify({'error': 'File type not allowed'}), 400

##This will run the ImageJ plugin, with or without an image
@app.route('/startImagej/', methods=["POST", "GET"])
def runImageJ():
    if request.method == 'POST':
        data = request.get_json()
        imageNames = data['images']
        passedNames = ""
        for name in imageNames:
            passedNames = passedNames + " " + name
        print("Names being passed to macro manager" + passedNames)
        MacroManager.runImageJ(passedNames)
        return jsonify({"images": imageNames})
    return jsonify({"Unable to open image"})

@app.route('/fileExists/', methods=["POST"])
def fileExists():
    if request.method == "POST":
        data = request.get_json()
        url = data['url']
        exists = os.path.isfile(url)
        print(exists)
        return jsonify({"exists": exists})
    return jsonify({"Error"})


@app.route('/', methods=['POST','GET'])
def root():
    return render_template('index.html')
  

if __name__ == "__main__":
    app.run(port=5000,debug=True)
