var GillianDots = function($){
  var _this = this;

  // Called on instantiation
  function _init(){
    return new BasicDots($, generateDotData, onCompleted);
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
  			r: getRandomInt(0, 100),
  			g: getRandomInt(0, 100),
  			b: getRandomInt(50, 255)
  		};
  		
  		dotData.push(dot);
  	}
  	return dotData;
  };
  
  
  var onCompleted = function() {
    var msgs = [
      {
        iD: 'msg-1',
        texT: "Dots!"
      },
      {
        iD: 'msg-2',
        texT: "dots"
      },
      {
        iD: 'msg-3',
        texT: "dots!"
      },
      {
        iD: 'msg-4',
        texT: "Dots"
      },
      {
        iD: 'msg-5',
        texT: "More dots!"
      },
      {
        iD: 'msg-6',
        texT: "please?"
      },
    ];
  	
  	showMsg(msgs[0]);
  	var i = 1;
  	var inter = setInterval(function() {
  	  showMsg(msgs[i]);
  	  i++;
  	  if (i >= msgs.length) {
  	    clearInterval(inter);
  	    setTimeout(function() {
  	      $('a.redraw').fadeIn();
  	    },1000);
  	  }
  	}, 500);
  };
  
  
  var showMsg = function(msgData) {
    var h = $(window).height();
  	var w = $(window).width();
    $('body').prepend('<div id="'+msgData.iD+'" class="msg">'+msgData.texT+'</div>');
    $msg = $('#'+msgData.iD);
    $msg.hide();
    
    var top 	    = getRandomInt(10, h-110);
		var left 	    = getRandomInt(10, w-110);
		var fontSize  = getRandomInt(12, 100);
		var r         = getRandomInt(0, 100);
		var g         = getRandomInt(0, 100);
		var b         = getRandomInt(50, 255);
		
		$msg.css({
		  top: top,
		  left: left,
		  fontSize: fontSize,
		  color: 'rgb('+r+','+g+','+b+')'
		});
		
    $msg.fadeIn(100).fadeOut(2500, function() {
      $(this).remove();
    });
  };


  /* ************************************************************************** */
  /* At the end of App instantiation, call the init function of the App object. */
  /* ************************************************************************** */
  _init.call(this);
};


