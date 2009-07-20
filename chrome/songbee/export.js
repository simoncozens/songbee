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
    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                 .createInstance(Components.interfaces.nsIFileOutputStream);
    foStream.init(thefile, 0x02 | 0x08 | 0x20, 0664, 0); 
    return {name: thefile, stream: foStream};
}

function saveDOC() {
    var file = saveDialog("Word document", "doc");
    if (!file) return;
    // We cheat, using the hidden iframe trick.
    var save = document.getElementById("save").contentDocument;
    var song_place = save.getElementById("song");
    var stylesheet = getXSLT();

    pl.items(function (i) {
        var head = save.createElement("h1"); head.innerHTML = i.title();
        song_place.appendChild(head);
        song_place.appendChild(i.transformToHTML(stylesheet, save));
    });
    var serializer = new XMLSerializer();
    serializer.serializeToStream(save, file.stream, ""); 
    song_place.innerHTML = "";
    file.stream.close();
    alert("Saved "+file.name.leafName);
}

function export_songs () {
    var file = saveDialog("Songbee library file", "songbee");
    if (!file) return;

    file.stream.write("<songs>\n", 12);
    Song.retrieveAll(function(song) { 
        var ser = new XMLSerializer(); 
        ser.serializeToStream(song.xmlDOM(), file.stream, "");
    });
    file.stream.write("\n</songs>\n", 14);
    file.stream.close();
    alert("Saved "+file.name.leafName);
}

function csvQuote(x) { return '"'+x.replace(/"/g, '""')+'"'; }

function export_songreport() {
    var file = saveDialog("Comma-separated variable file", "csv");
    if (!file) return;
    var header = '"Title","First line","Play count"\n';
    file.stream.write(header, header.length);
    Song.retrieveAll(function(song) { 
        if (song.playcount() > 0) {
            var line = csvQuote(song.title())+","+csvQuote(song.first_line())+","+song.playcount()+"\n";
            file.stream.write(line, line.length);
        }
    });
    file.stream.close();
    alert("Saved "+file.name.leafName);
}
