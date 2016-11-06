var Marquee = function($, onCompleted){
  var _this = this;
  
  // ***************
  // Variables
  // ***************

  var dotData = [];
  var inters  = [];
  var startPoint;
  

  // Called on instantiation
  function _init(){
    
    generatePlacement();
        
    $(window).on('resize orientationchange', function() {
     generatePlacement();
    });
  }

	
  // Application methods
  
  var generatePlacement = function() {
    // Clear lines
    $('.marquee').remove();
    
    var width = $(window).width();
    var height = $(window).height();
    
    // Right/Left
    var rlCounter = parseInt(height/12);
    for (var i=0; i<rlCounter; i++) {
      setTimeout(function() {
        var rightTopOffset = getRandomInt(50, height-20);
        generateLine('right', rightTopOffset, 0);
        var leftTopOffset = getRandomInt(50, height-20);
        generateLine('left', leftTopOffset, 0);
      }, i*2500);
    }
  	
  	// Top/Bottom
    var tbCounter = parseInt(width/12);
    for (var i=0; i<tbCounter; i++) {
      setTimeout(function() {
        var topLeftOffset = getRandomInt(-((width/2)-20), (width/2)-20);
        generateLine('top', height/2, topLeftOffset);
        var bottomLeftOffset = getRandomInt(-((width/2)-20), (width/2)-20);
        generateLine('bottom', height/2, bottomLeftOffset);
      }, i*2000);
  	}
  	
  };
  
  var generateLine = function(direction, top, left) {
    $('.lines').append('<marquee class="'+direction+'" style="top:'+top+'px;left:'+left+'px;"><span class="line"></span></marquee>');
  };

  /* ************************************************************************** */
  /* At the end of App instantiation, call the init function of the App object. */
  /* ************************************************************************** */
  _init.call(this);
};


