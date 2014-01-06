



// ***************
// Variables
// ***************

var scrollTop;
var inter;

var maxScroll;

var yfixed = false;
var xfixed = false;

// ***************
// Events
// ***************


$('.pages.index').ready(function() {
	var base = $('.pages.index');
	
	setupScroll(base);
	
	
	$(base).find('.links').on('scroll', function(e) {
		doScrolling(base);
	});
	
	$(base).find('.links').on('resize', function() {
		setMaxScroll(base);
	});
	
	
	
	// $(base).find('.links').on('scrollstart', function(e) {
	// 	isScrolling(base, e);
	// });
	
	
});

// ***************
// Functions
// ***************

function setupScroll(base) {
	setMaxScroll(base);
	
	// Setup the "path"
	var offset = 0;
	$(base).find('.scrollbar hr').each(function() {
		if ($(this).hasClass('y')) {
			$(this).css('height', $(this).attr('data-l')+"%");
			$(this).css('left', offset+"%");
		} else if ($(this).hasClass('x')) {
			$(this).css('width', $(this).attr('data-l')+"%");
			if ($(this).attr('data-d') == "r") {
				$(this).css('left', offset+"%");
				offset += parseInt($(this).attr('data-l'))-4;
			} else if ($(this).attr('data-d') == "l") {
				offset -= parseInt($(this).attr('data-l'))-4;
				$(this).css('left', offset+"%");
			}
		}
	});
	
}

function isScrolling(base, e) {
	inter = setInterval(function() {
		if ($(base).find('.links').scrollTop() == scrollTop) {
			clearInterval(inter);
		}
		doScrolling(base);
		
		scrollTop = $(base).find('.links').scrollTop();
	}, 100);
}

function doScrolling(base) {
	// Update the font-size (for parallax)
	updateParallax(base);
	// Update the scrollbar
	updateScrollbar(base);
	// Set the fixed variables
	setFixed(base);
	// Fix(ed position scroll) either x or y if necessary
	fixScroll(base);
}

function setMaxScroll(base) {
	// Calculate the maximum scroll position
  maxScroll = $(base).find('.links').height();
}

function updateParallax(base) {
	// Grab scroll position
  var scrolled = $(base).find('.links').scrollTop();

  /**
   * Calculate our factor, setting it as the root `font-size`.
   *
   * Our factor is calculated by multiplying the ratio of the page scrolled by our base factor. The higher the base factor, the larger the parallax effect.
   */
  $('html').css({ fontSize: (scrolled / maxScroll) * 50 });
}

function updateScrollbar(base) {
	// Calculate the y precentage scrolled
	var percent = ($(base).find('.links').scrollTop() / ($(base).find('.links')[0].scrollHeight - $(base).find('.links').outerHeight())) * 100;
	$(base).find('.scrollbar .current').css('top', percent+"%");
	
	// Calculate the x precentage scrolled
	var percent = ($(base).find('.links').scrollLeft() / ($(base).find('.links')[0].scrollWidth - $(base).find('.links').outerWidth())) * 100;
	$(base).find('.scrollbar .current').css('left', percent+"%");
}

function setFixed(base) {
	var position = $(base).find('.scrollbar .current').position().top;	
	var current = null;
	var next 		= $(base).find('.scrollbar hr:first');
	while (current == null) {
		// This is the current segment
		if (position < ($(next).position().top + $(next).height() - ($(base).find('.scrollbar .current').height()/2))) {
			current = next;
		// Go to next
		} else {
			next = $(next).nextAll('hr:first');
			if (next.length == 0) {
				current = $(base).find('.scrollbar hr:last');
			}
		}
	}
	// Set the fixed values
	if (current.length > 0) {
		console.log(current);
		if ($(current).hasClass('y') && (xfixed == false)) {
			yfixed = false;
			xfixed = $(base).find('.links').scrollLeft();
		} else if ($(current).hasClass('x') && (yfixed == false)) {
			yfixed = $(base).find('.links').scrollTop();
			xfixed = false;
		}
	}
}

function fixScroll(base) {
	if (yfixed) {
		$(base).find('.links').scrollTop(yfixed);
	}
	if (xfixed) {
		$(base).find('.links').scrollLeft(xfixed);
	}
}
