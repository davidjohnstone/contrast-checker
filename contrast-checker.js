// Contrast Checker
// by David Johnstone
//
// https://github.com/davidjohnstone/contrast-checker
//
// A bookmarklet that shows the contrast ratio of the current element and its background. Based on W3C's Web Content Accessibility Guidelines 2.0.
//
// Create a bookmarklet with javascript:(function(){var newscript=document.createElement('script');newscript.type='text/javascript';newscript.async=true;newscript.src='https://s3.amazonaws.com/cyclinganalytics/static/contrast-checker.js';(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);})();
//
// MIT license.

(function() {

// Be lazy, use jQuery.
var newscript = document.createElement('script');
newscript.type = 'text/javascript';
newscript.src='https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js';
(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);

newscript.onload = function() {

var html = '' +
	'<div id="contrast-checker">' +
		'<div id="contrast-checker-nothing-yet">Move mouse over text&hellip;</div>' +
		'<div id="contrast-checker-ratio" style="display: none"></div>' +
		'<div id="contrast-checker-description" style="display: none"></div>' +
		'<div>' +
			'<a id="contrast-checker-show-more-link">Show explanation&hellip;</a>' +
			'<div id="contrast-checker-show-more" style="display: none">' +
				'<div><a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">W3C recommendations:</a></div>' +
				'<table>' +
					'<tr><td></td><td class="contrast-checker-heading" title="Regular body text">Normal</td><td class="contrast-checker-heading" title="Font size at least 18pt, or bold and at least 14pt">Large</td></tr>' +
					'<tr><td class="contrast-checker-heading" title="W3C recommendation for minimum contrast ratio for AA level compliance">Minimum</td><td>4.5:1</td><td>3:1</td></tr>' +
					'<tr><td class="contrast-checker-heading" title="W3C recommendation for minimum contrast ratio for AAA level compliance">Enhanced</td><td>7:1</td><td>4.5:1</td></tr>' +
				'</table>' +
				'<div class="contrast-checker-note">These figures do not apply to incidental text that form inactive UI components or decorative text.</div>' +
				'<div class="contrast-checker-note">Large scale text is defined as 18pt or larger, or bold and 14pt or larger.</div>' +
				'<div class="contrast-checker-note">Note that these apply to regularly weighted fonts. Particularly light fonts need more contrast.</div>' +
			'</div>' +
		'</div>' +
		'<div class="contrast-checker-credits">' +
			'<a href="https://github.com/davidjohnstone/contrast-checker">Contrast Checker</a> by <a href="http://davidjohnstone.net/">David Johnstone</a>. <a href="https://github.com/davidjohnstone/contrast-checker">Learn more&hellip;</a>' +
			'<div title="Close" id="contrast-checker-close">&#215;</div>' +
		'</div>' +
	'</div>';

var css = '' +
'<style>' +
'#contrast-checker {' +
'	position: fixed;' +
'	bottom: 50px;' +
'	left: 50px;' +
'	width: 160px;' +
'	border: 1px solid rgba(0, 0, 0, 0.15);' +
'	border-radius: 3px;' +
'	color: #333;' +
'	background-color: #f4f4f4;' +
'	font: 12px/18px sans-serif;' +
'	text-align: left;' +
'	z-index: 1000000;' +
'}' +
'#contrast-checker > div {' +
'	border-top: 1px solid rgba(0, 0, 0, 0.15);' +
'	padding: 4px 12px;' +
'}' +
'#contrast-checker > div:first-child {' +
'	border-top: none;' +
'}' +
'#contrast-checker a {' +
'	color: hsl(5, 90%, 45%);' +
'	text-decoration: none;' +
'}' +
'#contrast-checker a:hover, #contrast-checker a:focus {' +
'	text-decoration: underline;' +
'	cursor: pointer;' +
'}' +
'#contrast-checker-ratio {' +
'	font-size: 24px;' +
'	text-align: center;' +
'	font-weight: 700;' +
'	color: #666;' +
'	line-height: 24px;' +
'}' +
'#contrast-checker-nothing-yet {' +
'	font-weight: 400;' +
'	font-size: 12px;' +
'	line-height: 24px;' +
'	font-style: italic;' +
'}' +
'#contrast-checker table {' +
'	border-collapse: collapse;' +
'}' +
'#contrast-checker td {' +
'	padding: 1px 4px;' +
'	font-size: 12px;' +
'	line-height: 18px;' +
'}' +
'#contrast-checker .contrast-checker-heading {' +
'	font-size: 10px;' +
'	font-weight: 700;' +
'	color: #666;' +
'}' +
'#contrast-checker .contrast-checker-note {' +
'	font-size: 10px;' +
'	line-height: 15px;' +
'	margin-top: 4px;' +
'}' +
'#contrast-checker .contrast-checker-credits {' +
'	font-size: 10px;' +
'	line-height: 15px;' +
'}' +
'#contrast-checker-close {' +
'	position: absolute;' +
'	top: 0px;' +
'	right: 0px;' +
'	font-size: 14px;' +
'	font-weight: 700;' +
'	color: #aaa;' +
'	padding: 0 4px;' +
'	cursor: pointer;' +
'}' +
'#contrast-checker-close:hover, #contrast-checker-close:focus {' +
'	color: #333;' +
'}' +
'</style>';

// Parse rgb(r, g, b) and rgba(r, g, b, a) strings into an array.
// Adapted from https://github.com/gka/chroma.js
var parseRgb = function(css) {
	var i, m, rgb, _i, _j;
	if (m = css.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)) {
		rgb = m.slice(1, 4);
		for (i = _i = 0; _i <= 2; i = ++_i) {
			rgb[i] = +rgb[i];
		}
		rgb[3] = 1;
	} else if (m = css.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/)) {
		rgb = m.slice(1, 5);
		for (i = _j = 0; _j <= 3; i = ++_j) {
			rgb[i] = +rgb[i];
		}
	}
	return rgb;
};

// Based on http://www.w3.org/TR/WCAG20/#contrast-ratiodef
var contrastRatio = function(x, y) {
	var l1 = relativeLuminance(parseRgb(x));
	var l2 = relativeLuminance(parseRgb(y));
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// Based on http://www.w3.org/TR/WCAG20/#relativeluminancedef
var relativeLuminance = function(c) {
	var lum = [];
	for (var i = 0; i < 3; i++) {
		var v = c[i] / 255;
		lum.push(v < 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
	}
	return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
};

// Based on http://jsfiddle.net/Y4uDL/
var getBackground = function(el) {
    var color = el.css('background-color');
    if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') { // Firefox can return transparent.
        return color;
    }
    if (el.is('html')) {
        return 'rgb(255, 255, 255)';
    } else {
        return getBackground(el.parent());
    }
};

var started = false;

$(document).mousemove(function(e) {
	var target = $(e.target);
	var colour = target.css('color');
	var bg = getBackground(target);
	var ratio = Math.round(contrastRatio(colour, bg) * 100) / 100;
	var ratioText = ratio + ':1';
	var fontSize = parseInt(target.css('fontSize')) * 3 / 4; // http://www.w3.org/TR/CSS2/syndata.html#length-units
	var fontWeight = target.css('fontWeight');
	var fontSizeString, ratingString;
	if (fontSize >= 18 || fontSize >= 14 && fontWeight >= 700) {
		fontSizeString = 'large scale text'
		if (ratio < 3) {
			ratingString = 'too low';
		} else if (ratio < 4.5) {
			ratingString = 'okay';
		} else {
			ratingString = 'excellent';
		}
	} else {
		fontSizeString = 'normal body text'
		if (ratio < 4.5) {
			ratingString = 'too low';
		} else if (ratio < 7) {
			ratingString = 'okay';
		} else {
			ratingString = 'excellent';
		}
	}
	$('#contrast-checker-ratio').text(ratioText);
	$('#contrast-checker-description').text('For ' + fontSizeString + ', a contrast ratio of ' + ratioText + ' is ' + ratingString + '.');
	if (!started) {
		started = true;
		$('#contrast-checker-nothing-yet').remove();
		$('#contrast-checker-ratio').show();
		$('#contrast-checker-description').show();
	}
});
$(document).ready(function() {
	$('body').append(css);
	$('body').append(html);
	$('#contrast-checker-close').click(function() {
		$('#contrast-checker').fadeOut(function() {
			$('#contrast-checker').remove();
		});
	});
	$('#contrast-checker-show-more-link').click(function() {
		$('#contrast-checker-show-more').show();
		$('#contrast-checker-show-more-link').remove();
	});
});

};

})();
