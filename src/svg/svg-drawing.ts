import { AbstractSvgBuilder } from "./svg-builder";
import { SvgNode } from "./svg-node";
import { IDrawing, IRegion, IPath } from "..";
import { SvgRegion } from "./svg-region";
import { SvgPath } from "./svg-path";
import { Attributes } from "../common";

export class SvgDrawing extends AbstractSvgBuilder implements IDrawing {
    private nextRegionId = 0;
    private nextPathId = 0;
    private defs: SvgNode;
    private styles: SvgNode;

    constructor (size?: {width: number, height: number}) {
        super(new SvgNode('svg', SvgDrawing.getSvgAttributes(size)));
        this.defs = new SvgNode('defs');
        this.root.add(this.defs);
        this.styles = new SvgNode('style', {type: 'text/css'});
        this.defs.add(this.styles);
    }

    private static getSvgAttributes(size?: {width: number, height: number}): Attributes {
        const result: Attributes = {
            'version': '1.1',
            'xmlns': 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink'
        };
        if (size) {
            result['viewBox'] = `0 0 ${size.width} ${size.height}`;
        }
        return result;
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

    addStyle(selector: string, style: string) {
        this.styles.add(`${selector} {${style}}`);
    }

    svg(): string {
        return this.root.toString();
    }
}