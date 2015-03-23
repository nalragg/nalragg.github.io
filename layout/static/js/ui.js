/*
 * @author : @iropke in sherlock
*/
var GG = window.GG || {};

$(function(){
    "use strict";
    GG.scrolling = false;
    GG.scrollTop = 0;
    GG.$win = $(window);
    GG.$body = $('body');
    GG.$header = $('#header');
    GG.$main = $('#main');
    GG.$footer = $('#footer');

    GG.$win.scroll(function(){
        GG.scrolling = true;
    })

    GG.catchScroll = setInterval(function() {
        if ( GG.scrolling ) {
            GG.scrolling = false;
            GG.scrollTop = GG.$win.scrollTop();

            scrollActions(GG.scrollTop);
        }
    }, 100);

    var scrollActions = function() {
        GG.$win.scroll(function(){
            if ( GG.$win.scrollTop() > 30 ) {
                GG.$header.addClass('is-fixed');
            } else {
                GG.$header.removeClass('is-fixed');
            }
        })
    }

    if ( Modernizr.touch ) {
        $('.tubular-thumb').on('click', function(event){
            $(this).ytiframe();
            event.preventDefault();
        });
    } else {
        $('#full-youtube-video-container').tubular({videoId: 'U04Iri51KSI'});
    }

    $('.ahchor-empty').on('click', function(event){
        event.preventDefault();
    });

    $('.section-portfolio-slider').bxSlider({
        auto: true,
        // mode: 'fade',
        speed: 1200,
        controls: false,
        infiniteLoop: false
    });
});

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


/**
 * inview event
 */
(function($) {

    var inview = function () {
        var $win = $(window),
            winHeight = $win.height(),
            scrollTop = $win.scrollTop(),
            docHeight = $(document).height(),
            elems = [];

        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                var elem = this.handle.elem,
                    offset = 0;

                try {
                    offset = this.events.inview[0].data.offset;
                } catch(err) {}

                $(elem).data('offset', offset);
                elems.push(elem);
            }
        });

        if(!elems.length) return;


        $(elems).each(function(idx, el) {

            var $elem = $(el),
                elTop = $elem.offset().top,
                height = $elem.height(),
                offset = winHeight * (1 - $elem.data('offset')),
                inview = $elem.data('inview') || false;

            if((scrollTop + winHeight) < elTop || scrollTop > (elTop + height)) {
                if (inview) {
                    $elem.data('inview', false);
                    $elem.trigger('inview', [false]);
                }
            } else if(
                (scrollTop + winHeight - offset) >= (elTop) ||
                (   // 스크롤로 도달될 수 없는 요소를 끝까지 스크롤 되었을 때 활성화
                elTop >= (docHeight - offset - 150) &&
                scrollTop + winHeight >= (docHeight - 150)
                )
            ) {
                if (!inview) {
                    $elem.data('inview', true);
                    $elem.trigger('inview', [true]);
                }
            }
        });
        // console.log('event: invew');
    };

    $(window).scroll(inview);
    $(window).resize(inview);
    setTimeout(inview, 500); // for mobile

    $(function () {
        $(window).scroll();
    });

})(jQuery);

