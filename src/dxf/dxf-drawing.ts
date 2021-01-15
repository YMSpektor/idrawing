import { DxfDocument } from "dxf-doc";

import { AbstractDxfBuilder } from "./dxf-builder";
import { IDrawing, IRegion } from "..";

export class DxfDrawing extends AbstractDxfBuilder implements IDrawing {
    private height: number;

    constructor(width: number, height: number) {
        super(new DxfDocument());
        this.height = height;
        this.document.extents([0, 0], [width, height]);
        this.document.limits([0, 0], [width, height]);
    }

    protected convertY(y: number): number {
        return this.height - y;
    }

    clip(region: IRegion, callback: () => void) {
        throw new Error("Method not implemented."); // TODO
    }

    addStyle(style: string) {
        throw new Error("Method not implemented."); // TODO
    }

    dxf(): string {
        return this.document.dxf();
    }
}