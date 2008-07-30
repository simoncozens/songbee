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
        frag.innerHTML = obj.passageText;
        return frag;
    }
};

function getPassage(reference) {
    var url = "http://www.gnpcb.org/esv/share/get/?key=IP&passage="+escape(reference)+"&action=doPassageQuery";
    var myXMLHTTPRequest = new XMLHttpRequest();
    myXMLHTTPRequest.open("GET", url, false);
    myXMLHTTPRequest.overrideMimeType('text/xml'); // Harder
    myXMLHTTPRequest.send(null);
    return myXMLHTTPRequest.responseText;
}
