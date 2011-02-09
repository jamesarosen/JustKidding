## What ##

JustKidding is a jQuery widget that adds keyboard navigation to lists
and tables on your site.

## The Basics ##

Create a list on the page:

    <ol id='events'>
      <li>Hanna was eaten by a pterodactyl</li>
      <li>Jakob became a crab farmer</li>
      <li>Vijay is in an awkward relationship</li>
    </ol>

Add JustKidding to the list:

    jQuery('#events').justKidding();

Users can now navigate down and up the list using the *j* and *k* keys. Of
course, without some styling, they won't be able to *tell* that they're
navigating up and down the list. Thus, it's important to have styles like
the following on your page:

    .justKidding .current {
      background-color: #ddd;
    }

## More Details ##

### Styling

See `JustKidding.css` for more in-depth styling.

### Tables

Calling `justKidding` on a `<table>` will act as though it was called on
the `<table>`s `<tbody>` element if present. That is, rows within the
`<thead>` and `<tfoot>` will not be navigable.

### Events

JustKidding will fire the following events during its life-cycle:

<dl>
  <dt><code>focus.justKidding</code></dt>
  <dd>
    Fired on the newly-selected element after a keypress if the cursor
    moves (i.e. if there are more elements in the direction indicated).
  </dd>

  <dt><code>blur.justKidding</code></dt>
  <dd>
    Fired on the previously-selected element after a keypress if the cursor
    moves (i.e. if there are more elements in the direction indicated).
  </dd>

  <dt><code>outofbounds.justKidding</code></dt>
  <dd>
    Fired on the currently-selected element after a keypress if the cursor
    cannot move in the specified direction.
  </dd>
</dl>

### Options

The widget accepts a number of options to fine-tune behavior.

<dl>
  <dt><code>initialSelector</code></dt>
  <dd>
    determines which element in the list or table is selected on page load. It
    accepts either a number or a string. If a number, it is converted into an
    <code>nth-child</code> query. If a string, it is treated as a jQuery
    selector within the list or table. Defaults to <code>1</code>.
  </dd>

  <dt><code>wasd</code></dt>
  <dd>
    enables navigation with the <i>w</i> and <i>s</i> keys (up
    and down respectively). Defaults to <code>false</code>.
  </dd>

  <dt><code>vim</code></dt>
  <dd>
    enables navigation with the <i>j</i> and <i>k</i> keys
    (down and up respectively). Defaults to <code>true</code>.
  </dd>

  <dt><code>actOnEvent</code></dt>
  <dd>
    a function that returns true if JustKidding should act on an event.
    Defaults to returning <code>false</code> if the event's source was an
    <code>input</code> or <code>textarea</code>, <code>true</code> otherwise.
    (NB: JustKidding only listens for <code>keypress</code> that have no
    namespace or the namespace <code>justKidding</code>.)
  </dd>

  <dt><code>activationKeys</code></dt>
  <dd>
    When the user presses one of the keys in this list while focused on one of
    the elements, JustKidding will fire an activation event (see events,
    above). Defaults to <code>[ 13 ]</code> (the ENTER key).
  </dd>
</dl>

### Multiple lists or tables

JustKidding currently supports only one instance per page. I would like to
support multiple lists or tables per page, but that requires some sort of
mechanism to determine the currently-focused list or table. Currently,
subsequent calls to `justKidding()` will log a warning and return immediately.

## Contributing ##

For bug reports, open an
[issue](https://github.com/jamesarosen/JustKidding/issues) on GitHub.

JustKidding has a ‘commit-bit’ policy, much like the Rubinius project
and Gemcutter. Submit a patch that is accepted, and you can get full
commit access to the project. All you have to do is open an issue
asking for access and I'll add you as a collaborator.
Feel free to fork the project though and have fun in your own sandbox.

Code style:

 * 2 space indent
 * all conditional and loop blocks have `{ }`
 * not picky about spaces around arguments
 * all code must pass JSLint with fairly strict settings
