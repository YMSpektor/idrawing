import { Region, RegionData, Point } from "..";
import { SvgNode } from ".";
import { SvgBuilder } from "./svg-builder";

class SvgRegionData implements RegionData {
    private builder: SvgBuilder;

    constructor(root: SvgNode, private fill: string) {
        this.builder = new SvgBuilder(root);
    }

    rect(x1: number, y1: number, x2: number, y2: number): void {
        this.builder.rect(x1, y1, x2, y2, {stroke: 'none', fill: this.fill});
    }

    circle(cx: number, cy: number, r: number): void {
        this.builder.circle(cx, cy, r, {stroke: 'none', fill: this.fill});
    }

    ellipse(cx: number, cy: number, rx: number, ry: number): void {
        this.builder.ellipse(cx, cy, rx, ry, {stroke: 'none', fill: this.fill});
    }

    polygon(pts: Point[]): void {
        this.builder.polygon(pts, {stroke: 'none', fill: this.fill});
    }

    closedCurve(pts: Point[], smoothing?: number): void {
        this.builder.curve(pts, true, smoothing, {stroke: 'none', fill: this.fill});
    }
}

export class SvgRegion implements Region {
    private includes: SvgRegionData;
    private excludes: SvgRegionData;

    constructor(private root: SvgNode) { 
        this.includes = new SvgRegionData(root, '#fff');
        this.excludes = new SvgRegionData(root, '#000');
    }

    include(callback: (r: RegionData) => void): void {
        callback(this.includes);
    }

    exclude(callback: (r: RegionData) => void): void {
        callback(this.excludes);
    }
}