function cssObj (which) { 
    var css = document.getElementById("preview").contentDocument.styleSheets;
    if (which != null) return css.item(which);
    return css.item(css.length-1);
}

function forEachStyle(callback, which) {
    var obj = cssObj(which);
    //jsdump("Got stylesheet "+obj.href);
    var rules = obj.cssRules;
    for (var i=0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.style) { // @import is a rule with no styles
            for (var j=0; j < rule.style.length; j++) {
                var thing = rule.style[j];
                callback(rule, thing);
            }
        }
    }
}

function fillvalues(which) {
    forEachStyle(function (rule, thing) {
            var selector = rule.selectorText;
            var formElem = findElem(selector + "." + thing );
            if (!formElem) {return}
            Songbee.Utilities.jsdump("Looking for an element for "+selector+"."+thing);
            var domname = domNameFor(thing);
            Songbee.Utilities.jsdump("value is "+rule.style[domname]);
            if (formElem.tagName == "colorpicker") 
                formElem.color = rule.style[domname];
            else
                formElem.value = rule.style[domname];
    }, which);
    $("textbox,menulist,colorpicker").change( function () { editcss(this); } );
    $("menulist").attr("oncommand", "editcss(this)");

}

function domNameFor(css) {
    var components = css.split(/-/);
    var domname = components.shift();
    while (components.length) {
        var comp = components.shift();
        var up = comp.charAt(0).toUpperCase() + comp.substring(1);
        domname += up;
    }
    return domname;
}

function findElem (name) { 
    return document.getElementById(name);
}

function editcss(control) {
    var parsedName = control.id.match(/^(.*)\.(.*)$/);
    Songbee.Utilities.jsdump("Editing "+control.id);
    var style = cssObj();
    var rules = style.cssRules;
    var value = control.color ? control.color : control.value;
    // Do I already have a rule for this selector?
    for (var i=0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.selectorText != parsedName[1]) { continue; }
        //  If so, do I already have a property for this style?
        for (var j=0; j < rule.style.length; j++) {
            var thing = rule.style[j];
            if (thing == parsedName[2]) { 
                // Delete it
                rule.style.removeProperty(thing);
            }
        }
        //  Add a new property
        //jsdump("Setting a property "+parsedName[2]+" to "+value);
        rule.style.setProperty(parsedName[2], value, "");
        return;
    }
    // Otherwise
    var ruleText = parsedName[1] + " { " + parsedName[2]+": " + value + " }";
    style.insertRule(ruleText, style.cssRules.length)
}

function dumpCSS() { 
    var cssText = "";
    var rules = cssObj().cssRules;
    for (var i=0; i < rules.length; i++) {
        var rule = rules[i];
        cssText += rule.cssText+"\n";
    }
    return cssText;
}
