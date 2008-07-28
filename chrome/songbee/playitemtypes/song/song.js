ItemTypeTable["song"] = { 
    label: "Song",
    create: function () {
        window.openDialog("chrome://songbee/content/playitemtypes/song/create-song.xul","create-song", "chrome, dialog, resizable");
    },
    edit: function (id) {
        window.openDialog("chrome://songbee/content/playitemtypes/song/create-song.xul","create-song", "chrome, dialog, resizable", id);
    }
};

