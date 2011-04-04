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

  var defaultEligibleChildrenSelector = function(container) {
    if (container.length === 0) {
      return null;
    }
    var type = container[0].nodeName.toLowerCase()
    if (type === 'table') {
      return 'tbody tr';
    }
    if (type === 'ul' || type === 'ol') {
      return 'li';
    }
  };

  var eligibleChildrenFor = function(container, eligibleChildrenSelector) {
    eligibleChildrenSelector = eligibleChildrenSelector || defaultEligibleChildrenSelector(container);
    if (eligibleChildrenSelector) {
      return container.find(eligibleChildrenSelector);
    } else {
      return container.children();
    }
  };

  // @return [jQuery element] the element that should be selected initially
  // @api private
  var initiallySelected = function(eligibleChildren, initialSelector) {
    initialSelector = initialSelector || 1;
    if (typeof(initialSelector) === 'number') {
      initialSelector = ':nth-child(' + initialSelector + ')';
    }
    var initiallySelected = eligibleChildren.filter(initialSelector);
    if (!initiallySelected.length) {
      initiallySelected = eligibleChildren;
    }
    return initiallySelected.first();
  };

  // @param [JustKidding] justKidding the JK instance
  // @param [Integer] which the character code
  // @return [jQuery element] the element that should become selected, or
  //                          null if no movement is possible in the
  //                          direction specified
  // @api private
  var calculateNewlySelected = function(justKidding, which) {
    var current  = justKidding.current()
      , eligible = justKidding.eligibleChildren()
      , up       = ((justKidding.vim && which === j) || (justKidding.wasd && which === s))
      , down     = ((justKidding.vim && which === k) || (justKidding.wasd && which === w))
      , result;

    if (up) {
      result = eligible.filter(current.nextAll()).first();
    } else if (down) {
      result = eligible.filter(current.prevAll()).last();
    } else {
      result = [];
    }
    return result.length > 0 ? result.first() : null;
  };

  // @param [JustKidding] justKidding the JK instance
  // @api private
  var bindEventHandler = function(justKidding) {
    $('body').bind('keypress.justKidding', function(e) {
      if (justKidding.actOnEvent(e)) {
        var newlySelected = calculateNewlySelected(justKidding, e.which);

        if (newlySelected) {
          justKidding.moveTo(newlySelected);
        } else {
          justKidding.current().trigger('outofbounds.justKidding');
        }
      }
    });
  };

  var tagsToIgnore = /^input|textarea$/i;

  // @param [Event] e the keypress event
  // @return [true,false] whether JustKidding should act on the event
  // @api private
  var defaultActOnEvent = function(e) {
    return (e && e.srcElement && !tagsToIgnore.test(e.srcElement.tagName));
  };

  var JustKidding = function(container, options) {
    container = $(container)
                  .addClass('justKidding')
                  .data('justKidding', this);

    $.extend(this, JustKidding.defaultOptions, options || {});

    var eligibleChildren = eligibleChildrenFor(container, this.eligibleChildren);
    var current;

    // @return [jQuery element] the container
    // @api public
    this.container = function() { return container; };

    // @return [jQuery element list] the list of selectable children
    // @api public
    this.eligibleChildren = function() { return eligibleChildren; }

    // @return [jQuery element] the currently selected element
    // @api public
    this.current = function() { return current; };

    // Move the cursor to +to+, triggering events and changing classes
    // as necessary. Does nothing if +to+ is null, empty, or not a child
    // of the container.
    // @param [jQuery element] to
    // @api public
    this.moveTo = function(to) {
      if (to && to.length && eligibleChildren.filter(to).length === 1) {
        if (current) {
          current.removeClass('current')
                 .trigger('blur.justKidding');
        }
        to.addClass('current')
          .trigger('focus.justKidding');
        current = to;
      } else {
        warn('Cannot move to ' + to);
        return;
      }
    };

    this.moveTo(initiallySelected(eligibleChildren, this.initialSelector));

    bindEventHandler(this);
  };

  JustKidding.defaultOptions = {
    initialSelector:  1,
    vim:              true,
    wasd:             false,
    actOnEvent:       defaultActOnEvent
  };

  $.fn.extend({
    justKidding: function(options) {
      new JustKidding(this, options);
      return $(this);
    }
  });

  window.JustKidding = JustKidding;

})(jQuery, this);
