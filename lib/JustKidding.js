(function($, window, undefined) {

  var j = 'j'.charCodeAt(0)
    , k = 'k'.charCodeAt(0)
    , w = 'w'.charCodeAt(0)
    , s = 's'.charCodeAt(0)
    ;

  var initiallySelected = function(container, initialSelector) {
    initialSelector = initialSelector || 1;
    if (typeof(initialSelector) === 'number') {
      initialSelector = ':nth-child(' + initialSelector + ')';
    }
    var initiallySelected = container.children().filter(initialSelector);
    if (!initiallySelected.length) {
      initiallySelected = container.children();
    }
    return initiallySelected.first();
  };

  $.fn.extend({
    justKidding: function(options) {
      options = options || {};

      $(this).addClass('justKidding');

      initiallySelected($(this), options.initialSelector)
        .addClass('current')
        .trigger('focus.justKidding');

      $('body').bind('keypress.justKidding', function(e) {
        var moved = false;
        var currentlySelected = $(this).find('.current');
        var newlySelected = currentlySelected;
        if (e.which === j && currentlySelected.next().length) {
          newlySelected = currentlySelected.next();
          moved = true;
        } else if (e.which === k && currentlySelected.prev().length) {
          newlySelected = currentlySelected.prev();
          moved = true;
        }
        if (moved) {
          currentlySelected
            .removeClass('current')
            .trigger('blur.justKidding');
          newlySelected
            .addClass('current')
            .trigger('focus.justKidding');
        } else {
          currentlySelected.trigger('outofbounds.justKidding');
        }
      });
      return $(this);
    }
  });

})(jQuery, this);
