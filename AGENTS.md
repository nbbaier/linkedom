# Agent Guidelines

## Commands
- **Build**: `npm run build` (TSC -> CJS -> Rollup -> Test)
- **Test**: `npm test` (All), `node test/index.js` (All via Node)
- **Single Test**: `node test/path/to/file.js` (e.g. `node test/html/anchor-element.js`)
- **Lint**: `eslint esm/`
- **Types**: `npm run tsc` (Generates types from JSDoc)

## Code Style & Conventions
- **Source**: Edit `esm/` (ES Modules) ONLY. `cjs/` and `types/` are generated.
- **Imports**: Relative paths with `.js` extension. Group by external/internal/shared.
- **Formatting**: 2 spaces indent, semicolons, single quotes.
- **Types**: Use JSDoc (`@implements`, `@param`, `@returns`). NO TypeScript syntax in .js files.
- **Naming**: camelCase (vars/funcs), PascalCase (classes), UPPER_CASE (constants).
- **Classes**: Export directly. Use `@implements globalThis.InterfaceName` for DOM interfaces.
- **Error Handling**: Throw `Error` with descriptive messages.
- **Coverage**: Use `/* c8 ignore */` for intentional exclusions.
