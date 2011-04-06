describe('JustKidding', function() {

  describe('on an empty container', function() {

    var fixture = "<ul id='awesomeZebraNames'></ul>";

    var jk = null;

    beforeEach(function() {
      setFixtures(fixture);
      jk = new JustKidding('#awesomeZebraNames');
    });

    it('should not have a "current" element', function() {
      expect(jk.current()).toBeNull();
    });

    describe('that later gets elements', function() {
      beforeEach(function() {
        $('#awesomeZebraNames')
          .append('<li data-index="1">Paisley</li>')
          .append('<li data-index="2">Plaid</li>');
      });

      it('should move "down" to the first element', function() {
        $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
        this.afterJustKiddingEvents(function() {
          expect(jk.current()).not.toBeNull();
          expect(jk.current()).toHaveAttr('data-index', 1);
        });
      });

      it('should move "up" to the last element', function() {
        $('body').simulate('keypress', { charCode: 'k'.charCodeAt(0) });
        this.afterJustKiddingEvents(function() {
          expect(jk.current()).not.toBeNull();
          expect(jk.current()).toHaveAttr('data-index', 2);
        });
      });
    });

  });

});
