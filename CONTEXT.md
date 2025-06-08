# LinkeDOM Development Context

## Build/Test Commands

-  `npm run build` - Full build: TypeScript compilation, CJS conversion, rollup bundling, and tests
-  `npm run tsc` - TypeScript compilation (generates types from JSDoc)
-  `npm run cjs` - Convert ESM to CJS using ascjs
-  `npm test` - Run ESLint, hello test, benchmark, and full test suite with coverage
-  `npm run coverage` - Generate coverage report
-  `node test/index.js` - Run all tests (loads all .js files in test/ subdirectories)
-  `node test/html/element.js` - Run single test file
-  `node test/interface/style-sheets.js` - Run Document.styleSheets tests
-  `eslint esm/` - Lint source code

## Code Style & Conventions

-  **Modules**: ES modules only in source (`esm/`), CJS generated in `cjs/`
-  **Imports**: Relative paths with `.js` extensions, grouped by type (external, internal, shared)
-  **Naming**: camelCase for variables/functions, PascalCase for classes, UPPER_CASE for constants
-  **Types**: JSDoc comments for TypeScript generation (`@implements`, `@param`, `@returns`)
-  **Classes**: Export classes directly, use `@implements globalThis.InterfaceName` for DOM interfaces
-  **Error handling**: Throw `Error` objects with descriptive messages
-  **Comments**: JSDoc for public APIs, inline comments for complex logic, `/* c8 ignore */` for coverage exclusions
-  **Formatting**: 2-space indentation, semicolons, single quotes for strings
-  **Constants**: Import from `../shared/constants.js`, use symbols from `../shared/symbols.js`

## Project Structure

-  `esm/` - ES module source code (main development)
-  `cjs/` - CommonJS build output (generated)
-  `types/` - TypeScript definitions (generated from JSDoc)
-  `test/` - Test files organized by module (html/, interface/, shared/, etc.)
-  Dual package.json exports for ESM/CJS compatibility

## Recent Updates

-  **Document.styleSheets**: Implemented web standard `Document.styleSheets` property returning `StyleSheetList` of `CSSStyleSheet` objects from `<style>` and `<link rel="stylesheet">` elements
-  **Window.getComputedStyle**: Implemented web standard `window.getComputedStyle()` method that returns read-only computed styles for DOM elements

## Session Documentation

-  **SESSION_NOTES.md**: Contains detailed session notes, implementation decisions, and progress tracking for development work. Check this file to understand recent changes and the reasoning behind implementation choices.
