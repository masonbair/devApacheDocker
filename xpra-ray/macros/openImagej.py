import scyjava
import sys
import subprocess
import os
import time

class macro:

	def __init__(self, args):
		self.callArgs = args[1:]
		print(self.callArgs)
		os.environ['DISPLAY'] = ':80'
		scyjava.config.add_option('-Xmx160g')

		##This section of the macro creates a lock file, which is essentially a miniature file to
		##tell us if an instance of ImageJ is already running
		lock_filename = "./lock/imagej_lock.txt"
		try:
			with open(lock_filename, 'x') as lock_file:
				pass
				if(self.callArgs[0] != "null "):
					subprocess.run(["/ray-docker/Fiji-app/ImageJ-linux64"] + self.callArgs)
					
				else:
					subprocess.run(["/ray-docker/Fiji-app/ImageJ-linux64"])
		except FileExistsError:
			print("ImageJ instances is already running")
		finally:
			if os.path.exists(lock_filename):
				os.remove(lock_filename)
				
args = sys.argv
newMacro = macro(args)