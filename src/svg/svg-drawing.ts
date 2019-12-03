import { AbstractSvgBuilder } from "./svg-builder";
import { SvgNode } from "./svg-node";
import { IDrawing, IRegion, IPath } from "..";
import { SvgRegion } from "./svg-region";

export class SvgDrawing extends AbstractSvgBuilder implements IDrawing {
    private nextRegionId = 0;
    private defs: SvgNode;
    private styles: SvgNode;

    constructor () {
        super(new SvgNode('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'version': '1.1',
            'xmlns:xlink': "http://www.w3.org/1999/xlink"
        }));
        this.defs = new SvgNode('defs');
        this.root.add(this.defs);
        this.styles = new SvgNode('style', {type: 'text/css'});
        this.defs.add(this.styles);
    }

    private generateRegionId(): string {
        return `rg_${this.nextRegionId++}`;
    }

    createRegion(): IRegion {
        const id = this.generateRegionId();
        const node = new SvgNode('mask', {id: id});
        return new SvgRegion(this, node, id);
    }

    createPath(): IPath {
        throw new Error("Method not implemented.");
    }

    addPattern(svgPattern: string | SvgNode) {
        this.defs.add(svgPattern);
    }

    addStyle(svgStyle: string | SvgNode) {
        this.styles.add(svgStyle);
    }

    toString(): string {
        return this.root.toString();
    }
}