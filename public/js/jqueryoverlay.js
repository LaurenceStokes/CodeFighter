// overlay plugin function
$.fn.overlay = function() {
	
	return this.each(function(){
      var $this = $(this);
      
      var left = $this.offset().left;
      var top = $this.offset().top;
      var width = $this.outerWidth();
      var height = $this.outerHeight();
      
      $this.wrap("<div id='overlay'> </div>")
		.css('opacity', '0.2')
		.css('z-index', '6')
		.css('background','black');
    });
};


// apply to single element by id
$('#myBtn').overlay();

// apply to all elements of class overlay
$('.overlay').overlay();
