import { Attributes, Point, Alignment, Region } from "..";
import { SvgNode } from "./svg-node";
import { svgPathPolybezier, svgPathCurve } from "./svg-path-helper";
import { SvgRegion } from "./svg-region";

export class SvgBuilder {
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

    rect(x1: number, y1: number, x2: number, y2: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.x = x1;
        attributes.y = y1;
        attributes.width = x2 - x1;
        attributes.height = y2 - y1;
        this.currentNode.add(new SvgNode('rect', attributes));
    }

    circle(cx: number, cy: number, r: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.x = cx;
        attributes.y = cy;
        attributes.r = r;
        this.currentNode.add(new SvgNode('circle', attributes));
    }

    ellipse(cx: number, cy: number, rx: number, ry: number, attributes?: Attributes): void {
        attributes = attributes || {};
        attributes.x = cx;
        attributes.y = cy;
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

    createRegion(): Region {
        const node = new SvgNode('mask');
        return new SvgRegion(node);
    }
}