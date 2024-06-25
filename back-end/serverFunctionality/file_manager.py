import os

class FileMaganer:

    def __init__(self):
        self.directories = []
    
    def loadDirectories(self, pLocation):
        self.changeDirectoriesNAmes(pLocation)
        self.directories = []
        tempLocation = [f.path for f in os.scandir(pLocation) if f.is_dir()]
        for x in tempLocation:
            x = f'{x}/'
            self.directories.append(x)
        return self.directories

    def changeDirectoriesNAmes(self, pLocation):
        for folder in pLocation:
            newName = str(folder).replace("(", "-").replace(")", "-").replace(" ", "-")
            print(newName)
            #os.rename(str(folder), newName)
