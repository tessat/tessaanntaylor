var KatieDots = function($){
  var _this = this;

  // Called on instantiation
  function _init(){
    return new BasicDots($, generateDotData);
  }

  // Application methods
  
  var generateDotData = function() {
    var dotData = [];
    var count = parseInt(($(window).height() + $(window).width())/75);

  	// Create and draw dots
  	for (var i=0; i<count; i++) {
  		var dot = {};

  		dot.iD = "dot"+i;

  		dot.diameter = getRandomInt(20, 100);

  		dot.rgb = {
  			r: getRandomInt(0, 150),
  			g: getRandomInt(150, 255),
  			b: getRandomInt(0, 150)
  		};
  		
  		dotData.push(dot);
  	}
  	return dotData;
  };
  

  /* ************************************************************************** */
  /* At the end of App instantiation, call the init function of the App object. */
  /* ************************************************************************** */
  _init.call(this);
};


