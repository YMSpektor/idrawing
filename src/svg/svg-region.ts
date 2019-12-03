import { IRegion, IRegionData, Point, Bounds } from "..";
import { SvgDrawing } from ".";
import { SvgBuilder } from "./svg-builder";
import { SvgNode } from "./svg-node";

class SvgRegionData implements IRegionData {
    private builder: SvgBuilder;
    private bounds?: Bounds;

    constructor(drawing: SvgDrawing, root: SvgNode, private fill: string) {
        this.builder = new SvgBuilder(drawing, root);
    }

    private addPoint(x: number, y: number) {
        if (!this.bounds) {
            this.bounds = {x1: x, y1: y, x2: x, y2: y};
        } else {
            this.bounds.x1 = Math.min(x, this.bounds.x1);
            this.bounds.y1 = Math.min(y, this.bounds.y1);
            this.bounds.x2 = Math.max(x, this.bounds.x2);
            this.bounds.y2 = Math.max(y, this.bounds.y2);
        }
    }

    rect(x: number, y: number, width: number, height: number): void {
        this.addPoint(x, y);
        this.addPoint(x + width, y + height);
        this.builder.rect(x, y, width, height, {stroke: 'none', fill: this.fill});
    }

    circle(cx: number, cy: number, r: number): void {
        this.addPoint(cx - r, cy - r);
        this.addPoint(cx + r, cy + r);
        this.builder.circle(cx, cy, r, {stroke: 'none', fill: this.fill});
    }

    ellipse(cx: number, cy: number, rx: number, ry: number): void {
        this.addPoint(cx - rx, cy - ry);
        this.addPoint(cx + rx, cy + ry);
        this.builder.ellipse(cx, cy, rx, ry, {stroke: 'none', fill: this.fill});
    }

    polygon(pts: Point[]): void {
        pts.forEach(x => this.addPoint(x.x, x.y));
        this.builder.polygon(pts, {stroke: 'none', fill: this.fill});
    }

    closedCurve(pts: Point[], smoothing?: number): void {
        pts.forEach(x => this.addPoint(x.x, x.y)); // TODO: calculate bounds more accurate
        this.builder.curve(pts, true, smoothing, {stroke: 'none', fill: this.fill});
    }

    getBounds(): Bounds {
        return this.bounds || {x1: 0, y1: 0, x2: 0, y2: 0};
    }
}

export class SvgRegion implements IRegion {
    private includes: SvgRegionData;
    private excludes: SvgRegionData;
    root: SvgNode;

    constructor(drawing: SvgDrawing, public id: string) {
        this.root = new SvgNode('mask', {id: id});
        this.includes = new SvgRegionData(drawing, this.root, '#fff');
        this.excludes = new SvgRegionData(drawing, this.root, '#000');
    }

    include(callback: (r: IRegionData) => void): void {
        callback(this.includes);
    }

    exclude(callback: (r: IRegionData) => void): void {
        callback(this.excludes);
    }

    getBounds(): Bounds {
        return this.includes.getBounds();
    }
}