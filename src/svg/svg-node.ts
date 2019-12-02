import { Attributes } from "..";

export class SvgNode {
    children: (SvgNode | string)[] = [];
    attributes: Attributes;

    constructor(public name: String, attributes?: Attributes) {
        this.attributes = attributes || {};
    }

    add(node: SvgNode | string) {
        this.children.push(node);
    }

    clear() {
        this.children = [];
    }

    toString(): string {
        const attrStr = Object.keys(this.attributes).reduce((acc, attr) => `${acc} ${attr}="${this.attributes[attr]}"` , '');
        const childrenStr = this.children.map(x => x.toString());
        return `<${this.name}${attrStr}>${childrenStr.join('')}</${this.name}>`;
    }
}