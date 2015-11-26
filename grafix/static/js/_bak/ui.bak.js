/**
 * @fileoverview: UI functions
 * @author alice@iropke.com
 * @since 2015.10.30
 */
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


"use strict";

// create global namespace
var GRF = window.GRF || {};

// set global object
$(function() {
	GRF.scrolling = false;
	GRF.scrollTop = 0;
	GRF.lastScrollTop = 0;
	GRF.$win = $(window);
	GRF.$body = $('body');
	GRF.$wrap = $('#wrap');
	GRF.$header = $('#header');
	GRF.$gnb = $('#gnb');
	GRF.$sidenav = $('#sidenav');
	GRF.$menu = $('#sidenav-open');
	GRF.$main = $('#main');
	GRF.$footer = $('#footer');

	// GRF.$win.scroll(function() {
	//     GRF.scrolling = true;
	// });

	// GRF.catchScroll = setInterval(function() {
	//     if ( GRF.scrolling ) {
	//         GRF.scrolling = false;
	//         GRF.scrollTop = GRF.$win.scrollTop();

	//         scrollActions(GRF.scrollTop);
	//     }
	// }, 250);
});


// default actions
// ----------------------------------------
$(function() {
    nav();
    selectbox();
	$('.toggle-layer').toggleLayer();

	// $('.break-word').each(function(i, el){
	// 	var $el = $(el),
	// 		txt;
	// 	if ( $.browser.webkit ) {
	// 		txt = new SplitText( $el );
	// 	}
	// });
});

function SplitText($el, options) {
	this.$input = $el;
	this.bunches = [];

	if ( options ) {
		this.o = options;
	} else {
		this.o = {
			type: 'words',
		}
	}

	this.dataText = ( this.o.type == 'chars' ) ? this.$input.text() : this.$input.html();

	if ( this.o.bunchClass != undefined ) {
		this.bunchClass = this.o.bunchClass;
	}
	this.init();
}
SplitText.prototype = {
	split: function() {
		var i = 0;
		if ( this.o.type == 'chars' ) {
			this.arrText = this.dataText.split('');
		} else {
			this.arrText = this.dataText.replace(/\t|\n/gi, '').split(' ');
		}
		return this.arrText;
	},
	append: function() {
		var i = 0, html;

		for ( ; i < this.arrText.length ; i++ ) {
			if ( this.arrText[i] ==  ' ') {
				this.arrText[i] = '&nbsp;';
			}
			if ( this.arrText[i].indexOf('<br>') == 0 ) {
				html += '<br><span>'+this.arrText[i].replace('<br>', '')+'</span>';
			} else {
				html += '<span>'+this.arrText[i]+'</span>';
			}


			if ( this.o.type == 'words' ) {
				html += ' ';
			}
		}

		this.$input.text('');
		$(html).appendTo(this.$input);
	},
	init: function() {
		var children = [];

		this.split();
		this.append();

		this.$input.find('>span').addClass(this.bunchClass).each(function(idx, el){
			children[idx] = el;
		});
		return this.bunches = children;
	}
}

/**
 * toggleSlider actions
 */
function toggleSlider($target) {
	var slider,
		mode = null, // if true -> mobile
		chkLayout = function() {
			if($target.css('z-index') == 2) {
				if(mode !== true) {
					mode = true;

					slider = $target.bxSlider({
						/*easing: 'easeOutExpo',
						speed: 400,
						pause: 3000,
						controls: false,
						pager: true,
						autoControls: true*/
						auto: true,
			   			pager: true,
			   			controls: false
					});
				}
			} else {
				if(mode !== false) {
					mode = false;

					if(!slider) return

					slider.destroySlider();

					setTimeout(function () {
						$target
							.removeAttr('style')
							.find('>li')
							.removeAttr('style');
					}, 1);
				}
			}
		};

	$(window).smartresize(chkLayout).resize();
}


/**
 * site navigation UI
 */
function nav() {
	var activation = GRF.$header.data('gnb');

	var GNB = {},
		ND = {},	// navigation drawer
		d1, d2, d3, timer;
		// sidenavStickies = new stickyTitles( GRF.$sidenav.find('.nav-d1') );

	if ( activation == undefined ) {

		d1 = GRF.$gnb.find('.nav-d1.is-current').index() + 1;
		d2 = GRF.$gnb.find('.nav-d2.is-current').index() + 1;
		d3 = GRF.$sidenav.find('.nav-d3.is-current').index() + 1;

	} else {

		// activation이 Number 형일 경우가 있기 때문에 String으로 casting하여 split
		// by Peter 150129
		activation = String(activation).split(',');
		d1 = ( activation[0] == undefined ) ? 0 : parseInt(activation[0]);
		d2 = ( activation[1] == undefined ) ? 0 : parseInt(activation[1]);
		d3 = ( activation[2] == undefined ) ? 0 : parseInt(activation[2]);
	}

	// console.log( '[activation]', d1, d2, d3 );

	GNB = {
		hascurrent: false,
		isindex: false,
		t: 0.5,
		timer: {},
		tl: new TimelineMax(),
		$menu: $('#gnb-menu'),
		$bg: $('#gnb-bg'),
		$d1: GRF.$gnb.find('.nav-d1'),
		$d1a: GRF.$gnb.find('.nav-d1-a'),
		$d2Box: GRF.$gnb.find('.nav-d2-box'),
		cur: false,
		curRow: null,
		activeRow: null,
		setup: function() {

			GNB.tl.to(GNB.$bg, GNB.t, {
				className:"+=is-active", ease: Power2.easeInOut
			}).to(GNB.$d2Box, 0.2, {
				autoAlpha: 1,
				ease: Power2.easeOut
			}, '-='+GNB.t).pause();

			if ( d1 != 0 ) {
				GNB.curRow = GNB.$d1[d1-1];
				if ( d1 !=0 && d2 != 0 ) {
					$(GNB.curRow).addClass('is-current').find('li').eq(d2-1).addClass('is-current').find('>a').addClass('is-active');
				}
			}

			if ( d1 == 0 ) {
				GNB.hascurrent = true;

				if ( d2 == 0 ) {
					GRF.$body.addClass('is-index');
				}
			} else {
				GNB.isopen = true;
				GNB.$bg.addClass('is-active');
				GNB.activate( GNB.curRow );
				GNB.cur = true;
			}
		},
		activate: function(row) {
			var $d1 = $(row),
				$d1a = $d1.find('>a'),
				$sub = $d1.find('ul'),
				$cur = $(GNB.curRow);

			if ( !GNB.isopen ) {
				GNB.tl.play();
				GNB.timer = setTimeout(active, (GNB.t - 0.2)*1000);
				GNB.isopen = true;

			} else {
				active();
			}

			function active() {
				if ( GNB.cur ) {
					$cur.find('>a').removeClass('is-active');
					$cur.find('>ul').removeClass('is-active').hide();
				}
				$d1a.addClass('is-active');
				$sub.show().addClass('is-active');
			}

			GNB.activeRow = row;
			console.log( '[GNB] activate:', $d1.find('>a').text() );
		},
		deactivate: function(row) {
			var $d1 = $(row),
				$d1a = $d1.find('>a'),
				$sub = $d1.find('ul');

			if ( GNB.hascurrent ) {
				clearTimeout(GNB.timer);
			}

			$d1a.removeClass('is-active');
			$sub.removeClass('is-active').hide();

			log( '[GNB] deactivate' );
		},
		init: function() {
			GNB.setup();
			GNB.$menu.menuAim({
				activate: function(row) {
					GNB.activate(row);
				},
				deactivate: function(row) {
					GNB.deactivate(row);
				},
				exitMenu: resetGNB,
				submenuDirection: 'below'
			});
		}
	}

	function resetGNB() {
		var deactivateSubmenu = true;

		if ( GNB.isopen && (GNB.curRow == null) ) {
			console.log( '[GNB] close');
			GNB.$d1.add( GNB.$d1.find('>a') ).removeClass('is-active');
			GNB.$d2Box.removeClass('is-active').hide();
			GNB.tl.reverse(0);
			GNB.isopen = false;
		}

		if ( GNB.activeRow == GNB.curRow ) {
			deactivateSubmenu = false;

		} else if ( GNB.curRow !== null ) {
			GNB.activate( GNB.curRow, ( d1 == 1 ) ? true : false );
		}

		return deactivateSubmenu;	// for reset activateSubmenu
	}

	ND = {
		isopen: false,
		$self: GRF.$sidenav,
		$box: GRF.$sidenav.find('.sidenav-box'),
		$btn: GRF.$menu,
		$d1: GRF.$sidenav.find('.nav-d1'),
		$d2: GRF.$sidenav.find('.nav-d2'),
		$d2a: GRF.$sidenav.find('.nav-d2-a'),
		$d2Box: GRF.$sidenav.find('.nav-d2-box'),
		$d3Box: GRF.$sidenav.find('.nav-d3-box'),
		$misc: GRF.$sidenav.find('.nav-misc-section'),
		$current: {},
		activate: function(row) {	// open sub menu
			row.add(row.parent()).addClass('is-active');
			row.next().addClass('is-active').slideDown(300, function(){
				// sidenavStickies.reload();
			});
		},
		deactivate: function() {	// close sub menu
			ND.$d2.add( ND.$d2a ).removeClass('is-active');
			ND.$d3Box.slideUp(300, function(){
				$(this).removeClass('is-active');
				// sidenavStickies.reload();
			});
		},
		setup: function() {
			var pb = GRF.$win.height() - ND.$d2.height()*2 - ND.$misc.height();

			ND.$d3Box.prev('a').addClass('has-sub');
			GRF.$sidenav.find('.nav-d3-box').slideUp();

			if ( pb > 0 ) {
				ND.$misc.css('padding-bottom', pb);
			}
			if ( d1 > 0 ) {
				if ( d2 > 0 ) {
					ND.$current = ND.$d2Box.eq(d1-1).find('.nav-d2').eq(d2-1).addClass('is-current');
					ND.activate(ND.$current.find('>a'));
				} else {
					ND.$current = ND.$d1.eq(d1-1).addClass('is-current');
				}
			}
		},
		init: function() {
			ND.setup();
			ND.$btn.on('click', function(event){
				if ( ND.isopen ) {
					ND.close();

				} else {
					ND.open();
				}
				event.stopPropagation();
			});

			ND.$d2a.on('click', function(event) {
				var $el = $(this);

				if ( $el.hasClass('has-sub') ) {

					if ( $el.hasClass('is-active') ) {
						ND.deactivate();
					} else {
						ND.deactivate();
						ND.activate($el);
					}

					event.preventDefault();
					event.stopPropagation();
				}
			});

			GRF.$win.on('hashchange', function(){
				ND.close();
			});
		},
		up: function($el) {
			var t = $el.offset().top - ND.$d2.outerHeight();
			GRF.$win.scrollTop(t);
		},
		open: function() {
			GRF.$body.addClass('is-open-sidenav');
			GRF.$sidenav.attr('tabindex', 0).css('outline', 0).focus();

			if ( d1 > 0 ) {
				ND.up(ND.$current);
			}

			this.isopen = true;

			GRF.$win.on('orientationchange', function(){
				ND.close();
			});

			GRF.$win.on('scroll.stickies', function() {
				// sidenavStickies.scroll();
			});

			GRF.$wrap.on('click.closeND', function(event){
				ND.close();
				event.preventDefault();
				event.stopPropagation();
			});
		},
		close: function() {
			ND.$d2.removeClass('fixed absolute');
			GRF.$win.off('orientationchange').scrollTop(0);
			GRF.$win.off('scroll.stickies');
			GRF.$wrap.off('click.closeND');
			GRF.$body.removeClass('is-open-sidenav');
			GRF.$sidenav.removeAttr('tabindex');
			GRF.$menu.focus().blur();
			this.isopen = false;
		}
	}

	GNB.init();

	if ( !Modernizr.mediaqueries && !GRF.$menu.is(':visible') ) {

		ND.$self.remove();

	} else {

		ND.init();
		// sidenavStickies.load();
	}

}


/**
 * init google map
 */
function initMap(id, lat, lng, imgUrl) {
	var id = ( id ) ? id : 'map-canvas000',
		lat = ( lat ) ? lat : 0,
		lng = ( lng ) ? lng : 0;

	// Create an array of styles.
	var styles = [{
			stylers: [
				{ hue: "#888888" },
				{ saturation: -20 }
			]
		},{
			featureType: "road",
			elementType: "geometry",
			stylers: [
		    	{ lightness: 100 },
		    	{ visibility: "simplified" }
			]
		},{
			featureType: "road",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
		}
	];

	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

	// Create a map object, and include the MapTypeId to add
	// to the map type control.
	var myLatLng = new google.maps.LatLng(lat, lng);
	var mapOptions = {
			zoom: 16,
			center: myLatLng,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
			}
		};
	var map = new google.maps.Map(document.getElementById(id), mapOptions);
	var image = imgUrl;

	var beachMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: image
	});

	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
}



/**
 * custom dropdown (.selectbox)
 * @author: Alice Kim, alice@iropke.com
 */
function selectbox() {
	var $select = $('div.selectbox'),
		$options = $select.find('.selectbox-option'),
		$body = $(document);

	$select.each(function(){
		var $box = $(this),
			$selector = $box.find('>.selector'),
			$selected = $box.find('.selector-text'),
			$list = $box.find('>.selectbox-option'),
			$li = $list.find('>li'),
			$item,
			selected = '',
			islink = ( $li.find('a').length > 0 ) ? true : false,
			w,
			len = $li.length;

		init();

		function init() {

			var top = 0;

			$item = ( islink ) ? $li.find('>a') : $li;

			setAttr();
			setStyle();

			if ( islink ) {
				$list.on('click', 'a', function(event) {
					select(this);
				});
				$list.on('keydown', 'a', function(event){
					var $el = $(this),
						i = $el.data('index');

					if ( event.keyCode == 9 || event.keyCode == 27 ) {
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

					if ( islink ) {

						$item.each(function(i, el){
							$(el).data('index', i);
						});

					} else {

						$item.each(function(i, el){
							$(el).attr('tabindex', 0).data('index', i);
							$(el).find('input[type=radio]').attr('tabindex', -1);
						});
					}

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

			// 선택된 아이템 처리 checkbox 일 때
			if ( !islink && $list.has('.selectbox-checked') ) {
				top = $(window).scrollTop();

				$list.find('.selectbox-checked').click();
				$('html, body').scrollTop(top);
				$selector.blur();
			}

			// 선택된 아이템 처리 link 일 때
			if ( islink && $box.has('.is-current').length > 0 ) {
				$list.find('.is-current').addClass('is-active');
				$selected.text( $list.find('.is-current').text() );
			}
		}

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
			$box.addClass('is-active').css('zIndex',1000).data('is-open', true);
			$list.show();
		}

		function close(){
			$list.hide();
			$body.off('keydown.blockArrow');
			$box.removeClass('is-active').css('zIndex',1).data('is-open', false);
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
		$select.removeClass('is-active').css('zIndex', 'auto').data('is-open', false);
		$options.hide();
	}
}


/**
 * window resizing 시 특정 조건에 의해 함수 실행
 * @author: Peter Choi, peter@iropke.com
 * @param {String} namespace resize 이벤트 namespace
 * @param {Function} cond 조건을 판별할 함수
 * @param {Function} callback resizing 중 조건이 변경되었을 때, 실행할 함수
 */
function switchLayout(namespace, cond, callback) {
	var state = cond(); // 현재 결과

	/**
	 * resizing 중 조건 판단
	 */
	function chkBreakpoint() {
		var result = cond();

		if(result !== state) {
			state = !state;

			log('[GLOBAL] layout switched.', namespace, state);
			callback(state);
		}
	}

	$(window).on('resize' + (namespace ? '.' + namespace : ''), function() {
		chkBreakpoint.call(undefined, state);
	});

	// 최초 실행
	callback(state);
}


/**
 * toggle layer
 * @author: alice@iropke.com
 */
(function($) {

	var $win = $(window);
	var plugin = {};

	var defaults = {
		side: false,
		autoFocus: true,
		toggleByClass: false,
		activeClass: 'is-active',
		closeBtnClass: 'close-layer',
		onOpen: function($link, $target) {},
		onClose: function($link, $target) {}
	};

	$.fn.toggleLayer = function(options) {

		if(this.length == 0) return this;

		// support mutltiple elements
		if(this.length > 1){
			this.each(function(){$(this).toggleLayer(options)});
			return this;
		}

		// create a namespace to be used throughout the plugin
		var toggle = {};

		// set a reference to our slider element
		var el = this;
		plugin.el = this;

		var call_selector = el.selector;

		var init = function() {

			toggle.o = $.extend({}, defaults, options);
			toggle.targetId = el.attr('href');
			toggle.$target = $(toggle.targetId);
			toggle.$close = toggle.$target.find('.'+toggle.o.closeBtnClass);
			toggle.pos = el.offset();

			el.data("target", {isopen: false});

			if ( toggle.$target.is(':visible') ) {
				close();
			}

			el.on('click', function(event) {
				if ( el.data('target').isopen ) {
					close();
				} else {
					open();
				}

				event.stopPropagation();
				event.preventDefault();
			});

			toggle.$close.on('click', function(event) {
				close();
				event.stopPropagation();
				event.preventDefault();
			});

			toggle.$target.on('click', function(event) {
				event.stopPropagation();
			});

			$('body').on('click', function(){
				if ( el.data('target').isopen ) {
					close();
				}
			});

			$win.on('resize', function(){
				toggle.o.side = ( el.data('layerOption') == undefined ) ? false : el.data('layerOption');

				if ( !Modernizr.touch && toggle.$target.is(':visible') ) {
					close();
				}
			});
			setup();
		}

		var setup = function(){
			toggle.$target.css({
				outline: '0 none'
			}).attr({
				tabindex: '0'
			});
		}

		var close = function() {
			if ( toggle.o.activeClass !== '' ) {
				toggle.$target.removeClass(toggle.o.activeClass);
			}

			if ( toggle.visible ) {
				toggle.$target.hide();
			} else {
				toggle.o.onClose(el, toggle.$target);
			}

			if ( !toggle.o.toggleByClass ) {
				toggle.$target.hide();
			}
			el.removeClass('toggle-on');
			el.data('target').isopen = false;
			el.focus();

			if ( toggle.$target.find(call_selector).hasClass('toggle-on') ) {
				toggle.$target.find(call_selector).trigger('click');
			}
		}

		var open = function() {
			var $focus = toggle.$target;

			if ( toggle.o.side != false ) {
				pos = el.offset();
				pos.side = ( toggle.o.side == 'left' ) ? pos.left : pos.right;

				if ( toggle.o.side == 'left' ) {
					toggle.$target.css({
						top: pos.top,
						left: pos.side - toggle.$target.outerWidth()
					});
				} else if ( toggle.o.side == 'right' ) {
					toggle.$target.css({
						top: pos.top,
						right: pos.side - toggle.$target.outerWidth()
					});
				}
			}

			if ( toggle.visible ) {
				toggle.$target.show();
			} else {
				toggle.o.onOpen(el, toggle.$target);
			}

			if ( !toggle.o.toggleByClass ) {
				toggle.$target.show();
			}

			if ( toggle.o.activeClass !== '' ) {
				toggle.$target.addClass(toggle.o.activeClass);
			}

			if( toggle.$target.find('input').length && toggle.o.autoFocus ) {
				$focus = toggle.$target.find('input').eq(0);
			}

			$focus.focus();
			el.addClass('toggle-on');
			el.data('target').isopen = true;
		}

		el.openTarget = open;
		el.closeTarget = close;

		init();

		return this;
	}

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
        theme: 'dark',
		controls: 1,
		onReady: undefined
    };

    $.fn.ytiframe = function(options){

        if(this.length == 0) return this;

        if(this.length > 1){
            this.each(function(){$(this).ytiframe(options)});
            return this;
        }

        var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;

        var player = {},
            el = this,
            o = {};

        plugin.el = this;

        var init = function() {
            $.extend(o, defaults, options);
            player.url = el.attr('href');
            player.videoId = '';
            player.ytId = '';

            if ( el.parents('.flexible-obj').length > 0 ) {
                player.container = el.wrap( '<div class="video-player" />' ).parent();
            } else {
                player.container = el.wrap( '<div class="video-player flexible-obj" />' ).parent();
            }

            player.ytId = player.url.match(regExp)[2];
            player.videoId = o.videoIdBase + player.ytId;

            // embed iframe
            player.embed = $('<iframe src="//www.youtube.com/embed/'+ player.ytId +'?showinfo=0&color=' + o.color + '&theme=' + o.theme + '&enablejsapi=0&rel=0&autoplay='+ o.autoplay + '&controls=' + o.controls + '" allowfullscreen></iframe>')
                .attr('id', player.videoId)
                .addClass('video-iframe')
                .appendTo( player.container );

			if(typeof o.onReady === 'function') o.onReady(player.embed);

            el.hide();
        }

        init();

        el.pause = function() {
        	//
        	console.log(el + ' pause');
        }

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


/*	SWFObject v2.2 <http://code.google.com/p/swfobject/>
 is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();


/*
 * Youtube Chromeless Video Plugin
 * http://www.viget.com/
 *
 * Copyright (c) 2010 Trevor Davis
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 0.4
 */

(function($) {
	var player = {};

	$.fn.ytchromeless = function(options){

		//Initial configuration
		var config = {
			videoWidth  : '640',
			videoHeight : '360',
			videoIdBase : 'ytplayer',
			autoplay : false,
			mute: false,
			start: 0,
			end: 0,
			loop: false,
			params : {
				allowScriptAccess: 'always',
				wmode: 'transparent'
			},
			onReady : undefined,
			onStateChange: undefined
		};

		return this.each(function(i) {

			// initial var setup
			var o    = $.extend({}, config, options),

			// set jQuery objects
				$link      = $(this),

			// set variables
				url        = $link.attr('href'),
				videoId    = $link.attr('id') || o.videoIdBase + i,
				ytVideoId  = url.substr(31),

			// new DOM elements
				$video     = $link.wrap( '<div class="video-player"></div>' ).parent(),
				$toReplace = $('<div class="video"></div>').prependTo( $video ).attr('id', videoId),

			// set up the special player object
				player,
				state = false,
				isStarted = false;

			// the youtube movie calls this method when it loads
			// DO NOT CHANGE THIS METHOD'S NAME
			onYouTubePlayerReady = function( videoId ) {
				console.log('[ytchromeless] ready', videoId);

				player.cueVideoById( ytVideoId );

				if(o.mute) player.mute();
				if(o.autoplay) player.playVideo();

				// player state check loop
				setInterval(function() {
					var _state = player.getPlayerState(),
						time = player.getCurrentTime();

					// 플레이어 상태 변경됨
					if(_state !== state) {
						log('[ytchromeless] state changed', _state);

						state = _state;

						// 재생 시작구간 적용
						if(!isStarted && state === 1 && o.start > 0) {
							log('[ytchromeless] start from', o.start + 's');

							player.seekTo(o.start, true);
							isStarted = true;
						}

						// 영상 끝났을 때 loop 활성화 시 시작 구간부터 다시 재생
						if(o.loop && state === 0) {
							log('[ytchromeless] video ended. restart to', o.start + 's');

							player.seekTo(o.start, true);
						}

						// 상태 변경 callback 호출
						if(typeof o.onStateChange === 'function') o.onStateChange(state);
					}

					// 재생 끝 구간 적용
					if(o.end > 0 && o.end > o.start && o.end <= time) {
						if(o.loop) { // loop 활성화 시 시작 구간부터 다시 재생
							log('[ytchromeless] restart to', o.start + 's');
							player.seekTo(o.start, true);
						} else { // loop 비활성화 시 동영상 정지
							log('[ytchromeless] stop video at end point');
							player.stopVideo();
						}
					}
				}, 100);

			};

			// the embed!
			$video.init = function() {

				swfobject.embedSWF(
					'http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=' + videoId,
					videoId,
					o.videoWidth,
					o.videoHeight,
					'8',
					null,
					null,
					o.params,
					{ id: videoId },
					function(){
						player = document.getElementById( videoId );

						if(typeof o.onReady === 'function') o.onReady(player);
					}
				);

				$link.hide();

			};

			$video.init();

		});

	};

})(jQuery);

/*
 * accordion list jQuery plugin
 * alice@iropke.com
 */
(function($) {
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
    };

    $(window).scroll(inview);
    $(window).resize(inview);
    setTimeout(inview, 500); // set first

})(jQuery);



/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);


/**
 * Debounced Resize() jQuery Plugin
 * @author Paul Irish
 * http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
 */
(function($,sr){
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
					timeout = null;
			};

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	// smartresize
	jQuery.fn[sr] = function(fn){ return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})(jQuery,'smartresize');



/**
 * menu-aim is a jQuery plugin for dropdown menus that can differentiate
 * between a user trying hover over a dropdown item vs trying to navigate into
 * a submenu's contents.
 *
 * https://github.com/kamens/jQuery-menu-aim
 */
(function($) {

    $.fn.menuAim = function(opts) {
        this.each(function() {
            init.call(this, opts);
        });
        return this;
    };

    function init(opts) {
        var $menu = $(this),
            activeRow = null,
            mouseLocs = [],
            lastDelayLoc = null,
            timeoutId = null,
            options = $.extend({
                rowSelector: "> li",
                submenuSelector: "*",
                submenuDirection: "right",
                tolerance: 75,  // bigger = more forgivey when entering submenu
                enter: $.noop,
                exit: $.noop,
                activate: $.noop,
                deactivate: $.noop,
                exitMenu: function() {}
            }, opts);

        var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
            DELAY = 300;  // ms delay when user appears to be entering submenu

        /**
         * Keep track of the last few locations of the mouse.
         */
        var mousemoveDocument = function(e) {
                mouseLocs.push({x: e.pageX, y: e.pageY});

                if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
                    mouseLocs.shift();
                }
            };

        /**
         * Cancel possible row activations when leaving the menu entirely
         */
        var mouseleaveMenu = function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // If exitMenu is supplied and returns true, deactivate the
                // currently active row on menu exit.

                if (options.exitMenu(this)) {
                    if (activeRow) {
                        options.deactivate(activeRow);
                    }

                    activeRow = null;
                }
            };

        /**
         * Trigger a possible row activation whenever entering a new row.
         */
        var mouseenterRow = function() {
                if (timeoutId) {
                    // Cancel any previous activation delays
                    clearTimeout(timeoutId);
                }

                options.enter(this);
                possiblyActivate(this);
            },
            mouseleaveRow = function() {
                options.exit(this);
            };

        /*
         * Immediately activate a row if the user clicks on it.
         */
        var clickRow = function() {
                activate(this);
            };

        var activate = function(row) {
                if (row == activeRow) {
                    return;
                }

                if (activeRow) {
                    options.deactivate(activeRow);
                }

                options.activate(row);
                activeRow = row;
            };

        var possiblyActivate = function(row) {
                var delay = activationDelay();

                if (delay) {
                    timeoutId = setTimeout(function() {
                        possiblyActivate(row);
                    }, delay);
                } else {
                    activate(row);
                }
            };

        /**
         * Return the amount of time that should be used as a delay before the
         * currently hovered row is activated.
         *
         * Returns 0 if the activation should happen immediately. Otherwise,
         * returns the number of milliseconds that should be delayed before
         * checking again to see if the row should be activated.
         */
        var activationDelay = function() {
                if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
                    // If there is no other submenu row already active, then
                    // go ahead and activate immediately.
                    return 0;
                }

                var offset = $menu.offset(),
                    upperLeft = {
                        x: offset.left,
                        y: offset.top - options.tolerance
                    },
                    upperRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: upperLeft.y
                    },
                    lowerLeft = {
                        x: offset.left,
                        y: offset.top + $menu.outerHeight() + options.tolerance
                    },
                    lowerRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: lowerLeft.y
                    },
                    loc = mouseLocs[mouseLocs.length - 1],
                    prevLoc = mouseLocs[0];

                if (!loc) {
                    return 0;
                }

                if (!prevLoc) {
                    prevLoc = loc;
                }

                if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
                    prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                    // If the previous mouse location was outside of the entire
                    // menu's bounds, immediately activate.
                    return 0;
                }

                if (lastDelayLoc &&
                        loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                    // If the mouse hasn't moved since the last time we checked
                    // for activation status, immediately activate.
                    return 0;
                }


                function slope(a, b) {
                    return (b.y - a.y) / (b.x - a.x);
                };

                var decreasingCorner = upperRight,
                    increasingCorner = lowerRight;

                if (options.submenuDirection == "left") {
                    decreasingCorner = lowerLeft;
                    increasingCorner = upperLeft;
                } else if (options.submenuDirection == "below") {
                    decreasingCorner = lowerRight;
                    increasingCorner = lowerLeft;
                } else if (options.submenuDirection == "above") {
                    decreasingCorner = upperLeft;
                    increasingCorner = upperRight;
                }

                var decreasingSlope = slope(loc, decreasingCorner),
                    increasingSlope = slope(loc, increasingCorner),
                    prevDecreasingSlope = slope(prevLoc, decreasingCorner),
                    prevIncreasingSlope = slope(prevLoc, increasingCorner);

                if (decreasingSlope < prevDecreasingSlope &&
                        increasingSlope > prevIncreasingSlope) {
                    // Mouse is moving from previous location towards the
                    // currently activated submenu. Delay before activating a
                    // new menu row, because user may be moving into submenu.
                    lastDelayLoc = loc;
                    return DELAY;
                }

                lastDelayLoc = null;
                return 0;
            };

        // edit by Alice 2015.02.10 : change event ordering
        var exitMenu = function() {
        	mouseleaveMenu();
        	options.exitMenu(this);
        }

        /**
         * Hook up initial menu events
         */
        $menu
            .mouseleave(mouseleaveMenu)
            .find(options.rowSelector)
                .mouseenter(mouseenterRow)
                .mouseleave(mouseleaveRow)
                // .focusout(exitMenu)
                .click(clickRow);

        $menu
        	.find(options.rowSelector)
                .focusin(function(){
                	possiblyActivate(this);
                });

        $(document).mousemove(mousemoveDocument);

    };
})(jQuery);


/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute===void 0&&(jQuery.migrateMute=!0),function(e,t,n){function r(n){var r=t.console;i[n]||(i[n]=!0,e.migrateWarnings.push(n),r&&r.warn&&!e.migrateMute&&(r.warn("JQMIGRATE: "+n),e.migrateTrace&&r.trace&&r.trace()))}function a(t,a,i,o){if(Object.defineProperty)try{return Object.defineProperty(t,a,{configurable:!0,enumerable:!0,get:function(){return r(o),i},set:function(e){r(o),i=e}}),n}catch(s){}e._definePropertyBroken=!0,t[a]=i}var i={};e.migrateWarnings=[],!e.migrateMute&&t.console&&t.console.log&&t.console.log("JQMIGRATE: Logging is active"),e.migrateTrace===n&&(e.migrateTrace=!0),e.migrateReset=function(){i={},e.migrateWarnings.length=0},"BackCompat"===document.compatMode&&r("jQuery is not compatible with Quirks Mode");var o=e("<input/>",{size:1}).attr("size")&&e.attrFn,s=e.attr,u=e.attrHooks.value&&e.attrHooks.value.get||function(){return null},c=e.attrHooks.value&&e.attrHooks.value.set||function(){return n},l=/^(?:input|button)$/i,d=/^[238]$/,p=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,f=/^(?:checked|selected)$/i;a(e,"attrFn",o||{},"jQuery.attrFn is deprecated"),e.attr=function(t,a,i,u){var c=a.toLowerCase(),g=t&&t.nodeType;return u&&(4>s.length&&r("jQuery.fn.attr( props, pass ) is deprecated"),t&&!d.test(g)&&(o?a in o:e.isFunction(e.fn[a])))?e(t)[a](i):("type"===a&&i!==n&&l.test(t.nodeName)&&t.parentNode&&r("Can't change the 'type' of an input or button in IE 6/7/8"),!e.attrHooks[c]&&p.test(c)&&(e.attrHooks[c]={get:function(t,r){var a,i=e.prop(t,r);return i===!0||"boolean"!=typeof i&&(a=t.getAttributeNode(r))&&a.nodeValue!==!1?r.toLowerCase():n},set:function(t,n,r){var a;return n===!1?e.removeAttr(t,r):(a=e.propFix[r]||r,a in t&&(t[a]=!0),t.setAttribute(r,r.toLowerCase())),r}},f.test(c)&&r("jQuery.fn.attr('"+c+"') may use property instead of attribute")),s.call(e,t,a,i))},e.attrHooks.value={get:function(e,t){var n=(e.nodeName||"").toLowerCase();return"button"===n?u.apply(this,arguments):("input"!==n&&"option"!==n&&r("jQuery.fn.attr('value') no longer gets properties"),t in e?e.value:null)},set:function(e,t){var a=(e.nodeName||"").toLowerCase();return"button"===a?c.apply(this,arguments):("input"!==a&&"option"!==a&&r("jQuery.fn.attr('value', val) no longer sets properties"),e.value=t,n)}};var g,h,v=e.fn.init,m=e.parseJSON,y=/^([^<]*)(<[\w\W]+>)([^>]*)$/;e.fn.init=function(t,n,a){var i;return t&&"string"==typeof t&&!e.isPlainObject(n)&&(i=y.exec(e.trim(t)))&&i[0]&&("<"!==t.charAt(0)&&r("$(html) HTML strings must start with '<' character"),i[3]&&r("$(html) HTML text after last tag is ignored"),"#"===i[0].charAt(0)&&(r("HTML string cannot start with a '#' character"),e.error("JQMIGRATE: Invalid selector string (XSS)")),n&&n.context&&(n=n.context),e.parseHTML)?v.call(this,e.parseHTML(i[2],n,!0),n,a):v.apply(this,arguments)},e.fn.init.prototype=e.fn,e.parseJSON=function(e){return e||null===e?m.apply(this,arguments):(r("jQuery.parseJSON requires a valid JSON string"),null)},e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||0>e.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e.browser||(g=e.uaMatch(navigator.userAgent),h={},g.browser&&(h[g.browser]=!0,h.version=g.version),h.chrome?h.webkit=!0:h.webkit&&(h.safari=!0),e.browser=h),a(e,"browser",e.browser,"jQuery.browser is deprecated"),e.sub=function(){function t(e,n){return new t.fn.init(e,n)}e.extend(!0,t,this),t.superclass=this,t.fn=t.prototype=this(),t.fn.constructor=t,t.sub=this.sub,t.fn.init=function(r,a){return a&&a instanceof e&&!(a instanceof t)&&(a=t(a)),e.fn.init.call(this,r,a,n)},t.fn.init.prototype=t.fn;var n=t(document);return r("jQuery.sub() is deprecated"),t},e.ajaxSetup({converters:{"text json":e.parseJSON}});var b=e.fn.data;e.fn.data=function(t){var a,i,o=this[0];return!o||"events"!==t||1!==arguments.length||(a=e.data(o,t),i=e._data(o,t),a!==n&&a!==i||i===n)?b.apply(this,arguments):(r("Use of jQuery.fn.data('events') is deprecated"),i)};var j=/\/(java|ecma)script/i,w=e.fn.andSelf||e.fn.addBack;e.fn.andSelf=function(){return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)},e.clean||(e.clean=function(t,a,i,o){a=a||document,a=!a.nodeType&&a[0]||a,a=a.ownerDocument||a,r("jQuery.clean() is deprecated");var s,u,c,l,d=[];if(e.merge(d,e.buildFragment(t,a).childNodes),i)for(c=function(e){return!e.type||j.test(e.type)?o?o.push(e.parentNode?e.parentNode.removeChild(e):e):i.appendChild(e):n},s=0;null!=(u=d[s]);s++)e.nodeName(u,"script")&&c(u)||(i.appendChild(u),u.getElementsByTagName!==n&&(l=e.grep(e.merge([],u.getElementsByTagName("script")),c),d.splice.apply(d,[s+1,0].concat(l)),s+=l.length));return d});var Q=e.event.add,x=e.event.remove,k=e.event.trigger,N=e.fn.toggle,T=e.fn.live,M=e.fn.die,S="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",C=RegExp("\\b(?:"+S+")\\b"),H=/(?:^|\s)hover(\.\S+|)\b/,A=function(t){return"string"!=typeof t||e.event.special.hover?t:(H.test(t)&&r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),t&&t.replace(H,"mouseenter$1 mouseleave$1"))};e.event.props&&"attrChange"!==e.event.props[0]&&e.event.props.unshift("attrChange","attrName","relatedNode","srcElement"),e.event.dispatch&&a(e.event,"handle",e.event.dispatch,"jQuery.event.handle is undocumented and deprecated"),e.event.add=function(e,t,n,a,i){e!==document&&C.test(t)&&r("AJAX events should be attached to document: "+t),Q.call(this,e,A(t||""),n,a,i)},e.event.remove=function(e,t,n,r,a){x.call(this,e,A(t)||"",n,r,a)},e.fn.error=function(){var e=Array.prototype.slice.call(arguments,0);return r("jQuery.fn.error() is deprecated"),e.splice(0,0,"error"),arguments.length?this.bind.apply(this,e):(this.triggerHandler.apply(this,e),this)},e.fn.toggle=function(t,n){if(!e.isFunction(t)||!e.isFunction(n))return N.apply(this,arguments);r("jQuery.fn.toggle(handler, handler...) is deprecated");var a=arguments,i=t.guid||e.guid++,o=0,s=function(n){var r=(e._data(this,"lastToggle"+t.guid)||0)%o;return e._data(this,"lastToggle"+t.guid,r+1),n.preventDefault(),a[r].apply(this,arguments)||!1};for(s.guid=i;a.length>o;)a[o++].guid=i;return this.click(s)},e.fn.live=function(t,n,a){return r("jQuery.fn.live() is deprecated"),T?T.apply(this,arguments):(e(this.context).on(t,this.selector,n,a),this)},e.fn.die=function(t,n){return r("jQuery.fn.die() is deprecated"),M?M.apply(this,arguments):(e(this.context).off(t,this.selector||"**",n),this)},e.event.trigger=function(e,t,n,a){return n||C.test(e)||r("Global events are undocumented and deprecated"),k.call(this,e,t,n||document,a)},e.each(S.split("|"),function(t,n){e.event.special[n]={setup:function(){var t=this;return t!==document&&(e.event.add(document,n+"."+e.guid,function(){e.event.trigger(n,null,t,!0)}),e._data(this,n,e.guid++)),!1},teardown:function(){return this!==document&&e.event.remove(document,n+"."+e._data(this,n)),!1}}})}(jQuery,window);
