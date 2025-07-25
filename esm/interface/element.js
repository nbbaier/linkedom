// https://dom.spec.whatwg.org/#interface-element

import {
	ATTRIBUTE_NODE,
	BLOCK_ELEMENTS,
	CDATA_SECTION_NODE,
	COMMENT_NODE,
	ELEMENT_NODE,
	NODE_END,
	TEXT_NODE,
	SVG_NAMESPACE,
} from "../shared/constants.js";

import {
	setAttribute,
	removeAttribute,
	numericAttribute,
	stringAttribute,
} from "../shared/attributes.js";

import {
	CLASS_LIST,
	DATASET,
	STYLE,
	END,
	NEXT,
	PREV,
	START,
	MIME,
} from "../shared/symbols.js";

import {
	htmlToFragment,
	ignoreCase,
	knownAdjacent,
	localCase,
	String,
} from "../shared/utils.js";

import { elementAsJSON } from "../shared/jsdon.js";
import { matches, prepareMatch } from "../shared/matches.js";
import { shadowRoots } from "../shared/shadow-roots.js";

import {
	isConnected,
	parentElement,
	previousSibling,
	nextSibling,
} from "../shared/node.js";
import {
	previousElementSibling,
	nextElementSibling,
} from "../mixin/non-document-type-child-node.js";

import { before, after, replaceWith, remove } from "../mixin/child-node.js";
import { getInnerHtml, setInnerHtml } from "../mixin/inner-html.js";
import { ParentNode } from "../mixin/parent-node.js";

import { DOMStringMap } from "../dom/string-map.js";
import { DOMTokenList } from "../dom/token-list.js";

import { CSSStyleDeclaration } from "./css-style-declaration.js";
import { Event } from "./event.js";
import { NamedNodeMap } from "./named-node-map.js";
import { ShadowRoot } from "./shadow-root.js";
import { NodeList } from "./node-list.js";
import { Attr } from "./attr.js";
import { Text } from "./text.js";
import { escape } from "../shared/text-escaper.js";

// <utils>
const attributesHandler = {
	get(target, key) {
		return key in target
			? target[key]
			: target.find(({ name }) => name === key);
	},
};

const create = (ownerDocument, element, localName) => {
	if ("ownerSVGElement" in element) {
		const svg = ownerDocument.createElementNS(SVG_NAMESPACE, localName);
		svg.ownerSVGElement = element.ownerSVGElement;
		return svg;
	}
	return ownerDocument.createElement(localName);
};

const isVoid = ({ localName, ownerDocument }) => {
	return ownerDocument[MIME].voidElements.test(localName);
};

// </utils>

/**
 * @implements globalThis.Element
 */
export class Element extends ParentNode {
	constructor(ownerDocument, localName) {
		super(ownerDocument, localName, ELEMENT_NODE);
		this[CLASS_LIST] = null;
		this[DATASET] = null;
		this[STYLE] = null;
	}

	// <Mixins>
	get isConnected() {
		return isConnected(this);
	}
	get parentElement() {
		return parentElement(this);
	}
	get previousSibling() {
		return previousSibling(this);
	}
	get nextSibling() {
		return nextSibling(this);
	}
	get namespaceURI() {
		return "http://www.w3.org/1999/xhtml";
	}

	get previousElementSibling() {
		return previousElementSibling(this);
	}
	get nextElementSibling() {
		return nextElementSibling(this);
	}

	before(...nodes) {
		before(this, nodes);
	}
	after(...nodes) {
		after(this, nodes);
	}
	replaceWith(...nodes) {
		replaceWith(this, nodes);
	}
	remove() {
		remove(this[PREV], this, this[END][NEXT]);
	}
	// </Mixins>

	// <specialGetters>
	get id() {
		return stringAttribute.get(this, "id");
	}
	set id(value) {
		stringAttribute.set(this, "id", value);
	}

	get className() {
		return this.classList.value;
	}
	set className(value) {
		const { classList } = this;
		classList.clear();
		classList.add(...String(value).split(/\s+/));
	}

	get nodeName() {
		return localCase(this);
	}
	get tagName() {
		return localCase(this);
	}

	get classList() {
		if (!this[CLASS_LIST]) {
			this[CLASS_LIST] = new DOMTokenList(this);
		}
		return this[CLASS_LIST];
	}

	get dataset() {
		if (!this[DATASET]) {
			this[DATASET] = new DOMStringMap(this);
		}
		return this[DATASET];
	}

	getBoundingClientRect() {
		return {
			x: 0,
			y: 0,
			bottom: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			width: 0,
		};
	}

	get nonce() {
		return stringAttribute.get(this, "nonce");
	}
	set nonce(value) {
		stringAttribute.set(this, "nonce", value);
	}

	get style() {
		if (!this[STYLE]) {
			this[STYLE] = new CSSStyleDeclaration(this);
		}
		return this[STYLE];
	}

	get tabIndex() {
		return numericAttribute.get(this, "tabindex") || -1;
	}
	set tabIndex(value) {
		numericAttribute.set(this, "tabindex", value);
	}

	get slot() {
		return stringAttribute.get(this, "slot");
	}
	set slot(value) {
		stringAttribute.set(this, "slot", value);
	}
	// </specialGetters>

	// <contentRelated>
	get innerText() {
		const text = [];
		let { [NEXT]: next, [END]: end } = this;
		while (next !== end) {
			if (next.nodeType === TEXT_NODE) {
				text.push(next.textContent.replace(/\s+/g, " "));
			} else if (
				text.length &&
				next[NEXT] != end &&
				BLOCK_ELEMENTS.has(next.tagName)
			) {
				text.push("\n");
			}
			next = next[NEXT];
		}
		return text.join("");
	}

	/**
	 * @returns {String}
	 */
	get textContent() {
		const text = [];
		let { [NEXT]: next, [END]: end } = this;
		while (next !== end) {
			const nodeType = next.nodeType;
			if (nodeType === TEXT_NODE || nodeType === CDATA_SECTION_NODE)
				text.push(next.textContent);
			next = next[NEXT];
		}
		return text.join("");
	}

	set textContent(text) {
		this.replaceChildren();
		if (text != null && text !== "")
			this.appendChild(new Text(this.ownerDocument, text));
	}

	get innerHTML() {
		return getInnerHtml(this);
	}
	set innerHTML(html) {
		setInnerHtml(this, html);
	}

	get outerHTML() {
		return this.toString();
	}
	set outerHTML(html) {
		const template = this.ownerDocument.createElement("");
		template.innerHTML = html;
		this.replaceWith(...template.childNodes);
	}
	// </contentRelated>

	// <attributes>
	get attributes() {
		const attributes = new NamedNodeMap(this);
		let next = this[NEXT];
		while (next.nodeType === ATTRIBUTE_NODE) {
			attributes.push(next);
			next = next[NEXT];
		}
		return new Proxy(attributes, attributesHandler);
	}

	focus() {
		this.dispatchEvent(new Event("focus"));
	}

	getAttribute(name) {
		if (name === "class") return this.className;
		const attribute = this.getAttributeNode(name);
		return (
			attribute &&
			(ignoreCase(this) ? attribute.value : escape(attribute.value))
		);
	}

	getAttributeNode(name) {
		let next = this[NEXT];
		while (next.nodeType === ATTRIBUTE_NODE) {
			if (next.name === name) return next;
			next = next[NEXT];
		}
		return null;
	}

	getAttributeNames() {
		const attributes = new NodeList();
		let next = this[NEXT];
		while (next.nodeType === ATTRIBUTE_NODE) {
			attributes.push(next.name);
			next = next[NEXT];
		}
		return attributes;
	}

	hasAttribute(name) {
		return !!this.getAttributeNode(name);
	}
	hasAttributes() {
		return this[NEXT].nodeType === ATTRIBUTE_NODE;
	}

	removeAttribute(name) {
		if (name === "class" && this[CLASS_LIST]) this[CLASS_LIST].clear();
		let next = this[NEXT];
		while (next.nodeType === ATTRIBUTE_NODE) {
			if (next.name === name) {
				removeAttribute(this, next);
				return;
			}
			next = next[NEXT];
		}
	}

	removeAttributeNode(attribute) {
		let next = this[NEXT];
		while (next.nodeType === ATTRIBUTE_NODE) {
			if (next === attribute) {
				removeAttribute(this, next);
				return;
			}
			next = next[NEXT];
		}
	}

	setAttribute(name, value) {
		if (name === "class") this.className = value;
		else {
			const attribute = this.getAttributeNode(name);
			if (attribute) attribute.value = value;
			else setAttribute(this, new Attr(this.ownerDocument, name, value));
		}
	}

	setAttributeNode(attribute) {
		const { name } = attribute;
		const previously = this.getAttributeNode(name);
		if (previously !== attribute) {
			if (previously) this.removeAttributeNode(previously);
			const { ownerElement } = attribute;
			if (ownerElement) ownerElement.removeAttributeNode(attribute);
			setAttribute(this, attribute);
		}
		return previously;
	}

	toggleAttribute(name, force) {
		if (this.hasAttribute(name)) {
			if (!force) {
				this.removeAttribute(name);
				return false;
			}
			return true;
		} else if (force || arguments.length === 1) {
			this.setAttribute(name, "");
			return true;
		}
		return false;
	}
	// </attributes>

	// <ShadowDOM>
	get shadowRoot() {
		if (shadowRoots.has(this)) {
			const { mode, shadowRoot } = shadowRoots.get(this);
			if (mode === "open") return shadowRoot;
		}
		return null;
	}

	attachShadow(init) {
		if (shadowRoots.has(this)) throw new Error("operation not supported");
		// TODO: shadowRoot should be likely a specialized class that extends DocumentFragment
		//       but until DSD is out, I am not sure I should spend time on this.
		const shadowRoot = new ShadowRoot(this);
		shadowRoots.set(this, {
			mode: init.mode,
			shadowRoot,
		});
		return shadowRoot;
	}
	// </ShadowDOM>

	// <selectors>
	matches(selectors) {
		return matches(this, selectors);
	}
	closest(selectors) {
		let parentElement = this;
		const matches = prepareMatch(parentElement, selectors);
		while (parentElement && !matches(parentElement))
			parentElement = parentElement.parentElement;
		return parentElement;
	}
	// </selectors>

	// <insertAdjacent>
	insertAdjacentElement(position, element) {
		const { parentElement } = this;
		switch (position) {
			case "beforebegin":
				if (parentElement) {
					parentElement.insertBefore(element, this);
					break;
				}
				return null;
			case "afterbegin":
				this.insertBefore(element, this.firstChild);
				break;
			case "beforeend":
				this.insertBefore(element, null);
				break;
			case "afterend":
				if (parentElement) {
					parentElement.insertBefore(element, this.nextSibling);
					break;
				}
				return null;
		}
		return element;
	}

	insertAdjacentHTML(position, html) {
		this.insertAdjacentElement(
			position,
			htmlToFragment(this.ownerDocument, html),
		);
	}

	insertAdjacentText(position, text) {
		const node = this.ownerDocument.createTextNode(text);
		this.insertAdjacentElement(position, node);
	}
	// </insertAdjacent>

	cloneNode(deep = false) {
		const { ownerDocument, localName } = this;
		const addNext = (next) => {
			next.parentNode = parentNode;
			knownAdjacent($next, next);
			$next = next;
		};
		const clone = create(ownerDocument, this, localName);
		let parentNode = clone,
			$next = clone;
		let { [NEXT]: next, [END]: prev } = this;
		while (next !== prev && (deep || next.nodeType === ATTRIBUTE_NODE)) {
			switch (next.nodeType) {
				case NODE_END:
					knownAdjacent($next, parentNode[END]);
					$next = parentNode[END];
					parentNode = parentNode.parentNode;
					break;
				case ELEMENT_NODE: {
					const node = create(ownerDocument, next, next.localName);
					addNext(node);
					parentNode = node;
					break;
				}
				case ATTRIBUTE_NODE: {
					const attr = next.cloneNode(deep);
					attr.ownerElement = parentNode;
					addNext(attr);
					break;
				}
				case TEXT_NODE:
				case COMMENT_NODE:
				case CDATA_SECTION_NODE:
					addNext(next.cloneNode(deep));
					break;
			}
			next = next[NEXT];
		}
		knownAdjacent($next, clone[END]);
		return clone;
	}

	// <custom>
	toString() {
		const out = [];
		const { [END]: end } = this;
		let next = { [NEXT]: this };
		let isOpened = false;
		do {
			next = next[NEXT];
			switch (next.nodeType) {
				case ATTRIBUTE_NODE: {
					const attr = " " + next;
					switch (attr) {
						case " id":
						case " class":
						case " style":
							break;
						default:
							out.push(attr);
					}
					break;
				}
				case NODE_END: {
					const start = next[START];
					if (isOpened) {
						if ("ownerSVGElement" in start) out.push(" />");
						else if (isVoid(start)) out.push(ignoreCase(start) ? ">" : " />");
						else out.push(`></${start.localName}>`);
						isOpened = false;
					} else out.push(`</${start.localName}>`);
					break;
				}
				case ELEMENT_NODE:
					if (isOpened) out.push(">");
					if (next.toString !== this.toString) {
						out.push(next.toString());
						next = next[END];
						isOpened = false;
					} else {
						out.push(`<${next.localName}`);
						isOpened = true;
					}
					break;
				case TEXT_NODE:
				case COMMENT_NODE:
				case CDATA_SECTION_NODE:
					out.push((isOpened ? ">" : "") + next);
					isOpened = false;
					break;
			}
		} while (next !== end);
		return out.join("");
	}

	toJSON() {
		const json = [];
		elementAsJSON(this, json);
		return json;
	}
	// </custom>

	/* c8 ignore start */
	getAttributeNS(_, name) {
		return this.getAttribute(name);
	}
	getElementsByTagNameNS(_, name) {
		return this.getElementsByTagName(name);
	}
	hasAttributeNS(_, name) {
		return this.hasAttribute(name);
	}
	removeAttributeNS(_, name) {
		this.removeAttribute(name);
	}
	setAttributeNS(_, name, value) {
		this.setAttribute(name, value);
	}
	setAttributeNodeNS(attr) {
		return this.setAttributeNode(attr);
	}
	/* c8 ignore stop */
}
