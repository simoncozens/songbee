/* Watch me pull a rabbit from out of my... */
var JSON;
var supportedTypes = [ "song", 
    "bible", 
    // "noticesheet", 
    "webpage" ];

function bug(str) {
    alert("BUG! "+str);
    Songbee.Utilities.jsdump(str+"\n\n"+ Songbee.Utilities.stackTrace(arguments.callee));
}

var mozIJSSubScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                            .getService(Components.interfaces.mozIJSSubScriptLoader);

Songbee.ItemTypes = {};
supportedTypes.forEach(function(type) {
    mozIJSSubScriptLoader.loadSubScript("chrome://songbee/content/playitemtypes/"+type+"/"+type+".js",
                                    this, "UTF-8");
});

function runFixups() {
    for (var a in Songbee.ItemTypes) {
        if (Songbee.ItemTypes[a].fixups) Songbee.ItemTypes[a].fixups();
    }
}


function checkUpdates()
{
        var updateListener = {
                onProgress: function(request, position, totalSize)
                {
                },

                onCheckComplete: function(request, updates, updateCount)
                {
                        if(updateCount > 0)
                        {
                                var prompt = Components.classes["@mozilla.org/updates/update-prompt;1"]. createInstance(Components.interfaces.nsIUpdatePrompt);
                                prompt.checkForUpdates();
                        }
                },

                onError: function(request, update)
                {
                        alert('update check error');
                },

                QueryInterface: function(aIID)
                {
                        if (!aIID.equals(Components.interfaces.nsIUpdateCheckListener) && !
aIID.equals(Components.interfaces.nsISupports))
                                throw Components.results.NS_ERROR_NO_INTERFACE;
                        return this;
                }
        };

        var checker = Components.classes["@mozilla.org/updates/update-checker;1"]. createInstance(Components.interfaces.nsIUpdateChecker);
        checker.checkForUpdates(updateListener, true);

} 