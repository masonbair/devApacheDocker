import imagej
import scyjava
import sys

class macro:

	def __init__(self, args):
		self.callArgs = args[1:]
		self.callMacro(self.callArgs[0], str(self.callArgs[1]), str(self.callArgs[2]), str(self.callArgs[3]))

	def callMacro(self, file, id, offsetX = 0, offsetY = 0):
		ij = imagej.init('~/necessary/fiji-linux64/Fiji.app', mode=imagej.Mode.INTERACTIVE)
		print(ij.getVersion())
		#ij = imagej.init(mode='gui')
		#ij.ui().showUI() # if you want to display the GUI immediately
		scyjava.config.add_option('-Xmx80g')
		macro = """
		IJ.redirectErrorMessages();
			function correctLength(str, len) {
		while (lengthOf(str) < len) {
			str = "0" + str;
		}
		return str;macros3d.py
	}

	function insertBetween(str, num) {
		var newString = "";
		newString = substring(str, 0, indexOf(str, "{"));
		num = correctLength(toString(num), indexOf(str, "}") - indexOf(str, "{") - 1);
		newString = newString + num;
		newString = newString + substring(str, indexOf(str, "}") + 1, lengthOf(str));
		return newString;
	}
	function getEntry(x, y, name) {
		if (dim == "dim = 2\\n") {	
		return name + "; ; (" + x + ", " + y + ")\\n";
		} else {
			return name + "; ; (" + x + ", " + y + ", 0.0)\\n";
		}
	}

	macro "MATL stitching"{\n """
		macroFile = f'var imagePath = \"{ file }\";\n'
		macroEnd = """
        print(imagePath);
		var matlPath = imagePath+"MATL_mosaic.log";
		pather=imagePath+"Image0001_01.oib";
        print(pather);
        run("Bio-Formats Importer", "open=" + pather);
       // var imp = openUsingBioFormats(pather);
        var pixelLength = getWidth();
       // if(imp != null){
       //     var pixelLength = imp.getWidth();
       // }else{
       // 	println("Unable to open image");
       // 	exit();
       // }

	var pattern = "Image{iiii}_01.oib";
"""
		offsets = f'yOffset = "{ offsetX }";\n xOffset = "{ offsetY }";\n'

		macroEnd2= """
		var matlData = File.openAsString(matlPath);

		
		var width = parseInt(substring(matlData, indexOf(matlData,"XImages>") + 8, indexOf(matlData,"</XImages>")));
		var height = parseInt(substring(matlData, indexOf(matlData,"YImages>") + 8, indexOf(matlData,"</YImages>")));
		
		var dim = "dim = 3\\n";
	var tileConfig = "dim = 3\\n";	
		var imagesProcessed = 0;	
		var searchIndex = 0;	
		var oibNum = 0;
		var tifNum = 1;	
		while (indexOf(matlData, "<ImageInfo>", searchIndex) > -1) {		
			var xval = parseInt(substring(matlData, indexOf(matlData, "<Xno>", searchIndex) + 5, indexOf(matlData, "</Xno>", searchIndex)));
			var yval = parseInt(substring(matlData, indexOf(matlData, "<Yno>", searchIndex + 10) + 5, indexOf(matlData, "</Yno>", searchIndex + 10)));
			searchIndex = indexOf(matlData, "</Yno>", searchIndex + 10);		
			var index = xval + width * yval;		
			while (imagesProcessed < index) {
			
				var dummyXval = parseInt(imagesProcessed / width - 0.5) * pixelLength;
				var dummyYval = imagesProcessed % width * pixelLength;
				var dummyName = insertBetween("tiff{iiii}.tif", tifNum);
				tifNum++;
				var dummyEntry = getEntry(dummyXval, dummyYval, dummyName);		
				imagesProcessed++;
			}
			
			oibNum++;
			var newEntry = getEntry(xval * pixelLength + (xval) * xOffset, yval * pixelLength + (yval) * yOffset , insertBetween(pattern, oibNum));
			tileConfig += newEntry;
			imagesProcessed++;
		}
		print("\\Clear");
		while(imagesProcessed < width * height) {			
				var dummyXval = parseInt(imagesProcessed / width - 0.5) * pixelLength;
				var dummyYval = imagesProcessed % width * pixelLength;
				var dummyName = insertBetween("tiff{iiii}.tif", tifNum);
				tifNum++;
				var dummyEntry = getEntry(dummyXval, dummyYval, dummyName);
				imagesProcessed++;
		}
		
		print(tileConfig);
		namelog=imagePath+"Log.txt";
		f = File.open(namelog);
		print(f, tileConfig);	
		File.close(f);
		
		run("Grid/Collection stitching", "type=[Positions from file] order=[Defined by TileConfiguration] directory="+imagePath+" layout_file=Log.txt fusion_method=[Linear Blending] regression_threshold=0.30 max/avg_displacement_threshold=2.50 absolute_displacement_threshold=3.50 computation_parameters=[Save memory (but be slower)] image_output=[Fuse only]");"""
		saving = f"""
        saveAs("tiff", "/var/www/html/flask/static/biology-share/IMAGEJ_SERVER/Results/result-{id}");
		run("Z Project...", "projection=[Max Intensity]");
        saveAs("jpeg", "/var/www/html/flask/static/biology-share/IMAGEJ_SERVER/Results/result-{id}");
        close();
		close();
		"""
		print("Ran the 3D Macro successfully")
		print(f"{id}")
		macroFinal = macro + macroFile + macroEnd + offsets + macroEnd2 + saving
		#ij.redirectErrorMessages()
		language_extension = 'ijm'
		ij.py.run_script(language_extension, macroFinal)     		
		ij.window().getOpenWindows()
		ij.window().clear()
		ij.dispose()			#very important part to close the imagej plugin, with this we can run as many times as we want, as long as we dispose from previous inits
		return("3D Success")
args = sys.argv
newMacro = macro(args)
