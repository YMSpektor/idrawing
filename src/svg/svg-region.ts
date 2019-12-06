import * as PolygonClipping from 'polygon-clipping';
import { MultiPolygon, Polygon, Pair } from 'polygon-clipping';

import { IRegion, IRegionData, Point, Bounds, IPath, Geometry, DRAWING_SETTINGS } from "..";
import { SvgDrawing } from ".";
import { SvgBuilder } from "./svg-builder";
import { SvgNode } from "./svg-node";
import { SvgPath } from './svg-path';

class SvgRegionData implements IRegionData {
    private builder: SvgBuilder;
    private bounds?: Bounds;
    private polygons: MultiPolygon = [];

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

    private ptsToPolygon(pts: Point[]): Polygon {
        return [pts.map(p => [p.x, p.y] as Pair)];
    }

    rect(x: number, y: number, width: number, height: number): void {
        this.addPoint(x, y);
        this.addPoint(x + width, y + height);
        this.builder.rect(x, y, width, height, {stroke: 'none', fill: this.fill});
        this.polygons.push([[[x,y],[x + width,y],[x + width,y + height],[x,y + height]]]);
    }

    circle(cx: number, cy: number, r: number): void {
        this.addPoint(cx - r, cy - r);
        this.addPoint(cx + r, cy + r);
        this.builder.circle(cx, cy, r, {stroke: 'none', fill: this.fill});
        this.polygons.push(this.ptsToPolygon(Geometry.approximateEllipse(cx, cy, r, r, DRAWING_SETTINGS.APPROX_ELLIPSE_LINES)));
    }

    ellipse(cx: number, cy: number, rx: number, ry: number): void {
        this.addPoint(cx - rx, cy - ry);
        this.addPoint(cx + rx, cy + ry);
        this.builder.ellipse(cx, cy, rx, ry, {stroke: 'none', fill: this.fill});
        this.polygons.push(this.ptsToPolygon(Geometry.approximateEllipse(cx, cy, rx, ry, DRAWING_SETTINGS.APPROX_ELLIPSE_LINES)));
    }

    polygon(pts: Point[]): void {
        pts.forEach(x => this.addPoint(x.x, x.y));
        this.builder.polygon(pts, {stroke: 'none', fill: this.fill});
        this.polygons.push(this.ptsToPolygon(pts));
    }

    closedCurve(pts: Point[], smoothing?: number): void {
        pts = Geometry.curveToPolybezier(pts, true, smoothing);
        const approxPts = Geometry.approximatePolybezier(pts, DRAWING_SETTINGS.APPROX_CURVE_MAX_DEVIATION);
        approxPts.forEach(x => this.addPoint(x.x, x.y));
        this.builder.polybezier(pts, {stroke: 'none', fill: this.fill});
        this.polygons.push(this.ptsToPolygon(approxPts));
    }

    path(path: IPath): void {
        this.builder.path(path, {stroke: 'none', fill: this.fill});
        const svgPath = path as SvgPath;
        const pathPolygons = svgPath.getPolygons();
        pathPolygons.forEach(polygon => {
            polygon.forEach(ring => {
                ring.forEach(pair => this.addPoint(pair[0], pair[1]));
            })
        });
        this.polygons.push(...pathPolygons);
    }

    getBounds(): Bounds {
        return this.bounds || {x1: 0, y1: 0, x2: 0, y2: 0};
    }

    getPolygons(): MultiPolygon {
        return this.polygons.length <= 1 ? this.polygons : PolygonClipping.union(this.polygons[0], ...this.polygons.slice(1));
    }
}

export class SvgRegion implements IRegion {
    private includes: SvgRegionData;
    private excludes: SvgRegionData;
    root: SvgNode;

    constructor(private drawing: SvgDrawing, public id: string) {
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

    outline(): IPath[] {
        const polygons = PolygonClipping.difference(this.includes.getPolygons(), this.excludes.getPolygons());
        return polygons.map(polygon => {
            return polygon.map(ring => {
                const path = this.drawing.createPath();
                if (ring.length) {
                    path.move(ring[0][0], ring[0][1]);
                    path.polyline(ring.slice(1).map(pair => ({x: pair[0], y: pair[1]})));
                    path.close();
                }
                return path;
            });
        }).reduce((acc, paths) => acc.concat(paths), []);
    }
}