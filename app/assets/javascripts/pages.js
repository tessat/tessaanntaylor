// ***************
// Events
// ***************


$('.pages.index').ready(function($) {
  
  window.dots = getDots();
 
 
 $('a.redraw').on('click', function(e) {
   e.preventDefault();
   
   $('a.redraw').fadeOut(100);
   $('.dot').remove();
   window.dots = getDots();
   
   return false;
 });

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
    default:
      return new BasicDots($);
      break;
  }
}

