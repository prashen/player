/*
 MODULE: context-menu

 */

Player.provide('context-menu',{

},function(Player,$,opts){
    var $this = this;
    $.extend($this, opts);

    $this.showMenu = false;
    $this.showLinkBox = false;
    $this.menuTop = 0;
    $this.menuLeft = 0;

    $this.linkBoxValue = Player.get("embedCode");

    /* GETTERS */
    Player.getter('showMenu', function(){ return $this.showMenu; });
    Player.getter('showLinkBox', function(){return $this.showLinkBox;});
    Player.getter('menuTop', function(){ return $this.menuTop; });
    Player.getter('menuLeft', function(){ return $this.menuLeft; });
    Player.getter('linkBoxValue', function(){return $this.linkBoxValue;});
    Player.getter('debugParameters', function(){
        var current_id = Player.get("video").type == "clip" ? Player.get("video_photo_id") : Player.get("video_live_id");
        var current_token = Player.get("video_token");
        var paramString = "current_id="+current_id+"&current_token="+current_token;
        $.each(Player.settings, function(key, value){
            paramString += "&" + key + "=" + value;
        });
        return paramString;
    });

    /* SETTERS */
    Player.setter('showMenu', function(e){
        $this.showMenu = !!e;
        if($this.showMenu){
            $this.showLinkBox = false;
            $this.menuLeft = e.pageX;
            if($this.menuLeft + 182 > $(window).width()){
                $this.menuLeft = e.pageX - 182;
            }
            $this.menuTop = e.pageY;
            if($this.menuTop + 185 > $(window).height()){
                $this.menuTop = Math.max(2, e.pageY - 185);
            }
        }
        $this.render(function(){
          $this.container.find(".link-box input").select();
        });
    });
    Player.setter('linkBoxValue', function(type){
        switch(type){
        case "url":
            $this.linkBoxValue = Player.get("videoLink");
            break;
        case "url-time":
            Player.set("playing", false);
            $this.linkBoxValue = Player.get("videoLink") + "?start=" + Math.round(Player.get("currentTime"));
            break;
        case "embed":
            $this.linkBoxValue = Player.get("embedCode");
            break;
        case "embed-time":
            Player.set("playing", false);
            var embed = $(Player.get("embedCode"));
            var iframe = embed[0].tagName == "DIV" ? embed.find("iframe") : embed;
            iframe.attr("src", iframe.attr("src") + "&start=" + Math.round(Player.get("currentTime")));
            $this.linkBoxValue = embed[0].outerHTML;
            break;
        }
        $this.showLinkBox = true;
        $this.render();
    });

    $(document).on("contextmenu", function(e) {
        Player.set('showMenu', e);
        e.preventDefault();
    });
    $this.container.on("click", ".menu-background", function(e){
        if($this.showMenu){
            Player.set('showMenu', false);
            e.preventDefault();
        }
    });

    return $this;
});
