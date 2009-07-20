var jsText = readJSFile("playitemtypes/bible/bible_ref_parsing.js");
eval(jsText);

ItemTypeTable["bible"] = {
    label: "Bible passage",
    create: function () {
        var passage = prompt("Bible passage to add?");
        /* Add on the end of the LHS list */
        if (!passage) { return; }
        var obj = { passage: passage };
        addToPlaylist(null, "bible", JSON.stringify(obj), "Bible passage: "+passage);
    },
    title: function () {
        var obj = JSON.parse(this.data());
        return "Bible passage: "+obj.passage;
    },
    transformToHTML: function (stylesheet, doc) { 
        var obj = JSON.parse(this.data());
        if (!obj.passageText) {
            obj.passageText = getPassage(obj.passage);
            this.data(JSON.stringify(obj));
        }
        var frag = doc.createElement("div"); 
        frag.setAttribute("class", "bible-text");
        frag.innerHTML = obj.passageText;
        return frag;
    }
};

var dserv = Components.classes["@mozilla.org/file/directory_service;1"] 
                     .getService(Components.interfaces.nsIProperties);
var storageService = Components.classes["@mozilla.org/storage/service;1"]
                        .getService(Components.interfaces.mozIStorageService);

function getPassage(ref) {
    var passage = new Reference(ref);
    return verseText(passage, "jss");
}

function getHandleToBibleVersion(version) {
    var bible = dserv.get("resource:app", Components.interfaces.nsIFile);
    bible.append("chrome"); bible.append("songbee");
    bible.append("playitemtypes"); bible.append("bible");
    bible.append(version+".db");
    //if (!bible.exists()) { alert("We don't have that bible version"); return; }
    return storageService.openDatabase(bible);
}

function verseText(reference, version) {
    var handle = getHandleToBibleVersion(version);
    if (!handle) return "";
    var iter = reference.iterator();
    var sql = "SELECT content FROM bible WHERE book = (?1) AND chapter = (?2) AND verse = (?3)";
    var statement = handle.createStatement(sql);
    if (!statement) { alert("Oops"); return }
    // Slow stupid way for now.
    var text = "<h1>"+reference.toString()+"</h1> ";
    var bcv;
    while (bcv = iter.next()) {
        statement.bindInt32Parameter(0, bcv.book);
        statement.bindInt32Parameter(1, bcv.chapter);
        statement.bindInt32Parameter(2, bcv.verse);
        while (statement.executeStep()) {
            var l = statement.getString(0);
            l = l.replace(/\((.*?)\|(.*?)\)/g,'<nobr><ruby style="position:relative"> <rb>$1</rb> <rt class="sup">$2</rt> </ruby></nobr>');
            text += "<p><span class=\"verse-num\">"+bcv.verse+"</span> ";
            text += l+"</p>";
        }
        statement.reset();
    }
    //text = "<p>"+text+"</p>";
    return text;
}
