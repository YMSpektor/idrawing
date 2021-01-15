import { Point, Attributes, Alignment, Bounds } from ".";

export interface IPath {
    move(x: number, y: number): void;
    line(x: number, y: number): void;
    polyline(pts: Point[]): void;
    polybezier(pts: Point[]): void;
    curve(pts: Point[], smoothing: number): void;

    close(): void;
}

export interface IRegionData {
    rect(x: number, y: number, width: number, height: number): void;
    circle(cx: number, cy: number, r: number): void;
    ellipse(cx: number, cy: number, rx: number, ry: number): void;
    polygon(pts: Point[]): void;
    closedCurve(pts: Point[], smoothing?: number): void;
    path(path: IPath): void;
}

export interface IRegion {
    include(callback: (r: IRegionData) => void): void;
    exclude(callback: (r: IRegionData) => void): void;
    getBounds(): Bounds;
    outline(): IPath[];
}

export interface IDrawing {
    line(x1: number, y1: number, x2: number, y2: number, attributes?: Attributes): void;
    rect(x: number, y: number, width: number, height: number, attributes?: Attributes): void;
    circle(cx: number, cy: number, r: number, attributes?: Attributes): void;
    ellipse(cx: number, cy: number, rx: number, ry: number, attributes?: Attributes): void;
    polyline(pts: Point[], attributes?: Attributes): void;
    polygon(pts: Point[], attributes?: Attributes): void;
    polybezier(pts: Point[], attributes?: Attributes): void;
    curve(pts: Point[], closed?: boolean, smoothing?: number, attributes?: Attributes): void;
    text(text: string, x: number, y: number, align: Alignment, attributes?: Attributes): void;
    region(region: IRegion, attributes?: Attributes): void;
    path(path: IPath, attributes?: Attributes): void;

    clip(region: IRegion, callback: () => void): void;

    createRegion(): IRegion;
    createPath(): IPath;

    addStyle(selector: string, style: string): void;
}