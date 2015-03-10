/*
 * Project : @iropke in sherlock
 * fileName : ui.js
 * This file includes plugins and custom functions.
*/

/*
* Copyright 2011 Nicholas C. Zakas. All rights reserved.
* Licensed under BSD License.
* https://gist.github.com/nzakas/08602e7d2ee448be834c
*/
// matchMedia polyfill (e.g. ie9)
var isMedia = (function(){

    if ( window.matchMedia ) {
        return function(query) {
            return window.matchMedia(query).matches;
        }

    } else {

        var div;

        return function(query){
            if (!div){
                div = document.createElement("div");
                div.id = "ncz1";
                div.style.cssText = "position:absolute;top:-1000px";
                document.body.insertBefore(div, document.body.firstChild);
            }

            div.innerHTML = "_<style media=\"" + query + "\"> #ncz1 { width: 1px; }</style>";
            div.removeChild(div.firstChild);
            return div.offsetWidth == 1;
        };
    }

})();

/**
 * toggleLayer, simpleTab, swapTab, placeholder(polyfill), accordion, animateChart
 */
(function($) {

    // placeholder polyfill
    $.fn.placeholder = function() {

        function hasPlaceholderSupport() {
            var i = document.createElement('input');
            return 'placeholder' in i;
        }

        return this.each(function(i, el){
            var $el = $(el),
                $fake,
                holder = $el.attr('placeholder'),
                is_password = $el.is('[type=password]');

            if( hasPlaceholderSupport() ) return;

            if ( is_password ) {
                $fake = $('<input />', {
                    className: $el.attr('class'),
                    type: 'text',
                    value: holder
                });
                $fake.appendTo( $el.parent() );
                $el.hide();

                $fake.on({
                    focus: function() {
                        showFakeInput();
                        $el.focus();
                    }
                });
                $el.on({
                    focus: showFakeInput,
                    blur: function() {
                        if ( $el.val() == '' ) {
                            $fake.css('display', '');
                            $el.hide();
                        }
                    }
                });

            } else {
                setPlaceholder();
                $el.on({
                    focus: function() {
                        if ( $el.val() == holder ) {
                            $el.val('').removeClass('placeholder');
                        }
                    },
                    blur: setPlaceholder
                });
            }

            function showFakeInput() {
                $fake.hide();
                $el.css('display', '');
            }

            function setPlaceholder() {
                if ( $el.val() == '' ) {
                    $el.val(holder).addClass('placeholder');
                }
            }
        });
    };

})(jQuery);


/**
 * ytiframe
 * change link to youtube player (iframe ver.)
 * @author: Alice Kim, alice@iropke.com
 */
(function($){

    var plugin = {};

    var defaults = {
        videoWidth  : '100%',
        videoHeight : 'auto',
        videoIdBase : 'ytplayer',
        color: 'white',
        autoplay: 0,
        theme: 'dark'
    };

    $.fn.ytiframe = function(options){

        if(this.length == 0) return this;

        if(this.length > 1){
            this.each(function(){$(this).ytiframe(options)});
            return this;
        }

        var player = {},
            el = this,
            o = {};

        plugin.el = this;

        var init = function() {
            o    = $.extend(defaults, options);
            player.url = el.attr('href');
            player.videoId = o.videoIdBase;
            player.ytId = '';

            if ( el.parents('.flexible-obj').length > 0 ) {
                player.container = el.wrap( '<div class="video-player" />' ).parent();
            } else {
                player.container = el.wrap( '<div class="video-player flexible-obj" />' ).parent();
            }

            if ( player.url.indexOf('v=') > 0 ) {
                ytId = player.url.replace('http://www.youtube.com/watch?v=', '');

            } else {
                player.url = player.url.split('?')[0];
                player.ytId = player.url.replace('http://youtu.be/', '');
            }

            player.videoId = player.videoId + player.ytId;

            // embed iframe
            player.embed = $('<iframe src="//www.youtube.com/embed/'+ player.ytId +'?showinfo=0&color=' + o.color + '&theme=' + o.theme + '&enablejsapi=0&rel=0&autoplay='+o.autoplay+'" allowfullscreen></iframe>')
                .attr('id', player.videoId)
                .addClass('video-iframe')
                .appendTo( player.container );
            el.hide();
        }

        init();

        el.destroyPlayer = function() {
            if ( player.embed ) {
                player.embed.remove();
                el.css('display', '');
                el.unwrap();
            }
        }

        return this;
    }
})(jQuery);
