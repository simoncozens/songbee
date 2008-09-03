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

function from_text() {
    var s = new SongPrototype();
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

function addTreeRow() {
	var result = {};
	window.openDialog("chrome://songbee/content/playitemtypes/song/addmetadata.xul", "", "chrome, dialog, modal, resizable=no", result).focus();
	if (result.type) {
		addTreeChild(result.type, result.type, result.value);
	}
}
