import { IPath, Point } from "..";
import { Geometry } from "../utils";
import { SvgNode } from "../../dist/svg";

export class SvgPath implements IPath {
    private initialPoint?: Point;
    private currentPoint?: Point;
    root: SvgNode;

    constructor(public id: string) {
        this.root = new SvgNode('path', {id: id, d: ''});
    }

    move(x: number, y: number): void {
        this.root.attributes.d += `M ${x},${y}`;
        this.currentPoint = {x: x, y: y};
        this.initialPoint = {x: x, y: y};
    }

    line(x: number, y: number): void {
        if (!this.currentPoint) {
            throw new Error('Invalid operation. No current point to start path command');
        }
        this.root.attributes.d += `L ${x},${y}`;
        this.currentPoint = {x: x, y: y};
    }

    polyline(pts: Point[]): void {
        if (!this.currentPoint) {
            throw new Error('Invalid operation. No current point to start path command');
        }
        pts.forEach(p => this.root.attributes.d += `L ${p.x},${p.y}`);
        this.currentPoint = {x: pts[pts.length - 1].x, y: pts[pts.length - 1].y};
    }

    polybezier(pts: Point[]): void {
        if (!this.currentPoint) {
            throw new Error('Invalid operation. No current point to start path command');
        }
        if (pts.length === 0 || pts.length % 3 !== 0) {
            throw new Error(`Invalid points length: ${pts.length}`);
        }
        pts.forEach((p, i) => this.root.attributes.d += i % 3 === 0 ? `C ${p.x},${p.y}` : ` ${p.x},${p.y}`);
        this.currentPoint = {x: pts[pts.length - 1].x, y: pts[pts.length - 1].y};
    }

    curve(pts: Point[], smoothing: number): void {
        if (!this.currentPoint) {
            throw new Error('Invalid operation. No current point to start path command');
        }
        pts = pts.slice();
        pts.unshift(this.currentPoint);
        pts = Geometry.curveToPolybezier(pts, false, smoothing);
        pts = pts.slice(1);
        pts.forEach((p, i) => this.root.attributes.d += i % 3 === 0 ? `C ${p.x},${p.y}` : ` ${p.x},${p.y}`);
        this.currentPoint = {x: pts[pts.length - 1].x, y: pts[pts.length - 1].y};
    }

    close(): void {
        if (!this.initialPoint) {
            throw new Error('Can\'t close path. No initial point established');
        }
        this.root.attributes.d += `Z`;
        this.currentPoint = this.initialPoint;
    }
}