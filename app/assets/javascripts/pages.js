// ***************
// Variables
// ***************

var startPoint;

// ***************
// Events
// ***************


$('.pages.index').ready(function() {
	
	initializeDots();
	
	$('.dot').on('vmousedown', function(e) {
		startDrag($(this), {x: e.clientX, y: e.clientY});
	});
	
	$('.dot').on('dblclick', function(e) {
		e.preventDefault();
		followLink($(this));
	});
	
});

// ***************
// Functions
// ***************

function initializeDots() {
	
	var h = $(window).height();
	var w = $(window).width();
	
	
	for (i=0; i<5; i++) {
		var dot = {};
		
		dot.position = {
			left: getRandomInt(100, w-100),
			top: getRandomInt(100, h-100)
		};
		
		dot.diameter = getRandomInt(50, 100);
		
		dot.rgba = {
			r: getRandomInt(100, 255),
			g: getRandomInt(100, 255),
			b: getRandomInt(100, 255),
			a: 1.0
		};
		
		drawDot(dot);
	}
	
}

function drawDot(dotData) {
	$('body').prepend('<div class="dot"></div>');
	
	var $_this = $('.dot').first();
	
	$_this.css({
		top: dotData.position.top,
		left: dotData.position.left,
		height: dotData.diameter,
		width: dotData.diameter,
		background: 'rgba('+dotData.rgba.r+','+dotData.rgba.g+','+dotData.rgba.b+','+dotData.rgba.a+')',
	});
}

function startDrag($dot, startPoint) {
	$dot.addClass('up');
	
	$(document).on('vmousemove', function(e) {
		e.preventDefault();
		var dX = e.clientX - startPoint.x;
		var dY = e.clientY - startPoint.y;

		$dot.css({
			left: parseFloat($dot.css('left').replace('px', '')) + dX + 'px',
			top: parseFloat($dot.css('top').replace('px', '')) + dY + 'px',
		});
		
		startPoint = {
			x: e.clientX,
			y: e.clientY
		};
	});
	
	$(document).on('vmouseup', function() {
		stopDrag($dot);
	});
}


function stopDrag($dot) {
	$dot.removeClass('up');
	
	$(document).off('vmousemove vmouseup');
}

function followLink($dot) {
	$dot.addClass('grow');
	
	setTimeout(function() {
		$('body').css('background-color', $dot.css('background-color'));
		$('.dot').hide();
	},500);
}


