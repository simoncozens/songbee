var Songbee = {
  runFixups: function() {
    for (var a in Songbee.ItemTypes) {
        if (Songbee.ItemTypes[a].fixups) Songbee.ItemTypes[a].fixups();
    }
  },

  checkUpdates: function () {
    var updateListener = {
      onProgress: function(request, position, totalSize) {},
      onCheckComplete: function(request, updates, updateCount) {
        if (updateCount > 0) {
          var prompt = Components.classes["@mozilla.org/updates/update-prompt;1"]. 
          createInstance(Components.interfaces.nsIUpdatePrompt);
          prompt.checkForUpdates();
        }
      },
      onError: function(request, update) { alert('update check error'); },
      QueryInterface: function(aIID) {
        if (!aIID.equals(Components.interfaces.nsIUpdateCheckListener) && !
          aIID.equals(Components.interfaces.nsISupports))
          throw Components.results.NS_ERROR_NO_INTERFACE;
        return this;
      }
    };
    var checker = Components.classes["@mozilla.org/updates/update-checker;1"].createInstance(Components.interfaces.nsIUpdateChecker);
    checker.checkForUpdates(updateListener, true);
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

/* Everyone gets these... */
Songbee.Utilities.loadJSFile("js/jquery.min.js", this);
Songbee.Utilities.loadJSFile("js/songbee-sql.js", this);
