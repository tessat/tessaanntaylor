// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery_ujs
//= require turbolinks
//= require_tree .


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

jQuery.event.special.dblclick = {
	setup: function(data, namespaces) {
		var elem 	= this,
				$elem = jQuery(elem);
		$elem.bind('vmouseup.dblclick', jQuery.event.special.dblclick.handler);
	},

	teardown: function(namespaces) {
		var elem 	= this,
				$elem = jQuery(elem);
		$elem.unbind('vmouseup.dblclick');
	},

	handler: function(event) {
		var elem 			= event.target,
				$elem 		= jQuery(elem),
				lastTouch = $elem.data('lastTouch') || 0,
				now 			= new Date().getTime();

		var delta = now - lastTouch;
		if (delta > 20 && delta<500) {
			$elem.data('lastTouch', 0);
			$elem.trigger('dblclick');
		} else {
			$elem.data('lastTouch', now);
		}
	}
};