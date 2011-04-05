describe('JustKidding', function() {

  describe('on the same page as a form', function() {

    var fixture = "<ol id='snacks'>" +
                  "  <li data-index='1'>Cheezy Poofs</li>" +
                  "  <li data-index='2'>Chips 'n' Salsa</li>" +
                  "  <li data-index='3'>Garlic Fries</li>" +
                  "</ol>" +
                  "<form><input type='text' id='aTextInput' /></form>";

    beforeEach(function() {
      setFixtures(fixture);
      $('#snacks').justKidding();
    });

    it('should ignore keypresses from inputs', function() {
      $('#aTextInput').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      this.afterJustKiddingEvents(function() {
        expect(this.blurEvent).toBeFalsy();
        expect($('#snacks .jk-current')).toHaveAttr('data-index', 1);
      });
    });

  });

});
