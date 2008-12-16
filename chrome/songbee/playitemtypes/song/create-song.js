var stylesheet = getXSLT();
var preview;

function onloadstuff () { 
    preview = document.getElementById("preview").contentDocument; 
    if (window.arguments) {
        song = Song.retrieve(window.arguments[0]);
        seedFromSong(song);
    }
}

function putDomInPreview(xmlDOM) {
    var frag = transformDOM(xmlDOM, stylesheet, preview);
    var song_place = preview.getElementById("song");
    song_place.innerHTML = "";
    song_place.appendChild(frag);
}

function update_preview() {
    var xml = from_text();
    var xmlDOM = (new DOMParser()).parseFromString(xml, "text/xml");
    if (xmlDOM) {putDomInPreview(xmlDOM) }
}

function SongPrototype() {
	var tc = document.getElementById("tc");
    for (var i =0; i < tc.childNodes.length; i++) {
		var node = tc.childNodes[i].firstChild.childNodes[1];
		this[node.id] = node.getAttribute("label")
	}
    this.lyrics = document.getElementById("lyrics").value;
    //this.title = document.getElementById("song-title").value;
}

function addTreeChild(id, label, value) {
	var keyNode = document.createElement("treecell"); keyNode.setAttribute("label", label);
	keyNode.setAttribute("editable", "false");
	var valueNode = document.createElement("treecell"); valueNode.setAttribute("label", value);
	valueNode.setAttribute("id", id);
	
	var row = document.createElement("treerow");
	var item = document.createElement("treeitem");
	row.appendChild(keyNode); row.appendChild(valueNode);
	item.appendChild(row);
	var	tc = document.getElementById("tc");
	tc.appendChild(item);
}
	
function seedFromSong(s) {
	var dom = s.xmlDOM();
    document.getElementById("lyrics").value = to_text(dom);
    putDomInPreview(dom);
	
	var metadata = dom.getElementsByTagName("head")[0].childNodes;
	for (var i in metadata) { var datum = metadata[i];
		if (!datum.tagName) continue;
		var text = datum.textContent;
		text = text.replace(/^\s+/, ""); 
		text = text.replace(/\s+$/, "");
		if (datum.tagName == "title") {
			document.getElementById("title").setAttribute("label", text);
		} else {
			addTreeChild(datum.tagName, datum.tagName, text);
		}
	}
}

function to_text(dom) {
    var xslt = getXSLT("text.xsl");
    var text = transformDOM(dom, xslt, dom);
    return text.textContent;
}

function Xesc(s) { return s.replace(/</g, "&lt;") }

function from_text(s) {
    if (!s) s = new SongPrototype();
    var output = "<song>\n<head>\n";
	for (var k in s) {
		if (k == "lyrics") continue;
		output += "<" + k + ">"+ Xesc(s[k]) + "</"+k+">\n";
	}
    output += "\n</head>\n\n";
    output += "<lyrics>";

    var lyr = s.lyrics.replace(/\r/g, "");
    var parts = lyr.split(/\n\n+/);
    for (var pn=0; pn < parts.length; pn++) {
        var lines = parts[pn].split(/\n/);
        var type = "verse";
        var m;
        if (m = lines[0].match(/^(chorus|bridge)/i)) {
            type = m[1].toLowerCase();
            lines.shift();
        }
        output += "<" + type + ">\n";
        for (var ln=0; ln < lines.length; ln++) {
            lines[ln] = lines[ln].replace(/\((.*?)\|(.*?)\)/g, '<sup text="$2">$1</sup>');
            output += "\t<line>" + lines[ln] + "</line>\n";
        }
        output += "</" + type + ">\n";
    }
    output += "</lyrics>\n</song>";
    return output;
}

function addTreeRow(type) {
	var result = {};
    if (type) { result.type = type }
	window.openDialog("chrome://songbee/content/playitemtypes/song/addmetadata.xul", "", "chrome, dialog, modal, resizable=no", result).focus();
	if (result.type) {
		addTreeChild(result.type, result.type, result.value);
	}
}

function markTranslation () {
    var s = new SongPrototype();
	if (song) { s.id = song.id() } else { alert("You must save this song at least once before marking it as a translation."); return }

    if (!s.language) { 
        alert("You must add a 'language' tag to this song first");
        return addTreeRow("language");
    }
	var result = {};
    result.insong = s;
	window.openDialog("chrome://songbee/content/playitemtypes/song/marktranslation.xul", "", "chrome, dialog, modal, resizable=no", result).focus();
	if (result.type) {
		addTreeChild(result.type, result.type, result.value);
		createBacklinks(s.id, result.value)
	}
}

function count(x) { var i = 0; for (var y in x) i++; return i}

function createBacklinks(from, to) {
	// We have just written into song "from" that it is a translation of "to". 
	// Now we have to form a transitive closure.
	
	// This is insanely overcomplex for the default use case, but it's correct and it's fun.
	
	// First, we collect all the data.
	var mdCache;
	var tSet = {}; tSet[from] = 1; tSet[to] = 1;
	var visited = {};
	var todo = {}; todo[from] = 1; todo[to] = 1;
	while (count(todo)) {
		for (var visit in todo) {
			mdCache[visit] = Song.retrieve(visit).metadataAsObject();
			var translations = mdCache[visit].translation;
			for (var t in translations) {
				tSet[translations[t]] = 1;
				if (!visited[translations[t]]) { todo[translations[t]] = 1; }
			}
			visited[visit] = 1;
			delete todo[visit];
		}
	}
	// Now we have to put all the data into every other song
	for (var a in tSet) {
		var tmp = [];
		for (var b in tSet) {
			if (a == b) continue;
			tmp.push[b];
		}
		var meta = mdCache[a];
		meta.translation = tmp;
		s.setMetadata(a);
	}	
}