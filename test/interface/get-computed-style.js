const assert = require('../assert.js').for('getComputedStyle');

const {parseHTML} = global[Symbol.for('linkedom')];

const {document, window} = parseHTML(`
<!DOCTYPE html>
<html>
<head>
  <style>
    .test { color: red; font-size: 16px; }
  </style>
</head>
<body>
  <div class="test" style="margin: 10px;">Test element</div>
</body>
</html>
`);

// Test that getComputedStyle exists on window
assert(typeof window.getComputedStyle, 'function', 'getComputedStyle is a function');

const element = document.querySelector('.test');
assert(!!element, true, 'test element found');

// Test calling getComputedStyle with valid element
const computedStyle = window.getComputedStyle(element);
assert(!!computedStyle, true, 'getComputedStyle returns an object');
assert(typeof computedStyle.getPropertyValue, 'function', 'computed style has getPropertyValue method');

// Test getting inline style property
assert(computedStyle.getPropertyValue('margin'), '10px', 'can get inline style property');
assert(computedStyle['margin'], '10px', 'can get property via bracket notation');

// Test that computed style is read-only (should not throw, but should not change)
const originalMargin = computedStyle.getPropertyValue('margin');
computedStyle.setProperty('color', 'blue'); // Should be no-op
assert(computedStyle.getPropertyValue('margin'), originalMargin, 'computed style remains unchanged after setProperty');

computedStyle.removeProperty('margin'); // Should be no-op
assert(computedStyle.getPropertyValue('margin'), originalMargin, 'computed style remains unchanged after removeProperty');

// Test error cases
try {
  window.getComputedStyle(null);
  assert(false, true, 'should throw for null element');
} catch (error) {
  assert(error.message.includes('parameter 1 is not of type \'Element\''), true, 'throws correct error for null element');
}

try {
  window.getComputedStyle(document.createTextNode('text'));
  assert(false, true, 'should throw for text node');
} catch (error) {
  assert(error.message.includes('parameter 1 is not of type \'Element\''), true, 'throws correct error for text node');
}

// Test with pseudoElement parameter (should not throw)
const computedStyleWithPseudo = window.getComputedStyle(element, '::before');
assert(!!computedStyleWithPseudo, true, 'getComputedStyle works with pseudoElement parameter');