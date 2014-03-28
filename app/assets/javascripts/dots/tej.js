var TejDots = function($){
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
  			r: getRandomInt(200, 255),
  			g: getRandomInt(0, 150),
  			b: getRandomInt(0, 50)
  		};
  		
  		dotData.push(dot);
  	}
  	return dotData;
  };
  
  
  var onCompleted = function() {
    var msgs = [
      {
        iD: 'msg-1',
        texT: "cool"
      },
      {
        iD: 'msg-2',
        texT: "Cool"
      },
      {
        iD: 'msg-3',
        texT: "cool"
      },
      {
        iD: 'msg-4',
        texT: "cool"
      },
      {
        iD: 'msg-5',
        texT: "Cool"
      },
      {
        iD: 'msg-6',
        texT: "cool"
      },
      {
        iD: 'msg-7',
        texT: "Cool"
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
  	}, 300);
  };
  
  
  var showMsg = function(msgData) {
    var h = $(window).height();
  	var w = $(window).width();
    $('body').prepend('<div id="'+msgData.iD+'" class="msg">'+msgData.texT+'</div>');
    $msg = $('#'+msgData.iD);
    $msg.hide();
    
    var top 	    = getRandomInt(10, h-110);
		var left 	    = getRandomInt(10, w-110);
		var fontSize  = getRandomInt(20, 100);
		var r         = getRandomInt(200, 255);
		var g         = getRandomInt(0, 150);
		var b         = getRandomInt(0, 50);
		
		$msg.css({
		  top: top,
		  left: left,
		  fontSize: fontSize,
		  color: 'rgb('+r+','+g+','+b+')'
		});
		
    $msg.fadeIn(100).fadeOut(2000, function() {
      $(this).remove();
    });
  };
  

  /* ************************************************************************** */
  /* At the end of App instantiation, call the init function of the App object. */
  /* ************************************************************************** */
  _init.call(this);
};


