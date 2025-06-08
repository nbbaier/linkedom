const assert = require('../assert.js').for('Document.styleSheets');

const {parseHTML} = global[Symbol.for('linkedom')];

// Test basic styleSheets property
const {document} = parseHTML(`
<!DOCTYPE html>
<html>
<head>
  <style>body { color: red; }</style>
  <link rel="stylesheet" href="test.css">
  <link rel="icon" href="favicon.ico">
  <style>p { margin: 0; }</style>
</head>
<body>
  <p>Test</p>
</body>
</html>
`);

// Test that styleSheets property exists and is a StyleSheetList
assert(typeof document.styleSheets, 'object', 'document.styleSheets should be an object');
assert(document.styleSheets.constructor.name, 'StyleSheetList', 'should be a StyleSheetList');

// Test that it contains the correct number of stylesheets
// Should include 2 style elements and 1 link with rel="stylesheet" (not the icon link)
assert(document.styleSheets.length, 3, 'should contain 3 stylesheets');

// Test that each item is a CSSStyleSheet
for (let i = 0; i < document.styleSheets.length; i++) {
  const sheet = document.styleSheets[i];
  assert(sheet !== null, true, `stylesheet ${i} should not be null`);
  assert(typeof sheet, 'object', `stylesheet ${i} should be an object`);
}

// Test item() method
assert(document.styleSheets.item(0) !== null, true, 'item(0) should return a stylesheet');
assert(document.styleSheets.item(999), null, 'item(999) should return null');

// Test that adding new style elements updates the list
const newStyle = document.createElement('style');
newStyle.textContent = 'h1 { font-size: 2em; }';
document.head.appendChild(newStyle);

assert(document.styleSheets.length, 4, 'should contain 4 stylesheets after adding new style');

// Test that the new stylesheet is accessible
const lastSheet = document.styleSheets[document.styleSheets.length - 1];
assert(lastSheet !== null, true, 'last stylesheet should not be null');

console.log('✓ Document.styleSheets tests passed');