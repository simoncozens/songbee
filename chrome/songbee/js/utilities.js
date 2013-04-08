/* General utility functions */

var Utilities = {
  loadJSFile: function (path, context) {
    var mozIJSSubScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
      .getService(Components.interfaces.mozIJSSubScriptLoader);
    Songbee.Utilities.jsdump("Loading chrome://songbee/content/"+path);
    mozIJSSubScriptLoader.loadSubScript("chrome://songbee/content/"+path, context, "UTF-8");
  },

  localisedString: function (key) { return document.getElementById("strings").getString(key); },

  windowOpener: function (name, args) {
    if (!args) {args = [];}
    window.openDialog("chrome://songbee/content/"+name+".xul", name, "chrome, dialog");
  },

  quit: function (aForceQuit) {
    var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
    getService(Components.interfaces.nsIAppStartup);
    // eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
    // process if there is unsaved data. eForceQuit will quit no matter what.
    var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
          Components.interfaces.nsIAppStartup.eAttemptQuit;
          appStartup.quit(quitSeverity);
  },

  openDebugger: function () { 
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    //Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
    getService(Ci.nsIWindowMediator);
    var console = wm.getMostRecentWindow("global:console");
    if (!console) {
      var wwatch = Cc["@mozilla.org/embedcomp/window-watcher;1"].
      getService(Ci.nsIWindowWatcher);
      wwatch.openWindow(null, "chrome://global/content/console.xul", "_blank", "chrome,dialog=no,all", null);
    } else {
      console.focus(); // the Error console was already open
    }
  },

  stackTrace: function(startingPoint) { 
    var getSignature = function (theFunction) { 
      var signature = theFunction.name; 
      signature += "("; 
      for(var x=0; x<theFunction.arguments.length; x++) { 
      // trim long arguments 
          var nextArgument = theFunction.arguments[x]; 
          if(nextArgument.length > 30) nextArgument = nextArgument.substring(0, 30) + "..."; 
          signature += "'" + nextArgument + "'"; 
          if(x < theFunction.arguments.length - 1) signature += ", "; 
      } 
      signature += ")"; 
      return signature; 
    }
    var stackTraceMessage = "Stack trace: \n"; 
    var nextCaller = startingPoint; 
    do {
        stackTraceMessage += getSignature(nextCaller) + "\n";
        nextCaller = nextCaller.caller;
    } while (nextCaller); 
    return stackTraceMessage + "\n";
  },

  jsdump: function(str) {
    Components.classes['@mozilla.org/consoleservice;1']
      .getService(Components.interfaces.nsIConsoleService)
      .logStringMessage(str);
  },

  bug: function(str) {
    alert("BUG! "+str);
    Songbee.Utilities.jsdump(str+"\n\n"+ Songbee.Utilities.stackTrace(arguments.callee));
  },
}