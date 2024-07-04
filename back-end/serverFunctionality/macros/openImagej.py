import imagej
import scyjava
import sys
import os
import time


class macro:

	def __init__(self, args):
		self.callArgs = args[1:]
		if(self.callArgs[0] != "null"):
			self.callImagejWithImage(self.callArgs[0])
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

	def callImagejWithImage(self):
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
newMacro = macro()