// ***************
// Variables
// ***************

var base;

var scrollEventPrevented = false;

var maxScroll;

var scrollTop;
var deltaY = 0;

var map 					= [];
var currentIndex 	= 0;


var yfixed = false;
var xfixed = false;
var minScrollTop;
var maxScrollTop;
var minScrollLeft;
var maxScrollLeft;
var xScrollDirection;



// ***************
// Events
// ***************


$('.pages.index').ready(function() {
	base = $('.pages.index');
	
	setupScroll();
	
	$(document).on('scroll', function(e) {
		doScrolling();
	});
	
	// $(window).on('resize', function() {
	// 	setupBoard();
	// });

	
	
	// $(base).find('.links').on('scrollstart', function(e) {
	// 	isScrolling(base, e);
	// });
	
	
});

// ***************
// Functions
// ***************

function setupScroll() {
	
	// Create the map
	var scrollPos = 0;
	var currentScrollPos;
	var dir;
	$('.scroll-content hr').each(function() {
		currentScrollPos = scrollPos;
		if ($(this).hasClass('y')) {
			scrollPos += Math.abs($(this).next('.element').position().top - $(this).prev('.element').position().top);
			dir = "y";
		} else if ($(this).hasClass('x')) {
			scrollPos += Math.abs($(this).next('.element').position().left - $(this).prev('.element').position().left);
			if ($(this).next('.element').position().left > $(this).prev('.element').position().left) {
				dir = "right";
			} else {
				dir = "left";
			}
		}
		mapObj = {
			min: currentScrollPos,
			max: scrollPos,
			dir: dir
		}
		map.push(mapObj);
	});
	
	// Set the body size
	var height = $(document).height() + scrollPos;
	$('body').css('height', height+'px');
	
	
	// Set current scroll
	scrollTop = $(document).scrollTop();
	
	// Set the max scroll
	setMaxScroll();
	
	
	
	
	// // Setup the board
	// setupBoard();
	// 
	// 
	// // Set current scrollTop and scrollLeft
	// scrollTop 	= $(base).find('.scroll-content').scrollTop();
	// scrollLeft 	= $(base).find('.scroll-content').scrollLeft();

	// 
	// // Set initial fixed settings
	// updateFixed();
	// 
	// // Setup the current scroller
	// $(base).find('.scrollbar .current').css({
	// 	'left': '5%',
	// 	'top': '10%'
	// });
	
}

function doScrolling() {	
	
	// // Update scroll data
	updateScrollData();

	
	// Check for min or max
	if (scrollTop < map[currentIndex]['min']) {
		currentIndex -= 1;
		if (currentIndex < 0) {
			currentIndex = 0;
		}
	}
	if (scrollTop > map[currentIndex]['max']) {
		currentIndex += 1;
		if (currentIndex > (map.length-1)) {
			currentIndex = map.length-1;
		}
	}
	
	if (map[currentIndex]['dir'] == 'y') {
		$(base).find('.scroll-content').css('top', ($(base).find('.scroll-content').position().top - deltaY)+"px");
	} else if (map[currentIndex]['dir'] == 'right') {
		$(base).find('.scroll-content').css('left', ($(base).find('.scroll-content').position().left - deltaY)+"px");
	} else if (map[currentIndex]['dir'] == 'left') {
		$(base).find('.scroll-content').css('left', ($(base).find('.scroll-content').position().left + deltaY)+"px");
	}

	
	// Update the font-size (for parallax)
	updateParallax();
	
	
	// Update the scrollbar
	// updateScrollbar();
	
	
	

	// 
	// // Update scroll
	// updateScroll();
	// 
	// // Listen for maxScrolls
	// listenFixChange();
	// 
	// 
	// // Set the fixed variables
	// // setFixed(base);
	// // Fix(ed position scroll) either x or y if necessary
	// // fixScroll(base);
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

function updateParallax() {
	// Calculate our factor, setting it as the root `font-size`.
	// Our factor is calculated by multiplying the ratio of the page scrolled by our base factor. The higher the base factor, the larger the parallax effect.
  $('html').css({ fontSize: (scrollTop / maxScroll) * 50 });
}

function updateScrollbar() {
	var scrollArea = $(base).find('.scroll-content');
	
	var left = ($(scrollArea).scrollTop() * $(base).find('.scrollbar').width()) / ($(scrollArea)[0].scrollHeight - $(scrollArea).outerHeight());
	
	// Calculate the y precentage scrolled
	var percent = ($(scrollArea).scrollTop() / ($(scrollArea)[0].scrollHeight - $(scrollArea).outerHeight())) * 100;
	$(base).find('.scrollbar .current').css('left', percent+"%");
	
	// Calculate the x precentage scrolled
	var percent = ($(scrollArea).scrollLeft() / ($(scrollArea)[0].scrollWidth - $(scrollArea).outerWidth())) * 100;
	// $(base).find('.scrollbar .current').css('bottom', percent+"%");
}

function updateScroll() {
	var scrollArea 	= $(base).find('.scroll-content');
	
	if (yfixed && (scrollDX != scrollDY*2)) {
		if (xScrollDirection == "right") {
			$(scrollArea).scrollLeft($(scrollArea).scrollLeft() + scrollDY*2);
		} else if (xScrollDirection == "left") {
			$(scrollArea).scrollLeft($(scrollArea).scrollLeft() - scrollDY*2);
		}
		
	}
}

function listenFixChange() {
	var scrollArea 	= $(base).find('.scroll-content');
	
	if (yfixed) {
		if ($(scrollArea).scrollLeft() < minScrollLeft) {
			$(scrollArea).scrollLeft(minScrollLeft);
			updateFixed(base);
		}
		if (($(scrollArea).scrollLeft() > maxScrollLeft)) {
			$(scrollArea).scrollLeft(maxScrollLeft);
			updateFixed(base);
		}
	}
	if (xfixed) {
		if ($(scrollArea).scrollTop() < minScrollTop) {
			$(scrollArea).scrollTop(minScrollTop);
			updateFixed(base);
		}
		if (($(scrollArea).scrollTop() > maxScrollTop)) {
			$(scrollArea).scrollTop(maxScrollTop);
			updateFixed(base);
		}
	}
}

function updateFixed() {
	var scrollArea 	= $(base).find('.scroll-content');
	
	console.log(scrollDY);
	
	// Get visible elements
	var visible = getVisibleElements(scrollArea);
	var current = $(visible[0]);
	var next 		= (scrollDY >= 0) ? $(current).next('.element') : $(current).prev('.element');

	// if should scroll y
	if (shouldScrollY(scrollArea, next)) {
		console.log("scroll y");
		// lock x scroll
		yfixed = false;
		xfixed = true;
		// find max and min scroll top
		if ($(current).position().top < $(next).position().top) {
			minScrollTop = $(current).position().top;
			maxScrollTop = $(next).position().top;
		} else {
			minScrollTop = $(next).position().top;
			maxScrollTop = $(current).position().top;
		}

	// if should scroll x
	} else {
		console.log("scroll x");
		// lock y scroll
		yfixed = true;
		xfixed = false;
		// find max and min scroll left
		var average = (($(current).position().left + ($(next).position().left + $(next).outerWidth()))/2) - ($(scrollArea).outerWidth()/2);
		if ($(current).position().left < $(next).position().left) {
			xScrollDirection = "right";
			minScrollLeft = $(scrollArea).scrollLeft();
			maxScrollLeft = average;
		} else {
			xScrollDirection = "left";
			minScrollLeft = average;
			maxScrollLeft = $(scrollArea).scrollLeft();
		}
	}
	
	// Fix the scroll direction
	fixScroll(scrollArea);
	
}

function getVisibleElements(scrollArea) {
	var visible 		= [];
	$(base).find('.element').each(function() {
		var element = this;
		if (($(element).position().top >= $(scrollArea).scrollTop()) && 
		(($(element).position().top + $(element).outerHeight()) <= ($(scrollArea).scrollTop() + $(scrollArea).outerHeight())) && 
		($(element).position().left >= $(scrollArea).scrollLeft()) &&
		(($(element).position().left + $(element).outerWidth()) <= ($(scrollArea).scrollLeft() + $(scrollArea).outerWidth()))) {
			visible.push(this);
		}
	});
	return visible;
}

function shouldScrollY(scrollArea, element) {
	return (($(element).position().left >= $(scrollArea).scrollLeft()) &&
	(($(element).position().left + $(element).outerWidth()) <= ($(scrollArea).scrollLeft() + $(scrollArea).outerWidth())));
}

function shouldScrollX(scrollArea, element) {
	return (!shouldScrollY(scrollArea, element) && (($(element).position().top >= $(scrollArea).scrollTop()) && 
	(($(element).position().top + $(element).outerHeight()) <= ($(scrollArea).scrollTop() + $(scrollArea).outerHeight()))));
}


// function setFixed(base) {
// 	var position = $(base).find('.scrollbar .current').position().top;	
// 	var current = null;
// 	var next 		= $(base).find('.scrollbar hr:first');
// 	while (current == null) {
// 		// This is the current segment
// 		if (position < ($(next).position().top + $(next).height() - ($(base).find('.scrollbar .current').height()/2))) {
// 			current = next;
// 		// Go to next
// 		} else {
// 			next = $(next).nextAll('hr:first');
// 			if (next.length == 0) {
// 				current = $(base).find('.scrollbar hr:last');
// 			}
// 		}
// 	}
// 	
// 	// Set the fixed values
// 	if (current.length > 0) {
// 		if ($(current).hasClass('y')) {
// 			yfixed = false;
// 			xfixed = true;
// 		} else if ($(current).hasClass('x')) {
// 			yfixed = true;
// 			xfixed = false;
// 		}
// 	}
// }

function fixScroll(scrollArea) {
	if (yfixed) {
		$(scrollArea).css({
			"overflow-y": "hidden",
			// "overflow-x": "scroll"
		});
	}
	if (xfixed) {
		$(scrollArea).css({
			"overflow-y": "scroll",
			// "overflow-x": "hidden"
		});
	}
}
