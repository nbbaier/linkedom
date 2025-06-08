import {NodeList} from './node-list.js';

/**
 * @implements globalThis.StyleSheetList
 */
export class StyleSheetList extends NodeList {
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