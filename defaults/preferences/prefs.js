pref("toolkit.defaultChromeURI", "chrome://songbee/content/playlist-list.xul"); 
//pref("browser.chromeURL", "chrome://songbee/content/navigator.xul") 
user_pref("signed.applets.codebase_principal_support", true);
/* debugging prefs */
pref("browser.dom.window.dump.enabled", true);
pref("security.fileuri.strict_origin_policy", false);
pref("javascript.options.showInConsole", true);
pref("javascript.options.strict", true);
pref("nglayout.debug.disable_xul_cache", true);
pref("nglayout.debug.disable_xul_fastload", true);

pref("app.update.enabled", true);
pref("app.update.auto", true);
pref("app.update.mode", 1);
pref("app.update.silent", false);
// XXX Need to get this update server running.
pref("app.update.url", "http://songbee.simon-cozens.org/cgi-bin/update.pl/%VERSION%/%OS_VERSION%");
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
