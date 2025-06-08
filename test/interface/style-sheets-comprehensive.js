const assert = require('../assert.js').for('Document.styleSheets comprehensive');

const {parseHTML} = global[Symbol.for('linkedom')];

// Test comprehensive styleSheets functionality
const {document} = parseHTML(`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      color: red; 
      font-family: Arial;
    }
  </style>
  <link rel="stylesheet" href="external.css" type="text/css">
  <link rel="icon" href="favicon.ico">
  <style>
    p { 
      margin: 0; 
      padding: 10px;
    }
  </style>
  <link rel="stylesheet" href="another.css">
</head>
<body>
  <p>Test content</p>
</body>
</html>
`);

console.log('Testing Document.styleSheets comprehensive functionality...');

// Test basic properties
assert(typeof document.styleSheets, 'object', 'styleSheets should be an object');
assert(document.styleSheets.constructor.name, 'StyleSheetList', 'should be a StyleSheetList');
assert(document.styleSheets.length, 4, 'should contain 4 stylesheets (2 style + 2 link[rel=stylesheet])');

// Test that each stylesheet is a CSSStyleSheet object
for (let i = 0; i < document.styleSheets.length; i++) {
  const sheet = document.styleSheets[i];
  assert(sheet !== null, true, `stylesheet ${i} should not be null`);
  assert(typeof sheet, 'object', `stylesheet ${i} should be an object`);
  assert(typeof sheet.cssRules, 'object', `stylesheet ${i} should have cssRules`);
}

// Test item() method
assert(document.styleSheets.item(0) !== null, true, 'item(0) should return first stylesheet');
assert(document.styleSheets.item(1) !== null, true, 'item(1) should return second stylesheet');
assert(document.styleSheets.item(999), null, 'item(999) should return null for out-of-bounds');

// Test array-like access
assert(document.styleSheets[0] !== null, true, 'array access [0] should work');
assert(document.styleSheets[1] !== null, true, 'array access [1] should work');

// Test that non-stylesheet links are excluded
const iconLinks = document.querySelectorAll('link[rel="icon"]');
assert(iconLinks.length, 1, 'should have one icon link');
// Icon link should not contribute to styleSheets

// Test dynamic addition of stylesheets
const newStyle = document.createElement('style');
newStyle.textContent = 'h1 { font-size: 2em; color: blue; }';
document.head.appendChild(newStyle);

// StyleSheets should be updated dynamically
assert(document.styleSheets.length, 5, 'should contain 5 stylesheets after adding new style');

const newLink = document.createElement('link');
newLink.rel = 'stylesheet';
newLink.href = 'dynamic.css';
document.head.appendChild(newLink);

assert(document.styleSheets.length, 6, 'should contain 6 stylesheets after adding new link');

// Test that the new stylesheets are accessible and valid
const lastSheet = document.styleSheets[document.styleSheets.length - 1];
assert(lastSheet !== null, true, 'last stylesheet should not be null');

// Test that non-stylesheet links don't get added
const newIcon = document.createElement('link');
newIcon.rel = 'icon';
newIcon.href = 'new-icon.ico';
document.head.appendChild(newIcon);

assert(document.styleSheets.length, 6, 'should still contain 6 stylesheets after adding icon link');

console.log('✓ All Document.styleSheets comprehensive tests passed');