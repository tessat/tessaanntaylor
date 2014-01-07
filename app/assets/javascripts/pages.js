



// ***************
// Variables
// ***************

var scrollTop;
var inter;

var maxScroll;

var yfixed = false;
var xfixed = false;
var minScrollTop;
var maxScrollTop;
var minScrollLeft;
var maxScrollLeft;

// ***************
// Events
// ***************


$('.pages.index').ready(function() {
	var base = $('.pages.index');
	
	setupScroll(base);
	
	
	$(base).find('.scroll-content').on('scroll', function(e) {
		doScrolling(base);
	});
	
	$(window).on('resize', function() {
		setupBoard(base);
	});
	
	
	
	// $(base).find('.links').on('scrollstart', function(e) {
	// 	isScrolling(base, e);
	// });
	
	
});

// ***************
// Functions
// ***************

function setupScroll(base) {
	// Setup the board
	setupBoard(base);
	// Start scroll at center
	$(base).find('.scroll-content').scrollLeft($(base).find('.scroll-content')[0].scrollWidth/4);
	
	// Set the max scroll
	setMaxScroll(base);
	
	// Set initial fixed settings
	updateFixed(base);
	
	// Setup the path
	var offset = 50;
	$(base).find('.scrollbar hr').each(function() {
		if ($(this).hasClass('y')) {
			$(this).css('width', $(this).attr('data-l')+"%");
			$(this).css('top', offset+"%");
		} else if ($(this).hasClass('x')) {
			$(this).css('height', $(this).attr('data-l')+"%");
			if ($(this).hasClass('r')) {
				offset -= parseInt($(this).attr('data-l'))-3;
				$(this).css('top', offset+"%");
			} else if ($(this).hasClass('l')) {
				$(this).css('top', offset+"%");
				offset += parseInt($(this).attr('data-l'))-4;
			}
		}
	});
	
	// Setup the current scroller
	$(base).find('.scrollbar .current').css({
		'left': '5%',
		'top': '10%'
	});
	
}

function isScrolling(base, e) {
	inter = setInterval(function() {
		if ($(base).find('.links').scrollTop() == scrollTop) {
			clearInterval(inter);
		}
		console.log($('.links').scrollTop());
		
		scrollTop = $(base).find('.links').scrollTop();
	}, 50);
}

function doScrolling(base) {
	// Update the font-size (for parallax)
	updateParallax(base);
	// Update the scrollbar
	updateScrollbar(base);
	// Listen for maxScrolls
	listenFixChange(base);
	
	
	// Set the fixed variables
	// setFixed(base);
	// Fix(ed position scroll) either x or y if necessary
	// fixScroll(base);
}

function setupBoard(base) {
	// Setup the board width
	$(base).find('.scroll-content .board').width($(window).width()*2);
}

function setMaxScroll(base) {
	// Calculate the maximum scroll position
  maxScroll = $(base).find('.scroll-content')[0].scrollHeight;
}

function updateParallax(base) {
	// Grab scroll position
  var scrolled = $(base).find('.scroll-content').scrollTop();

  /**
   * Calculate our factor, setting it as the root `font-size`.
   *
   * Our factor is calculated by multiplying the ratio of the page scrolled by our base factor. The higher the base factor, the larger the parallax effect.
   */
  $('html').css({ fontSize: (scrolled / maxScroll) * 50 });
}

function updateScrollbar(base) {
	var scrollArea = $(base).find('.scroll-content');
	
	var left = ($(scrollArea).scrollTop() * $(base).find('.scrollbar').width()) / ($(scrollArea)[0].scrollHeight - $(scrollArea).outerHeight());
	
	// Calculate the y precentage scrolled
	var percent = ($(scrollArea).scrollTop() / ($(scrollArea)[0].scrollHeight - $(scrollArea).outerHeight())) * 100;
	$(base).find('.scrollbar .current').css('left', percent+"%");
	
	// Calculate the x precentage scrolled
	var percent = ($(scrollArea).scrollLeft() / ($(scrollArea)[0].scrollWidth - $(scrollArea).outerWidth())) * 100;
	// $(base).find('.scrollbar .current').css('bottom', percent+"%");
}

function listenFixChange(base) {
	var scrollArea 	= $(base).find('.scroll-content');
	
	console.log(maxScrollTop);
	
	if (yfixed) {
		if ($(scrollArea).scrollLeft() < minScrollLeft) {
			console.log("lmin!");
			$(scrollArea).scrollLeft(minScrollLeft);
			updateFixed(base);
		}
		if (($(scrollArea).scrollLeft() > maxScrollLeft)) {
			console.log("lmax!");
			$(scrollArea).scrollLeft(maxScrollLeft);
			updateFixed(base);
		}
	}
	if (xfixed) {
		if ($(scrollArea).scrollTop() < minScrollTop) {
			console.log("ymin!");
			$(scrollArea).scrollTop(minScrollTop);
			updateFixed(base);
		}
		if (($(scrollArea).scrollTop() > maxScrollTop)) {
			console.log("ymax!");
			$(scrollArea).scrollTop(maxScrollTop);
			updateFixed(base);
		}
	}
}

function updateFixed(base) {
	var scrollArea 	= $(base).find('.scroll-content');
	
	// Get visible elements
	var visible = getVisibleElements(base, scrollArea);
	var current = $(visible[0]);
	var next 		= $(current).next('.element');

	// if can scroll y
	if (shouldScrollY(scrollArea, next)) {
		// lock x plane
		yfixed = false;
		xfixed = true;
		// find max and min scroll top
		minScrollTop = $(current).position().top;
		maxScrollTop = $(next).position().top;
	}
	
	// if can scroll x
	if (shouldScrollX(scrollArea, next)) {
		// lock y plane
		yfixed = true;
		xfixed = false;
		// find max and min scroll left
		minScrollLeft = $(current).position().left;
		maxScrollLeft = $(next).position().left + $(next).outerWidth();
	}
	
	// Fix the scroll direction
	fixScroll(scrollArea);
	
}

function getVisibleElements(base, scrollArea) {
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
	return (($(element).position().top >= $(scrollArea).scrollTop()) && 
	(($(element).position().top + $(element).outerHeight()) <= ($(scrollArea).scrollTop() + $(scrollArea).outerHeight())));
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
