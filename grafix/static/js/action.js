/**
 * @fileoverview 페이지별 함수 및 플러그인 실행 코드
 * @author sherlock@iropke
 * @since 2015.10.30
 */

 $(function(){

 	setNav();
 	setPage();

 	function setNav() {
	 	var $sNav = $('.sidenav-menu'),
	 		$d1 = $sNav.find('.nav-d1'),
	 		$d1Opnr = $d1.find('.nav-d1-h'),
	 		$d1Draw = $d1.find('.nav-d1-a'),
	 		$d2 = $sNav.find('.nav-d2'),
	 		$d2Draw = $d2.find('.nav-d2-a'),
	 		tl = new TimelineLite(),
	 		tlDu = 0.08,
	 		tlDe = 0.08;

		$d1Opnr.on('mouseenter', function(){
			var $el = $(this).parent();

			$el.addClass('on');
			tl.staggerFromTo($el.find($d2Draw), tlDu, {
				rotationX: 45,
				autoAlpha: 0
			}, {
				rotationX: 0,
				autoAlpha: 1
			}, tlDe);
		});

		$d1.on('mouseleave', function(){
			$(this).removeClass('on');

			tl.staggerTo( $(this).find($d2Draw), tlDu, {
				rotationX: 45,
				autoAlpha: 0
			}, -tlDe);
		});

		// $d1Draw.on('click', function(event){
		// 	var $body = $('html, body'),
		// 		$target = $(this).attr('href'),
		// 		$targetTop = $($target).offset().top;

		// 	event.preventDefault();
		// 	event.stopPropagation();

		// 	console.log($target);

		// 	TweenMax.delayedCall( 1, function(){
		// 		$body.animate({scrollTop: $targetTop});
		// 	});
		// });

		$sNav.find('a').each(function(i, el){
			var $el = $(el),
				$se = $('.section');

			$el.on('click', function(){
				$se.removeClass('on');
				$se.eq(i).addClass('on');
			});
		});

		console.log( $d2Draw.length );
	}

	function setPage() {
		var $section = $('.section');

		$section.each(function(i, el){
			var $el = $(el),
				elTop = $el.offset().top;

			if ( elTop == GRF.$win.scrollTop() ) {
				$el.addClass('on');
			} else {
				$el.removeClass('on');
			}
		});
	}
 });
