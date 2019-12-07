import { DxfDocument } from "dxf-doc";

import { AbstractDxfBuilder } from "./dxf-builder";
import { IDrawing } from "..";

export class DxfDrawing extends AbstractDxfBuilder implements IDrawing {
    private _height: number;

    constructor(width: number, height: number) {
        super(new DxfDocument());
        this._height = height;
        this.document.extents([0, 0], [width, height]);
        this.document.limits([0, 0], [width, height]);
    }

    protected convertY(y: number): number {
        return this._height - y;
    }

    dxf(): string {
        return this.document.dxf();
    }
}