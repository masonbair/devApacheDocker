from macros.MacroManager import MacroManager
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
from flask import Flask, render_template, redirect
import requests
import file_manager
import datetime
import random
import time


app = Flask(__name__)

#CORS(app)   #cors if for hosting the flask server and angular in the same computer
cors = CORS(app, resources={r"/*": {"origins": "*"}})
#CORS(app, origins='http://localhost')

manager = file_manager.FileMaganer()
MacroManager = MacroManager()


def findDirectories():
    directories = manager.loadDirectories('/var/www/html/flask/static/biology-share/IMAGEJ_SERVER/Pending/')
    return(directories)

def runMacro(macroName, pFolders, pOffsetX, pOffsetY):
    resultList = []
    for folder in pFolders:
        result = MacroManager.runMacro(macroName,folder['Name'], folder["Id"], pOffsetX, pOffsetY)
        resultList.append({"Name":folder["Name"],"Id":folder["Id"], "Image":result})
        resultList.append({"Name": folder["Name"], "Id": folder["Id"], "Image": result})
    return resultList

#here we define the waiting function for loading the macro, both macro loading and macro are in charge oof showing the process loading
@app.route('/addMacroToQueue/',methods = ['POST', 'GET'])
#@cross_origin()
def macroqueue():
    if request.method == 'POST':
        data = request.get_json()
        folders = data["folders"]
        jobsList = []
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
    return jsonify({"directories": MacroManager.getMacroList()});

@app.route('/macroStatus/', methods=['POST'])
#@cross_origin()
def returnMacroStatus():
    data = request.get_json()
    jobsId = data["jobs"]
    result = MacroManager.getMacrosStatus(jobsId)
    return jsonify({"message": result});

@app.route('/jobIdStatus/', methods=['POST'])
#@cross_origin()
def returnjobIdStatus():
    data = request.get_json()
    jobId = data["job"]
    result = MacroManager.getJobIdStatus(jobId)
    doneFolder = MacroManager.getDoneMacroData(jobId)
    return jsonify({"message": [jobId, result, doneFolder]})

@app.route('/xpraStation/', methods=['POST', 'GET'])
@cross_origin()
def xpraStation():
    print("xpraStation")
    internal_url = 'http://localhost/xpra/'
    # Forward the request with same method and data
    return redirect(internal_url)


@app.route('/', methods=['POST','GET'])
#@cross_origin()
def root():
    return render_template('index.html')
   # response = jsonify({"message": 'This is the home page of the flask server'})
    #response.headers.add('Access-Control-Allow-Origin', '*')
    #return response
    #return jsonify({"message": 'This is the home page of the flask server'})

if __name__ == "__main__":
    app.run(port=5000,debug=True)
