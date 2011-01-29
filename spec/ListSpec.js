describe('JustKidding', function() {

  describe('for a list', function() {

    var fixture = "<ol id='events'>" +
                  "  <li>Hanna was eaten by a pterodactyl</li>" +
                  "  <li>Jakob became a crab farmer</li>" +
                  "  <li>Vijay is in an awkward relationship</li>" +
                  "</ol>";

    beforeEach(function() { $('body').append(fixture); });

    afterEach(function() { $('#events').remove(); });

    describe('called with no options', function() {

      beforeEach(function() { $('#events').justKidding(); });

      it('should add the class "justKidding" to the list', function() {
        expect($('#events')).toHaveClass('justKidding');
      });

      it('should highlight the first <li>', function() {
        expect($('.current').html()).toEqual('Hanna was eaten by a pterodactyl');
      });

    });

    describe('when there are more elements below the currently-selected element', function() {
      var blurEvent, focusEvent;

      beforeEach(function() {
        runs(function() {
          $('body')
            .bind('blur.justKidding',  function(e) { blurEvent  = e; })
            .bind('focus.justKidding', function(e) { focusEvent = e; })
            .simulate('keyup', { charCode: 'j'.charCodeAt(0) });
        });
        waitsFor(function() {
          return blurEvent || focusEvent;
        }, "events to fire", 1000);
        runs(function() { });
      });

      it('should select the next element', function() {
        expect($('.current').html()).toEqual('Jakob became a crab farmer');
      });

      xit('should fire a blur event on the previously selected element', function() {
        expect(blurEvent).toBeTruthy();
        expect($(blurEvent.target).html()).toEqual('Hanna was eaten by a pterodactyl');
      });

      xit('should fire a focus event on the newly selected element', function() {
        expect(focusEvent).toBeTruthy();
        expect($(focusEvent.target).html()).toEqual('Jakob became a crab farmer');
      });
    });

  });

});