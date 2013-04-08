var SQL = {
  currentSchemaVersion: 2,
  dbh: function() {
    var dserv = Components.classes["@mozilla.org/file/directory_service;1"] 
    .getService(Components.interfaces.nsIProperties);
    var file = dserv.get("ProfD", Components.interfaces.nsIFile);
    file.append("workship.db");
    var ours = dserv.get("DefRt", Components.interfaces.nsIFile).parent;
    ours.append("chrome");
    ours.append("workship.db");
    if (!file.exists()) {
      if (!ours.exists()) { alert("Oops, I can't find my own database in "+ours.path) }
        ours.copyTo(dserv.get("ProfD", Components.interfaces.nsIFile), "workship.db");
    }

    var storageService = Components.classes["@mozilla.org/storage/service;1"]
    .getService(Components.interfaces.mozIStorageService);

    return storageService.openDatabase(file);
  },
  schemaVersion: function() {
    try {
      var statement = mDBConn.createStatement("SELECT schema_version FROM songbee_system");
      statement.executeStep();
      var ver = statement.getString(0);
      statement.reset();
      return ver; 
    } catch (e) { return 1 }
  },
  setupStatement: function (sql,params) {
    var statement;
    try {
      statement = Songbee.SQL.dbh().createStatement(sql);
    } catch (e) {
      Songbee.Utilities.bug("Bad SQL: "+sql);
      return;
    }
    if (params) {
      for (var i =0; i < params.length; i++) 
        statement.bindStringParameter(i, params[i]);
    }
    return statement;
  },
  exec: function (sql, targetClass, callback, params) {
    var object = function (o) { function F() {} F.prototype = o; return new F(); };
    var rv = [];
    var statement = Songbee.SQL.setupStatement(sql, params);
    while (statement.executeStep()) {
      var c;
      var thisArray = [];
      for (c=0; c< statement.numEntries; c++) {
        thisArray.push(statement.getString(c));
      }
      if (targetClass) {
        var thing = new targetClass(thisArray);
        for(var i=0; i < thing.columns.length; i++)
          thing["_"+thing.columns[i]] = thisArray[i];
        if (callback) { callback(thing); } 
        rv.push(thing);
      } else { rv.push(thisArray); } 
    }
    statement.reset();
    return rv;
  }, 
  doSQLStatement: function (sql, params) {
    var statement = Songbee.SQL.setupStatement(sql, params);
    statement.execute();
    statement.reset();
  },
};

function databaseClass (where, table, cols) {
    where.prototype.init = function (values) {
        var that = this;
        values.forEach(function (e,i) { that["_"+that.columns[i]] = e});
    };
    where.prototype.table = table;
    where.prototype.columns = cols;

    // Make accessors
    cols.forEach(function (e) { 
        where.prototype[e] = function (val) { 
            if (val) this.set(e, val);
            return this["_"+e];
        }
    });

    where.prototype.select_clause = "SELECT "+cols.join(", ")+" FROM "+table; 
    where.retrieveAll = function (callback)  {
        return Songbee.SQL.exec(this.prototype.select_clause, this, callback)
    }
    where.retrieve = function (id)  {
        var a = Songbee.SQL.exec(this.prototype.select_clause + " WHERE id = "+id, this);
        if (a) { return a[0] }
    }
    // delete was a reserved word in JS 1.5
    where.prototype.drop = function ()  {
        if (this.tidy_up) { this.tidy_up() } 
        Songbee.SQL.doSQLStatement("DELETE FROM "+table+" WHERE id="+this.id());
    }
    where.prototype.set = function (name, val) {
        Songbee.SQL.doSQLStatement("UPDATE "+table+" SET "+name+" = (?1) WHERE id="+this.id(), [val]);
        this["_"+name] = val;
    }

    where.create = function (myA) {
        var cols = new Array(); var values = new Array();
        while (myA.length >0) { cols.push(myA.shift()); values.push(myA.shift()) }
        var cc = "INSERT INTO "+table+" ("+cols.join(", ")+") VALUES (";
        for (var i=1;  i <= cols.length; i++) { cc += "(?"+i+"), "; }
        cc = cc.replace(/, $/, ")");
        Songbee.SQL.doSQLStatement(cc, values);
        return where.retrieve(auto_increment_value());
    }
};


function auto_increment_value () { return mDBConn.lastInsertRowID; }

function Playlist () {}; databaseClass(Playlist, "playlist", [ "id", "name", "css" ]);
function PlayItem () {}; databaseClass(PlayItem, "play_item", [ "id", "playlist", "song", "position", "type", "data" ]);
function Song () {}; databaseClass(Song, "song", [ "id", "song_key", "title", "first_line", "xml", "age", "playcount" ]);

Song.ageAll = function () {
    Songbee.SQL.doSQLStatement("UPDATE song SET age = 0 WHERE age IS NULL");
    Songbee.SQL.doSQLStatement("UPDATE song SET age = age + 1");
}

Song.prototype.played = function () {
    Songbee.SQL.doSQLStatement("UPDATE song SET playcount = 0 WHERE playcount IS NULL");
    Songbee.SQL.doSQLStatement("UPDATE song SET playcount = playcount + 1 WHERE id = "+this.id());
}

Song.resetAllPlaycounts = function () {
    Songbee.SQL.doSQLStatement("UPDATE song SET playcount = 0");
};

Song.prototype.xmlDOM = function () {
    var parsed = (new DOMParser()).parseFromString(this.xml(), "text/xml");
    return parsed;
};

/* This is horrible. It would be so much easier if we were using JSON
but for backward compatibility we can't really now. */
Song.prototype.metadataAsObject = function () {
    var md = {};
    var dom = this.xmlDOM();
    var options = dom.getElementsByTagName("head")[0].childNodes;
    for (var i =0; i < options.length; i++) {
        var node = options[i];
        if (node.nodeType == 1) {
            var text = node.textContent;
            text = text.replace(/^\s+/, "");
            text = text.replace(/\s+$/, "");
            if (typeof (md[node.tagName]) == "undefined") {  
                md[node.tagName] = [ text ];
            } else {
                md[node.tagName].push(text);
            }
        }
    }
    return md;
}

Song.prototype.setMetadata = function (o) { 
	var dom = this.xmlDOM();
	var options = dom.getElementsByTagName("head")[0];
	var title; // Save this one;
	var c;
	while (c = options.firstChild) {
		if (c.tagName == "title") { title = c; }
		options.removeChild(c);
	}
	if (title) options.appendChild(title);
	for (var node in o) {
		for (var entry in o[node]) {
			var c = dom.createElement(node); 
			var tnode = dom.createTextNode(o[node][entry]);
			c.appendChild(tnode);
			options.appendChild(c);
		}
	}
	// Serialise back to the Database
	
    var serializer = new XMLSerializer();
	var temp = serializer.serializeToString(dom)
    this.xml(temp); 
}

Playlist.prototype.items = function (callback) {
    return Songbee.SQL.exec("SELECT id, playlist, song, position, type, data FROM play_item WHERE play_item.playlist = "+this._id+" ORDER BY position ", PlayItem, function (pi) { pi.specialize(); if (callback) callback(pi); });
};

Playlist.prototype.tidy_up = function () {
    Songbee.SQL.doSQLStatement("DELETE FROM play_item WHERE playlist= (?1)", [this._id]);
};

Playlist.prototype.add_item = function(song, position, type, data) {
	if (!type) type = "song";
	if (!data) data = "";
	if (type == "song" && !song) { bug("No song ID given for song item."); return; }
    Songbee.SQL.doSQLStatement("INSERT INTO play_item (playlist, song, position, type, data) VALUES ((?1), (?2), (?3),(?4),(?5))", [this._id, song, position, type, data]);
};

Playlist.prototype.toLI = function () {
  var li = document.createElementNS(hns, "html:li");
  li.setAttribute("id", "playlist"+this.id());
  var label = document.createElement("label");
  label.setAttribute("value", this.name());

  li.appendChild(label);

  var worship = document.createElement("button");
  worship.setAttribute("id", "worship"+this.id());
  worship.setAttribute("oncommand", "worship("+this.id()+")");
  worship.setAttribute("label", Songbee.Utilities.localisedString("worship"));
  li.appendChild(worship);

  var edit = document.createElement("button");
  edit.setAttribute("id", "edit"+this.id());
  edit.setAttribute("oncommand", "edit_pl("+this.id()+")");
  edit.setAttribute("label", Songbee.Utilities.localisedString("edit"));
  li.appendChild(edit);

  var delbut = document.createElement("button");
  delbut.setAttribute("id", "delete"+this.id());
  delbut.setAttribute("oncommand", "delete_pl("+this.id()+")");
  delbut.setAttribute("label", Songbee.Utilities.localisedString("delete"));
  li.appendChild(delbut);

  return li;
}

PlayItem.prototype.song = function() {
	if (this.type() != "song") { bug("song called on playitem "+this._id+" which has type ["+this.type()+"]"); }
	var songlist = Songbee.SQL.exec("SELECT song.id, song_key, title, first_line, xml FROM song  WHERE id = "+this._song, Song);
	if (songlist.length < 1 )  { alert("Retrieving song not in database: has it been deleted?"); }
	return songlist[0]
}

/* PlayItem function dispatchers. We are faking specialization here. */

var ActionFallbacks = {
	transformToHTML: function () { return "<p>[Don't know how to transform object of type "+this.type+"]</p>" },
	postDisplayHook: function () {},
	title: function() { return "[PlayItem "+this._id+"/"+this.type()+"]" }
};

PlayItem.prototype.specialize = function () {
	for (var handle in ActionFallbacks) {
		this[handle] = Songbee.ItemTypes[this.type()][handle] || ActionFallbacks[handle];
	}
}

function songShape (dom) {
    /* Notice this hack: songs created using create-song have a
    different XML structure than those created by the old, old Perl
    script to parse the Sankey hymnal. It's ugly. */
    var sections = (dom.getElementsByTagName("lyrics")[0] || dom.getElementsByTagName("song")[0]).childNodes;
    var shape = "";
    for (var i =0; i < sections.length; i++) {
        if (sections[i].tagName == "verse") { shape = shape + "v" }
        if (sections[i].tagName == "chorus") { shape = shape + "c" }
        if (sections[i].tagName == "brdige") { shape = shape + "b" }
    }
    return shape;
}

