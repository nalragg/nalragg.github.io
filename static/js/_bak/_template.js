/*
	Project : SHERLOCK @ iropke

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

var header_html, footer_html, sidenav_html, selsect_product_html;

header_html = hereDoc(function () {/*
	header
*/});


footer_html = hereDoc(function () {/*
	footer
*/});

if ( document.getElementById('header') != undefined ) {
	document.getElementById('header').innerHTML = header_html;
}
if ( document.getElementById('footer') != undefined ) {
	document.getElementById('footer').innerHTML = footer_html;
}

