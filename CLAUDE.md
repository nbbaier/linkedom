# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinkeDOM is a triple-linked list based DOM implementation for DOM-less environments (Node.js, Workers). It prioritizes performance and linear scalability while avoiding maximum callstack issues and heap crashes that plague other implementations. This is a **fork** that adds `doc.styleSheets` and `getComputedStyle` support for integration with kepano/defuddle.

**Key Design Principles:**
- Performance over 100% spec compliance (intentionally not JSDOM)
- Server-side rendering focused (not a browser simulator)
- Triple-linked list data structure for O(1) node manipulation
- No live collections (they're cached, not reactive)

## Development Commands

### Build & Test
```bash
npm run build          # Full build: tsc → cjs → rollup → test
npm run tsc            # TypeScript compilation (generates types from JSDoc)
npm run cjs            # Convert ESM to CJS using ascjs
npm test               # ESLint + hello test + benchmark + coverage
npm run coverage       # Generate lcov coverage report

# Run specific tests
node test/index.js                        # All tests (runs xml → svg → html → interface → shared)
node test/html/element.js                 # Single test file
node test/interface/style-sheets.js       # Specific interface test
```

### Benchmarks
```bash
npm run benchmark          # Quick benchmark
npm run benchmark:w3c      # W3C tests across implementations
npm run benchmark:dom      # DOM operations benchmark
npm run benchmark:html     # HTML parsing benchmark
```

### Linting
```bash
eslint esm/                # Lint source code
```

## Architecture

### Triple-Linked List Structure

Elements consist of TWO nodes (start + end) linked bidirectionally:
- `PREV` ← `START` ↔ attributes → children → `END` → `NEXT`
- `parentNode` points upward from `START`
- Fragments are elements without boundaries/parent

**Why this matters:** Moving N nodes requires only 4 pointer updates (no array operations), making DOM manipulation extremely fast and preventing stack overflows.

### Source Organization

**Source of truth:** `esm/` directory only. Never edit `cjs/` (auto-generated).

```
esm/
├── index.js                  # Main entry point, exports parseHTML/DOMParser
├── cached.js                 # Alternative entry with caching enabled
├── interface/                # Core DOM interfaces (Document, Element, Node, etc.)
│   ├── document.js           # Document class, defaultView proxy, custom elements
│   ├── element.js            # Element implementation, attribute handling
│   ├── node.js               # Base Node class
│   ├── style-sheet-list.js   # StyleSheetList implementation (fork addition)
│   └── css-style-declaration.js
├── html/                     # HTML element classes (HTMLDivElement, etc.)
│   ├── element.js            # Base HTMLElement
│   ├── style-element.js      # <style> element
│   └── [70+ element classes]
├── shared/                   # Utilities and core logic
│   ├── symbols.js            # Private property symbols (NEXT, PREV, START, END, etc.)
│   ├── constants.js          # Node type constants (ELEMENT_NODE, etc.)
│   ├── node.js               # Node traversal utilities (isConnected, nextSibling, etc.)
│   ├── attributes.js         # Attribute helpers (booleanAttribute, numericAttribute, stringAttribute)
│   ├── facades.js            # Public constructors that throw "Illegal constructor"
│   ├── html-classes.js       # HTML element class exports
│   ├── register-html-class.js # Associates tag names with element classes
│   └── utils.js              # Misc utilities (htmlToFragment, localCase, etc.)
├── mixin/                    # Mixin classes (ParentNode, NonElementParentNode, etc.)
├── svg/                      # SVG element classes
├── dom/                      # DOMParser implementation
└── xml/                      # XML parsing
```

**Key Symbols:** (from `shared/symbols.js`)
- `NEXT`, `PREV`, `START`, `END` - Triple-linked list pointers
- `MIME`, `DOCTYPE`, `CUSTOM_ELEMENTS`, `MUTATION_OBSERVER` - Document state
- `STYLE_SHEETS` - StyleSheet cache (fork addition)
- `CLASS_LIST`, `DATASET`, `STYLE` - Element private state

### Document.defaultView Proxy

The `document.defaultView` returns a proxy to `globalThis` that:
- Intercepts gets to provide Document/window-specific APIs (CustomEvent, Event, HTMLElement, etc.)
- Routes event methods (addEventListener) to the document's `EVENT_TARGET`
- Simulates a window object without global pollution

## Code Style & Conventions

### Modules & Imports
- ES modules only in `esm/` (type: "module")
- Use relative paths with `.js` extensions
- Group imports: external → interface → shared → mixin
- Dual package exports in package.json (ESM/CJS)

### Naming
- camelCase: variables, functions, parameters
- PascalCase: classes, constructors
- UPPER_CASE: constants from `shared/constants.js`
- Symbols: from `shared/symbols.js` for private properties

### JSDoc & TypeScript
- Use `@implements globalThis.InterfaceName` for DOM interface classes
- Add `@param` and `@returns` for public APIs
- TypeScript defs auto-generated from JSDoc via `tsc -p .`
- Coverage exclusions: `/* c8 ignore start */` ... `/* c8 ignore stop */`

### Classes & Registration
```js
import {registerHTMLClass} from '../shared/register-html-class.js';
import {HTMLElement} from './html-element.js';

/**
 * @implements globalThis.HTMLExampleElement
 */
class HTMLExampleElement extends HTMLElement {
  constructor(ownerDocument, localName = 'example') {
    super(ownerDocument, localName);
  }
}

// Register tag name(s) with class
registerHTMLClass('example', HTMLExampleElement);
// Or multiple: registerHTMLClass(['h1', 'h2', 'h3'], HTMLHeadingElement);

export {HTMLExampleElement};
```

### Attribute Helpers
```js
import {booleanAttribute, numericAttribute, stringAttribute} from '../shared/attributes.js';

// In element class:
get disabled() { return booleanAttribute.get(this, 'disabled'); }
set disabled(value) { booleanAttribute.set(this, 'disabled', value); }

get width() { return numericAttribute.get(this, 'width'); }
set width(value) { numericAttribute.set(this, 'width', value); }

get src() { return stringAttribute.get(this, 'src'); }
set src(value) { stringAttribute.set(this, 'src', value); }
```

### Formatting
- 2-space indentation
- Semicolons required
- Single quotes for strings

## Testing

### Test Structure
- Tests in `test/` mirror `esm/` structure
- Each test runs twice: once for `linkedom`, once for `linkedom/cached`
- Use `const assert = require('../assert.js').for('Test Name');`
- 100% code coverage required (use `c8 ignore` directives for uncovered but safe code)

### Coverage Guidelines
- New features need tests
- HTML element accessors can use `/* c8 ignore start/stop */` if trivial
- Run `npm run coverage` to generate HTML report in `coverage/`

## Important Constraints

### Live Collections NOT Supported
These do NOT update after initial access:
- `getElementsByTagName/ClassName`
- `childNodes`, `children` (if trapped once)
- `attributes`, `document.all`

**Safe patterns:**
```js
// ✓ Modern (best)
target.append(...element.children);

// ✓ Check existence
while (element.firstChild)
  target.appendChild(element.firstChild);

// ✗ INFINITE LOOP (children is static reference)
const {children} = element;
while (children.length)
  target.appendChild(children[0]);
```

### Cached vs Non-Cached
- `linkedom` - Default, minimal RAM, fast mutations, nothing cached
- `linkedom/cached` - Caches queries/lists, faster for static docs, slower mutations

**childNodes/children** are always recomputed (while loops, not arrays), unless using cached variant.

## Fork-Specific Features

This fork adds CSS support for defuddle integration:

### Document.styleSheets
- Returns `StyleSheetList` of `CSSStyleSheet` objects
- Collects from `<style>` and `<link rel="stylesheet">` elements
- Implementation: `esm/interface/style-sheet-list.js`
- Symbol: `STYLE_SHEETS` in `shared/symbols.js`

### window.getComputedStyle()
- Returns `CSSStyleDeclaration` for element computed styles
- Implementation: `esm/interface/css-style-declaration.js`
- See `test/interface/style-sheets.js` for usage examples

## Node Types Supported

Only these node types are parsed/supported:
- `ELEMENT_NODE`, `ATTRIBUTE_NODE`, `TEXT_NODE`
- `COMMENT_NODE`, `DOCUMENT_NODE`, `DOCUMENT_FRAGMENT_NODE`
- `DOCUMENT_TYPE_NODE`

Everything else (ProcessingInstruction, Entity, etc.) is considered YAGNI.

## Additional Resources

- `deep-dive.md` - Detailed explanation of triple-linked list architecture
- `how-to-contribute.md` - Contribution guidelines and HTMLClass patterns
- `SESSION_NOTES.md` - Recent implementation notes and decisions
