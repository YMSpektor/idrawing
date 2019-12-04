import { AbstractSvgBuilder } from "./svg-builder";
import { SvgNode } from "./svg-node";
import { IDrawing, IRegion, IPath } from "..";
import { SvgRegion } from "./svg-region";
import { SvgPath } from "./svg-path";

export class SvgDrawing extends AbstractSvgBuilder implements IDrawing {
    private nextRegionId = 0;
    private nextPathId = 0;
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

    private generatePathId(): string {
        return `path_${this.nextPathId++}`;
    }

    createRegion(): IRegion {
        const id = this.generateRegionId();
        const region = new SvgRegion(this, id);
        this.defs.add(region.root);
        return region;
    }

    createPath(): IPath {
        const id = this.generatePathId();
        const path = new SvgPath(id);
        this.defs.add(path.root);
        return path;
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