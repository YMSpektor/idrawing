import { SvgBuilder } from "./svg-builder";
import { SvgNode } from "./svg-node";
import { IDrawing } from "..";

export class SvgDrawing extends SvgBuilder implements IDrawing {

    constructor () {
        const svg = new SvgNode('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'version': '1.1'
        });
        super(svg);
    }

    toString(): string {
        return this.root.toString();
    }
}