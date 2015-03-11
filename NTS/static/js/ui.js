/*
 * @author : @iropke in sherlock
*/
$(function(){

    $(window).load(function(){

        if ( Modernizr.touch ) {
            var s = skrollr.init();
            // s.destroy();

        } else {
            var parallax = skrollr.init({
                forceHeight: false,
                smoothScrolling: true,
                smoothScrollingDuration: 400
            });
        }

    });

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

    $('.section-portfolio-item').bxSlider({
        // auto: true,
        speed: 1200,
        controls: false,
        slideWidth: 960,
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
