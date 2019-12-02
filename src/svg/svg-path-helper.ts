import { Point } from "..";

function commandBezier (point: Point, i: number): string {
    const cmd = (i - 1) % 3 === 0 ? 'C' : '';
    return `${cmd}${point.x},${point.y}`;
}

function line(a: Point, b: Point) {
    const lengthX = b.x - a.x;
    const lengthY = b.y - a.y;
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    };
}

function controlPoint(current: Point, previous: Point, next: Point, reverse: boolean, smoothing: number): Point {
    const p = previous || current;
    const n = next || current;
    const o = line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    const x = current.x + Math.cos(angle) * length;
    const y = current.y + Math.sin(angle) * length;
    return {x, y};
  }

function commandCurve (point: Point, i: number, a: Point[], smoothing: number, closed: boolean): string {
    const p2 = closed && i < 2 ? a[i + a.length - 2] : a[i - 2];
    const p1 = closed && i < 1 ? a[i + a.length - 1] : a[i - 1];
    const n = closed && i >= a.length - 1 ? a[i - a.length + 1] : a[i + 1];
    const cps = controlPoint(p1, p2, point, false, smoothing);
    const cpe = controlPoint(point, p1, n, true, smoothing);
    return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
}

export function svgPathPolybezier(pts: Point[]) {
    return pts.reduce((acc, point, i) => i === 0
        ? `M${point.x},${point.y}`
        : `${acc} ${commandBezier(point, i)}`
    , '');
}

export function svgPathCurve(pts: Point[], closed = false, smoothing = 0.25) {
    let d = pts.reduce((acc, point, i, a) => i === 0
        ? `M${point.x},${point.y}`
        : `${acc} ${commandCurve(point, i, a, smoothing, closed)}`
    , '');
    if (closed && pts.length) {
        const arr = pts.slice(1);
        arr.push(pts[0]);
        d = `${d} ${commandCurve(arr[arr.length - 1], arr.length - 1, arr, smoothing, closed)}`;
    }
    return d + (closed ? ' Z' : '');
}