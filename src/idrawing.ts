import { Attributes } from "./common/attributes";
import { Point } from "./common/point";
import { Alignment } from "./common/alignment";
import { Region } from "./common/region";

export interface IDrawing {
    line(x1: number, y1: number, x2: number, y2: number, attributes?: Attributes): void;
    rect(x1: number, y1: number, x2: number, y2: number, attributes?: Attributes): void;
    circle(cx: number, cy: number, r: number, attributes?: Attributes): void;
    ellipse(cx: number, cy: number, rx: number, ry: number, attributes?: Attributes): void;
    polyline(pts: Point[], attributes?: Attributes): void;
    polygon(pts: Point[], attributes?: Attributes): void;
    polybezier(pts: Point[], attributes?: Attributes): void;
    curve(pts: Point[], closed?: boolean, smoothing?: number, attributes?: Attributes): void;
    text(text: string, x: number, y: number, align: Alignment, attributes?: Attributes): void;

    createRegion(): Region;
}