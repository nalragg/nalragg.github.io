/*
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
    replace(isIdx ? /="\.\.\//g : '', isIdx ? '="./' : '');

    //'/
}

header_html = hereDoc(function () {/*
<h1 class="h1"><img src="./static/images/a/logo.png" alt=""></h1>
<div class="">
	<a href="#" id="" class="nav-menu"><span class="nav-menu-icon"><span class="blind">메뉴열기</span></span></a>
</div>
*/});

footer_html = hereDoc(function () {/*
<div class="l-wrap">
	<div class="footer-area">
		copyright(c) 2015 All rights reserved by Sherlock Jeon
	</div>
</div>
*/});

document.getElementById('header').innerHTML = header_html;
document.getElementById('footer').innerHTML = footer_html;

