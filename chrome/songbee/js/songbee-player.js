var plData = {};
var stylesheet = getXSLT();
var htmlNS = "http://www.w3.org/1999/xhtml";

var pausedColor = "#dddd00";
var exposedColor = "#00dddd";
var blankColor = "";
var allowScrollBackUp = 0; // is a matter of taste

var state = {
    paused: 0,
    currentItemIndex: 0,
    currentSectionIndex: 0,
    consoleColor: exposedColor,
    highlightingIndividualLines: 0,
    scrolledOffset: 0,
    verses: [],
    naturalOrder: []
};

var windows = {
    console: window,
    projector: window.open("chrome://songbee/content/blank-projector.html", "projector", "chrome=yes, titlebar=no, width=1024, height=768")
};

// Utility functions

function currentItem() {
    if (state.currentItemIndex < 0) { state.currentItemIndex = 0; }
    if (state.currentItemIndex > plData.items.length - 1) { 
        state.currentItemIndex = plData.items.length - 1;
    }
    return plData.items[state.currentItemIndex];
}
function grep(func, list) { var out = new Array(); for (var i = 0; i < list.length; i++) { if (func(list[i])) { out.push(list[i]) } } return out; };

function nonContainer (x) {return x.className != "container" }
function nextItem() { return plData.items[state.currentItemIndex+1]; }
function projectorSections() { return grep(nonContainer,windows.projector.document.getElementById("song").getElementsByTagName("div")) }
function consoleSections()  {return grep(nonContainer, windows.thisSong.contentDocument.getElementById("song").getElementsByTagName("div")) }
function currentConsoleSection() { return consoleSections()[state.currentSectionIndex]; }
function currentProjectorSection() { return projectorSections()[state.currentSectionIndex]; }
function projectorLines () { return currentProjectorSection().getElementsByTagName("p"); }
function consoleLines () { return currentConsoleSection().getElementsByTagName("p"); }
function topOf (elem) { return $(elem).offset().top }
function bottomOf (elem) { return topOf(elem) + $(elem).outerHeight(); }

// Now the meat of it...

function my_onload() {
    var c = 0;

    var playlistLI = windows.console.document.getElementById("playlist");
    windows.thisSong = document.getElementById("thissong-body");
    windows.nextSong = document.getElementById("nextsong-body");

    windows.projector.screenX = windows.projector.screen.width+1;
    windows.projector.fullScreen = true;

    windows.console.addEventListener("keypress", onKeyPress,  false);
    plData.playlist = Songbee.Playlist.retrieve(window.arguments[0]);
    plData.items = plData.playlist.items(function(s) {
        var li = document.createElementNS(htmlNS, "html:li");
        var label = document.createElement("label");
        label.setAttribute("value", s.title());
        li.appendChild(label);
        li.setAttribute("onclick", "switchItem("+c+")");
        playlistLI.appendChild(li);
        c++;
    });
	var css = plData.playlist.css();
	if (css) {
		var elem = windows.projector.document.createElement("style");
		elem.innerHTML = css;
		windows.projector.document.getElementById("headElem").appendChild(elem);
	} else {
		addUserStylesheet(windows.projector.document);
	}
    switchItem(0,1);
}

function switchItem(s, firstTime) {
    state.currentItemIndex = s;
    if (!firstTime) { unhighlightSection(); }
    displayItem(currentItem());
}

function mkChangeSection(i) { return function () { changeSection(i); }; }

function displayItem(item) { 
    // Display item in browser windows
    putItemInDoc(item, windows.projector.document);
    if (item.type() == "song") 
        cleanProjectorWindow(); // Do this as quickly as possible
    putItemInDoc(item, windows.thisSong.contentDocument);
    putItemInDoc(nextItem(), windows.nextSong.contentDocument);

    item.postDisplayHook();

	if (item.type() == "song") {
	    // Set up data structure for easy access
	    state.verses = [];
	    var cs = consoleSections();
	    for (var i = 0; i < cs.length; i++) {
	        var section = cs[i];
	        section.addEventListener("click", mkChangeSection(i), true);
	        if (section.className == "verse") { state.verses.push(i); }
	    }
	    // Set up the "natural order"
	    state.naturalOrder = determineNaturalOrder(item);
	    if (state.naturalOrder.length && state.naturalOrder[0] === 0) { state.naturalOrder.shift(); }
	    //Songbee.Utilities.jsdump("Natural order was: ");
	    //for (var i in state.naturalOrder) { Songbee.Utilities.jsdump(state.naturalOrder[i]) };		
	}

    // Scroll things back to the beginnng
    state.currentSectionIndex = 0;
    windows.thisSong.contentWindow.scrollTo(0,0);
    highlightSection();
}

function putItemInDoc(item, doc) {
    var song_place = doc.getElementById("song");
    song_place.innerHTML = "";
    if (!item) { song_place.innerHTML="<p>End of playlist</p>"; return; }
    var frag = item.transformToHTML(stylesheet, doc);
    song_place.appendChild(frag);
}

function cleanProjectorWindow() {
    var ps = projectorSections();
    for (var i = 0; i < ps.length; i++) {
        ps[i].style.visibility = "hidden";
    }
}

function unhighlightSection() {
    var ccs = currentConsoleSection();
    ccs.style.backgroundColor = blankColor;
    if (state.highlightingIndividualLines) {
        var p = ccs.getElementsByTagName("p");
        for (var i =0; i < p.length; i++) {
            p[i].style.backgroundColor = blankColor;
        }
        state.highlightingIndividualLines = 0;
    }
    if (!state.paused) { currentProjectorSection().style.visibility = "hidden"; }
}

function highlightSection() {
    if (!state.paused) { currentProjectorSection().style.visibility = "visible"; }
    var ccs = currentConsoleSection();
    if (!fitsOnOnePage()) {
        ccs.style.backgroundColor = blankColor;
        highlightVisibleElements();
    } else {
        ccs.style.backgroundColor = state.consoleColor;
    }
    windows.thisSong.contentWindow.scrollTo(0, topOf(ccs));
}

function firstOffscreenLine() {
    var screenBottom = windows.projector.innerHeight;
    var pl = projectorLines();
    for (var i = 0; i < pl.length; i++) {
        var middleOf = (topOf(pl[i]) + bottomOf(pl[i]))/2;
        if (middleOf > screenBottom) { 
            Songbee.Utilities.jsdump("First offscreen-line is "+pl[i].innerHTML)
            return i; 
        }
    }
    return -1;
}

function highlightVisibleElements() {
    state.highlightingIndividualLines = 1;
    var screenTop = 0; // windows.projector.pageYOffset;
    var screenBottom = screenTop + windows.projector.innerHeight;
    Songbee.Utilities.jsdump("Screen Top is "+screenTop+" & Screen bottom is "+screenBottom);

    var pl = projectorLines();
    var cl = consoleLines();

    for (var i = 0; i < pl.length; i++) {
        var middleOf = (topOf(pl[i]) + bottomOf(pl[i]))/2;
        Songbee.Utilities.jsdump("Top of line is at "+topOf(pl[i])+" bottom of is at "+bottomOf(pl[i])+" and line is "+pl[i].innerHTML);
        var offscreen = (middleOf > screenBottom || bottomOf(pl[i]) < screenTop);
        cl[i].style.background = offscreen ? blankColor : state.consoleColor;
    }
}

function findNext(searchClass) {
    var i;
    var cs = consoleSections();
    var maxItem = cs.length - 1;
    for (i = state.currentSectionIndex + 1; i <= maxItem; i++) {
        if (cs[i].className == searchClass) { return i; }
	}
    for (i = 0; i <= state.currentSectionIndex; i++) {
        if (cs[i].className == searchClass) { return i; }
	}
    return -1;
}

function fitsOnOnePage () {
    var screenBottom =  windows.projector.innerHeight;
    var lines = projectorLines();
    var itemBottom = bottomOf(lines[lines.length-1]);
    //Songbee.Utilities.jsdump("Does item fit on screen? Bottom of screen is "+screenBottom+", bottom of item is "+itemBottom+" "+lines[lines.length-1].innerHTML);
    return (screenBottom >= itemBottom);
}
// Commands

function togglePaused() {
    state.paused = !state.paused;
    if (state.paused) {
        $(currentProjectorSection()).animate({opacity: 0},
            { duration: 500,
              step: function(now, fx){ currentProjectorSection().style.opacity = now; },
              complete:  function() {
                currentProjectorSection().style.visibility = "hidden";
                currentProjectorSection().style.opacity = 1;
                state.consoleColor = pausedColor;
                highlightSection();
              }
           }
        );
        return;
    } else {
        currentProjectorSection().style.opacity = 0;
        currentProjectorSection().style.visibility = "visible";
        $(currentProjectorSection()).animate({opacity: 1},
            { duration: 500,
              step: function(now, fx){ currentProjectorSection().style.opacity = now; },
              complete: function() {
                state.consoleColor = exposedColor;
                highlightSection();
            }
            }
        );
    }
}

function scrollProjectorByLine(offset) {
    state.scrolledOffset += offset;
    if (state.scrolledOffset <0) {
        state.scrolledOffset = 0;
    }
    var line = projectorLines()[state.scrolledOffset];
    Songbee.Utilities.jsdump("Scrolling to line: "+line.innerHTML);
    $(windows.projector).scrollTo(windows.projector.pageYOffset + topOf(line), {axis: "y", duration: 500, onAfter: highlightVisibleElements});
}

function changeSection(sectionIndex) {
    unhighlightSection();
    state.currentSectionIndex = sectionIndex;
    state.scrolledOffset = 0;
    windows.projector.scrollTo(0,0);
    highlightSection();
}

function handleUp () {
    // If we're paused, we're at the top of the current section, or we
    // do not allow scrolling up-screen, then we change sections
    if (state.scrolledOffset === 0 || state.paused || !allowScrollBackUp) {
        if (state.currentSectionIndex === 0) { return; }
        changeSection(state.currentSectionIndex-1);
        return;
    }
    scrollProjectorByLine(-1);
}

function handleDown() {
    // If the current section fits on one screen, or we're paused, then
    // we change sections
    if (state.paused || fitsOnOnePage()) {
        if (state.currentSectionIndex == consoleSections().length-1) { return; }
        changeSection(state.currentSectionIndex+1);
        return;
    }
    scrollProjectorByLine(1);
}

function pageDown() {
    if (fitsOnOnePage()) { return; }
    var l = firstOffscreenLine();
    if (l == -1) { return; }
    // Jump, don't (smooth) scroll
    state.scrolledOffset = l;
    var line = projectorLines()[l];
    windows.projector.scrollTo(0, topOf(line));
    highlightVisibleElements();
}
function pageUp() {}

// Key handler
function onKeyPress(e) {
    var fe = document.commandDispatcher.focusedElement;
    if (fe && fe.tagName == "html:input") { return; }
    Songbee.Utilities.jsdump("Which :"+e.which+" Alt: "+e.altKey+" Ctrl: "+e.ctrlKey+" Meta: "+e.metaKey);
    switch (e.keyCode) {
        case e.DOM_VK_UP: handleUp(); e.preventDefault(); return;
        case e.DOM_VK_DOWN: handleDown(); e.preventDefault(); return;
        case e.DOM_VK_LEFT: switchItem(state.currentItemIndex-1); e.preventDefault();return;
        case e.DOM_VK_RIGHT: switchItem(state.currentItemIndex+1); e.preventDefault();return;
        case e.DOM_VK_PAGE_DOWN: pageDown(); e.preventDefault(); return;
        case e.DOM_VK_PAGE_UP: pageUp(); e.preventDefault(); return;
        case e.DOM_VK_ESCAPE: togglePaused(); e.preventDefault(); return;
    }
    var newSection = -1;
    switch (e.charCode) {
        case e.DOM_VK_1: if (state.verses.length) { newSection = state.verses[0]; } break; 
        case e.DOM_VK_2: if (state.verses[1]) {newSection = state.verses[1];} break; 
        case e.DOM_VK_3: if (state.verses[2]) {newSection = state.verses[2];} break; 
        case e.DOM_VK_4: if (state.verses[3]) {newSection = state.verses[3];} break; 
        case e.DOM_VK_5: if (state.verses[4]) {newSection = state.verses[4];} break; 
        case 118: newSection = findNext("verse"); break; // v
        case 110: if (state.naturalOrder.length > 0) { newSection = state.naturalOrder.shift(); } break; // n
        case 99: newSection = findNext("chorusdiv"); break; // c 
        case 98: newSection = findNext("bridge"); break; // b
    }
    if (newSection == -1) { return; }
    e.preventDefault();
    changeSection(newSection);
} 

// Worship-time searching
var ff;
function update_search() {
    var cd = windows.console.document;
    if (!ff) { 
        ff= cd.getElementById("find-field");
    }
    var text = ff.value;
    if (!text) {
        // Hide the preview bit, show the original RHS, and let's be done.
        cd.getElementById("searchrhs").setAttribute("collapsed", 1);
        cd.getElementById("searchrhs").setAttribute("style", "visibility:collapse");
        cd.getElementById("rhs").setAttribute("collapsed", 0);
        cd.getElementById("rhs").setAttribute("style", "");
        return;
    }
    // Show the preview bit
    cd.getElementById("rhs").setAttribute("collapsed", 1);
    cd.getElementById("rhs").setAttribute("style", "visibility:collapse");
    cd.getElementById("searchrhs").setAttribute("collapsed", 0);
    cd.getElementById("searchrhs").setAttribute("style", "");

    // Get on with the search
    var v = new songTreeView();
    var tree = cd.getElementById("songlist");
    v.searchColumn = "title";
    v.searchText = text;
    tree.view = v;
    v.recalculateRows();
    tree.boxObject.invalidate();
}

// "Natural order" stuff
function determineNaturalOrder(song) {
    // If there's one defined in the database, use that.
    // XXX but right now there isn't.
    var cs = consoleSections();
    var splitSections = {};
    splitSections.chorusdiv = [];
    splitSections.bridge = [];
    splitSections.verse = [];
	var i, v, order;
    for (i = 0; i < cs.length; i++) {
        splitSections[cs[i].className].push(i);
	}
    // No bridge, no chorus: return verses
    if (splitSections.chorusdiv.length === 0 && splitSections.bridge.length === 0) { return splitSections.verse; }

    // No bridge, one chorus: interleave verse/chorus
    if (splitSections.bridge.length === 0 && splitSections.chorusdiv.length == 1) {
        order = [];
        for (v in splitSections.verse) {
            order.push(splitSections["verse"][v], splitSections["chorusdiv"][0]);
		}
        return order;
    }

    // One or two sections: in that order
    if (cs.length <= 2) {
        order = [];
        for (i = 0; i < cs.length; i++) { order.push(i); }
        return order; 
    }
    return [];
}

function displaySong(song) {
    // Come up with a playitem for a song that's not on the playlist
    var item = new PlayItem;
    item["song"] = function () { return song }; 
    item["type"] = function () { return "song"; }
    item.specialize();
    displayItem(item);
}

function doTreeDoubleClick() {
    displaySong(Song.retrieve(selectedSong()));
    ff.value = ""; update_search();
}
