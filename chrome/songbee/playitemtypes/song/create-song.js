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
    this.lyrics = document.getElementById("lyrics").value;
    this.title = document.getElementById("song-title").value;
    this.author = document.getElementById("author").value;
    this.owner = document.getElementById("copyright").value;
    this.year = document.getElementById("year").value;
    this.key = document.getElementById("song-key").value;
}

function seedFromSong(s) {
    document.getElementById("song-title").value = s.title();
    document.getElementById("song-key").value  = s.song_key();
    var dom = s.xmlDOM();
    document.getElementById("lyrics").value = to_text(dom);
    putDomInPreview(dom);
    // These need seeding from XPath...
}

function to_text(dom) {
    var xslt = getXSLT("text.xsl");
    var text = transformDOM(dom, xslt, dom);
    return text.textContent;
}
function from_text() {
    var output = "<song>\n<head>\n<title>"
    var s = new SongPrototype();
    output += s.title+"</title>\n";
    output += "<copyright>\n\t<author>"+s.author+"</author>\n";
    output += "\t<owner>"+s.owner+"</owner>\n</copyright>\n";
    output += "<key>"+s.key+"</key>\n</head>\n\n";
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
