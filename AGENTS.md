# LinkeDOM (fork)

Triple-linked-list DOM for Node/Workers. Performance and linear scaling beat spec
compliance; this is not JSDOM. Fork purpose: `document.styleSheets` and
`window.getComputedStyle` for kepano/defuddle.

## Source and build
- Edit `esm/` only. `cjs/` and `types/` are generated and committed: regenerate
  with `npm run cjs` / `npm run tsc` and commit them with the `esm/` change.
- **Tests import `cjs/`, not `esm/`.** After editing `esm/`, run `npm run cjs`
  before `node test/<dir>/<file>.js`, or you are testing stale code.
- `npm test` is the gate: lint, benchmark smoke test, both test passes, coverage.

## Where things live
- Window/global APIs (`getComputedStyle`, `CustomEvent`, …): the `defaultView`
  proxy in `esm/interface/document.js`.
- Fork CSS support: `esm/interface/style-sheet-list.js`,
  `esm/interface/css-style-declaration.js`, symbol `STYLE_SHEETS`; examples in
  `test/interface/style-sheets*.js`.
- Private state is keyed by symbols in `esm/shared/symbols.js`.

## Before writing code
- Adding or changing an element class, attribute accessor, or test: read
  `CODING_STANDARDS.md`.
- Touching node traversal or insertion (`shared/node.js`, `mixin/`): read
  `deep-dive.md`.
