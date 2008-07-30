ItemTypeTable["webpage"] = {
    label: "Web page",
    create: function () {
        var url = prompt("Web site address?");
        /* Add on the end of the LHS list */
        if (!url) { return; }
        var obj = { url: url };
        addToPlaylist(null, "webpage", JSON.stringify(obj), "Web site: "+url);
    },
    title: function () {
        var obj = JSON.parse(this.data());
        return "Web site: "+obj.url;
    },
    transformToHTML: function (stylesheet, doc) { 
        var obj = JSON.parse(this.data());
        var frag = doc.createElement("iframe");
        frag.setAttribute("src", obj.url);
        frag.style.position = "absolute";
        frag.style.top = 0;
        frag.style.left = 0;
        frag.style.width = "100%";
        frag.style.height = "100%";
        return frag;
    }
};
