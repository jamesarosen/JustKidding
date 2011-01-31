(function() {
  jasmine.Spec.prototype.afterJustKiddingEvents = function(fn) {
    var spec = this;
    waitsFor(function() {
      return spec.blurEvent || spec.focusEvent || spec.outOfBoundsEvent;
    }, "events to fire", 1000);
    runs(fn);
  };

  beforeEach(function() {
    var spec = this;
    $('body')
      .bind('blur.justKidding',         function(e) { spec.blurEvent         = e; })
      .bind('focus.justKidding',        function(e) { spec.focusEvent        = e; })
      .bind('outofbounds.justKidding',  function(e) { spec.outOfBoundsEvent  = e; });

    this.addMatchers({
      toHaveFunction: function(name) {
        return jQuery.isFunction(this.actual[name]);
      }
    });
  });

  afterEach(function() {
    $('*').unbind('.justKidding');
  });
})();
