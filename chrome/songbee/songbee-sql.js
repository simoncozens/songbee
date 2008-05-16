var dserv = Components.classes["@mozilla.org/file/directory_service;1"] 
                     .getService(Components.interfaces.nsIProperties);

var file = dserv.get("ProfD", Components.interfaces.nsIFile);
file.append("workship.db");

var ours = dserv.get("resource:app", Components.interfaces.nsIFile);
ours.append("chrome");
ours.append("workship.db");
if (!file.exists()) {
    if (!ours.exists()) { alert("Oops, I can't find my own database in "+ours.path) }
    ours.copyTo(dserv.get("ProfD", Components.interfaces.nsIFile), "workship.db");
}

var storageService = Components.classes["@mozilla.org/storage/service;1"]
                        .getService(Components.interfaces.mozIStorageService);

var mDBConn = storageService.openDatabase(file);

function jsdump(str)
{
  Components.classes['@mozilla.org/consoleservice;1']
            .getService(Components.interfaces.nsIConsoleService)
            .logStringMessage(str);
}

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
        return doSQL(this.prototype.select_clause, this, callback)
    }
    where.retrieve = function (id)  {
        var a = doSQL(this.prototype.select_clause + " WHERE id = "+id, this);
        if (a) { return a[0] }
    }
    // delete was a reserved word in JS 1.5
    where.prototype.drop = function ()  {
        if (this.tidy_up) { this.tidy_up() } 
        doSQLStatement("DELETE FROM "+table+" WHERE id="+this.id());
    }
    where.prototype.set = function (name, val) {
        doSQLStatement("UPDATE "+table+" SET "+name+" = (?1) WHERE id="+this.id(), [val]);
        this["_"+name] = val;
    }

    where.create = function (myA) {
        var cols = new Array(); var values = new Array();
        while (myA.length >0) { cols.push(myA.shift()); values.push(myA.shift()) }
        var cc = "INSERT INTO "+table+" ("+cols.join(", ")+") VALUES (";
        for (var i=1;  i <= cols.length; i++) { cc += "(?"+i+"), "; }
        cc = cc.replace(/, $/, ")");
        doSQLStatement(cc, values);
        return where.retrieve(auto_increment_value());
    }
};

function doSQL(sql, targetClass, callback, params) {
    var rv = new Array;
    var statement;
    try {
        statement = mDBConn.createStatement(sql);
    } catch (e) {
        jsdump("Bad SQL: "+sql);
        return;
    }
    if (params) {
        for (var i =0; i < params.length; i++) 
            statement.bindStringParameter(i, params[i]);
    }
    while (statement.executeStep()) {
        var c;
        var thisArray = new Array;
        for (c=0; c< statement.numEntries; c++) {
            thisArray.push(statement.getString(c));
        }
        if (targetClass) {
            var thing = new targetClass(thisArray);
            for(var i=0; i < thing.columns.length; i++)
                thing["_"+thing.columns[i]] = thisArray[i];
            if (callback) { callback(thing) } 
            rv.push(thing)
        } else { rv.push(thisArray) } 
    }
    return rv;
}

function doSQLStatement(sql, params) {
    var statement = mDBConn.createStatement(sql)
    if (params) {
        for (var i =0; i < params.length; i++) 
            statement.bindStringParameter(i, params[i]);
    }
    statement.execute();
}

function auto_increment_value () { 
    var statement = mDBConn.createStatement("SELECT last_insert_rowid()");
    statement.executeStep();
    return statement.getInt32(0);
}

function Playlist () {}; databaseClass(Playlist, "playlist", [ "id", "name" ]);

function Song () {}; databaseClass(Song, "song", [ "id", "song_key", "title", "first_line", "xml", "age", "playcount" ]);

Song.ageAll = function () {
    doSQLStatement("UPDATE song SET age = 0 WHERE age IS NULL");
    doSQLStatement("UPDATE song SET age = age + 1");
}

Song.prototype.played = function () {
    doSQLStatement("UPDATE song SET playcount = 0 WHERE playcount IS NULL");
    doSQLStatement("UPDATE song SET playcount = playcount + 1 WHERE id = "+this.id());
}

Playlist.prototype.songs = function (callback) {
    return doSQL("SELECT song.id, song_key, title, first_line, xml FROM song, play_item WHERE play_item.playlist = "+this._id+" AND play_item.song = song.id ORDER BY play_item.position ", Song, callback);
};

Playlist.prototype.tidy_up = function () {
    doSQLStatement("DELETE FROM play_item WHERE playlist= (?1)", [this._id]);
};

Playlist.prototype.add_item = function(song, position) {
    doSQLStatement("INSERT INTO play_item (playlist, song, position) VALUES ((?1), (?2), (?3))", [this._id, song, position]);
};

Song.prototype.xmlDOM = function () {
    var parsed = (new DOMParser()).parseFromString(this.xml(), "text/xml");
    return parsed;
};
