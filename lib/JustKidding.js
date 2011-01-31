(function($, window, undefined) {

  var j = 'j'.charCodeAt(0)
    , k = 'k'.charCodeAt(0)
    , w = 'w'.charCodeAt(0)
    , s = 's'.charCodeAt(0)
    ;

  // print a warning message if possible
  // @api private
  var warn = function() { };
  if (window.console && window.console.warn) {
    warn = function() { window.console.warn(arguments); };
  }

  // @return [jQuery element] the element that should be selected initially
  // @api private
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

  // @param [jQuery element] current the currently selected element
  // @param [Integer] which the character code
  // @return [jQuery element] the element that should become selected, or
  //                          null if no movement is possible in the
  //                          direction specified
  // @api private
  var calculateNewlySelected = function(current, which) {
    if (which === j && current.next().length) {
      return current.next();
    } else if (which === k && current.prev().length) {
      return current.prev();
    } else {
      return null;
    }
  };

  var JustKidding = function(container, options) {
    var justKidding = this;

    container = $(container)
                  .addClass('justKidding')
                  .data('justKidding', justKidding);
    options   = $.extend({}, JustKidding.defaultOptions, options || {});

    var current = initiallySelected(container, options.initialSelector)
      .addClass('current')
      .trigger('focus.justKidding');

    $('body').bind('keypress.justKidding', function(e) {
      var newlySelected = calculateNewlySelected(current, e.which);

      if (newlySelected) {
        justKidding.moveTo(newlySelected);
      } else {
        current.trigger('outofbounds.justKidding');
      }
    });

    // @return [jQuery element] the container
    // @api public
    this.container = function() { return container; };

    // @return [jQuery element] the currently selected element
    // @api public
    this.current = function() { return current; };

    // Move the cursor to +to+, triggering events and changing classes
    // as necessary. Does nothing if +to+ is null, empty, or not a child
    // of the container.
    // @param [jQuery element] to
    // @api public
    this.moveTo = function(to) {
      if (to && to.length && to.parent()[0] === container[0]) {
        current.removeClass('current')
               .trigger('blur.justKidding');
        to.addClass('current')
          .trigger('focus.justKidding');
        current = to;
      } else {
        warn('Cannot move to ' + to);
        return;
      }
    };
  };

  JustKidding.defaultOptions = {
    initialSelector: 1
  };

  $.fn.extend({
    justKidding: function(options) {
      new JustKidding(this, options);
      return $(this);
    }
  });

  window.JustKidding = JustKidding;

})(jQuery, this);
