// ***************
// Variables
// ***************

var base;

var maxScroll;

var scrollTop;
var deltaY = 0;

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
	
	$(base).find('.scroll-content').on('scroll', function(e) {
		doScrolling();
	});
	
	$(window).on('resize', function() {
		setupBoard();
	});
	
	
	
	// $(base).find('.links').on('scrollstart', function(e) {
	// 	isScrolling(base, e);
	// });
	
	
});

// ***************
// Functions
// ***************

function setupScroll() {
	// Setup the board
	setupBoard();
	
	// Start scroll at center
	$(base).find('.scroll-content').scrollLeft($(base).find('.scroll-content')[0].scrollWidth/4);
	
	// Set current scrollTop
	scrollTop = $(base).find('.scroll-content').scrollTop();
	
	// Set the max scroll
	setMaxScroll();
	
	// Set initial fixed settings
	updateFixed();
	
	// Setup the current scroller
	$(base).find('.scrollbar .current').css({
		'left': '5%',
		'top': '10%'
	});
	
}

function doScrolling() {
	// Update scroll data
	updateScrollData();
	
	// Update the font-size (for parallax)
	updateParallax();
	
	// Update the scrollbar
	updateScrollbar();
	
	// Update scroll
	updateScroll();
	
	// Listen for maxScrolls
	listenFixChange();
	
	
	// Set the fixed variables
	// setFixed(base);
	// Fix(ed position scroll) either x or y if necessary
	// fixScroll(base);
}

function setupBoard() {
	// Setup the board width
	$(base).find('.scroll-content .board').width($(window).width()*2);
}

function setMaxScroll() {
	// Calculate the maximum scroll position
  maxScroll = $(base).find('.scroll-content')[0].scrollHeight;
}

function updateScrollData() {
	if (Math.abs($(base).find('.scroll-content').scrollTop() - scrollTop) != deltaY) {
		deltaY = $(base).find('.scroll-content').scrollTop() - scrollTop;
		scrollTop = $(base).find('.scroll-content').scrollTop();
	}
}

function updateParallax() {
	// Grab scroll position
  var scrolled = $(base).find('.scroll-content').scrollTop();

  /**
   * Calculate our factor, setting it as the root `font-size`.
   *
   * Our factor is calculated by multiplying the ratio of the page scrolled by our base factor. The higher the base factor, the larger the parallax effect.
   */
  $('html').css({ fontSize: (scrolled / maxScroll) * 50 });
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
	
	if (yfixed) {
		if (xScrollDirection == "right") {
			console.log(deltaY);
			$(scrollArea).scrollLeft($(scrollArea).scrollLeft() + deltaY*1);
		} else if (xScrollDirection == "left") {
			$(scrollArea).scrollLeft($(scrollArea).scrollLeft() - deltaY*1);
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
	
	console.log(deltaY);
	
	// Get visible elements
	var visible = getVisibleElements(scrollArea);
	var current = $(visible[0]);
	var next 		= (deltaY >= 0) ? $(current).next('.element') : $(current).prev('.element');

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
			"overflow-x": "scroll"
		});
	}
	if (xfixed) {
		$(scrollArea).css({
			"overflow-y": "scroll",
			"overflow-x": "hidden"
		});
	}
}
