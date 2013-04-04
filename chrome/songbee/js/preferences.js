const IO_SERVICE_CTRID = "@mozilla.org/network/io-service;1" ;
const nsIFileProtocolHandler = Components.interfaces.nsIFileProtocolHandler ;
const nsIIOService = Components.interfaces.nsIIOService ;

var gLocalFonts;
var enumerator = Components.classes["@mozilla.org/gfx/fontenumerator;1"]
                         .getService(Components.interfaces.nsIFontEnumerator);
var localFontCount = { value: 0 }
gLocalFonts = enumerator.EnumerateAllFonts(localFontCount);

function fillFontMenu (menulist) {
    var pop = menulist.ownerDocument.createElement("menupopup");
    for (var i in gLocalFonts) {
        var item = menulist.ownerDocument.createElement("menuitem");
        item.setAttribute("label", gLocalFonts[i]);
        item.setAttribute("value", gLocalFonts[i]);
        item.setAttribute("oncommand", "editcss(document.getElementById('"+menulist.id+"'))");
        pop.appendChild(item);
    }
    menulist.appendChild(pop);
}

function setbackground(control) {
    var image = document.getElementById("body.background-image");
    var box = document.getElementById("filebox");
    var ioservice = Components.classes[IO_SERVICE_CTRID].getService(nsIIOService);
    var protocolhandler = ioservice.getProtocolHandler("file").QueryInterface(nsIFileProtocolHandler);
    if (!control) { // Clear it 
        image.value = ''; 
        box.clear();
    } else {
        var filename = protocolhandler.getURLSpecFromFile(control.fileName);
        image.value = 'url(' + filename +')';
    }
    editcss(image);
}

function userCSS() {
    var dserv = Components.classes["@mozilla.org/file/directory_service;1"] 
                         .getService(Components.interfaces.nsIProperties);
    var file = dserv.get("ProfD", Components.interfaces.nsIFile);
    file.append("user.projector.css");
    return file;
}

function addUserStylesheet (doc) {
    var file = userCSS();
    if (!file.exists()) fillvalues(0);
    var ioservice = Components.classes[IO_SERVICE_CTRID].getService(nsIIOService);
    var protocolhandler = ioservice.getProtocolHandler("file").QueryInterface(nsIFileProtocolHandler);
    var linkel = doc.createElement("link");
    linkel.setAttribute("rel", "stylesheet");
    linkel.setAttribute("href", protocolhandler.getURLSpecFromFile(file));
    doc.getElementById("headElem").appendChild(linkel);
}

function reset() { 
    var file = userCSS();
    if (!file.exists()) return;
    file.remove(0);
    document.getElementById("preview").contentDocument.location.reload();
    fillvalues(0);
}

function savechanges(where) { 
	var css = dumpCSS();
	if (where) { // Saving to database
		Songbee.Playlist.retrieve(where[0]).css(css);
	} else { // Global settings, saving to file.
		var file = userCSS();
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"] 
                         .createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
		foStream.write(css, css.length);
		foStream.close;
	}
    window.close();
}

var observerService = Components.classes["@mozilla.org/observer-service;1"]
    .getService(Components.interfaces.nsIObserverService);

const gStyleComplete = {
  observe: function(subject, topic, data)
  {
    fillvalues();
    observerService.removeObserver(gStyleComplete, "style-sheet-applicable-state-changed");
  }
};

var intervalID;
function tryToFillValues() {
   var css = cssObj();
   if (!cssObj().disabled) {
    clearInterval(intervalID);
    fillvalues(0);
    fillvalues();
   }
}

function slowlyfillvalues() { 
   intervalID = setInterval( tryToFillValues, 10 );
}
