ItemTypeTable["song"] = { 
    label: "Song",
    create: function () {
        window.openDialog("chrome://songbee/content/playitemtypes/song/create-song.xul","create-song", "chrome, dialog, resizable");
    },
    edit: function (id) {
        window.openDialog("chrome://songbee/content/playitemtypes/song/create-song.xul","create-song", "chrome, dialog, resizable", id);
    },
	transformToHTML: function (stylesheet, doc) { return transformDOM(this.song().xmlDOM(), stylesheet, doc) },
	postDisplayHook: function () { 
        var trans = document.getElementById("translations");
        var options = this.song().metadataAsObject();
        var tArray = options["translation"];
        while (trans.firstChild) trans.removeChild(trans.firstChild);
        if (tArray && tArray.length > 0) {
            for (var i in tArray) {
                var song = Song.retrieve(tArray[i]);
                if (!song) continue;
                var lang = song.metadataAsObject().language[0];
                var button = document.createElement("toolbarbutton");
                button.setAttribute("label", lang);
                button.setAttribute("oncommand", "displaySong(Song.retrieve("+song.id()+"))" );
                trans.appendChild(button);
            }
            trans.hidden = 0;
        } else {
            trans.hidden = 1;
        }
        return this.song().played(); 
    },
	title: function () { return this.song().title(); }
};

