/* Watch me pull a rabbit from out of my... */
var supportedTypes = [ "song", "bible", "noticesheet" ];
var ItemTypeTable = {}; // Filled in by setupType

function readJSFile (filename) {
  	var myXMLHTTPRequest = new XMLHttpRequest();
  	myXMLHTTPRequest.open("GET", "chrome://songbee/content/"+filename, false);
  	myXMLHTTPRequest.overrideMimeType('text/javascript');
  	myXMLHTTPRequest.send(null);
  	return myXMLHTTPRequest.responseText;
}

function setupType(typename) {
	var jsText;
	try { jsText = readJSFile("playitemtypes/"+typename+"/"+typename+".js"); } catch (e) {};
	if (jsText) { eval(jsText); }
}

for (var a in supportedTypes) { setupType(supportedTypes[a]); }
