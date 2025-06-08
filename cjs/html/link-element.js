'use strict';
const {parse} = require('cssom');

const {registerHTMLClass} = require('../shared/register-html-class.js');
const {booleanAttribute, stringAttribute} = require('../shared/attributes.js');
const {SHEET} = require('../shared/symbols.js');

const {HTMLElement} = require('./element.js');

const tagName = 'link';

/**
 * @implements globalThis.HTMLLinkElement
 */
class HTMLLinkElement extends HTMLElement {
  constructor(ownerDocument, localName = tagName) {
    super(ownerDocument, localName);
    this[SHEET] = null;
  }

  /* c8 ignore start */ // copy paste from img.src, already covered
  get disabled() { return booleanAttribute.get(this, 'disabled'); }
  set disabled(value) { booleanAttribute.set(this, 'disabled', value); }

  get href() { return stringAttribute.get(this, 'href').trim(); }
  set href(value) { 
    stringAttribute.set(this, 'href', value);
    this[SHEET] = null; // Reset sheet when href changes
  }

  get hreflang() { return stringAttribute.get(this, 'hreflang'); }
  set hreflang(value) { stringAttribute.set(this, 'hreflang', value); }

  get media() { return stringAttribute.get(this, 'media'); }
  set media(value) { stringAttribute.set(this, 'media', value); }

  get rel() { return stringAttribute.get(this, 'rel'); }
  set rel(value) { 
    stringAttribute.set(this, 'rel', value);
    this[SHEET] = null; // Reset sheet when rel changes
  }

  get type() { return stringAttribute.get(this, 'type'); }
  set type(value) { stringAttribute.set(this, 'type', value); }

  /**
   * @returns {CSSStyleSheet|null}
   */
  get sheet() {
    if (this.rel !== 'stylesheet') {
      return null;
    }
    
    const sheet = this[SHEET];
    if (sheet !== null) {
      return sheet;
    }
    
    // For now, return an empty stylesheet since we can't fetch external resources
    // In a real implementation, this would fetch and parse the external CSS
    return this[SHEET] = parse('');
  }
  /* c8 ignore stop */

}

registerHTMLClass(tagName, HTMLLinkElement);

exports.HTMLLinkElement = HTMLLinkElement;
