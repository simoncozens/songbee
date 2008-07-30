ItemTypeTable["bible"] = {
    label: "Bible passage",
    create: function () {
        var passage = prompt("Bible passage to add?");
        /* Add on the end of the LHS list */
        if (!passage) { return; }
        var obj = { passage: passage };
        addToPlaylist(null, "bible", JSON.stringify(obj), "Bible passage: "+passage);
    },
    title: function () {
        var obj = JSON.parse(this.data());
        return "Bible passage: "+obj.passage;
    }
};
