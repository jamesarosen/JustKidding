describe('JustKidding', function() {

  describe('for a list', function() {

    var fixture = "<ol id='events'>" +
                  "  <li data-index='1' class='foo'>Hanna was eaten by a pterodactyl</li>" +
                  "  <li data-index='2' class='bar'>Jakob became a crab farmer</li>" +
                  "  <li data-index='3' class='baz'>Vijay is in an awkward relationship</li>" +
                  "</ol>";

    beforeEach(function() { setFixtures(fixture); });

    describe('called with no options', function() {
      it('should add the class "justKidding" to the list', function() {
        expect($('#events').justKidding()).toHaveClass('justKidding');
      });

      it('should make the JustKidding instance available as a data-attribute', function() {
        var jk = $('#events').justKidding().data('justKidding');
        expect(jk).toBeTruthy();
        expect(jk).toHaveFunction('moveTo');
      });
    });

    describe('option initialSelector', function() {
      it('should assume "first-child" if not specified', function() {
        $('#events').justKidding({ initialSelector: null });
        expect($('.current')).toHaveAttr('data-index', 1);
      });

      it('should default to "first-child" if an invalid filter is specified', function() {
        $('#events').justKidding({ initialSelector: ':nth-child(1000)' });
        expect($('.current')).toHaveAttr('data-index', 1);
      });

      it('should convert an integer to an index', function() {
        $('#events').justKidding({ initialSelector: 3 });
        expect($('.current')).toHaveAttr('data-index', 3);
      });

      it('should treat a String as a jQuery filter', function() {
        $('#events').justKidding({ initialSelector: '.bar' });
        expect($('.current')).toHaveAttr('data-index', 2);
      });
    });

    describe('option wasd', function() {
      it('should be off by default', function() {
        $('#events').justKidding();
        $('body').simulate('keypress', { charCode: 'w'.charCodeAt(0) });
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 1);
        });
      });

      it('should enable navigation down by "s"', function() {
        $('#events').justKidding({ wasd: true, initialSelector: 1 });
        $('body').simulate('keypress', { charCode: 's'.charCodeAt(0) });
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 2);
        });
      });

      it('should enable navigation up by "w"', function() {
        $('#events').justKidding({ wasd: true, initialSelector: 3 });
        $('body').simulate('keypress', { charCode: 'w'.charCodeAt(0) });
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 2);
        });
      });
    });

    describe('option vim', function() {
      it('should be on by default', function() {
        $('#events').justKidding({ initialSelector: 1 });
        $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 2);
        });
      });

      it('should disable j/k navigation when turned off', function() {
        $('#events').justKidding({ vim: false, initialSelector: 1 });
        $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 1);
        });
      });
    });

    describe('when there are more elements below the currently-selected element, pressing "j"', function() {
      beforeEach(function() {
        $('#events').justKidding();
        $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      });

      it('should select the next element', function() {
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 2);
        });
      });

      it('should fire a blur event on the previously selected element', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.blurEvent).toBeTruthy();
          expect($(this.blurEvent.target)).toHaveAttr('data-index', 1);
        });
      });

      it('should fire a focus event on the newly selected element', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.focusEvent).toBeTruthy();
          expect($(this.focusEvent.target)).toHaveAttr('data-index', 2);
        });
      });
    });

    describe('when there are no more elements below the currently-selected element, pressing "j"', function() {
      beforeEach(function() {
        $('#events').justKidding({ initialSelector: ':last-child' });
        this.focusEvent = null; // erase the initial focus event from creation
        $('body').simulate('keypress', { charCode: 'j'.charCodeAt(0) });
      });

      it('should leave the current element selected', function() {
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 3);
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
          expect($(this.outOfBoundsEvent.target)).toHaveAttr('data-index', 3);
        });
      });
    });

    describe('when there are more elements above the currently-selected element, pressing "k"', function() {
      beforeEach(function() {
        $('#events').justKidding({ initialSelector: 2 });
        $('body').simulate('keypress', { charCode: 'k'.charCodeAt(0) });
      });

      it('should select the previous element', function() {
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 1);
        });
      });

      it('should fire a blur event on the previously selected element', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.blurEvent).toBeTruthy();
          expect($(this.blurEvent.target)).toHaveAttr('data-index', 2);
        });
      });

      it('should fire a focus event on the newly selected element', function() {
        this.afterJustKiddingEvents(function() {
          expect(this.focusEvent).toBeTruthy();
          expect($(this.focusEvent.target)).toHaveAttr('data-index', 1);
        });
      });
    });

    describe('when there are no more elements below the currently-selected element, pressing "k"', function() {
      beforeEach(function() {
        $('#events').justKidding({ initialSelector: 1 });
        this.focusEvent = null; // erase the initial focus event from creation
        $('body').simulate('keypress', { charCode: 'k'.charCodeAt(0) });
      });

      it('should leave the current element selected', function() {
        this.afterJustKiddingEvents(function() {
          expect($('.current')).toHaveAttr('data-index', 1);
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
          expect($(this.outOfBoundsEvent.target)).toHaveAttr('data-index', 1);
        });
      });
    });

  });

});
