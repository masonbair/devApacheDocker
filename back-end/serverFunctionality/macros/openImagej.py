import imagej
import scyjava
import sys
import subprocess
import os
import time

class macro:

	def __init__(self, args):
		self.callArgs = args[1:]
		os.environ['DISPLAY'] = ':80'
		if(self.callArgs[0] != "null"):
			image_names = ""
			for name in self.callArgs:
				image_names = image_names + " " + name
			subprocess.run(["/ray-docker/Fiji-app/ImageJ-linux64", image_names])
		else:
			self.callImagej()

	def callImagej(self):
		os.environ['DISPLAY'] = ':80'
		scyjava.config.add_option('-Xmx120g')
		ij = imagej.init('/ray-docker/Fiji-app', mode=imagej.Mode.INTERACTIVE)

		# Keep ImageJ window open
		ij.ui().showUI()
		while ij.ui().isVisible:
			time.sleep(1)

		# Closing ImageJ when done
		ij.context().dispose()

args = sys.argv
newMacro = macro(args)