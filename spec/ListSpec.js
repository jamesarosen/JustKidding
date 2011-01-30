describe('JustKidding', function() {

  describe('for a list', function() {

    var fixture = "<ol id='events'>" +
                  "  <li>Hanna was eaten by a pterodactyl</li>" +
                  "  <li>Jakob became a crab farmer</li>" +
                  "  <li>Vijay is in an awkward relationship</li>" +
                  "</ol>";

    beforeEach(function() { setFixtures(fixture) });

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
      beforeEach(function() {
        $('#events').justKidding();
        $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      });

      it('should select the next element', function() {
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveText(/Jakob/);
        });
      });

      it('should fire a blur event on the previously selected element', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.blurEvent).toBeTruthy();
          expect($(this.blurEvent.target)).toHaveText(/Hanna/);
        });
      });

      it('should fire a focus event on the newly selected element', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.focusEvent).toBeTruthy();
          expect($(this.focusEvent.target)).toHaveText(/Jakob/);
        });
      });
    });

    describe('when there are no more elements below the currently-selected element', function() {
      beforeEach(function() {
        $('#events')
          .justKidding()
          .find('li:not(:first-child)').remove()
        $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      });

      it('should leave the current element selected', function() {
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveText(/Hanna/);
        });
      });

      it('should not fire a blur event', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.blurEvent).toBeFalsy();
        });
      });

      it('should not fire a focus event', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.focusEvent).toBeFalsy();
        });
      });

      it('should fire an out-of-bounds event on the selected element', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.outOfBoundsEvent).toBeTruthy();
          expect($(this.outOfBoundsEvent.target)).toHaveText(/Hanna/);
        });
      });
    });

  });

});
