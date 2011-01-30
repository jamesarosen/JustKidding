(function() {
  $.fn.extend({
    triggerKeyPress: function(options) {
      var e = $.extend({
        bubbles: true,
        cancelable: true,
        view: window,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        keyCode: 0,
        charCode: 0
      }, options);
      $(this).trigger('keypress', [e]);
    }
  });

  var jasmineExtensions = {
    jQuerySpies: {},

    spyOnEvent: function(element, eventName) {
      var control = {
        triggered: false
      };
      element.bind(eventName, function() {
        control.triggered = true;
      });
      jasmineExtensions.jQuerySpies[element[eventName]] = control;
    }
  };

  jasmine.Spec.prototype.spyOnEvent = function(selector, event) {
    return jasmineExtensions.spyOnEvent(selector, event);
  };

  beforeEach(function() {
    this.addMatchers({
      toHaveClass: function(className) {
        return jQuery(this.actual).hasClass(className);
      },

      toHaveBeenTriggered: function() {
        var control = jasmineExtensions.jQuerySpies[this.actual];
        return control.triggered;
      }
    });
  });

  afterEach(function() {
    console.log('beginning of afterEach', new Date());
    jasmineExtensions.jQuerySpies = {};
    $('*').unbind('.justKidding');
  });
})();
