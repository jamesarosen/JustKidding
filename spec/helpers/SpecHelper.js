(function() {
  beforeEach(function() {
    this.addMatchers({
      toHaveClass: function(className) {
        return this.actual.hasClass(className);
      },

      toHaveText: function(text) {
        if (text.test) {
          return text.test(this.actual.text());
        } else {
          return text === this.actual.text();
        }
      }
    });
  });

  afterEach(function() {
    $('*').unbind('.justKidding');
  });
})();
