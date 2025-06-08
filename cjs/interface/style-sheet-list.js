'use strict';
const {NodeList} = require('./node-list.js');

/**
 * @implements globalThis.StyleSheetList
 */
class StyleSheetList extends NodeList {
  constructor() {
    super();
  }

  /**
   * @param {number} index
   * @returns {CSSStyleSheet|null}
   */
  item(index) {
    return this[index] || null;
  }

  /**
   * @returns {number}
   */
  get length() {
    return super.length;
  }
}
exports.StyleSheetList = StyleSheetList