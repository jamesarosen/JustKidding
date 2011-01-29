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

### Events

JustKidding will fire the following events during its life-cycle:

#### `focus.justKidding`

Fired on the newly-selected element after a keypress if the cursor
moves (i.e. if there are more elements in the direction indicated).

#### `blur.justKidding`

Fired on the previously-selected element after a keypress if the cursor
moves (i.e. if there are more elements in the direction indicated).

#### `outofbounds.justKidding`

Fired on the currently-selected element after a keypress if the cursor
cannot move in the specified direction.

### Options

The widget accepts a number of options to fine-tune behavior.

#### `initialSelector`

The `initialSelector` option determines which element in the list or table
is selected on page load. It accepts either a number or a string. If a
number, it is converted into an `nth-child` query. If a string, it is
treated as a jQuery selector within the list or table. Defaults to `1`.

#### `wasd`

The `wasd` option enables navigation with the *w* and *s* keys (up
and down respectively). Defaults to `false`.

#### `vim`

The `vim` option enables navigation with the *j* and *k* keys
(down and up respectively). Defaults to `true`.

#### `tbodyOnly`

When `justKidding()` is called on a `<table>` element, this determines whether
all rows (`<tr>s`) are eligible for navigation or just those in the `<tbody>`.
Defaults to `true`.

#### `activationKeys`

When the user presses one of the keys in this list while focused on one of
the elements, JustKidding will fire an activation event (see events, above).
Defaults to `[ 13 ]` (the ENTER key).

### Multiple lists or tables

JustKidding currently supports only one instance per page. I would like to
support multiple lists or tables per page, but that requires some sort of
mechanism to determine the currently-focused list or table. Currently,
subsequent calls to `justKidding()` will log a warning and return immediately.

## Contributing ##

For bug reports, open an [issue](https://github.com/jamesarosen/JustKidding/issues)
on GitHub.

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
