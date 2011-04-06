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
    var type = container[0].nodeName.toLowerCase();
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

  // Given a live-updating jQuery list, a target element within the list
  // and a direction (+1 for successor, -1 for predecessor), find the
  // adjacent element in the list, or null if no such element exists.
  // @return [jQuery element] the adjacent element
  // @param [jQuery selector] list
  // @param [jQuery element] target the starting point
  // @param [+1, -1] delta the direction in which to find the neighbor
  //
  // TODO: this is O(n). Is there a way to speed it up?
  // See http://stackoverflow.com/questions/5545526
  function adjacentInList($list, $target, delta) {
    if ($list.length === 0 || $target.length === 0) {
      return null;
    }
    var target = $target[0];
    var $result = null;
    $list.each(function(index, element) {
      if (target === element) {
        $result = $list.slice(index + delta, index + delta + 1);
      }
    });
    return $result.length > 0 ? $result : null;
  }

  // @return [jQuery element] the element that should be selected initially
  // @api private
  var initiallySelected = function(eligibleChildren, initialSelector) {
    if (!initialSelector) { return null; }
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
      , down     = ((justKidding.vim && which === k) || (justKidding.wasd && which === w));

    if (current && up) {
      return adjacentInList(eligible, current, +1);
    } else if (!current && up) {
      return eligible.first();
    } else if (current && down) {
      return adjacentInList(eligible, current, -1);
    } else if (!current && down) {
      return eligible.last();
    } else {
      return null;
    }
  };

  // @param [JustKidding] justKidding the JK instance
  // @api private
  var bindEventHandlers = function(justKidding) {
    $('body')
      .bind('keypress.justKidding', function(e) {
        if (justKidding.isInFocus() && justKidding.actOnEvent(e)) {
          var newlySelected = calculateNewlySelected(justKidding, e.which);

          if (newlySelected) {
            justKidding.moveTo(newlySelected);
          } else {
            justKidding.current().trigger('outofbounds.justKidding');
          }
        }
      })
      .bind('focusin.justKidding', function(e) {
        var isFromThisJK = justKidding.eligibleChildren().filter(e.target).length > 0;
        if (isFromThisJK && !justKidding.isInFocus()) { justKidding.focus(); }
        if (!isFromThisJK && justKidding.isInFocus()) { justKidding.blur(); }
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

    $.extend(this, options || {});

    var current = null; // pointer to the currently-selected element
    var isInFocus = false; // whether this JK instance is currently in-focus

    // @return [jQuery element] the container
    // @api public
    this.container = function() { return container; };

    var eligibleChildrenSelector = this.eligibleChildren;

    // @return [jQuery element list] the list of selectable children
    // @api public
    this.eligibleChildren = function() { return eligibleChildrenFor(container, eligibleChildrenSelector); };

    // @return [jQuery element] the currently selected element
    // @api public
    this.current = function() { return current; };

    // @return [true, false] whether this JustKidding instance is currently
    // in-focus (responds to key events).
    // @api public
    this.isInFocus = function() {
      return isInFocus;
    };

    // Focus on this JustKidding instance, causing it to respond to key
    // events.
    // @api public
    this.focus = function() {
      isInFocus = true;
      container.addClass('jk-in-focus');
      current && current.trigger('focus.justKidding');
      current && current.trigger('focusin.justKidding');
    };

    // Blur from this JustKidding instance, causing it to ignore key events.
    // @api public
    this.blur = function() {
      isInFocus = false;
      container.removeClass('jk-in-focus');
      current && current.trigger('blur.justKidding');
      current && current.trigger('focusout.justKidding');
    };

    // Move the cursor to +to+, triggering events and changing classes
    // as necessary. Does nothing if +to+ is null, empty, or not a child
    // of the container.
    // @param [jQuery element] to
    // @api public
    this.moveTo = function(to) {
      if (to && to.length && this.eligibleChildren().filter(to).length === 1) {
        current && current.removeClass('jk-current');
        // trigger blur events on the current element if we're in-focus:
        current && isInFocus && current.trigger('focusout.justKidding')
                                       .trigger('blur.justKidding');
        to.addClass('jk-current');
        // trigger focus events on the to element if we're in-focus:
        isInFocus && to.trigger('focus.justKidding')
                       .trigger('focusin.justKidding');
        current = to;
      } else {
        warn('Cannot move to ' + to);
        return;
      }
    };

    bindEventHandlers(this);
    if ($('.justKidding').length === 1) {
      this.focus();
    };
    var initial = initiallySelected(this.eligibleChildren(), this.initialSelector);
    initial && this.moveTo(initial);
    container.trigger('created.justKidding', this);
  };

  JustKidding.prototype = {
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

}(jQuery, this));
