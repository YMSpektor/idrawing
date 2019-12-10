import { DxfDocument } from 'dxf-doc';
import { Line, Hatch, Circle, Ellipse, LwPolyline } from 'dxf-doc/entities';
import { EdgeBoundaryPath, HatchPattern, PolylineBoundaryPath } from 'dxf-doc/entities/hatch';

import { Attributes, Point, Alignment, IRegion, IPath, Geometry, DRAWING_SETTINGS } from '..';

enum FontStyle {
    normal = 'normal',
    italic = 'italic'
};

interface Style {
    stroke?: string;
    'stroke-width'?: number;
    'stroke-dasharray'?: number[];

    fill?: string;

    'font-style'?: FontStyle;
    'font-weight'?: string;
    'font-family'?: string;
    'font-size'?: number;
}

// http://gohtx.com/acadcolors.php
const COLORS = [
    ['black', '#000', '#000000'],
    ['red', '#f00', '#ff0000'],
    ['yellow', '#ff0', '#ffff00'],
    ['lime', '#0f0', '#00ff00'],
    ['cyan', '#0ff', '#00ffff'],
    ['blue', '#00f', '#0000ff'],
    ['magenta', '#f0f', '#ff00ff'],
    ['white', '#fff', '#ffffff'],
    ['gray', '#888', '#888888'],
    ['darkgray', '#c0c0c0']
];

export abstract class AbstractDxfBuilder {
    private ltypes = new Set<string>();
    private patterns = new Map<string, HatchPattern>();

    constructor(protected document: DxfDocument) { }

    private getStyle(attributes?: Attributes): Style {
        const style: Style = {};
        if (attributes) {
            style.stroke = attributes.stroke;
            style['stroke-width'] = attributes['stroke-width'] ? +attributes['stroke-width'] : attributes['stroke-width'];
            style['stroke-dasharray'] = attributes['stroke-dasharray'] ? 
                Array.isArray(attributes['stroke-dasharray']) ? (attributes['stroke-dasharray'] as (number | string)[]).map(x => +x) : 
                typeof attributes['stroke-dasharray'] === 'string' ? (attributes['stroke-dasharray'] + '').split(' ').map(x => +x) : undefined
                : undefined;
            style.fill = attributes.fill;
            
            if (attributes.font) {
                const match = (attributes.font + '').match(/((?:normal|italic)(?:\s))?((?:bold|bolder|\d+)(?:\s))?(\d+)\s(.+)/);
                if (match) {
                    style['font-style'] = match[1] as FontStyle;
                    style['font-weight'] = match[2];
                    style['font-size'] = +match[3];
                    style['font-family'] = match[4];
                }
            }

            if (attributes['font-style'] && Object.keys(FontStyle).includes(attributes['font-style'])) {
                style['font-style'] = attributes['font-style']; 
            }
            if (attributes['font-weight']) {
                style['font-weight'] = attributes['font-weight'];
            }
            if (attributes['font-size']) {
                style['font-size'] = +attributes['font-weight'];
            }
            if (attributes['font-family']) {
                style['font-family'] = attributes['font-family'];
            }
        }
        return style;
    }

    private getLType(style: Style): string | undefined {
        const strokeDashArray = style['stroke-dasharray'];
        const result = strokeDashArray ? 'DASH_' + strokeDashArray.map(x => x.toFixed(2)).join('_') : undefined;
        if (result && !this.ltypes.has(result)) {
            this.document.addLineType(result, strokeDashArray);
            this.ltypes.add(result);
        }
        return result;
    }

    private getLineWeight(style: Style): number | undefined {
        const strokeWidth = style['stroke-width'];
        return strokeWidth ? Math.round(strokeWidth * 100) : undefined;
    }

    private getColor(style: Style, key: 'stroke' | 'fill'): number | undefined {
        const color = style[key];
        const colorIndex = COLORS.findIndex(values => values.some(val => val === color));
        return colorIndex >= 0 ? colorIndex : undefined;
    }

    private getFillPattern(style: Style): string | undefined {
        let pattern;
        if (style.fill) {
            const match = style.fill.match(/^url\(#(.+)\)$/);
            if (match) {
                pattern = match[1];
            }
        }
        return pattern;
    }

    protected abstract convertY(y: number): number;

    line(x1: number, y1: number, x2: number, y2: number, attributes?: Attributes): void {
        const style = this.getStyle(attributes);
        if (style.stroke !== 'none') {
            const entity = new Line(this.document, x1, this.convertY(y1), x2, this.convertY(y2));
            entity.ltype = this.getLType(style);
            entity.lineWeight = this.getLineWeight(style);
            entity.color = this.getColor(style, 'stroke');
            this.document.addEntity(entity);
        }
    }

    rect(x: number, y: number, width: number, height: number, attributes?: Attributes | undefined): void {
        this.polygon([{x, y}, {x: x + width, y}, {x: x + width, y: y + height}, {x, y: y + height}]);
    }

    circle(cx: number, cy: number, r: number, attributes?: Attributes | undefined): void {
        const style = this.getStyle(attributes);
        if (style.fill) {
            const patternName = this.getFillPattern(style);
            const boundary = new EdgeBoundaryPath();
            boundary.acr(cx, this.convertY(cy), r, 0, 360, true);
            const pattern = patternName ? this.patterns.get(patternName) : undefined;
            const entity = new Hatch(this.document, [boundary], pattern);
            entity.color = this.getColor(style, 'fill');
            this.document.addEntity(entity);
        }
        if (style.stroke !== 'none') {
            const entity = new Circle(this.document, cx, this.convertY(cy), r);
            entity.ltype = this.getLType(style);
            entity.lineWeight = this.getLineWeight(style);
            entity.color = this.getColor(style, 'stroke');
            this.document.addEntity(entity);
        }
    }

    ellipse(cx: number, cy: number, rx: number, ry: number, attributes?: Attributes | undefined): void {
        const style = this.getStyle(attributes);
        if (style.fill) {
            const patternName = this.getFillPattern(style);
            const boundary = new EdgeBoundaryPath();
            if (rx > ry) {
                boundary.ellipse(cx, this.convertY(cy), rx, 0, ry / rx * 100, 0, 360, true);
            } else {
                boundary.ellipse(cx, this.convertY(cy), 0, ry, rx / ry * 100, 0, 360, true);
            }
            const pattern = patternName ? this.patterns.get(patternName) : undefined;
            const entity = new Hatch(this.document, [boundary], pattern);
            entity.color = this.getColor(style, 'fill');
            this.document.addEntity(entity);
        }
        if (style.stroke !== 'none') {
            let entity: Ellipse;
            if (rx > ry) {
                entity = new Ellipse(this.document, cx, this.convertY(cy), rx, 0, ry / rx);
            } else {
                entity = new Ellipse(this.document, cx, this.convertY(cy), 0, ry, rx / ry);
            }
            entity.ltype = this.getLType(style);
            entity.lineWeight = this.getLineWeight(style);
            entity.color = this.getColor(style, 'stroke');
            this.document.addEntity(entity);
        }
    }

    polyline(pts: Point[], attributes?: Attributes | undefined): void {
        const style = this.getStyle(attributes);
        if (style.stroke !== 'none') {
            const entity = new LwPolyline(this.document, pts.map(p => [p.x, this.convertY(p.y)] as [number, number]), false);
            entity.ltype = this.getLType(style);
            entity.lineWeight = this.getLineWeight(style);
            entity.color = this.getColor(style, 'stroke');
            this.document.addEntity(entity);
        }
    }

    polygon(pts: Point[], attributes?: Attributes | undefined): void {
        const style = this.getStyle(attributes);
        const dxfPts = pts.map(p => [p.x, this.convertY(p.y)] as [number, number]);
        if (style.fill) {
            const patternName = this.getFillPattern(style);
            const boundary = new PolylineBoundaryPath(dxfPts);
            const pattern = patternName ? this.patterns.get(patternName) : undefined;
            const entity = new Hatch(this.document, [boundary], pattern);
            entity.color = this.getColor(style, 'fill');
            this.document.addEntity(entity);
        }
        if (style.stroke !== 'none') {
            const entity = new LwPolyline(this.document, dxfPts, true);
            entity.ltype = this.getLType(style);
            entity.lineWeight = this.getLineWeight(style);
            entity.color = this.getColor(style, 'stroke');
            this.document.addEntity(entity);
        }
    }
    
    polybezier(pts: Point[], attributes?: Attributes | undefined): void {
        pts = Geometry.approximatePolybezier(pts, DRAWING_SETTINGS.APPROX_CURVE_MAX_DEVIATION);
        this.polyline(pts);
    }

    curve(pts: Point[], closed?: boolean | undefined, smoothing?: number | undefined, attributes?: Attributes | undefined): void {
        pts = Geometry.curveToPolybezier(pts, closed || false, smoothing);
        this.polybezier(pts);
    }

    text(text: string, x: number, y: number, align: Alignment, attributes?: Attributes | undefined): void {
        throw new Error("Method not implemented.");
    }

    region(region: IRegion, attributes?: Attributes | undefined): void {
        throw new Error("Method not implemented.");
    }

    path(path: IPath, attributes?: Attributes | undefined): void {
        throw new Error("Method not implemented.");
    }

    createRegion(): IRegion {
        throw new Error("Method not implemented.");
    }
    
    createPath(): IPath {
        throw new Error("Method not implemented.");
    }

    addPattern(pattern: HatchPattern) {
        this.patterns.set(pattern.name, pattern);
    }
}