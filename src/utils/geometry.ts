import { Point } from "..";

export class Geometry {
    private static curveControlPoint(current: Point, previous: Point, next: Point, reverse: boolean, smoothing: number): Point {
        const p = previous || current;
        const n = next || current;
        const angle = Math.atan2(n.y - p.y, n.x - p.x) + (reverse ? Math.PI : 0);
        const length = Math.sqrt(Math.pow(n.x - p.x, 2) + Math.pow(n.y - p.y, 2)) * smoothing;
        const x = current.x + Math.cos(angle) * length;
        const y = current.y + Math.sin(angle) * length;
        return {x, y};
    }

    private static curveControlPoints(point: Point, i: number, a: Point[], smoothing: number, closed: boolean): Point[] {
        const p2 = closed && i < 2 ? a[i + a.length - 2] : a[i - 2];
        const p1 = closed && i < 1 ? a[i + a.length - 1] : a[i - 1];
        const n = closed && i >= a.length - 1 ? a[i - a.length + 1] : a[i + 1];
        const cps = Geometry.curveControlPoint(p1, p2, point, false, smoothing);
        const cpe = Geometry.curveControlPoint(point, p1, n, true, smoothing);
        return [cps, cpe, point];
    }

    public static curveToPolybezier(pts: Point[], closed: boolean, smoothing: number = 0.25): Point[] {
        let result: Point[] = [];
        result = pts.reduce((acc, point, i, a) => i === 0 ? [point] : acc.concat(Geometry.curveControlPoints(point, i, a, smoothing, closed)), result);

        if (closed && pts.length) {
            const arr = pts.slice(1);
            arr.push(pts[0]);
            result = result.concat(Geometry.curveControlPoints(arr[arr.length - 1], arr.length - 1, arr, smoothing, closed));
        }

        return result;
    }

    public static approximateEllipse(cx: number, cy: number, rx: number, ry: number, count: number): Point[] {
        const result: Point[] = new Array(count);
        for (var i = 0; i < count; i++) {
            const a = Math.PI * 2 / count * i;
            result[i] = {
                x: Math.cos(a) * rx + cx,
                y: Math.sin(a) * ry + cy
            }
        }
        return result;
    }

    public static approximatePolybezier(pts: Point[], maxDeviation: number): Point[] {
        const beziers = pts.reduce((acc, p, i, a) => {
            return i % 3 === 0 && i !== a.length - 1 ? acc.concat([[a[i], a[i + 1], a[i + 2], a[i + 3]]]) : acc
        }, [] as [Point, Point, Point, Point][]);
        return beziers.reduce((acc, bezier, i) => {
            return acc.concat(Geometry.approximateBezier(bezier, maxDeviation, i === beziers.length - 1));
        }, [] as Point[]);
    }

    private static approximateBezier(bezier: [Point, Point, Point, Point], maxDeviation: number, includeLast: boolean): Point[] {
        const result = [bezier[0]];

        const recursiveBezier = (p1: Point, p2: Point, p3: Point, p4: Point) => {
            const p12 = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
            const p23 = {x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2};
            const p34 = {x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2};
            const p123 = {x: (p12.x + p23.x) / 2, y: (p12.y + p23.y) / 2};
            const p234 = {x: (p23.x + p34.x) / 2, y: (p23.y + p34.y) / 2};
            const p1234 = {x: (p123.x + p234.x) / 2, y: (p123.y + p234.y) / 2};
            const dx = p4.x - p1.x;
            const dy = p4.y - p1.y;
            const d2 = Math.abs(((p2.x - p4.x) * dy - (p2.y - p4.y) * dx));
            const d3 = Math.abs(((p3.x - p4.x) * dy - (p3.y - p4.y) * dx));
            if ((d2 + d3) * (d2 + d3) < (maxDeviation * maxDeviation) * ((dx * dx) + (dy * dy))) {
                result.push(p1234);
                return;
            }
            recursiveBezier(p1, p12, p123, p1234);
            recursiveBezier(p1234, p234, p34, p4);
        };

        if (bezier[0].x !== bezier[1].x || bezier[0].x !== bezier[2].x || bezier[0].x !== bezier[3].x) {
            recursiveBezier(bezier[0], bezier[1], bezier[2], bezier[3]);
        }
        if (includeLast) {
            result.push(bezier[3]);
        }
        return result;
    }
}