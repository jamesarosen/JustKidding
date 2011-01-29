(function($, window, undefined) {

  var j = 'j'.charCodeAt(0)
    , k = 'k'.charCodeAt(0)
    , w = 'w'.charCodeAt(0)
    , s = 's'.charCodeAt(0)
    ;

  $.fn.extend({
    justKidding: function() {
      $(this)
        .addClass('justKidding')
        .find(':first-child')
          .addClass('current');
      $('body').bind('keypress.justKidding', function(e) {
        var currentlySelected = $(this).find('.current');
        var newlySelected = currentlySelected;
        if (e.which === j) {
          newlySelected = currentlySelected.next();
        }
        currentlySelected
          .removeClass('current')
          .trigger('blur.justKidding');
        newlySelected
          .addClass('current')
          .trigger('focus.justKidding');
      });
    }
  });

})(jQuery, this);
