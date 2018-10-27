// ***************
// Events
// ***************

// Init index page
$('.pages.index').ready(function($) {
  new Marquee($);
});

// Init dots page
$('.pages.dots').ready(function($) {
  
  window.dots = getDots();
 
 $('a.redraw').on('click', function(e) {
   e.preventDefault();
   
   $('a.redraw').fadeOut(100);
   $('.dots-container').html("");
   window.dots = getDots();
   
   return false;
 });

});

// Init font page
$('.pages.font').ready(function($) {
  new Font($);
});

// ***************
// Functions
// ***************


function getDots() {
  switch (window.location.hash) {
    case "#gillian":
      return new GillianDots($);
      break;
    case "#katie":
      return new KatieDots($);
      break;
    case "#tej":
      return new TejDots($);
      break;
    case "#stef":
      return new StefDots($);
      break;
    default:
      return new BasicDots($);
      break;
  }
}

