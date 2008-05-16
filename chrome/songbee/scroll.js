// Smooth scroll functions
var ss_INTERVAL;
var ss_STEPS = 25;

function smooth_scroll (desty) {
 clearInterval(ss_INTERVAL);
 cypos = windows.projector.pageYOffset;
 ss_stepsize = parseInt((desty-cypos)/ss_STEPS);
 ss_INTERVAL = setInterval('ss_scrollWindow('+ss_stepsize+','+desty+')',1);
}

function ss_scrollWindow(scramount,dest) {
 wascypos = windows.projector.pageYOffset;
 isAbove = (wascypos < dest);
 windows.projector.scrollTo(0,wascypos + scramount);
 iscypos = windows.projector.pageYOffset;
 isAboveNow = (iscypos < dest);
 if ((isAbove != isAboveNow) || (wascypos == iscypos)) {
   windows.projector.scrollTo(0,dest);
   highlightVisibleElements();
   clearInterval(ss_INTERVAL);
 }
}
