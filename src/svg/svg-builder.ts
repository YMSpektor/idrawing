import { Attributes, Point, Alignment } from "..";
import { SvgNode } from "./svg-node";
import { SvgRegion } from "./svg-region";
import { SvgDrawing } from "./svg-drawing";
import { IRegion, IPath } from "../idrawing";
import { SvgPath } from "./svg-path";
import { Geometry } from "../utils";

export abstract class AbstractSvgBuilder {
    private currentNode: SvgNode;

    constructor(public root: SvgNode) {
        this.currentNode = root;
    }

    line(x1: number, y1: number, x2: number, y2: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.x1 = x1;
        attributes.y1 = y1;
        attributes.x2 = x2;
        attributes.y2 = y2;
        this.currentNode.add(new SvgNode('line', attributes));
    }

    rect(x: number, y: number, width: number, height: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.x = x;
        attributes.y = y;
        attributes.width = width;
        attributes.height = height;
        this.currentNode.add(new SvgNode('rect', attributes));
    }

    circle(cx: number, cy: number, r: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.cx = cx;
        attributes.cy = cy;
        attributes.r = r;
        this.currentNode.add(new SvgNode('circle', attributes));
    }

    ellipse(cx: number, cy: number, rx: number, ry: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.cx = cx;
        attributes.cy = cy;
        attributes.rx = rx;
        attributes.ry = ry;
        this.currentNode.add(new SvgNode('ellipse', attributes));
    }

    polyline(pts: Point[], attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.points = pts.reduce((acc, p) => `${acc} ${p.x},${p.y}`, '').trim();
        this.currentNode.add(new SvgNode('polyline', attributes));
    }

    polygon(pts: Point[], attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.points = pts.reduce((acc, p) => `${acc} ${p.x},${p.y}`, '').trim();
        this.currentNode.add(new SvgNode('polygon', attributes));
    }

    polybezier(pts: Point[], attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.d = pts.reduce((acc, point, i) => i === 0
            ? `M${point.x},${point.y}`
            : `${acc} ${(i - 1) % 3 === 0 ? 'C' : ''}${point.x},${point.y}`
        , '');
        this.currentNode.add(new SvgNode('path', attributes));
    }

    curve(pts: Point[], closed: boolean = false, smoothing: number = 0.25, attributes?: Attributes): void {
        pts = Geometry.curveToPolybezier(pts, closed, smoothing);
        this.polybezier(pts, attributes);
    }

    text(text: string, x: number, y: number, align: Alignment, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.x = x;
        attributes.y = y;
        attributes['text-anchor'] = Alignment[align].toLowerCase();
        const textNode = new SvgNode('text', attributes);
        textNode.add(text);
        this.currentNode.add(textNode);
    }

    region(region: IRegion, attributes?: Attributes): void {
        this.clip(region, () => {
            const bounds = region.getBounds();
            attributes = attributes || {};
            attributes.style = `stroke: none`;
            this.rect(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1, attributes);
        });
    }

    path(path: IPath, attributes?: Attributes): void {
        const svgPath = path as SvgPath;
        attributes = attributes || {};
        const pathNode = new SvgNode('use', {...attributes, 'xlink:href': `#${svgPath.id}`});
        this.currentNode.add(pathNode);
    }

    public abstract createRegion(): IRegion;
    public abstract createPath(): IPath;
    
    clip(region: IRegion, callback: () => void) {
        const svgRegion = region as SvgRegion;
        const g = new SvgNode('g', {mask: `url(#${svgRegion.id})`});
        this.currentNode.add(g);
        const oldCurrentNode = this.currentNode;
        this.currentNode = g;
        try {
            callback();
        }
        finally {
            this.currentNode = oldCurrentNode;
        }
    }
}

export class SvgBuilder extends AbstractSvgBuilder {
    constructor(public drawing: SvgDrawing, root: SvgNode) {
        super(root);
    }

    public createRegion(): IRegion {
        return this.drawing.createRegion();
    }

    public createPath(): IPath {
        return this.drawing.createPath();
    }
}