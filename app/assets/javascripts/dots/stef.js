var StefDots = function($){
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

      var c = getRandomInt(10, 200);
  		dot.rgb = {
  			r: getRandomInt(c-10, c+10),
  			g: getRandomInt(0, 10),
  			b: getRandomInt(c-10, c+10)
  		};
  		
  		dotData.push(dot);
  	}
  	return dotData;
  };
  
  
  var onCompleted = function() {
    var msgs = [
      {
        iD: 'msg-1',
        texT: "Great"
      },
      {
        iD: 'msg-2',
        texT: "job"
      },
      {
        iD: 'msg-3',
        texT: "pal!"
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
		var fontSize  = getRandomInt(20, 100);
		var c         = getRandomInt(10, 200);
		var r         = getRandomInt(c-10, c+10);
		var g         = getRandomInt(0, 10);
		var b         = getRandomInt(c-10, c+10);
		
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


