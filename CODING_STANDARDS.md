# Coding standards

## Coverage
Coverage must stay at 100%. Trivial HTML element accessors may sit inside
`/* c8 ignore start */ … /* c8 ignore stop */` instead of being tested;
everything else gets a test.

## Tests
- Mirror the `esm/` path under `test/`. Name the suite after the class tested:
  `const assert = require('../assert.js').for('HTMLAnchorElement');`
- Get the API via `global[Symbol.for('linkedom')]`. Every file runs twice
  (`linkedom`, then `linkedom/cached`), so assertions must hold under both.

## Element classes
- Mark DOM interfaces with `@implements globalThis.<Interface>`. Types come
  from JSDoc; `.js` files stay plain JS.
- Register tag names with `registerHTMLClass('tag', Class)` (array for several).
- Attribute accessors use `booleanAttribute` / `numericAttribute` /
  `stringAttribute` from `shared/attributes.js`.
- See `how-to-contribute.md` § HTMLClasses for a worked commit.

## Collections are static
`childNodes`, `children`, `getElementsBy*`, `attributes`, `document.all` are
snapshots that never update. Loop on live state (`while (el.firstChild)`) or
spread (`target.append(...el.children)`), never on a held collection's
`.length`.

## Scope
Supported node types: element, attribute, text, comment, document, fragment,
doctype. Leave others unimplemented.
