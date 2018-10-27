var Font = function($, onCompleted){
  var _this = this;
  
  // ***************
  // Variables
  // ***************

  var prettyPermutations = {
    ":": ["u", "s", "b", "i"],
    "[": ["u", "s", "b", "i"],
    "]": ["u", "s", "b", "i"],
    ".": ["u", "s", "b", "i"],
    "-": ["u", "b"],
    "|": ["s", "i"],
    "/": ["s", "i"],
    "=": ["u", "b", "i"],
    "+": ["u", "b", "i"],
    "`": ["u", "s", "i"],
    "~": ["u", "b"],
  };
  
  // var prettyPermutations = {
    // "{": ["s", "i"],
    // "}": ["s", "i"],
    // "!": ["b", "i"],
  // };
  

  // Called on instantiation
  function _init(){
    draw();
  }

  
  // Application methods

  var draw = function() {
    // Draw 50 to start
    for (var i=0; i<50; i++) {
      drawElement();
    }

    // Draw a new element 
    // and remove an old element
    // every 30 seconds
    setInterval(function(){ 
      drawElement();
      $('.font-container span:last').remove();
    }, 30000);

    // Reveal the styling of an element
    // every 2 seconds
    setInterval(function(){
      var index = getRandomInt(0, $('.font-container span').length);
      var $elem = $($('.font-container span')[index]);
      revealFont($elem);
      setTimeout(function() {
        hideFont($elem);
      }, 2000);
    }, 100);
  }

  var drawElement = function() {
    // Get a random element
    var index = getRandomInt(0, Object.keys(prettyPermutations).length);
    var element = Object.keys(prettyPermutations)[index];

    // Get the classes (shuffled)
    var classes = shuffleArray(prettyPermutations[element]);
    // Get the current list of classes (some subset of the possible classes)
    var classList = classes.slice(getRandomInt(0,classes.length)).join(" ");
    
    // Place the element in the dom
    $('.font-container').prepend('<span class="'+classList+'">'+element+'</span>');
    var $elem = $('.font-container span:first');

    // Setup events
    setupEvents($elem);

    // Make the spacing + font size arbitrary
    var leftMargin = getRandomInt(2, 30);
    var fontSize = getRandomInt(50, 200);
    var color = getRandomInt(0, 140);
    $elem.css({'marginLeft': leftMargin+"%", 'fontSize': fontSize+"%", 'color': "rgb("+color+","+color+","+color+")"});
  }

  var setupEvents = function($elem) {
    // Swap in the "real" element on hover
    $elem.on("mouseenter", function(e) {
      revealFont(e.target);
    });
    // Swap back the augmented element on un-hover
    $elem.on("mouseleave", function(e) {
      hideFont(e.target);
    });
  }

  var revealFont = function($elem) {
    var classes = $($elem).attr('class');
    $($elem).attr('data-class-names', classes);
    $($elem).removeAttr('class');
  }

  var hideFont = function($elem) {
    $($elem).attr('class', $($elem).attr('data-class-names'));
    $($elem).removeAttr('data-class-names');
  }

  var getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var shuffleArray = function(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      var index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      var temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }
  /* ************************************************************************** */
  /* At the end of App instantiation, call the init function of the App object. */
  /* ************************************************************************** */
  _init.call(this);
};

