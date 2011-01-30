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

      var justKidding;

      beforeEach(function() { justKidding = $('#events').justKidding(); });

      it('should add the class "justKidding" to the list', function() {
        expect($('#events')).toHaveClass('justKidding');
      });

      it('should highlight the first <li>', function() {
        expect($('.current').html()).toEqual('Hanna was eaten by a pterodactyl');
      });

      it('should return the jQuery DOM query on which it was called', function() {
        expect(justKidding).toEqual($('#events'));
      });

    });

    describe('when there are more elements below the currently-selected element', function() {
      var blurEvent, focusEvent;

      beforeEach(function() {
        blurEvent = focusEvent = null;
        $('#events').justKidding();
        $('body')
          .bind('blur.justKidding',  function(e) { blurEvent  = e; })
          .bind('focus.justKidding', function(e) { focusEvent = e; })
          .simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      });

      it('should select the next element', function() {
        waitsFor(function() {
          return blurEvent || focusEvent;
        }, "events to fire", 1000);
        runs(function() {
          expect($('.current')).toHaveText(/Jakob/);
        });
      });

      it('should fire a blur event on the previously selected element', function() {
        waitsFor(function() {
          return blurEvent || focusEvent;
        }, "events to fire", 1000);
        runs(function() {
          expect(blurEvent).toBeTruthy();
          expect($(blurEvent.target)).toHaveText(/Hanna/);
        });
      });

      it('should fire a focus event on the newly selected element', function() {
        waitsFor(function() {
          return blurEvent || focusEvent;
        }, "events to fire", 1000);
        runs(function() {
          expect(focusEvent).toBeTruthy();
          expect($(focusEvent.target)).toHaveText(/Jakob/);
        });
      });
    });

    describe('when there are no more elements below the currently-selected element', function() {
      var blurEvent, focusEvent, outOfBoundsEvent;

      beforeEach(function() {
        blurEvent = focusEvent = outOfBoundsEvent = null;
        $('#events')
          .justKidding()
          .find('li:not(:first-child)').remove()
        $('body')
          .bind('blur.justKidding',         function(e) { blurEvent         = e; })
          .bind('focus.justKidding',        function(e) { focusEvent        = e; })
          .bind('outofbounds.justKidding',  function(e) { outOfBoundsEvent  = e; })
          .simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      });

      it('should leave the current element selected', function() {
        waitsFor(function() {
          return blurEvent || focusEvent || outOfBoundsEvent;
        }, "events to fire", 1000);
        runs(function() {
          expect($('.current')).toHaveText(/Hanna/);
        });
      });

      it('should not fire a blur event', function() {
        waitsFor(function() {
          return blurEvent || focusEvent || outOfBoundsEvent;
        }, "events to fire", 1000);
        runs(function() {
          expect(blurEvent).toBeFalsy();
        });
      });

      it('should not fire a focus event', function() {
        waitsFor(function() {
          return blurEvent || focusEvent || outOfBoundsEvent;
        }, "events to fire", 1000);
        runs(function() {
          expect(focusEvent).toBeFalsy();
        });
      });

      it('should fire an out-of-bounds event on the selected element', function() {
        waitsFor(function() {
          return blurEvent || focusEvent || outOfBoundsEvent;
        }, "events to fire", 1000);
        runs(function() {
          expect(outOfBoundsEvent).toBeTruthy();
          expect($(outOfBoundsEvent.target)).toHaveText(/Hanna/);
        });
      });
    });

  });

});
