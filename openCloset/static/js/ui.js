/*
 * Project : PRIMERA (AMOREPACIFIC) @iropke
 * fileName : ui.js
 * This file includes plugins and custom functions.
*/

// function chkTouchendOut(event) {
//     if (event.type != 'touchend') return false;

//     var e = document.elementFromPoint(
//         event.originalEvent.changedTouches[0].clientX,
//         event.originalEvent.changedTouches[0].clientY
//     );

//     if (event.currentTarget !== e && $(event.currentTarget).has(e).length < 1) return true;

//     return false;
// }


/**
 * window popup function
 */
function popup(url, w, h, name, option) {
    var px, py;
    var sw = screen.availWidth;
    var sh = screen.availHeight;
    var scroll = 0;
    if (option == 'scroll') {
        scroll = 1;
    }
    px = (sw - w) / 2;
    py = (sh - h) / 2;
    return window.open(url, name, "location=0,status=0,scrollbars=" + scroll + ",resizable=1,width=" + w + ",height=" + h + ",left=" + px + ",top=" + py);
}


/**
 * scroll to top
 * @author: Peter Choi, peter@iropke.com
 */
function scrollToTop() {
    var $btnTop = $('#go-top'),
        $win = $(window),
        mode = null; // if true -> mobile

    // toggle top button
    $win.scroll(function() {
        if($(this).scrollTop() > 200) $btnTop.stop(true, true).fadeIn(200);
        else $btnTop.stop(true, true).fadeOut(200);
    }).scroll();

    // scroll to top on click
    $btnTop.click(function(event) {
        $('html, body').animate({scrollTop: 0}, 500, 'easeInOutExpo');

        event.preventDefault();
        event.stopPropagation();
    });
}



/**
 * custom dropdown (.selectbox)
 * @author: Alice Kim, alice@iropke.com
 */
function selectbox() {
    var $select = $('div.selectbox'),
        $options = $select.find('ul.selectbox-options'),
        $body = $(document);

    $select.each(function(){
        var $box = $(this),
            $selector = $box.find('>.selectbox-selected'),
            $list = $box.find('>.selectbox-options'),
            $li = $list.find('>li'),
            $item,
            selected = '',
            islink = ( $li.find('a').length > 0 ) ? true : false,
            w,
            len = $li.length;

        init();

        function init() {

            $item = ( islink ) ? $li.find('>a') : $li;

            setAttr();
            setStyle();

            if ( islink ) {
                $list.on('click', 'a', function(event) {
                    select(this);
                    event.stopPropagation();
                });
                $list.on('keydown', 'a', function(event){
                    var $el = $(this).find('a'),
                        i = $el.data('index');

                    if ( event.keyCode == 13 ) {
                        // enter
                        select( this );
                        prevent(event);

                    } else if ( event.keyCode == 9 || event.keyCode == 27 ) {
                        // tab or esc
                        afterSelect();
                        prevent(event);

                    } else if ( event.keyCode == 38 ) {
                        // up arrow
                        if ( i - 1 >= 0 ) {
                            $item.eq( i - 1 ).focus();
                        }

                    } else if ( event.keyCode == 40 ) {
                        // down arrow
                        if ( i + 1 <= len - 1 ) {
                            $item.eq( i + 1 ).focus();
                        }
                    }
                });
                $list.on('focus', 'a', function(event) {
                    $(this).parent().addClass('is-active');
                });
                $list.on('blur', 'a', function(event) {
                    $(this).parent().removeClass('is-active');
                });

            } else {
                $list.on('click', 'li', function(event) {
                    select(this);
                    event.stopPropagation();
                });
                $box.delegate('li', 'keydown', function(event){
                    var $el = $(this),
                        i = $el.data('index');

                    if ( event.keyCode == 13 ) {
                        // enter
                        $(this).trigger('click');

                    } else if ( event.keyCode == 9 || event.keyCode == 27 ) {
                        // tab or esc
                        afterSelect();
                        prevent(event);

                    } else if ( event.keyCode == 38 ) {
                        // up arrow
                        if ( i - 1 >= 0 ) {
                            $item.eq( i - 1 ).focus();
                        }

                    } else if ( event.keyCode == 40 ) {
                        // down arrow
                        if ( i + 1 <= len - 1 ) {
                            $item.eq( i + 1 ).focus();
                        }
                    }
                });
                $list.on('focus', 'li', function(event) {
                    $(this).addClass('is-active');
                });
                $list.on('blur', 'li', function(event) {
                    $(this).removeClass('is-active');
                });
            }

            $selector.on('click keydown', function(event) {

                if ( $(this).next('ul').find('li').attr('tabindex') == undefined ) {
                    $item = ( islink ) ? $li.find('>a') : $list.find('>li');

                    $item.each(function(i, el){
                        $(el).attr('tabindex', 0).data('index', i);
                        $(el).find('input[type=radio]').attr('tabindex', -1);
                    });

                    len = $item.length;
                }
                if ( event.type == 'click' || event.keyCode == 13 ) {
                    if ( $box.data('is-open') ) {
                        close();
                    } else {
                        open();
                        if ( event.keyCode == 13 ) {
                            $item.eq(0).focus();
                        }
                    }
                    event.preventDefault();
                }
                event.stopPropagation();
            });

            $selector.on('focus', blockArrow);

            function blockArrow() {
                var arrKey = new Array(38,40);

                $body.on('keydown.blockArrow', 'li', function(event) {
                    var key = event.which;
                    if( $.inArray(key, arrKey) > -1 ) {
                      event.preventDefault();
                      return false;
                    }
                });
            }

            $box.on('click', function(event){
                event.stopPropagation();
            });

            if ( !islink && $list.has('.selectbox-checked') ) {
                var top = $(window).scrollTop();

                $list.find('.selectbox-checked').click();
                $('html, body').scrollTop(top);
                $selector.blur();
            }
        }
        // end: init();

        function select(obj) {
            var $el = $(obj),
                has_el = ( $el.find('.select-item').length > 0 ) ? true : false;

            if ( has_el ) {
                selected = $el.find('.select-item').html();
                $selector.find('>span').html( selected );
            } else {
                selected = $el.text();
                $selector.find('>span').text( selected );
            }

            if ( !islink ) {
                $list.find('input').prop('checked', false);
                $el.find('input').prop('checked', true).trigger('change');
            }

            afterSelect();
        }

        function setAttr() {
            $box.data('is-open', false);
            $selector.attr('tabindex', 0);

            if ( !islink ) {
                $item.attr('tabindex', 0).find('input[type=radio]').attr('tabindex', '-1').each(function(idx, el) {
                    var $el = $(el),
                        $label,
                        id;

                    if ( $el.attr('id') && $el.attr('id') !== '' ) return;

                    $label = $el.parent('label') || $el.siblings('label');
                    id = $el.attr('name') + (idx + 1);

                    $el.attr('id', id);

                    if ( $label.length ) $label.attr('for', id);
                });
            }

            $item.each(function(i, el){
                $(el).data('index', i);
            });
        }

        function setStyle() {
            if ( !$selector.attr('style') || $selector.attr('style').indexOf('width') == - 1 ) {

                // width + 1 for ceil
                var itemWidth = $li.children().width() + 1,
                    selectorWidth = $selector.find('>span').width() + 1;

                if ( selectorWidth < itemWidth ) {
                    $selector.width( itemWidth );
                } else {
                    $selector.width( selectorWidth );
                }

                $list.width( $selector.innerWidth() );
            }

            $list.css('visibility', 'visible').hide();
        }

        function open(){
            if ( $box.data('is-open') ) return;

            allClose();
            $box.css('zIndex',1000).data('is-open', true);
            $list.show();
        }

        function close(){
            $list.hide();
            // $body.off('keydown');
            $body.off('keydown.blockArrow');
            $box.css('zIndex',1).data('is-open', false);
        }

        function afterSelect() {
            close();
            $selector.focus();
        }

        function prevent(event) {
            if( event.preventDefault ) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.returnValue = false;
            }
        }
    });

    $body.on('click', allClose);

    function allClose() {
        $select.css('zIndex', 'auto').data('is-open', false);
        $options.hide();
    }
}



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

    // toggle layer
    $.fn.toggleLayer = function(option) {
        var call_selector = this.selector;
        var option = $.extend({
            callback: function() {}
        }, option);

        return this.each(function(){

            var $a = $(this),
                $win = $(window),
                $target,
                $close_btn,
                targetId = $a.attr('href'),
                pos = $a.offset(),
                layer_option = false,
                layer_on_class = '',
                delay,
                $target_keys;

            targetId = targetId.split('#')[1];
            targetId = '#' + targetId;
            $target = $(targetId);
            $close_btn = $target.find('.close-layer');

            delay = ( Modernizr.csstransitions && $target.css('transition-duration') ) ? ( $target.css('transition-duration') ) : '0';
            delay = ( delay.indexOf('ms') > 0 ) ? parseInt(delay) : parseFloat( delay )*1000;

            layer_option = ( $a.data('layerOption') == undefined ) ? false : $a.data('layerOption');
            layer_on_class = ( $a.data('onClass') == undefined ) ? '' : $a.data('onClass');

            $target.css({
                outline: '0 none'
            }).attr({
                tabindex: '0'
            });

            $a.data("target", {isopen: false});

            if ( $a.css('display') !== 'none' ) {
                close();
            }

            $a.on('click', function(event) {
                if ( $a.data('target').isopen ) {
                    close();
                } else {
                    open();
                }

                option.callback();

                event.stopPropagation();
                event.preventDefault();
            });

            $target_keys = $target.find('a, button, input, [tabindex]');
            $target_keys.filter(':last').on('keydown', function(event){
                if ( event.keyCode == 9 ) {
                    $a.focus();
                    event.preventDefault();
                }
            });

            this.closeLayer = function() {
                close();
            }

            $close_btn.on('click', function(event) {
                close();
                $a.focus();
                event.stopPropagation();
                event.preventDefault();
            });

            $target.on('click', function(event) {
                event.stopPropagation();
            });

            function close() {
                if ( layer_on_class !== '' ) {
                    $target.removeClass(layer_on_class);
                }
                setTimeout(function() {
                    $target.hide();
                }, delay);

                $a.removeClass('toggle-on');
                $a.data('target').isopen = false;

                if ( $target.find(call_selector).hasClass('toggle-on') ) {
                    $target.find(call_selector).trigger('click');
                }
            }

            function open() {
                if ( layer_option != false ) {
                    pos = $a.offset();
                    pos.side = ( layer_option == 'left' ) ? pos.left : pos.right;

                    if ( layer_option == 'left' ) {
                        $target.css({
                            top: pos.top,
                            left: pos.side - $target.outerWidth()
                        });
                    } else if ( layer_option == 'right' ) {
                        $target.css({
                            top: pos.top,
                            right: pos.side - $target.outerWidth()
                        });
                    }
                }

                $target.show();
                if ( layer_on_class !== '' ) {
                    $target.addClass(layer_on_class);
                }

                $target.focus();
                $a.addClass('toggle-on');
                $a.data('target').isopen = true;
            }


            $('body').on('click', function(){
                if ( $a.css('display') !== 'none' ) {
                    close();
                }
            });

            if ( !Modernizr.touch ) {

                $win.on('resize', function(){
                    layer_option = ( $a.data('layerOption') == undefined ) ? false : $a.data('layerOption');

                    if ( $a.css('display') !== 'none' ) {
                        close();
                    } else {
                        $target.css('display', '');
                    }
                });
            }
        });
    };

    // initTabMenu jQuery ver. ( target focusing )
    $.fn.simpleTab = function(option) {

        var option = $.extend({
            activeClass: 'on',
            tabClass: 'tab',
            scroll: false,
            scrollOffset: -100,
            easing: 'swing',
            changed: function() {}
        }, option);

        return this.each(function(){

            var $container = $(this),
                activeClass = option.activeClass,
                tabClass = option.tabClass,
                $tab = $container.find('a.'+ tabClass),
                $tabContents = $([]),
                len = $tab.length,
                current = $tab.filter('.' + activeClass).index() >= 0 ? $tab.filter('.' + activeClass).index() : 0;

            $tab.each(function(i, el){
                var $a = $(el),
                    $target = $($a.attr('href'));

                if ( $a.parent().hasClass(activeClass) ) {
                    current = i;
                }

                $tabContents = $tabContents.add($target);

                $target.css({
                        display: 'none',
                        outline: '0 none'
                    }).attr({
                        tabindex: '0'
                    });

                $a.on('click', function(event){
                    var top = $(window).scrollTop();

                    $tabContents.hide();
                    $tab.removeClass(activeClass);
                    $tab.parent().removeClass(activeClass);

                    $a.addClass(activeClass);
                    $a.parent().addClass(activeClass);
                    $target.show();
                    $target.focus();

                    if ( option.scroll ) {
                        top = $target.offset().top + option.scrollOffset;
                        $('html, body').stop().animate({ scrollTop: top }, 700, option.easing);

                    } else {

                        $(window).scrollTop(top);
                    }

                    option.changed();

                    event.preventDefault();
                    event.stopPropagation();
                });
            });

            $tabContents.hide();
            $tab.eq(current).addClass(activeClass);
            $tab.eq(current).parent().addClass(activeClass);
            $tabContents.eq(current).show();
        });
    };

    // simple tab / support focusing target
    // add <select> for small screens
    $.fn.swapTab = function(option) {

        var option = $.extend({
            activeClass: 'is-active',
            tabClass: 'tab',
            scroll: false,
            scrollOffset: 10,
            easing: 'swing',
            swap: true,

            // input 'css' if you want to set the breakpoint by css
            // class name is 'container class' + '-sub'
            breakpoint: 768,

            changed: function() {}
        }, option);

        return this.each(function(){

            var $win = $(window),
                $container = $(this),
                tabClass = option.tabClass,
                activeClass = option.activeClass,
                $list = $container.find('ul'),
                $tab = $container.find('a.'+ tabClass),
                $contents = $([]),
                $select,
                $label,
                current = -1,
                breakpoint = option.breakpoint,
                swap = option.swap;

            $tab.each(function(i, el){
                var $a = $(el),
                    $target = ( $a.attr('href').indexOf('#') == 0 ) ? $($a.attr('href')) : false;

                $a.data('tab-index', i);

                if ( $a.hasClass(activeClass) || $a.parent().hasClass(activeClass) ) {
                    current = i;
                }

                if ( !$target ) return;

                $contents = $contents.add($target);
                $target
                    .data('tab-index', i)
                    .css({
                        display: 'none',
                        outline: '0 none'
                    })
                    .attr({
                        tabindex: '0'
                    });

                $a.on('click', function(event){
                    active( $(this) );
                    event.preventDefault();
                    event.stopPropagation();
                });
            });

            init();

            function init() {
                if ( swap ) {
                    createDropdown();

                    if ( breakpoint !== 'css' ) {
                        checkBreakpoint();
                        $win.on('resize', checkBreakpoint);
                    }
                }

                if ( current > -1 ) {
                    active( $tab.eq(current), 'init' );
                }
            }

            function createDropdown() {
                var id = $container.attr('id') + '-dropdown';

                $label = $('<lable />', {
                    'class' : 'blind',
                    'for'   : id,
                    'text'  : '콘텐츠 선택'
                }).appendTo( $container );

                $select = $('<select />', {
                    'id': id,
                    'class': $container.attr('class') + '-sub'
                }).appendTo( $container );

                $tab.each(function(i, el) {
                    var $el = $(el),
                        href = $el.attr('href'),
                        selected = false;

                    if ( i == current ) {
                        selected = true;
                    }

                    $('<option />', {
                        'value' : href,
                        'text'  : $el.text(),
                        'data-tab-index': i,
                        'selected': selected
                    }).appendTo($select);
                });

                $select.on('change', function(event) {
                    var $selected = $select.find('option:selected'),
                        $this = $(this),
                        url = $this.val(),
                        index = $selected.data('tab-index'),
                        href = $selected.val(),
                        msg;

                    if ( href.indexOf('#') == 0 ) {
                        if ( href == '#' ) {
                            alert( '준비중입니다' );
                        } else {
                            active( $tab.eq( index ) );
                        }
                    } else {

                        if ( Modernizr.touch ) {
                            if ( $tab.eq(index).attr('target') == '_blank' ) {
                                window.open(href);
                            } else {
                                location.href = url;
                            }
                        } else {

                            if ( $tab.eq(index).attr('target') == '_blank' ) {

                                $this.on('click', function() {
                                    window.open(href);
                                });

                                $this.on('keydown', function(event) {
                                    if (event.keyCode == 13) {
                                        window.open(href);
                                        event.preventDefault();
                                    }
                                });
                            } else {
                                $this.on('click', function() {
                                    location.href = url;
                                });

                                $this.on('keydown', function(event) {
                                    if (event.keyCode == 13) {
                                        location.href = url;
                                        event.preventDefault();
                                    }
                                });
                            }
                        }
                    }
                });
            }

            function checkBreakpoint() {
                // isMedia('only all and (max-width:' + breakpoint + 'px)')

                if ( ( window.matchMedia && window.matchMedia('only all and (max-width:' + breakpoint + 'px)').matches ) || isMedia('only all and (max-width:' + breakpoint + 'px)') ) {
                    // console.log( 'mq support, and mobile size');
                    $select.add($label).show();
                    $list.hide();

                } else {
                    // console.log( 'no mq support or desktop');
                    $select.add($label).hide();
                    $list.show();
                }
            }

            function active($a, init) {
                var $target,
                    top = $win.scrollTop(),
                    index = $a.data('tab-index'),
                    init = ( init ) ? true : false;

                $target = ( $a.attr('href').indexOf('#') > 0 ) ? $($a.attr('href')) : false;

                if ( $target ) {
                    $contents.hide();
                    $tab.add($tab.parent()).removeClass(activeClass);
                    $target.show();

                    if ( !init ) {
                        $target.focus();
                    }
                }

                $a.add($a.parent()).addClass(activeClass);

                if ( option.scroll && !init ) {
                    top = $container.offset().top - option.scrollOffset;
                    $('html, body').stop(true, true).animate({ scrollTop: top }, 500, option.easing);
                }

                if ( swap ) {
                    $select.find('option:not(:eq(' + index + '))').attr('selected', false);
                    $select.find('option:eq(' + index + ')').attr('selected', true);
                }

                option.changed();
            }
        });
    };

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

    // accordion
    $.fn.accordion = function(opt) {
        var opt = $.extend({
            easing:         'easeOutQuint',
            speed:          400,
            titleSelector:  '.q',
            contSelector:   '.a',

            collapsible:    false,
            callback:       function() {}
        }, opt);

        return this.each(function() {
            var $this = $(this),
                $title = $this.find(opt.titleSelector),
                $cont = $this.find(opt.contSelector),
                $items = $title.parent(),
                $currentItem = $this.filter('.on');

            var init = function() {
                var titleHeight = $title.outerHeight();

                $title.css('cursor', 'pointer').attr('tabindex', 0);
                $title.on('click keypress', function(event) {
                    if ( event.type == 'click' || event.which == 13 ) {
                        open($(this).parent());
                    }
                });

                if ( !opt.collapsible ) {
                    if( $currentItem.length > 0 ) open($currentItem.eq(0));
                } else {
                    $currentItem.removeClass('on');
                }

                $items.not('.on').find(opt.contSelector).hide();
            };

            var open = function($target) {
                var isOn = $target.hasClass('on');

                $items.removeClass('on');
                $cont.stop(true, true).slideUp({
                    duration: opt.speed,
                    easing: opt.easing,
                    complete: function() {
                        opt.callback();
                        $cont.css('zoom', 1);
                    }
                });

                if(isOn) return;

                $target.addClass('on').find(opt.contSelector).stop(true, true).slideDown({
                    duration: opt.speed,
                    easing: opt.easing,
                    complete: function() {
                        opt.callback();
                    }
                });
            };

            init();
        });
    };

    // animate chart plugin
    // @author: Peter Choi, peter@iropke.com
    $.fn.animateChart = function(duration, term, isShowFloat, isAnimateOnVisible, visibleOffset) {
        isShowFloat = isShowFloat == true ? 10:1;

        $(this).on('reset', function() {
            var $this = $(this);

            $this.find('.bar').css('width', 0)
            $this.find('b').css('opacity', 0);
            $this.find('.value').css('opacity', 0);
        }).trigger('reset');

        this.animate = function() {
            $(this).find('.bar').each(function(i, e) {
                var $_value = $(e).find('.value'),
                    _valueTxt = $_value.text();

                _valueTxt = _valueTxt.replace(/(^\s+|\s+$)/g,'');
                $_value.data('init', parseFloat(_valueTxt));

                $(e).delay(i * term).animate(
                    {'width': _valueTxt}, {
                        duration: duration,
                        easing: 'easeOutCubic',

                        // increase bar value with animation
                        progress: function(animation, progress, remaining) {
                            $_value.html(Math.round($_value.data('init') * progress * isShowFloat) / isShowFloat + '%');
                        },

                        complete: function() {
                            $_value.html($_value.data('init') + '%');
                        }
                    }
                )

                $(e).find('b').add($_value).delay(200 + i * term).fadeTo(400, 1);
            });
        }

        if(!isAnimateOnVisible) {
            this.animate();
            return;
        }

        $(this).one('inview', {offset: visibleOffset}, this.animate);
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



/**
 * inview event
 */
(function($) {
    var inview = function () {
        var $win = $(window),
            winHeight = $win.height(),
            winTop = $win.scrollTop(),
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

        $(elems).each(function () {
            var $elem = $(this),
                top = $elem.offset().top,
                height = $elem.height(),
                offset = winHeight * (1 - $elem.data('offset')),
                inview = $elem.data('inview') || false;

            var id = $elem.attr('id');

            if((winTop + winHeight) < top || winTop > (top + height)) {
                if (inview) {
                    $elem.data('inview', false);
                    $elem.trigger('inview', [false]);
                }
            } else if((winTop + winHeight - offset) >= (top)) {
                if (!inview) {
                    $elem.data('inview', true);
                    $elem.trigger('inview', [true]);
                }
            }
        });
    };

    $(window).scroll(inview);
    setTimeout(inview, 1000); // for mobile

    $(function () {
        $(window).scroll();
    });

})(jQuery);



/**
 * lightbox
 *
 * by Peter@iropke
 */
(function($) {

    "use strict";

    /**
     * jQuery utility로 등록
     */
    var lightbox = $.lightbox = function(opt) {
        if(this.constructor === lightbox) return;

        var _lightbox = new lightbox().init(opt);

        return _lightbox;
    };

    $.extend(lightbox, {
        methods: {
            /**
             * 초기화
             */
            init: function(opt) {
                this.opt = $.extend({
                    prefix: 'lightbox',     // 클래스 및 data 접두어

                    // elements
                    content: null,          // 팝업 컨텐츠 선택자
                    scrollable: null,       // 창 크기가 작을 경우 스크롤될 컨텐츠
                    root: $('body'),        // 스크롤바 제어를 위한 최상위 요소 지정

                    // switches
                    clone: true,            // 팝업 컨텐츠를 복사하여 표시할지 여부
                    closeByBG: true,        // 배경 클릭 시 팝업을 닫을지 여부
                    autoOpen: false,        // 초기화 할 때 자동으로 팝업 열기

                    // effect options
                    scaleStart: 0.75,       // scale 효과 배율
                    openSpeed: 400,         // 팝업 열기 효과 시간
                    closeSpeed: 250,        // 팝업 닫기 효과 시간

                    // events
                    onInit: null,           // 플러그인 초기화 이벤트
                    onBeforeOpen: null,     // 팝업을 열기 전 이벤트
                    onOpen: null,           // 팝업을 연 후 이벤트
                    onBeforeClose: null,    // 팝업을 닫기 전 이벤트
                    onClose: null           // 팝업을 닫은 후 이벤트
                }, opt);

                // if browser don't support css opacity, disable open/close effect
                if(!Modernizr.opacity) this.opt.openSpeed = this.opt.closeSpeed = 0;

                // this.$container = null;
                this.$_content = $(this.opt.content).eq(0);

                this.isOpen = false;
                this.scrollBarWidth = 0;

                this.$win = $(window);
                this.$containerTmpl = $('<div class="' + this.opt.prefix + '"><div class="' + this.opt.prefix + '-bg"></div></div>');

                this.execCallback('onInit');

                if(this.opt.autoOpen) this.open();

                return this;
            },

            /**
             * 이벤트 탑재
             */
            attach: function($target, opt) {
                var self = this;

                this.init(opt);
                self.opt.content = $target.attr('href') || $target.attr('data-' + self.opt.prefix);
                this.$_content = $(this.opt.content).eq(0);

                $target.on('click', function(event) {
                    if($(this).attr('data-' + self.opt.prefix + '-closebybg') == 'false') self.opt.closeByBG = false;

                    self.open();

                    event.preventDefault();
                    event.stopPropagation();
                });
            },

            /**
             * 콜백 이벤트 실행
             */
            execCallback: function(func) {
                if(typeof(this.opt[func]) === 'function') this.opt[func](this, this.$content);
            },

            /**
             * 팝업 위치를 화면 중앙으로 정렬
             */
            align: function() {
                this.$content.css({
                    'margin-left': this.$content.outerWidth() / -2,
                    'margin-top': this.$content.outerHeight() / -2
                });
            },

            /**
             * 스크롤 가능 컨텐츠 조정
             */
            scrollable: function() {
                var $scrollable = this.$content.find(this.opt.scrollable)

                if(!$scrollable.length) return false;

                $scrollable.css({
                    'height': '',
                    'min-height': '',
                    'overflow-y': ''
                });

                var height = this.$content.height(),
                    siblingsHeight = 0;

                $scrollable.siblings().each(function(idx, el) {
                    var $el = $(el);

                    if($el.css('position') != 'static' && $el.css('position') != 'relative') return true;

                    siblingsHeight += $(el).outerHeight(true);
                });

                $scrollable.css({
                    'height': height - siblingsHeight - parseInt($scrollable.css('padding-top')) - parseInt($scrollable.css('padding-bottom')),
                    'min-height': 0,
                    'overflow-y': 'auto'
                });
            },

            /**
             * 스크롤바 크기 구하기
             */
            getScrollBarWidth: function() {
                var $outer = $('<div>'),
                    $inner = $('<div>').appendTo($outer),

                    outerWidth = 0,
                    innerWidth = 0;

                $inner.css({
                    width: '100%',
                    height: '150px',
                    margin: 0,
                    padding: 0,
                    border: 0
                });

                $outer.css({
                    overflow: 'hidden',
                    visibillity: 'hidden',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100px',
                    height: '100px',
                    margin: 0,
                    padding: 0,
                    border: 0
                });

                $outer.appendTo($('body'));
                outerWidth = $inner[0].offsetWidth;
                $outer.css('overflow', 'scroll');
                innerWidth = outerWidth == $inner[0].offsetWidth ? $outer[0].clientWidth : $inner[0].offsetWidth;

                $outer.remove();

                return outerWidth - innerWidth;
            },

            /**
             * 팝업 열기
             */
            open: function() {
                if(this.isOpen !== false) return false;

                this.execCallback('onBeforeOpen');

                var self = this,
                    rootWidth = Math.min(this.opt.root[0].offsetWidth, this.opt.root[0].clientWidth),
                    scrollTop = this.opt.root.scrollTop();

                // 스크롤바 감추기
                this.scrollBarWidth = 0;
                this.opt.root.css('overflow', 'hidden');
                this.scrollBarWidth = this.opt.root[0].offsetWidth - rootWidth;

                if(this.scrollBarWidth > 0) this.opt.root.css('padding-right', this.scrollBarWidth);

                // 컨테이너 만들기
                this.$container = this.$containerTmpl.clone();

                // 배경 클릭 시 닫기 적용
                if(this.opt.closeByBG) {
                    this.$container.find('.' + this.opt.prefix + '-bg').css('cursor', 'pointer');
                }

                this.$container.css('opacity', 0).appendTo(this.opt.root);

                // 팝업 컨텐츠 설정
                this.$content = this.$_content;

                if(this.opt.clone) {
                    this.$content = this.$content.clone(true).attr('id', this.opt.prefix + '-' + this.$content.attr('id'));
                } else {
                    // 컨텐츠를 복사하지 않을 때 원래 위치 기억
                    var $_prev = this.$content.prev();

                    // 바로 앞의 요소가 있을 경우 그것을 기억, 첫번째 자식일 경우 부모 요소를 기억
                    if($_prev.length) {
                        this.$content.data(this.opt.prefix + '-prev', $_prev[0]);
                    } else {
                        this.$content.data(this.opt.prefix + '-parent', this.$content.parent()[0]);
                    }
                }

                // 컨텐츠 초기 설정 후 컨테이너로 삽입
                this.$content = this.$content.addClass(this.opt.prefix + '-content')
                    .attr('tabindex', 0)
                    .css('transform', 'scale(' + this.opt.scaleStart + ')')
                    .appendTo(this.$container).focus();

                this.opt.root.scrollTop(scrollTop);

                // 스크롤 가능 컨텐츠 설정
                this.$win.on('resize', function() {
                    if(self.opt.scrollable) self.scrollable();
                    self.align();
                }).resize();

                // 팝업 열기 애니메이션 시작
                this.$container.animate({opacity: 1}, {
                    duration: self.opt.openSpeed,
                    easing: 'easeOutExpo',
                    step: function(now) {
                        self.$content.css('transform', 'scale(' + (self.opt.scaleStart + (now * (1 - self.opt.scaleStart))) + ')');
                    },
                    complete: function() {
                        self.$container.css('opacity', '');
                        self.$content.css('transform', '');
                        self.execCallback('onOpen');

                        // 닫기 이벤트 바인딩
                        self.$container.on('click', function(event) {
                            var $target = $(event.target);

                            if(
                                ($target.is('.' + self.opt.prefix + '-bg') && self.opt.closeByBG) ||
                                $target.is('[data-' + self.opt.prefix + '-close]') ||
                                $target.parents('[data-' + self.opt.prefix + '-close]').length
                            ) {
                                self.close();
                            }
                        });

                        self.isOpen = true;
                    }
                });
            },

            /**
             * 팝업 닫기
             */
            close: function() {
                if(this.isOpen !== true) return false;

                var self = this;

                this.isOpen = null;
                this.execCallback('onBeforeClose');

                this.$container.animate({opacity: 0}, {
                    duration: self.opt.closeSpeed,
                    easing: 'easeInCubic',
                    step: function(now) {
                        self.$content.css('transform', 'scale(' + (self.opt.scaleStart + (now * (1 - self.opt.scaleStart))) + ')');
                    },
                    complete: function() {
                        if(!self.opt.clone) {
                            self.$content.removeClass(self.opt.prefix + '-content')
                                .removeAttr('tabindex')
                                .css({
                                    'margin-left': '',
                                    'margin-top': '',
                                    'transform': ''
                                });

                            if(self.$content.data(self.opt.prefix + '-prev')) {
                                $(self.$content.data(self.opt.prefix + '-prev')).after(self.$content)
                            } else {
                                $(self.$content.data(self.opt.prefix + '-parent')).prepend(self.$content);
                            }
                        }

                        self.$container.remove();
                        delete self.$container;
                        delete self.$content;

                        self.$win.off('resize');
                        self.opt.root.css('overflow', '');
                        if(self.scrollBarWidth > 0) self.opt.root.css('padding-right', '');

                        self.execCallback('onClose');

                        self.isOpen = false;
                    }
                });
            }
        }
    });

    /**
     * 메소드 설정
     */
    lightbox.prototype = $.extend({constructor: lightbox}, lightbox.methods);

    /**
     * jQuery 플러그인으로 등록
     */
    $.fn.lightbox = function(opt) {
        return this.each(function(){
            var _lightbox = new lightbox().attach($(this), opt);
        });
    };

}(jQuery));