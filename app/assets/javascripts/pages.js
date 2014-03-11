// ***************
// Variables
// ***************

var base;

var maxScroll;
var scrollTop;
var deltaY = 0;

var map 					= [];
var currentIndex 	= 0;




// ***************
// Events
// ***************


$('.pages.index').ready(function() {
	base = $('.pages.index');
	
	setupScroll();
	
	$(document).on('scroll', function(e) {
		doScrolling();
	});
	
	$(window).on('resize', function() {
		setupScroll();
	});
	
	$(base).on('scrollEnd', function() {
		doScrollEnd();
	});
	
	
});

// ***************
// Functions
// ***************

function setupScroll() {
	
	// Create the scroller map (also sets maxScroll)
	createMap();

	// Set the body size
	$('body').css('height', maxScroll + $(document).height() + 10 +'px');
	
	// Set current scroll
	scrollTop = $(document).scrollTop();
	
	// Setup scroll bar
	// TODO
	
}

function doScrolling() {	
	
	// Update scroll data
	updateScrollData();
	
	// Update the font-size (for parallax)
	updateParallax();
	
	// Check the map to make sure we're on the right path 
	checkMap();

	// Update scroll
	updateScroll();
	
	// Update the scrollbar
	updateScrollbar();
	
}

function doScrollEnd() {
	
	// Setup end scrolling
	$(base).find('.custom-scroll').addClass('end-scroll');
	
	// Drop the scroller
	$(base).find('.scrollbar .current').css('top', $(document).height() + 'px');
	
	// Get height
	var distance = parseInt($(base).find('.social').css('bottom').replace("px", ""));
	
	setTimeout(function() {
		
		// Move up the scroll area
		$(base).find('.scroll-content').css('top', $(base).find('.scroll-content').position().top + distance + "px");

		// Move up the social area
		$(base).find('.social').css('bottom', "0px");
		
	},1100);
	
}

function undoScrollEnd() {
	
}

function createMap() {
	// Create the map
	var scrollPos = 0;
	var currentScrollPos;
	var dir;
	var currenty = -$(base).find('.scroll-content').position().top;
	var currentx = -$(base).find('.scroll-content').position().left;
	$(base).find('.scroll-content hr').each(function() {
		currentScrollPos = scrollPos;
		if ($(this).hasClass('y')) {
			dir 			= "y";
			scrollPos += Math.abs($(this).next('.element').position().top - currenty);
			currenty 	+= $(this).next('.element').position().top;
		} else if ($(this).hasClass('x')) {
			var prev;
			var next;
			if ($(this).next('.element').position().left > $(this).prev('.element').position().left) {
				dir = "right";
				prev = $(this).prev('.element');
				next = $(this).next('.element');
			} else {
				dir = "left";
				prev = $(this).next('.element');
				next = $(this).prev('.element');
			}
			var nextx	= (($(prev).position().left + ($(next).position().left + $(next).outerWidth()))/2) - ($(document).width()/2);
			scrollPos += Math.abs(currentx - nextx);
			currentx 	+= nextx;
		}
		mapObj = {
			min: currentScrollPos,
			max: scrollPos,
			dir: dir
		}
		map.push(mapObj);
	});
	
	// Set the maxScroll
	maxScroll = scrollPos;
}

function checkMap() {
	// Check for min 
	if (scrollTop < map[currentIndex]['min']) {
		$(document).scrollTop(map[currentIndex]['min'] - 1);
		currentIndex -= 1;
		if (currentIndex < 0) {
			currentIndex = 0;
		}
	}
	// Check for max
	if (scrollTop > map[currentIndex]['max']) {
		$(document).scrollTop(map[currentIndex]['max'] + 1);
		currentIndex += 1;
		if (currentIndex > (map.length-1)) {
			currentIndex = map.length-1;
			$(base).trigger('scrollEnd');
		}
	}
}

function updateScroll() {
	if (map[currentIndex]['dir'] == 'y') {
		$(base).find('.scroll-content').css('top', ($(base).find('.scroll-content').position().top - deltaY)+"px");
	} else if (map[currentIndex]['dir'] == 'right') {
		$(base).find('.scroll-content').css('left', ($(base).find('.scroll-content').position().left - deltaY)+"px");
	} else if (map[currentIndex]['dir'] == 'left') {
		$(base).find('.scroll-content').css('left', ($(base).find('.scroll-content').position().left + deltaY)+"px");
	}
}

function updateParallax() {
	// Calculate our factor, setting it as the root `font-size`.
	// Our factor is calculated by multiplying the ratio of the page scrolled by our base factor. The higher the base factor, the larger the parallax effect.
  $('html').css({ fontSize: (scrollTop / maxScroll) * 50 });
}

function updateScrollbar() {
	$(base).find('.scrollbar .current').css({
		'-webkit-transform': 'rotate('+scrollTop+'deg)',
	     '-moz-transform': 'rotate('+scrollTop+'deg)', 
	      '-ms-transform': 'rotate('+scrollTop+'deg)', 
	       '-o-transform': 'rotate('+scrollTop+'deg)',
	          'transform': 'rotate('+scrollTop+'deg)',
	});
	if (map[currentIndex]['dir'] == 'right') {
		$(base).find('.scrollbar .current').css('left', $(base).find('.scrollbar .current').position().left - (deltaY/1000) + "px");
	} else if (map[currentIndex]['dir'] == 'left') {
		$(base).find('.scrollbar .current').css('left', $(base).find('.scrollbar .current').position().left + (deltaY/1000) + "px");
	}
}



function setMaxScroll() {
	// Calculate the maximum scroll position
  maxScroll = $('body')[0].scrollHeight;
}

function updateScrollData() {
	// Update scrolling variables
	deltaY 		= $(document).scrollTop() - scrollTop;
	scrollTop = $(document).scrollTop();
}

