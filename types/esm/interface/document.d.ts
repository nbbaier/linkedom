/**
 * @implements globalThis.Document
 */
export class Document extends NonElementParentNode implements globalThis.Document {
    constructor(type: any);
    /**
     * @type {globalThis.Document['defaultView']}
     */
    get defaultView(): Window & typeof globalThis;
    set doctype(value: import("../mixin/parent-node.js").NodeStruct | DocumentType);
    get doctype(): import("../mixin/parent-node.js").NodeStruct | DocumentType;
    get documentElement(): import("../mixin/parent-node.js").NodeStruct;
    /**
     * @type {StyleSheetList}
     */
    get styleSheets(): StyleSheetList;
    /**
     * @protected
     */
    protected _getParent(): EventTarget;
    createAttribute(name: any): Attr;
    createCDATASection(data: any): CDATASection;
    createComment(textContent: any): Comment;
    createDocumentFragment(): DocumentFragment;
    createDocumentType(name: any, publicId: any, systemId: any): DocumentType;
    createElement(localName: any): Element;
    createRange(): Range;
    createTextNode(textContent: any): Text;
    createTreeWalker(root: any, whatToShow?: number): TreeWalker;
    createNodeIterator(root: any, whatToShow?: number): TreeWalker;
    createEvent(name: any): any;
    cloneNode(deep?: boolean): any;
    importNode(externalNode: any, ...args: any[]): any;
    querySelectorAll(selectors: any): any;
    getElementsByTagNameNS(_: any, name: any): NodeList;
    createAttributeNS(_: any, name: any): Attr;
    createElementNS(nsp: any, localName: any, options: any): Element;
    [CUSTOM_ELEMENTS]: {
        active: boolean;
        registry: any;
    };
    [MUTATION_OBSERVER]: {
        active: boolean;
        class: any;
    };
    [MIME]: any;
    /** @type {DocumentType} */
    [DOCTYPE]: DocumentType;
    [DOM_PARSER]: any;
    [GLOBALS]: any;
    [IMAGE]: any;
    [UPGRADE]: any;
    [STYLE_SHEETS]: any;
    [EVENT_TARGET]: EventTarget;
}
import { NonElementParentNode } from '../mixin/non-element-parent-node.js';
import { DocumentType } from './document-type.js';
import { StyleSheetList } from './style-sheet-list.js';
import { EventTarget } from './event-target.js';
import { Attr } from './attr.js';
import { CDATASection } from './cdata-section.js';
import { Comment } from './comment.js';
import { DocumentFragment } from './document-fragment.js';
import { Element } from './element.js';
import { Range } from './range.js';
import { Text } from './text.js';
import { TreeWalker } from './tree-walker.js';
import { NodeList } from './node-list.js';
import { CUSTOM_ELEMENTS } from '../shared/symbols.js';
import { MUTATION_OBSERVER } from '../shared/symbols.js';
import { MIME } from '../shared/symbols.js';
import { DOCTYPE } from '../shared/symbols.js';
import { DOM_PARSER } from '../shared/symbols.js';
import { GLOBALS } from '../shared/symbols.js';
import { IMAGE } from '../shared/symbols.js';
import { UPGRADE } from '../shared/symbols.js';
import { STYLE_SHEETS } from '../shared/symbols.js';
import { EVENT_TARGET } from '../shared/symbols.js';
