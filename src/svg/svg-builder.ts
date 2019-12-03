import { Attributes, Point, Alignment } from "..";
import { SvgNode } from "./svg-node";
import { svgPathPolybezier, svgPathCurve } from "./svg-path-helper";
import { SvgRegion } from "./svg-region";
import { SvgDrawing } from "./svg-drawing";
import { IRegion, IPath } from "../idrawing";

export abstract class AbstractSvgBuilder {
    private currentNode: SvgNode;

    constructor(public root: SvgNode) {
        this.currentNode = root;
    }

    line(x1: number, y1: number, x2: number, y2: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.x1 = x1;
        attributes.y1 = y1;
        attributes.x2 = x1;
        attributes.y2 = y1;
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
        attributes.d = svgPathPolybezier(pts);
        this.currentNode.add(new SvgNode('path', attributes));
    }

    curve(pts: Point[], closed?: boolean, smoothing?: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.d = svgPathCurve(pts, closed, smoothing);
        this.currentNode.add(new SvgNode('path', attributes));
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
        throw new Error("Method not implemented."); // TODO
    }

    public abstract createRegion(): IRegion;
    public abstract createPath(): IPath;
    
    clip(region: IRegion, callback: () => void) {
        const svgRegion = region as SvgRegion;
        const g = new SvgNode('g', {mask: `url(#${svgRegion.id})`});
        g.add(svgRegion.root);
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