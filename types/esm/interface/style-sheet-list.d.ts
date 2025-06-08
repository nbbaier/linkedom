/**
 * @implements globalThis.StyleSheetList
 */
export class StyleSheetList extends NodeList implements globalThis.StyleSheetList {
    constructor();
    /**
     * @param {number} index
     * @returns {CSSStyleSheet|null}
     */
    item(index: number): CSSStyleSheet | null;
    /**
     * @returns {number}
     */
    get length(): number;
}
import { NodeList } from './node-list.js';
