// ***************
// Variables
// ***************

var startPoint;
var inters = [];

// ***************
// Events
// ***************


$('.pages.index').ready(function() {
	
	initializeDots();
	
	$(window).on('resize orientationchange', function() {
		layoutDots();
	});
	
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
	
	var count = parseInt(($(window).height() + $(window).width())/75)

	// Create and draw dots
	for (i=0; i<count; i++) {
		var dot = {};
		
		dot.iD = "dot"+i;
		
		dot.diameter = getRandomInt(20, 100);
		
		dot.rgb = {
			r: getRandomInt(100, 255),
			g: getRandomInt(100, 255),
			b: getRandomInt(100, 255)
		};
		
		drawDot(dot);
	}
	
	// Layout dots
	layoutDots();
	
}

function drawDot(dotData) {
	$('body').prepend('<div id="'+dotData.iD+'" class="dot"></div>');
	
	var $dot = $('.dot').first();
	
	$dot.css({
		height: dotData.diameter,
		width: dotData.diameter,
		background: 'rgb('+dotData.rgb.r+','+dotData.rgb.g+','+dotData.rgb.b+')',
	});
}

function layoutDots() {
	var h = $(window).height();
	var w = $(window).width();
	
	$('.dot').each(function() {
		$dot = $(this);
		
		do {
			var top 	= getRandomInt(10, h-110);
			var left 	= getRandomInt(10, w-110);
			
			$dot.css({
				top: top,
				left: left,
			});
			
			var collided 	= findCollisions($dot);
			var isCollided = (collided.length > 0);
		} while (isCollided);
		
	});
	
}

function startDrag($dot, startPoint) {
	$dot.addClass('up');
	
	var collided 		= [];
	$(document).on('vmousemove', function(e) {
		e.preventDefault();
		
		
		// Move with drag
		
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
		
		
		// Manage collisions
		
		var oldCollided = collided;
		collided 		= findCollisions($dot);
		var union 	= arrayUnion(oldCollided, collided);
		for (i=0; i<union.length; i++) {
			// Collide 
			if ((oldCollided.indexOf(union[i]) == -1) && (collided.indexOf(union[i]) > -1)) {
				collide($dot, $('#'+union[i]));
			// Move collision
			} else if ((oldCollided.indexOf(union[i]) > -1) && (collided.indexOf(union[i]) > -1)) {
				moveCollision($dot, $('#'+union[i]));
			// Uncollide	
			} else if ((oldCollided.indexOf(union[i]) > -1) && (collided.indexOf(union[i]) == -1)) {
				uncollide($dot, $('#'+union[i]));
			}	
		}
	});
	
	$(document).on('vmouseup', function() {
		stopDrag($dot, collided);
	});
}


function stopDrag($dot, collided) {
	$dot.removeClass('up');
	$(document).off('vmousemove vmouseup');
	
	// Collision resolution
	for (i=0;i<collided.length;i++) {
		resolveColision($dot, $('#'+collided[i]));
	}
}

function findCollisions($dot) {
	$dot.addClass('checking');
	
	var midpoint = {
		x: $dot.position().left + ($dot.width()/2),
		y: $dot.position().top + ($dot.height()/2)
	};
	
	var collided = [];
	$('.dot:not(.checking)').each(function() {
		var minD = ($dot.width()/2) + ($(this).width()/2);
		var cMidpoint = {
			x: $(this).position().left + ($(this).width()/2),
			y: $(this).position().top + ($(this).height()/2)
		};
		var x = (midpoint.x - cMidpoint.x);
		var y = (midpoint.y - cMidpoint.y);
		var d = Math.sqrt((x*x)+(y*y));
		if (d < minD) {
			collided.push($(this).attr('id'));
		}
	});
	
	$dot.removeClass('checking');
	
	return collided;
}

function collide($originalDot, $collideDot) {
	var $overlap = $originalDot.find('.overlap[data-collided-with="'+$collideDot.attr('id')+'"]');
	if ($overlap.length == 0) {
		$originalDot.prepend('<div class="overlap" data-collided-with="'+$collideDot.attr('id')+'"></div>');
		$overlap = $originalDot.find('.overlap[data-collided-with="'+$collideDot.attr('id')+'"]');

		// Calculate background color 
		var rgb1 = $originalDot.css('background-color').match(/(?:rgb\()(.*?)(?:\))/)[1].split(", ");
		var rgb2 = $collideDot.css('background-color').match(/(?:rgb\()(.*?)(?:\))/)[1].split(", ");

		var r = parseInt((parseInt(rgb1[0]) + parseInt(rgb2[0]))/2);
		var g = parseInt((parseInt(rgb1[1]) + parseInt(rgb2[1]))/2);
		var b = parseInt((parseInt(rgb1[2]) + parseInt(rgb2[2]))/2);

		$overlap.css({
			backgroundColor: 'rgb('+r+','+g+','+b+')',
			height: $collideDot.css('height'),
			width: $collideDot.css('width'),
			boxShadow: '0px 0px 2px rgb('+r+','+g+','+b+')',
		});
		
		oscillateColor($overlap, 'rgb('+rgb1[0]+', '+rgb1[1]+', '+rgb1[2]+')', 'rgb('+rgb2[0]+', '+rgb2[1]+', '+rgb2[2]+')');
	}
	moveCollision($originalDot, $collideDot);
}

function moveCollision($originalDot, $collideDot) {
	var $overlap = $originalDot.find('.overlap[data-collided-with="'+$collideDot.attr('id')+'"]');
	if ($overlap.length == 0) {
		collide($originalDot, $collideDot);
		$overlap = $originalDot.find('.overlap[data-collided-with="'+$collideDot.attr('id')+'"]');
	}
	
	var top 	= parseFloat($collideDot.css('top').replace('px', '')) - parseFloat($originalDot.css('top').replace('px', ''));
	var left 	= parseFloat($collideDot.css('left').replace('px', '')) - parseFloat($originalDot.css('left').replace('px', ''));

	$overlap.css({
		top: top + 'px',
		left: left + 'px'
	});
}

function uncollide($originalDot, $collideDot) {
	$overlap = $originalDot.find('.overlap[data-collided-with="'+$collideDot.attr('id')+'"]');
	if ($overlap.length > 0) {
		$overlap.remove();
	}
}

function resolveColision($originalDot, $collideDot) {
	uncollide($originalDot, $collideDot);
	for(i=0;i<inters.length;i++) {
		clearInterval(inters[i]);
	}
	// Calculate background color 
	var rgb1 = $originalDot.css('background-color').match(/(?:rgb\()(.*?)(?:\))/)[1].split(", ");
	var rgb2 = $collideDot.css('background-color').match(/(?:rgb\()(.*?)(?:\))/)[1].split(", ");

	var r = parseInt((parseInt(rgb1[0]) + parseInt(rgb2[0]))/2);
	var g = parseInt((parseInt(rgb1[1]) + parseInt(rgb2[1]))/2);
	var b = parseInt((parseInt(rgb1[2]) + parseInt(rgb2[2]))/2);
	
	// Calculate size
	var diameter = (parseFloat($collideDot.css('width').replace('px', '')) + parseFloat($originalDot.css('width').replace('px', '')))/2;
	
	// Calculate position
	var top 	= (parseFloat($collideDot.css('top').replace('px', '')) + parseFloat($originalDot.css('top').replace('px', '')))/2;
	var left 	= (parseFloat($collideDot.css('left').replace('px', '')) + parseFloat($originalDot.css('left').replace('px', '')))/2;

	$originalDot.addClass('merging');
	$originalDot.addClass('od');
	$originalDot.css({
		backgroundColor: 'rgb('+r+','+g+','+b+')',
		height: diameter,
		width: diameter,
		top: top,
		left: left
	});
	$collideDot.addClass('merging');
	$collideDot.css({
		backgroundColor: 'rgb('+r+','+g+','+b+')',
		height: diameter,
		width: diameter,
		top: top,
		left: left
	});
	
	setTimeout(function() {
		$originalDot.removeClass('merging');
		$originalDot.removeClass('od');
		$collideDot.remove();
	},500);
}


function oscillateColor($overlap, rgb1, rgb2) {
	var inter = setInterval(function() {
		$overlap.css('background', rgb1);
		setTimeout(function() {
			$overlap.css('background-color', rgb2);
		},1000);
	},2000);
	inters.push(inter);
}

function followLink($dot) {
	$dot.addClass('grow');
	
	var diameter = ($(document).height() > $(document).width()) ? $(document).height() : $(document).width();
	diameter += (diameter/2);
	
	$dot.animate({
		width: diameter + "px",
		height: diameter + "px",
		left: 0 - (diameter/4) + "px",
		top: 0 - (diameter/4) + "px",
	}, 500, function() {
		$('body').css('background-color', $dot.css('background-color'));
		$('.dot').hide();
	});
}


