function saveDialog(classname, extension) {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

    fp.init(window, "Save as "+classname+"...", nsIFilePicker.modeSave);
    fp.appendFilter(classname+"s","*."+extension);
    fp.defaultExtension = extension;
    var res = fp.show();
    if (res == nsIFilePicker.returnCancel){ return; }
    var thefile = fp.file;
    if (!(thefile.leafName.match(new RegExp("\\."+extension+"$"))))
        thefile.leafName += "."+extension;
    if (thefile.exists())
       thefile.remove(false);
    return thefile;
}

function saveDOC() {
    var thefile = saveDialog("Word document", "doc");
    if (!thefile) return;
    // We cheat, using the hidden iframe trick.
    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                 .createInstance(Components.interfaces.nsIFileOutputStream);
    foStream.init(thefile, 0x02 | 0x08 | 0x20, 0664, 0); 
    var save = document.getElementById("save").contentDocument;
    var song_place = save.getElementById("song");
    var stylesheet = getXSLT();

    pl.items(function (i) {
        var head = save.createElement("h1"); head.innerHTML = i.title();
        song_place.appendChild(head);
        song_place.appendChild(i.transformToHTML(stylesheet, save));
    });
    var serializer = new XMLSerializer();
    serializer.serializeToStream(save, foStream, ""); 
    song_place.innerHTML = "";
    foStream.close();
    alert("Saved "+thefile.leafName);
}

function export_songs () {
    var thefile = saveDialog("Songbee library file", "songbee");
    if (!thefile) return;
    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                 .createInstance(Components.interfaces.nsIFileOutputStream);
    foStream.init(thefile, 0x02 | 0x08 | 0x20, 0664, 0); 

    foStream.write("<songs>\n", 12);
    Song.retrieveAll(function(song) { 
        var ser = new XMLSerializer(); 
        ser.serializeToStream(song.xmlDOM(), foStream, "");
    });
    foStream.write("\n</songs>\n", 14);
    foStream.close();
    alert("Saved "+thefile.leafName);
}
