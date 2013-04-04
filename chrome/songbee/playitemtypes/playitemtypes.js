
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