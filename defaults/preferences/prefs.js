pref("toolkit.defaultChromeURI", "chrome://songbee/content/playlist-list.xul"); 
//pref("toolkit.defaultChromeURI", "chrome://songbee/content/test.xul"); 
user_pref("signed.applets.codebase_principal_support", true);
/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);

pref("app.update.enabled", true);
pref("app.update.auto", true);
pref("app.update.mode", 1);
pref("app.update.silent", false);
pref("app.update.url", "http://songbee.simon-cozens.org/update.xml");
pref("app.update.url.manual", "http://songbee.simon-cozens.org/");
pref("app.update.url.details", "http://songbee.simon-cozens.org/");
pref("app.update.interval", 86400);
pref("app.update.nagTimer.download", 86400);
pref("app.update.nagTimer.restart", 1800);
pref("app.update.timer", 600000);
pref("app.update.showInstalledUI", true);
pref("app.update.incompatible.mode", 0);

   user_pref("app.update.log.Checker", true);
   user_pref("app.update.log.Downloader", true);
   user_pref("app.update.log.General", true);
   user_pref("app.update.log.UI:CheckingPage", true);
   user_pref("app.update.log.UI:DownloadingPage", true);
   user_pref("app.update.log.UI:LicensePage", true);
   user_pref("app.update.log.UpdateManager", true);
   user_pref("app.update.log.UpdateService", true); 
