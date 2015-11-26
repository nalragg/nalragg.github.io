/*
	Project : grafix @iropke

	ref :
	http://tomasz.janczuk.org/2013/05/multi-line-strings-in-javascript-and.html
	http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript/5571069#5571069
*/

function hereDoc(f) {
	var scriptEls = document.getElementsByTagName('script'),
		scriptSrc = scriptEls[scriptEls.length - 1].src,
		isIdx = /\?index$/.test(scriptSrc);

	return f.toString().
		replace(/^[^\/]+\/\*!?/, '').
		replace(/\*\/[^\/]+$/, '').
		replace(isIdx?/="\.\.\//g:'', isIdx?'="./':'');

	//'/
}

var header_html, footer_html, sidenav_html;

var SWS = window.SWS || {};
SWS.DEV = true;

header_html = hereDoc(function () {/*
	<h1>grafix</h1>
*/});

footer_html = hereDoc(function () {/*
*/});

sidenav_html = hereDoc(function () {/*
	<ul class="sidenav-menu">
		<li class="nav-d1">
			<h2 class="nav-d1-h"><a href="#intro" class="nav-d1-a"><span>grafix</span></a></h2>
			<ul class="nav-d2">
				<li><a href="#position" class="nav-d2-a"><span>position</span></a></li>
				<li><a href="#scale" class="nav-d2-a"><span>scale</span></a></li>
				<li><a href="#opacity" class="nav-d2-a"><span>opacity</span></a></li>
				<li><a href="#rotate" class="nav-d2-a"><span>rotate</span></a></li>
				<li><a href="#ex01" class="nav-d2-a"><span>example 1</span></a></li>
				<li><a href="#ex02" class="nav-d2-a"><span>example 2</span></a></li>
				<li><a href="#ex03" class="nav-d2-a"><span>example 3</span></a></li>
			</ul>
		</li>
	</ul>
*/});

if ( document.getElementById('header') != undefined ) {
	document.getElementById('header').innerHTML = header_html;
}
if ( document.getElementById('footer') != undefined ) {
	document.getElementById('footer').innerHTML = footer_html;
}
if ( document.getElementById('sidenav') != undefined ) {
	document.getElementById('sidenav').innerHTML = sidenav_html;
}
