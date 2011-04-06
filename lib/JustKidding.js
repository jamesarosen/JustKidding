// [JustKidding.js 0.2.0](https://github.com/jamesarosen/JustKidding)
// (c) 2011 James A. Rosen, Zendesk, Inc.
// JustKidding is freely distributable under the MIT license.
//
// ## What ##
//
// JustKidding is a jQuery widget that adds keyboard navigation to lists
// and tables on your site.
//
// ## The Basics ##
//
// Create a list on the page:
//
//     <ol id='events'>
//       <li>Hanna was eaten by a pterodactyl</li>
//       <li>Jakob became a crab farmer</li>
//       <li>Vijay is in an awkward relationship</li>
//     </ol>
//
// Add JustKidding to the list:
//
//     jQuery('#events').justKidding();
//
// Users can now navigate down and up the list using the *j* and *k* keys. Of
// course, without some styling, they won't be able to *tell* that they're
// navigating up and down the list. Thus, it's important to have styles like
// the following on your page:
//
//     .justKidding .jk-current {
//       background-color: #ddd;
//     }
// ## More Details ##
//
// ### Styling
//
// See `JustKidding.css` for more in-depth styling.
//
// ### Tables
//
// Calling `justKidding` on a `<table>` will act as though it was called on
// the `<table>`s `<tbody>` element if present. That is, rows within the
// `<thead>` and `<tfoot>` will not be navigable.
//
// ### Events
//
// JustKidding will fire the following events during its life-cycle:
//
// <dl>
//   <dt><code>focus.justKidding and focusin.justKidding</code></dt>
//   <dd>
//     Fired on the newly-selected element after a keypress if the cursor
//     moves (i.e. if there are more elements in the direction indicated).
//   </dd>
//
//   <dt><code>blur.justKidding and focusout.justKidding</code></dt>
//   <dd>
//     Fired on the previously-selected element after a keypress if the cursor
//     moves (i.e. if there are more elements in the direction indicated).
//   </dd>
//
//   <dt><code>outofbounds.justKidding</code></dt>
//   <dd>
//     Fired on the currently-selected element after a keypress if the cursor
//     cannot move in the specified direction.
//   </dd>
//
//   <dt><code>created.justKidding</code></dt>
//   <dd>
//     Fired when a JustKidding instance is created.
//   </dd>
// </dl>
//
// ### Options
//
// The widget accepts a number of options to fine-tune behavior.
//
// <dl>
//   <dt><code>initialSelector</code></dt>
//   <dd>
//     determines which element in the list or table is selected on page load.
//      It accepts either a number or a string. If a number, it is converted
//     into an <code>nth-child</code> query. If a string, it is treated as a
//     jQuery selector within the list or table. Defaults to <code>1</code>.
//   </dd>
//
//   <dt><code>eligibleChildren</code></dt>
//   <dd>
//     determines which elements in the list or table can be focused on via
//     keystrokes. You can use this to exclude certain elements (e.g.
//     by passing `":not(.disabled)"`) or to use some deeper descendants of
//     the container. Defaults to `"li"` when the container is an `<ul>` or
//     `<ol>` and to `"tbody tr"` when the container is a `<table>`.
//   </dd>
//
//   <dt><code>wasd</code></dt>
//   <dd>
//     enables navigation with the <i>w</i> and <i>s</i> keys (up
//     and down respectively). Defaults to <code>false</code>.
//   </dd>
//
//   <dt><code>vim</code></dt>
//   <dd>
//     enables navigation with the <i>j</i> and <i>k</i> keys
//     (down and up respectively). Defaults to <code>true</code>.
//   </dd>
//
//   <dt><code>actOnEvent</code></dt>
//   <dd>
//     a function that returns true if JustKidding should act on an event.
//     Defaults to returning <code>false</code> if the event's source was an
//     <code>input</code> or <code>textarea</code>, <code>true</code>
//     otherwise. (NB: JustKidding only listens for <code>keypress</code> that
//     have no namespace or the namespace <code>justKidding</code>.)
//   </dd>
// </dl>
// 
// ### Multiple lists or tables
// 
// If you create multiple JustKidding instances on a page (e.g. via
// a call like jQuery('#cheeses,#meats,#wines').justKidding()), only one
// will have "focus" at a time. Only the instance that has focus will respond
// to keypress events. You can query a JustKidding instance's focus with
// `isInFocus()`. Whichever JustKidding instance was created first will have
// focus initially. You can change this in one of two ways:
//
//  1. call `focus()` on a JustKidding instance
//  2. trigger a `focusin.justKidding` event on one of the navigable children
//     of a JustKidding container.
(function($, window, undefined) {

  // save some known key codes
  var j = 'j'.charCodeAt(0)
    , k = 'k'.charCodeAt(0)
    , w = 'w'.charCodeAt(0)
    , s = 's'.charCodeAt(0)
    ;

  // Print a warning message if possible; do nothing otherwise.
  var warn = function() { };
  if (window.console && window.console.warn) {
    warn = function() { window.console.warn(arguments); };
  }

  // 
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

  // Given a jQuery list, a target element within the list and a direction
  // (+1 for successor, -1 for predecessor), find the adjacent element in the
  // list, or null if no such element exists.
  //
  // ### Parameters
  //  * $list -- a jQuery node list
  //  * $target -- the starting point, a jQuery element
  //  * delta -- the direction in which to find the neighbor
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

  // Determine the element that should be initially selected for a container.
  //
  // ### Parameters
  //  * $eligibleChildren -- a jQuery node list
  //  * initialSelector -- an Integer (the nth-child), String (a jQuery
  //    selector within the list), or null
  var initiallySelected = function($eligibleChildren, initialSelector) {
    if (!initialSelector) { return null; }
    if (typeof(initialSelector) === 'number') {
      initialSelector = ':nth-child(' + initialSelector + ')';
    }
    var initiallySelected = $eligibleChildren.filter(initialSelector);
    if (!initiallySelected.length) {
      initiallySelected = $eligibleChildren;
    }
    return initiallySelected.first();
  };

  // Determine which element should be selected next, given a JustKidding
  // instance and a key code.
  //
  // ### Parameters
  //  * justKidding -- a JustKidding instance
  //  * which -- the event's key code
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

  // Bind event handlers for a JustKidding instance.
  var bindEventHandlers = function(justKidding) {
    $('body')
      // bind the keypress events for navigation:
      .bind('keypress.justKidding', function(e) {
        // Ignore if out-of-focus or from a form element:
        // TODO: we should skip events with key codes we don't care about
        // TODO: rename actOnEvent to isFromIgnoredElement and reverse condition
        if (justKidding.isInFocus() && justKidding.actOnEvent(e)) {
          // figure out where the user wants to move:
          var newlySelected = calculateNewlySelected(justKidding, e.which);

          // try to move there:
          if (newlySelected) {
            justKidding.moveTo(newlySelected);
          } else {
            justKidding.current().trigger('outofbounds.justKidding');
          }
        }
      })
      // bind the focus events in case there are multiple JustKidding
      // instances on the page:
      .bind('focusin.justKidding', function(e) {
        // this event was triggered on an "eligible child" of _some_
        // JustKidding instance. If it's mine, and I'm out-of-focus, focus me.
        // If it's not mine and I _am_ focused, blur me.
        var isFromThisJK = justKidding.eligibleChildren().filter(e.target).length > 0;
        if (isFromThisJK && !justKidding.isInFocus()) { justKidding.focus(); }
        if (!isFromThisJK && justKidding.isInFocus()) { justKidding.blur(); }
      });
  };

  // It would really suck if filling out a form caused navigation to happen.
  var tagsToIgnore = /^input|textarea$/i;

  // Default implementation of actOnEvent.
  var defaultActOnEvent = function(e) {
    return (e && e.srcElement && !tagsToIgnore.test(e.srcElement.tagName));
  };

  // Create a new JustKidding instance.
  //
  // ### Parameters:
  //  * container -- a jQuery node
  //  * options -- an Object of additional options. See above for more info.
  var JustKidding = function(container, options) {
    container = $(container)
                  .addClass('justKidding')
                  .data('justKidding', this);

    // merge options into this
    $.extend(this, options || {});

    // pointer to the currently-selected element
    var current = null;

    // whether this JK instance is currently in-focus
    var isInFocus = false;

    // Public getter for the container
    this.container = function() { return container; };

    // save off the eligibleChildren option:
    var eligibleChildrenSelector = this.eligibleChildren;

    // Public getter for the eligible (navigable) children.
    this.eligibleChildren = function() { return eligibleChildrenFor(container, eligibleChildrenSelector); };

    // Public getter for the currently-highlighted element.
    this.current = function() { return current; };

    // Public getter for whether this JustKidding instance is the one
    // currently in-focus (and thus currently responding to key events).
    this.isInFocus = function() {
      return isInFocus;
    };

    // Focus on this JustKidding instance; it begins responding to key events.
    this.focus = function() {
      isInFocus = true;
      container.addClass('jk-in-focus');
      current && current.trigger('focus.justKidding');
      current && current.trigger('focusin.justKidding');
    };

    // No longer focus on this JustKidding instance; it stops responding
    // to key events.
    this.blur = function() {
      isInFocus = false;
      container.removeClass('jk-in-focus');
      current && current.trigger('blur.justKidding');
      current && current.trigger('focusout.justKidding');
    };

    // Move the cursor to +to+, triggering events and changing classes
    // as necessary. Does nothing if +to+ is null, empty, or not an
    // eligible child of the container.
    //
    // ### Parameters:
    //  * to -- a jQuery node within the set of eligible children
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
      // if this is the first instance on the page, focus on it
      this.focus();
    };
    var initial = initiallySelected(this.eligibleChildren(), this.initialSelector);
    initial && this.moveTo(initial);
    container.trigger('created.justKidding', this);
  };

  JustKidding.prototype = {
    // by default, focus on the first eligible child initially
    initialSelector:  1,

    // by default, observe *j* and *k* for next and previous
    vim:              true,

    // by default, do **not** observe *s* and *w* for next and previous
    wasd:             false,

    // by default, ignore key events originating from form elements
    actOnEvent:       defaultActOnEvent
  };

  $.fn.extend({
    justKidding: function(options) {
      new JustKidding(this, options);
      return $(this);
    }
  });

  // Export JustKidding into the global namespace.
  window.JustKidding = JustKidding;

}(jQuery, this));
