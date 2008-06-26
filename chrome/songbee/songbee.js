var plData = {};
var stylesheet = getXSLT();
var htmlNS = "http://www.w3.org/1999/xhtml";

var pausedColor = "#dddd00";
var exposedColor = "#00dddd";
var blankColor = "";
var allowScrollBackUp = 0; // is a matter of taste

var state = {
    paused: 0,
    currentSongIndex: 0,
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

function currentSong() {
    if (state.currentSongIndex < 0) { state.currentSongIndex = 0 }
    if (state.currentSongIndex > plData.songs.length - 1) { 
        state.currentSongIndex = plData.songs.length - 1;
    }
    return plData.songs[state.currentSongIndex];
}
function nextSong() { return plData.songs[state.currentSongIndex+1] }
function projectorSections() { return windows.projector.document.getElementById("song").getElementsByTagName("div") }
function consoleSections()  {return windows.thisSong.contentDocument.getElementById("song").getElementsByTagName("div"); }
function currentConsoleSection() { return ((consoleSections())[state.currentSectionIndex]) }
function currentProjectorSection() { return ((projectorSections())[state.currentSectionIndex]) }
function projectorLines () { return currentProjectorSection().getElementsByTagName("p"); }
function consoleLines () { return currentConsoleSection().getElementsByTagName("p"); }
function topOf (elem) { return elem.ownerDocument.getBoxObjectFor(elem).y; }
function bottomOf (elem) { return topOf(elem) + elem.offsetHeight }

// Now the meat of it...

function my_onload() {
    var c = 0;

    var playlistLI = windows.console.document.getElementById("playlist");
    windows.thisSong = document.getElementById("thissong-body"),
    windows.nextSong = document.getElementById("nextsong-body")

    windows.projector.screenX = windows.projector.screen.width+1;
    windows.projector.fullScreen = true;

    windows.console.addEventListener("keypress", onKeyPress,  false);
    plData.playlist = Playlist.retrieve(window.arguments[0]);
    plData.songs = plData.playlist.songs(function(s) {
        var li = document.createElementNS(htmlNS, "html:li");
        var label = document.createElement("label");
        label.setAttribute("value", s.title());
        li.appendChild(label);
        li.setAttribute("onclick", "switchSong("+c+")");
        playlistLI.appendChild(li);
        c++;
    });
	var css = plData.playlist.css();
	if (css) {
		var elem = doc.createElement("style");
		elem.innerHTML = css;
		windows.projector.document.getElementById("headElem").appendChild(elem);
	} else {
		addUserStylesheet(windows.projector.document);
	}
    switchSong(0,1);
}

function switchSong(s, firstTime) {
    state.currentSongIndex = s;
    if (!firstTime)
        unhighlightSection();
    displaySong(currentSong());
}

function displaySong(song) { 
    // Display song in browser windows
    putSongInDoc(song, windows.projector.document);
    cleanProjectorWindow(); // Do this as quickly as possible
    putSongInDoc(song, windows.thisSong.contentDocument);
    putSongInDoc(nextSong(), windows.nextSong.contentDocument);

    // Increment the counter
    song.played();

    // Set up data structure for easy access
    state.verses = [];
    var cs = consoleSections();
    for (var i = 0; i < cs.length; i++) {
        var section = cs[i];
        section.addEventListener("click", mkChangeSection(i), true);
        if (section.className == "verse") { state.verses.push(i) }
    }
    // Set up the "natural order"
    state.naturalOrder = determineNaturalOrder(song);
    if (state.naturalOrder.length && state.naturalOrder[0] == 0) { state.naturalOrder.shift() }
    //jsdump("Natural order was: ");
    //for (var i in state.naturalOrder) { jsdump(state.naturalOrder[i]) };

    // Scroll things back to the beginnng
    state.currentSectionIndex = 0;
    windows.thisSong.contentWindow.scrollTo(0,0);
    highlightSection();
}

function mkChangeSection(i) { return function () { changeSection(i) } }

function putSongInDoc(song, doc) {
    var song_place = doc.getElementById("song");
    song_place.innerHTML = "";
    if (!song) { song_place.innerHTML="<p>End of playlist</p>"; return; }
    var frag = transformDOM(song.xmlDOM(), stylesheet, doc);
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
    if (!state.paused)
        currentProjectorSection().style.visibility = "hidden";
}

function highlightSection() {
    if (!state.paused) 
        currentProjectorSection().style.visibility = "visible";
    var ccs = currentConsoleSection();
    if (!fitsOnOnePage()) {
        ccs.style.backgroundColor = blankColor;
        highlightVisibleElements();
    } else {
        ccs.style.backgroundColor = state.consoleColor;
    }
    windows.thisSong.contentWindow.scrollTo(0, topOf(ccs) - 10);
}

function firstOffscreenLine() {
    var screenTop = windows.projector.pageYOffset;
    var screenBottom = screenTop + windows.projector.innerHeight;
    var pl = projectorLines();
    for (var i = 0; i < pl.length; i++) {
        var middleOf = (topOf(pl[i]) + bottomOf(pl[i]))/2;
        if (middleOf > screenBottom) return i;
    }
    return -1;
}

function highlightVisibleElements() {
    state.highlightingIndividualLines = 1;
    var screenTop = windows.projector.pageYOffset;
    var screenBottom = screenTop + windows.projector.innerHeight;

    var pl = projectorLines();
    var cl = consoleLines();

    for (var i = 0; i < pl.length; i++) {
        var middleOf = (topOf(pl[i]) + bottomOf(pl[i]))/2;
        var offscreen = (middleOf > screenBottom || bottomOf(pl[i]) < screenTop);
        cl[i].style.background = offscreen ? blankColor : state.consoleColor;
    }
}

function findNext(class) {
    var i;
    var cs = consoleSections();
    var maxItem = cs.length - 1;
    for (i = state.currentSectionIndex + 1; i <= maxItem; i++)
        if (cs[i].className == class) return i;
    for (i = 0; i < state.currentSectionIndex; i++)
        if (cs[i].className == class) return i;
    return -1;
}

function fitsOnOnePage () {
    var screenTop = windows.projector.pageYOffset;
    var screenBottom = screenTop + windows.projector.innerHeight;
    var lines = projectorLines();
    var itemBottom = bottomOf(lines[lines.length-1]);
    return (screenBottom >= itemBottom);
}
// Commands

function togglePaused() {
    state.paused = !state.paused;
    if (state.paused) {
        currentProjectorSection().style.visibility = "hidden";
        state.consoleColor = pausedColor;
    } else {
        state.consoleColor = exposedColor;
    }
    highlightSection();
}

function scrollProjectorByLine(offset) {
    state.scrolledOffset += offset;
    if (state.scrolledOffset <0) {
        state.scrolledOffset = 0;
    }
    var line = (projectorLines())[state.scrolledOffset];
    smooth_scroll(topOf(line));
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
    if (state.scrolledOffset == 0 || state.paused || !allowScrollBackUp) {
        if (state.currentSectionIndex == 0) return;
        changeSection(state.currentSectionIndex-1);
        return;
    }
    scrollProjectorByLine(-1);
}

function handleDown() {
    // If the current section fits on one screen, or we're paused, then
    // we change sections
    if (state.paused || fitsOnOnePage()) {
        if (state.currentSectionIndex == consoleSections().length-1) return;
        changeSection(state.currentSectionIndex+1);
        return;
    }
    scrollProjectorByLine(1);
}

function pageDown() {
    if (fitsOnOnePage()) return;
    var l = firstOffscreenLine();
    if (l == -1) return;
    // Jump, don't (smooth) scroll
    state.scrolledOffset = l;
    var line = (projectorLines())[l];
    windows.projector.scrollTo(0, topOf(line));
    highlightVisibleElements();
}
function pageUp() {}

// Key handler
function onKeyPress(e) {
    var fe = document.commandDispatcher.focusedElement;
    if (fe && fe.tagName == "html:input") return;
    e.preventDefault();
    switch (e.keyCode) {
        case e.DOM_VK_UP: handleUp(); return;
        case e.DOM_VK_DOWN: handleDown(); return;
        case e.DOM_VK_LEFT: switchSong(state.currentSongIndex-1); return;
        case e.DOM_VK_RIGHT: switchSong(state.currentSongIndex+1); return;
        case e.DOM_VK_PAGE_DOWN: pageDown(); return;
        case e.DOM_VK_PAGE_UP: pageUp(); return;
        case e.DOM_VK_ESCAPE: togglePaused(); return;
    }
    var newSection = -1;
    switch (e.charCode) {
        case e.DOM_VK_1: if (state.verses.length) newSection = state.verses[0]; break;
        case e.DOM_VK_2: if (state.verses[1]) newSection = state.verses[1]; break;
        case e.DOM_VK_3: if (state.verses[2]) newSection = state.verses[2]; break;
        case e.DOM_VK_4: if (state.verses[3]) newSection = state.verses[3]; break;
        case e.DOM_VK_5: if (state.verses[4]) newSection = state.verses[4]; break;
        case 118: newSection = findNext("verse"); break; // v
        case 110: if (state.naturalOrder.length > 0) newSection = state.naturalOrder.shift(); break; // n
        case 99: newSection = findNext("chorusdiv"); break; // c 
        case 98: newSection = findNext("bridge"); break; // b
    }
    if (newSection == -1) return;
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
    var splitSections = new Object;
    splitSections["chorusdiv"] = [];
    splitSections["bridge"] = [];
    splitSections["verse"] = [];
    for (var i = 0; i < cs.length; i++)
        splitSections[cs[i].className].push(i);
    // No bridge, no chorus: return verses
    if (splitSections["chorusdiv"].length == 0 
        && splitSections["bridge"].length == 0) 
        return splitSections["verse"];

    // No bridge, one chorus: interleave verse/chorus
    if (splitSections["bridge"].length == 0 &&
        splitSections["chorusdiv"].length == 1) {
        var order = [];
        for (v in splitSections["verse"])
            order.push(splitSections["verse"][v], splitSections["chorusdiv"][0]);
        return order;
    }

    // One or two sections: in that order
    if (cs.length <= 2) {
        var order = [];
        for (var i = 0; i < cs.length; i++)
            order.push(i);
        return order; 
    }
    return [];
}

function doTreeDoubleClick() {
    displaySong(Song.retrieve(selectedSong()));
    ff.value = ""; update_search();
}
