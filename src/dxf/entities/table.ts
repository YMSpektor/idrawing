import { DxfWritable } from "../dxf-writable";
import { DxfWriter } from "..";

export class Table<T extends TableRecord> implements DxfWritable {
    entries: T[] = [];

    constructor(public name: string, public handle: string) { }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, 'TABLE');
        writer.writeGroup(2, this.name);
        writer.writeGroup(5, this.handle);
        writer.writeGroup(330, this.handle);
        writer.writeGroup(100, 'AcDbSymbolTable');
        writer.writeGroup(70, this.entries.length);
        this.entries.forEach(x => x.writeDxf(writer));
        writer.writeGroup(0, 'ENDTAB');
    }
}

export abstract class TableRecord implements DxfWritable {
    constructor(public recordName: string, public handle: string, public ownerHandle: string) {
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, this.recordName);
        writer.writeGroup(5, this.handle);
        writer.writeGroup(330, this.ownerHandle);
        writer.writeGroup(100, 'AcDbSymbolTableRecord');
        this.writeTableRecord(writer);
    }

    protected abstract writeTableRecord(writer: DxfWriter): void;
}