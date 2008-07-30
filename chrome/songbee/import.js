const PERMS_FILE                 = 0644;
const MODE_RDONLY                = 0x01;

function xmlimport()  {
    var filename = document.getElementById("file").fileName;
    if (!filename) { alert("Select a file first!"); return; }
    // Gratuitiously stolen from cckwizard/search.js
    var sourcefile = filename;
    if (!sourcefile.exists) { alert("File doesn't exist. Huh?"); return;}

    var fileInStream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                                 .createInstance(Components.interfaces.nsIFileInputStream);
    fileInStream.init(sourcefile, MODE_RDONLY, PERMS_FILE, false);

    var domParser = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                              .createInstance(Components.interfaces.nsIDOMParser);
    var doc;
    try {
        doc = domParser.parseFromStream(fileInStream, "UTF-8",
                                          sourcefile.fileSize,
                                          "text/xml");
    } catch (e) { alert("Could not parse file!"); return } 
    var data = doc.documentElement;
    if (data.tagName != "worshipml" && data.tagName != "songs" ) { alert("File is not a songbee library!");return }

    var songs = doc.getElementsByTagName("song");
    var progressmeter = document.getElementById("meter");
    var messages = "";
    var ok = 0;
    for (var i = 0; i < songs.length; i++) {
        var message = importSong(songs[i]);
        if (message) { messages += message + "\n" } else ok++;
        progressmeter.value = (100*((1+i)/songs.length)).toFixed();
    }
    alert(ok+" songs imported OK; "+ (songs.length-ok)+" failed.\n\nImport messages: "+ messages);
    window.close();
}

function importSong(xml) { 
    var lines = xml.ownerDocument.evaluate("descendant::line", xml, null, XPathResult.ANY_TYPE,null);
    var firstLine = lines.iterateNext().firstChild.textContent;
    firstLine = firstLine.replace(/\W$/, "");
    firstLine = firstLine.replace(/^\s+/, " ");
    var title = xml.ownerDocument.evaluate("descendant::title", xml, null, XPathResult.ANY_TYPE,null).iterateNext().firstChild.textContent;

    // Check if song exists
    var existing = doSQL("SELECT * FROM song WHERE title=(?1) AND first_line = (?2)", Song, null, [title, firstLine]);
    if (existing.length > 0) 
        return ("Song \""+title+"\" already exists in the database!");

    var song = Song.create(["title", title, "first_line", firstLine]);
    var ser = new XMLSerializer();
    song.xml(ser.serializeToString(xml));
    //song.song_key(s.key);
}

