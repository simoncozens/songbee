var ff; 
var tree; 

function setupTree() { 
    ff = document.getElementById("find-field");
    tree = document.getElementById("songlist");
    tree.view = new songTreeView() 
}

function songTreeView()
{

    this.columns = ["title", "first_line", "id"];
    this.orderColumn = "playcount/age";
    this.orderDirection = 0;
    this.searchText = "";
    this.searchColumn = "";

    this.whereClause = function() {
        return this.searchColumn ? "WHERE "+this.searchColumn+" LIKE (?1)" : "";
    }

    this.recalculateRows = function () {
        this.cacheRowNum = -1;
        var whereclause = this.whereClause();
        var count;
        if (whereclause) 
            count = Songbee.SQL.exec("SELECT COUNT(*) FROM song "+whereclause, null, null, ["%"+this.searchText+"%"]);
        else 
            count = Songbee.SQL.exec("SELECT COUNT(*) FROM song");
        this.rowCount            = count[0][0];
        if(this.rowCount == 0) { 
            if (this.searchColumn == "title") {
                this.searchColumn = "first_line";
                this.recalculateRows();
                return;
            } else if (this.searchColumn == "first_line") {
                this.searchColumn = "xml";
                this.recalculateRows();
                return;
            } else {
                if (ff) ff.setAttribute("status", "notfound");
            }
        } else {
            if (ff) ff.removeAttribute("status");
        }
    }

    this.getCellText         = function(row,column){ 
        if (row > this.rowCount - 1) return;
        return (this.getSongAtIndex(row))[column.id]();
    };
    this.getSongAtIndex      = function(row) {
        var whereclause = this.whereClause();
        var orderclause = this.orderColumn + (this.orderDirection ? "": " DESC");
        if (row != this.cacheRowNum){
            var limitclause = "LIMIT 1 OFFSET "+row;
            var sql=  "SELECT * FROM song "+whereclause+" ORDER BY "+orderclause+" "+limitclause
            var res;
            if (whereclause)
                res = Songbee.SQL.exec(sql, Song, null, ["%"+this.searchText+"%"]);
            else 
                res = Songbee.SQL.exec(sql, Song);
            this.cacheRow = res[0];
            this.cacheRowNum = row;
        }
        return this.cacheRow;
    };
    this.setTree             = function(treebox){ this.treebox=treebox; };
    this.isContainer         = function(row){ return false; };
    this.isSeparator         = function(row){ return false; };
    this.isSorted            = function(row){ return false; };
    this.getLevel            = function(row){ return 0; };
    this.getImageSrc         = function(row,col){ return null; };
    this.getRowProperties    = function(row,props){ };
    this.getCellProperties   = function(row,col,props){};
    this.getColumnProperties = function(colid,col,props){};
    this.cycleHeader = function (col) {
        if (col.id == this.orderColumn) {
            this.orderDirection = !this.orderDirection;
        } else {
            this.orderColumn = col.id;
        }
        this.treebox.invalidate();
        this.cacheRowNum = -1; // Invalidate cache
    }
    this.recalculateRows();
    return this;
}

function updatePreview() {
    var stylesheet = getXSLT();
    var preview = document.getElementById("preview").contentDocument;
    var song_place = preview.getElementById("song");
    song_place.innerHTML = "";

    var sid = selectedSong();
    if (!sid) return;
    var song = Song.retrieve(sid);
    var frag = transformDOM(song.xmlDOM(), stylesheet, preview);
    song_place.appendChild(frag);
}

function selectedSong() {
    var count = tree.view.selection.getRangeCount();
    if (!count) { return; }
    var start = {};
    var end = {};
    tree.view.selection.getRangeAt(0,start,end);
    return tree.view.getCellText(start.value, tree.columns.getNamedColumn("id"));
}
function update_search() {
    var v = new songTreeView();
    v.searchColumn = "title";
    v.searchText = ff.value;
    tree.view = v;
    v.recalculateRows();
    v.selection.select(0);
    tree.boxObject.invalidate();
}

function refreshTree() {
    tree.view = new songTreeView();
    tree.boxObject.invalidate();
    updatePreview();
}
