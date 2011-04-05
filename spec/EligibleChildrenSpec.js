describe('JustKidding', function() {

  describe('with the eligibleChildren option', function() {

    var fixture = "<ol id='cats'>" +
                  "  <div class='group1'>" +
                  "    <li data-index='1' class='disabled'>1</li>" +
                  "    <li data-index='2'>2</li>" +
                  "  </div>" +
                  "  <div class='group2'>" +
                  "    <li data-index='3' class='disabled'>3</li>" +
                  "    <li data-index='4'>4</li>" +
                  "  </div>" +
                  "</ol>";

    beforeEach(function() {
      setFixtures(fixture);
      $('#cats').justKidding({ eligibleChildren: 'li:not(.disabled)' });
    });

    it('should select the first eligible child', function() {
      expect($('#cats .jk-current')).toHaveAttr('data-index', 2);
    });

    it('should skip ineligible children when navigating', function() {
      $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      this.afterJustKiddingEvents(function() {
        expect($('#cats .jk-current')).toHaveAttr('data-index', 4);
      });
    });

    it('should not move in a direction that has no eligible children', function() {
      $('body').simulate('keypress', { charCode: 'k'.charCodeAt(0) });
      this.afterJustKiddingEvents(function() {
        expect($('#cats .jk-current')).toHaveAttr('data-index', 2);
      });
    });

  });

});
