var jsText = readJSFile("playitemtypes/bible/bible_ref_parsing.js");
eval(jsText);

ItemTypeTable["bible"] = {
    label: "Bible passage",
    create: function () {
        var result = { catalog: buildCatalog() };
        window.openDialog("chrome://songbee/content/playitemtypes/bible/choosepassage.xul", "", "chrome, dialog, modal, resizable=no", result).focus();
        if (!result.passage) return;
        var obj = { passage: result.passage, version: result.version, db: result.catalog[result.version].target };
        addToPlaylist(null, "bible", JSON.stringify(obj), "Bible passage: "+obj.passage+" ("+obj.version+")");
    },
    title: function () {
        var obj = JSON.parse(this.data());
        return "Bible passage: "+obj.passage+" ("+obj.version+")";
    },
    transformToHTML: function (stylesheet, doc) { 
        var obj = JSON.parse(this.data());
        if (!obj.passageText) {
            obj.passageText = getPassage(obj.passage, obj.db);
            this.data(JSON.stringify(obj));
        }
        var frag = doc.createElement("div"); 
//        frag.setAttribute("class", "bible-text");
        frag.setAttribute("class", "line");
        frag.innerHTML = obj.passageText;
        return frag;
    },
    fixups: function() { 
        if (document.documentElement.id != "playlist-list") return;
        var m;
        if ((m = document.getElementById("tools-popup"))) {
            m.appendChild(document.createElement("menuseparator"));
            var i = document.createElement("menuitem");
            i.setAttribute("label", "Import Bible...");
            i.setAttribute("oncommand", "importBible()");
            function importBible () {
                window.openDialog("chrome://songbee/content/playitemtypes/bible/import-bible.xul", "import-bible", "chrome, dialog,modal,resizable=no");
            };
            m.appendChild(i);
        }
    }
};

var dserv = Components.classes["@mozilla.org/file/directory_service;1"] 
                     .getService(Components.interfaces.nsIProperties);
var storageService = Components.classes["@mozilla.org/storage/service;1"]
                        .getService(Components.interfaces.mozIStorageService);

function getPassage(ref, db) {
    var passage = new Reference(ref);
    return verseText(passage, db);
}


function buildCatalog() {
    var profile = dserv.get("ProfD", Components.interfaces.nsIFile);
    var catalog = {};
    scanVersions(profile, catalog);
    var appdir = dserv.get("DefRt", Components.interfaces.nsIFile).parent;
    appdir.append("chrome"); appdir.append("songbee");
    appdir.append("playitemtypes"); appdir.append("bible");
    scanVersions(appdir, catalog);
    return catalog;
}

function scanVersions (directory, catalog) {
    var entries = directory.directoryEntries;
    while(entries.hasMoreElements()) {
      var entry = entries.getNext();
      entry.QueryInterface(Components.interfaces.nsIFile);
      if (entry.leafName.search(/\.sbb$/) >= 0) 
        catalog[getVersionName(entry)] = entry;
    }
}

function getVersionName(file) {
    var dbh = storageService.openDatabase(file);
    var sql = "SELECT name FROM metadata";
    var statement = dbh.createStatement(sql);
    statement.executeStep();
    return statement.getString(0);
}

function verseText(reference, version) {
    var file = Components.classes['@mozilla.org/file/local;1']  
               .createInstance(Components.interfaces.nsILocalFile);  
    jsdump(version);
    file.initWithPath(version);  
    var handle = storageService.openDatabase(file);
    jsdump(handle);
    if (!handle) return "";
    var iter = reference.iterator();
    var sql = "SELECT content FROM bible WHERE book = (?1) AND chapter = (?2) AND verse = (?3)";
    var statement = handle.createStatement(sql);
    if (!statement) { alert("Oops"); return ""; }
    // Slow stupid way for now.
    var text = "<h1>"+reference.toString()+"</h1> ";
    var bcv;
    while ((bcv = iter.next())) {
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

