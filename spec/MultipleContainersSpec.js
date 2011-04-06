describe('JustKidding', function() {

  describe('on multiple containers on the same page', function() {

    var fixture = "<table id='collectiveNouns'>" +
                  "  <tbody>" +
                  "    <tr data-index='1'><td>fleet</td><td>mudhens</td></tr>" +
                  "    <tr data-index='2'><td>string</td><td>ponies</td></tr>" +
                  "    <tr data-index='3'><td>flotilla</td><td>swordfish</td></tr>" +
                  "  </tbody>" +
                  "</table>" +
                  "<ul id='columns'>" +
                  "  <li data-index='4'>Doric</li>" +
                  "  <li data-index='5'>Ionic</li>" +
                  "  <li data-index='6'>Egyptian</li>" +
                  "</ul>";

    var jk1 = null;
    var jk2 = null;

    beforeEach(function() {
      setFixtures(fixture);
      jk1 = new JustKidding('#collectiveNouns');
      jk2 = new JustKidding('#columns');
    });

    it('should leave the first one in-focus', function() {
      expect(jk1.isInFocus()).toBeTruthy();
      expect(jk2.isInFocus()).toBeFalsy();
    });

    it('should only navigate on the in-focus list', function() {
      $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      this.afterJustKiddingEvents(function() {
        expect(jk1.current()).toHaveAttr('data-index', 2);
        expect(jk2.current()).toHaveAttr('data-index', 4);
      });
    });

    it('should change the in-focus container on focusin events', function() {
      var focusinEvent = null;
      $(document.body).focusin(function(e) { focusinEvent = e; });
      $('#columns li').first().focusin();
      waitsFor(function() {
        return focusinEvent;
      }, "focusin event to fire", 1000);
      runs(function() {
        expect(jk1.isInFocus()).toBeFalsy();
        expect(jk2.isInFocus()).toBeTruthy();
      });
    });

    it('should support manual activation', function() {
      var focusinEvent = null;
      $(document.body).bind('focusin.justKidding', function(e) { focusinEvent = e; });
      jk2.focus();
      waitsFor(function() {
        return focusinEvent;
      }, "focusin event to fire", 1000);
      runs(function() {
        expect(jk1.isInFocus()).toBeFalsy();
        expect(jk2.isInFocus()).toBeTruthy();
      });
    });

    it('should add a class to the in-focus container', function() {
      expect($('#collectiveNouns')).toHaveClass('jk-in-focus');
      expect($('#columns')).not.toHaveClass('jk-in-focus');
    });

  });

});
