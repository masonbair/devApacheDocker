import datetime

from ray.job_submission import JobSubmissionClient, JobStatus
import threading
import time

class MacroManager:
    macrosPendingList = []
    macrosDoneList = []
    macrosRunningJobsList = []

    def backgroundRayJobUpdater(self):
        print("TestMainMacroManager")
        client = JobSubmissionClient("http://ray-container:8265")
        while(True):
            for job in self.macrosRunningJobsList:
                status = client.get_job_status(job[0])
                if(status in {JobStatus.SUCCEEDED, JobStatus.STOPPED, JobStatus.FAILED}):
                    self.macrosDoneList.append(job)
                    self.macrosRunningJobsList.remove(job)
            time.sleep(3)
    def backgroundThreadMacroRunner(self):
        while(True):
            if(len(self.macrosPendingList) > 0):
                macroItem = self.macrosPendingList[-1]
                self.runMacro(macroItem[0], macroItem[1], macroItem[2], macroItem[3], macroItem[4])
                self.macrosPendingList.pop()
                macroItem[5] = (f"/IMAGEJ_SERVER/Results/result-{ macroItem[0] }.jpg")
                self.macrosRunningJobsList.append(macroItem)
            time.sleep(3)


    def __init__(self):
        x = threading.Thread(target=self.backgroundThreadMacroRunner)
        x.start()
        y = threading.Thread(target=self.backgroundRayJobUpdater)
        y.start()


    #returns the status of a job
    def checJob(self, jobId):
        return jobId in self.doneList

    def sendRayJobSubmission(self):
        pass

    def runMacro(self, pId, macroName, pFolder, pOffsetX = 0, pOffsetY = 0):
        client = JobSubmissionClient("http://localhost:8265")
        status_to_wait_for = {JobStatus.SUCCEEDED, JobStatus.STOPPED, JobStatus.FAILED}
        #its important to set the working directory for ray since the ray start head command might not be in the same folder as the script files
        working_dir = '/var/www/html/flask/static'
        print("TestRunMacro")
        if(macroName == "2D"):
            print("Running 2D Macro")
            job_id = client.submit_job(
                # Entrypoint shell command to execute
                entrypoint=f'python macros2d.py {pFolder} {pId} {pOffsetX} {pOffsetY}',
                submission_id=pId
            )
        elif(macroName == "3D"):
            print("Running 3D macro")
            job_id = client.submit_job(
                # Entrypoint shell command to execute
                entrypoint=f'python macros3d.py {pFolder} {pId} {pOffsetX} {pOffsetY}',
                submission_id = pId
            )
        elif(macroName == "Primes"):
            job_id = client.submit_job(
                # Entrypoint shell command to execute
                entrypoint=f'python primes.py',
                submission_id = pId
            )


    def addMacroToList(self, pMacro):
            self.macrosPendingList.insert(0 ,pMacro)

    def getMacroList(self):
        return self.macroList

    def getMacrosStatus(self, pJobIds):

        jobresults = []
        for job in pJobIds:
            jobresults.append([job, self.checkMacro(int(job))])
        return jobresults

    def getJobIdStatus(self, pJobId):
        done = False
        for job in self.macrosDoneList:
            if pJobId in job:
                return True
        return done

    def checkMacro(self, pJobId):
        jobIsDone = False
        for jobItem in self.macrosDoneList:
            if pJobId in jobItem:
                jobIsDone = True
        return (jobIsDone)

    def getPositionOnQueue(self, jobId):
        index = 0
        for job in self.macrosPendingList:
            if jobId in job:
                return (len(self.macrosPendingList) - 1 -index)
            index += 1
        return -1

    def getDoneMacroData(self, id):
        for item in self.macrosDoneList:
            if(id == str(item[0])):
                return item[5]
        return ''
