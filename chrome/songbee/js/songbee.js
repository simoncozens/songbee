var Songbee = {

  runFixups: function() {
    for (var a in Songbee.ItemTypes) {
        if (Songbee.ItemTypes[a].fixups) Songbee.ItemTypes[a].fixups();
    }
  },

  Utilities: { /* Bootstrapping */
    loadJSFile: function (path, context) {
      var mozIJSSubScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
        .getService(Components.interfaces.mozIJSSubScriptLoader);
      mozIJSSubScriptLoader.loadSubScript("chrome://songbee/content/"+path, context, "UTF-8");
    },
  },
};

/* Replace utilities with utilities.js */
Songbee.Utilities.loadJSFile("js/utilities.js", Songbee);

/* Now load the extensions */
var supportedTypes = [ "song", 
    "bible", 
    // "noticesheet", 
    "webpage" ];

Songbee.ItemTypes = {};
supportedTypes.forEach(function(type) {
  Songbee.Utilities.loadJSFile("playitemtypes/"+type+"/"+type+".js", this);
});
