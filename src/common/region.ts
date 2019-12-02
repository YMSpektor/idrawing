import { Point } from "..";

export interface RegionData {
    rect(x1: number, y1: number, x2: number, y2: number): void;
    circle(cx: number, cy: number, r: number): void;
    ellipse(cx: number, cy: number, rx: number, ry: number): void;
    polygon(pts: Point[]): void;
    closedCurve(pts: Point[], smoothing?: number): void;
}

export interface Region {
    include(callback: (r: RegionData) => void): void;
    exclude(callback: (r: RegionData) => void): void;
}