(function() {

"use strict";


/* utils */


function E(tagName) {
	var i, leni;
	var attrs = {};
	var contentIndex = 1;
	if (arguments.length > 1 && arguments[1].constructor === Object) {
		attrs = arguments[1];
		contentIndex = 2;
	}
	tagName = tagName.split(/(?=[\.#])/);
	var tag = document.createElement(tagName[0]);
	for (i = 1, leni = tagName.length; i < leni; i++) {
		var tagExtra = tagName[i];
		if (tagExtra[0] === '.') {
			tag.classList.add(tagExtra.slice(1));
		}
		else {
			tag.setAttribute('id', tagExtra.slice(1));
		}
	}

	for (var attrName in attrs) {
		if (Object.prototype.hasOwnProperty.call(attrs, attrName)) {
			tag.setAttribute(attrName, attrs[attrName]);
		}
	}

	for (i = contentIndex, leni = arguments.length; i < leni; i++) {
		var content = arguments[i];
		if (content === undefined) {
			continue;
		}
		if (typeof content === 'string') {
			tag.appendChild(document.createTextNode(content));
		}
		else {
			tag.appendChild(content);
		}
	}

	return tag;
}

/* code */

function rgbtohex(r, g, b) {
	r = Math.round(Math.min(Math.max(r, 0), 255));
	g = Math.round(Math.min(Math.max(g, 0), 255));
	b = Math.round(Math.min(Math.max(b, 0), 255));
	var colorCode = r * 0x10000 + g * 0x100 + b;
	return '#' + ('000000' + colorCode.toString(16)).slice(-6);
}


function colorscheme_red_green(frac) {
	var r, g, b = 0;
	frac = Math.max(Math.min(frac, 1.0), 0.0);
	if (frac < 0.5) {
		r = 255;
		g = Math.round(510 * frac);
	}
	else {
		g = 255;
		r = Math.round(510 - 510 * frac);
	}
	return [r, g, b];
}

var inferno_palette = [[0, 0, 4], [1, 0, 5], [1, 1, 6], [1, 1, 8], [2, 1, 10], [2, 2, 12], [2, 2, 14], [3, 2, 16], [4, 3, 18], [4, 3, 20], [5, 4, 23], [6, 4, 25], [7, 5, 27], [8, 5, 29], [9, 6, 31], [10, 7, 34], [11, 7, 36], [12, 8, 38], [13, 8, 41], [14, 9, 43], [16, 9, 45], [17, 10, 48], [18, 10, 50], [20, 11, 52], [21, 11, 55], [22, 11, 57], [24, 12, 60], [25, 12, 62], [27, 12, 65], [28, 12, 67], [30, 12, 69], [31, 12, 72], [33, 12, 74], [35, 12, 76], [36, 12, 79], [38, 12, 81], [40, 11, 83], [41, 11, 85], [43, 11, 87], [45, 11, 89], [47, 10, 91], [49, 10, 92], [50, 10, 94], [52, 10, 95], [54, 9, 97], [56, 9, 98], [57, 9, 99], [59, 9, 100], [61, 9, 101], [62, 9, 102], [64, 10, 103], [66, 10, 104], [68, 10, 104], [69, 10, 105], [71, 11, 106], [73, 11, 106], [74, 12, 107], [76, 12, 107], [77, 13, 108], [79, 13, 108], [81, 14, 108], [82, 14, 109], [84, 15, 109], [85, 15, 109], [87, 16, 110], [89, 16, 110], [90, 17, 110], [92, 18, 110], [93, 18, 110], [95, 19, 110], [97, 19, 110], [98, 20, 110], [100, 21, 110], [101, 21, 110], [103, 22, 110], [105, 22, 110], [106, 23, 110], [108, 24, 110], [109, 24, 110], [111, 25, 110], [113, 25, 110], [114, 26, 110], [116, 26, 110], [117, 27, 110], [119, 28, 109], [120, 28, 109], [122, 29, 109], [124, 29, 109], [125, 30, 109], [127, 30, 108], [128, 31, 108], [130, 32, 108], [132, 32, 107], [133, 33, 107], [135, 33, 107], [136, 34, 106], [138, 34, 106], [140, 35, 105], [141, 35, 105], [143, 36, 105], [144, 37, 104], [146, 37, 104], [147, 38, 103], [149, 38, 103], [151, 39, 102], [152, 39, 102], [154, 40, 101], [155, 41, 100], [157, 41, 100], [159, 42, 99], [160, 42, 99], [162, 43, 98], [163, 44, 97], [165, 44, 96], [166, 45, 96], [168, 46, 95], [169, 46, 94], [171, 47, 94], [173, 48, 93], [174, 48, 92], [176, 49, 91], [177, 50, 90], [179, 50, 90], [180, 51, 89], [182, 52, 88], [183, 53, 87], [185, 53, 86], [186, 54, 85], [188, 55, 84], [189, 56, 83], [191, 57, 82], [192, 58, 81], [193, 58, 80], [195, 59, 79], [196, 60, 78], [198, 61, 77], [199, 62, 76], [200, 63, 75], [202, 64, 74], [203, 65, 73], [204, 66, 72], [206, 67, 71], [207, 68, 70], [208, 69, 69], [210, 70, 68], [211, 71, 67], [212, 72, 66], [213, 74, 65], [215, 75, 63], [216, 76, 62], [217, 77, 61], [218, 78, 60], [219, 80, 59], [221, 81, 58], [222, 82, 56], [223, 83, 55], [224, 85, 54], [225, 86, 53], [226, 87, 52], [227, 89, 51], [228, 90, 49], [229, 92, 48], [230, 93, 47], [231, 94, 46], [232, 96, 45], [233, 97, 43], [234, 99, 42], [235, 100, 41], [235, 102, 40], [236, 103, 38], [237, 105, 37], [238, 106, 36], [239, 108, 35], [239, 110, 33], [240, 111, 32], [241, 113, 31], [241, 115, 29], [242, 116, 28], [243, 118, 27], [243, 120, 25], [244, 121, 24], [245, 123, 23], [245, 125, 21], [246, 126, 20], [246, 128, 19], [247, 130, 18], [247, 132, 16], [248, 133, 15], [248, 135, 14], [248, 137, 12], [249, 139, 11], [249, 140, 10], [249, 142, 9], [250, 144, 8], [250, 146, 7], [250, 148, 7], [251, 150, 6], [251, 151, 6], [251, 153, 6], [251, 155, 6], [251, 157, 7], [252, 159, 7], [252, 161, 8], [252, 163, 9], [252, 165, 10], [252, 166, 12], [252, 168, 13], [252, 170, 15], [252, 172, 17], [252, 174, 18], [252, 176, 20], [252, 178, 22], [252, 180, 24], [251, 182, 26], [251, 184, 29], [251, 186, 31], [251, 188, 33], [251, 190, 35], [250, 192, 38], [250, 194, 40], [250, 196, 42], [250, 198, 45], [249, 199, 47], [249, 201, 50], [249, 203, 53], [248, 205, 55], [248, 207, 58], [247, 209, 61], [247, 211, 64], [246, 213, 67], [246, 215, 70], [245, 217, 73], [245, 219, 76], [244, 221, 79], [244, 223, 83], [244, 225, 86], [243, 227, 90], [243, 229, 93], [242, 230, 97], [242, 232, 101], [242, 234, 105], [241, 236, 109], [241, 237, 113], [241, 239, 117], [241, 241, 121], [242, 242, 125], [242, 244, 130], [243, 245, 134], [243, 246, 138], [244, 248, 142], [245, 249, 146], [246, 250, 150], [248, 251, 154], [249, 252, 157], [250, 253, 161], [252, 255, 164]];


function colorscheme_inferno(frac) {
	var idx = Math.min(Math.max(Math.round(frac * 256), 0), 255);
	return inferno_palette[idx];

}


function fractionColor(frac) {
	return rgbtohex.apply(null, colorscheme_inferno(frac));
}

var body = document.body;
var minFraction = 0;
var maxFraction = 0;

window.timeReports.forEach(function(report) {
	if (report.active_days === 0) {
		return;
	}
	maxFraction = Math.max(maxFraction, report.max_value / report.active_days);
});

var content = E('div');

var tickText, tick;
var timeScale = E('div.time-scale');
var i, min;
for (min = 0; min <= 1440; min += 5) {
	tickText = undefined;
	if (min % 180 === 0 && min !== 0 && min !== 1440) {
		tickText = (min / 60) + ':00';
	}

	var tickCls = 'tick tick-1';
	if (min % 15 === 0) {
		tickCls = 'tick tick-2';
	}
	if (min % 30 === 0) {
		tickCls = 'tick tick-3';
	}
	if (min % 60 === 0) {
		tickCls = 'tick tick-4';
	}

	if (tickText === undefined) {
		tick = E('span', {'class': tickCls});
	}
	else {
		tick = E('span', {'class': tickCls}, E('span', tickText));
	}
	var position = 100 * min / 1440;
	tick.style.left = position + '%';
	if (position > 50) {
		tick.style.marginLeft = '-1px';
	}
	timeScale.appendChild(tick);
}

content.appendChild(E('div.row', E('div.title'), E('div.value', timeScale)));


window.timeReports.forEach(function(report) {
	var workBar = E('div.work-bar');
	var colorPalette = [];

	report.minutes.forEach(function(val, min) {
		colorPalette.push(fractionColor(val/report.active_days/maxFraction) + ' ' + (100 * min / 1440) + '%');
	});
	workBar.style.background = 'linear-gradient(90deg, ' + colorPalette.join(', ') + ')';
	workBar.dataset.hoverTimeFormat = '%s';

	content.appendChild(E('div.row', E('div.title', report.label), E('div.value', workBar)));
});


var workScale = E('div.work-scale', E('div.label.start', '0%'), E('div.label.end', Math.ceil(100 * maxFraction) + '%'));
var colorPalette = [];
for (i = 0; i <= 100; ++i) {
	colorPalette.push(fractionColor(i/100) + ' ' + i + '%');
}
workScale.style.background = 'linear-gradient(90deg, ' + colorPalette.join(', ') + ')';

content.appendChild(E('div.row', E('div.title'), E('div.value', workScale)));

var dayLength = 60*60*24;
var currentDay = new Date(window.daily.end_date + 'T00:00:00.000Z');
var dateScale = E('div.date-scale');
var daily = E('div.daily');


function zPad(n, width) {
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


window.daily.records.forEach(function(dayData, day) {
	var gradient = [];
	gradient.push(fractionColor(0) + ' 0%');
	dayData.forEach(function(record) {
		var start = 100 * (record[0] / dayLength);
		var end = 100 * ((record[0] + record[1]) / dayLength);
		gradient.push(fractionColor(0) + ' ' + (start-0.0001)+'%');
		gradient.push(fractionColor(1) + ' ' + (start)+'%');
		gradient.push(fractionColor(1) + ' ' + (end-0.0001)+'%');
		gradient.push(fractionColor(0) + ' ' + (end)+'%');
	});
	gradient.push(fractionColor(0) + ' 100%');

	var dailyBar = E('div.daily-bar');
	dailyBar.style.background = 'linear-gradient(90deg, ' + gradient.join(', ') + ')';
	dailyBar.dataset.hoverTimeFormat = currentDay.getUTCFullYear() + '-' + zPad(currentDay.getUTCMonth()+1, 2) + '-' + zPad(currentDay.getUTCDate(), 2) + ' %s';
	daily.appendChild(dailyBar);

	var tickCls = 'tick tick-1';
	if (currentDay.getUTCDay() === 0) {
		tickCls = 'tick tick-2';
	}
	if (currentDay.getUTCDate() === 1) {
		tickCls = 'tick tick-3';
	}
	var tick = E('span', {'class': tickCls});
	dateScale.appendChild(tick);

	currentDay = new Date(currentDay.getTime() - 24*60*60*1000);
});


content.appendChild(E('div.row.by-day', E('div.title', dateScale), E('div.value', daily)));

var tooltipContent;
var tooltip = E('div.tooltip.hidden', tooltipContent=E('div.tooltip-content'));
var tooltipText = document.createTextNode('');
tooltipContent.appendChild(tooltipText);

body.appendChild(content);
body.appendChild(tooltip);

function onMouseMove(e) {
	var timeFormat;
	var target = e.target;
	if (target === tooltip || target === tooltipContent) {
		return;
	}
	if (target && target.dataset) {
		timeFormat = target.dataset.hoverTimeFormat;
	}
	tooltip.classList.toggle('hidden', timeFormat === undefined);
	if (timeFormat !== undefined) {
		var position = Math.max(Math.min((e.pageX - target.offsetLeft) / target.offsetWidth, 1), 0);
		var minute = Math.round(1440 * position);
		var hour = Math.floor(minute / 60);
		minute = minute - hour * 60;
		var time = zPad(hour, 2) + ':' + zPad(minute, 2);

		tooltipText.nodeValue = timeFormat.replace('%s', time);
		tooltip.style.transform = 'translate('+e.clientX+'px, '+(e.clientY-tooltip.offsetHeight)+'px)';
	}
}

window.addEventListener('mousemove', onMouseMove, true);

}());
