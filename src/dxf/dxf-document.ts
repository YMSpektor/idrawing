import { DxfHeaderSection, DxfClassesSection, DxfTablesSection } from "./dxf-sections";
import { DxfWriter } from "./dxf-writer";
import { DxfWritable } from "./dxf-writable";
import { Table } from "./entities/table";
import { LType } from "./entities/ltype";

export class DxfDocument implements DxfWritable {
    private _nextHandle = 256;
    private header = new DxfHeaderSection();
    private classes = new DxfClassesSection();
    private tables = new DxfTablesSection();

    constructor() {
        this.header.variables['$ACADVER'] = new Map([[1, 'AC1021']]);
        const ltypeTable = new Table('LTYPE', this.nextHandle());
        const byBlock = new LType('ByBlock', this.nextHandle(), ltypeTable.handle);
        ltypeTable.entries.push(byBlock);
        this.tables.tables.push(ltypeTable);
    }

    nextHandle(): string {
        const handle = this._nextHandle;
        this._nextHandle++;
        return handle.toString(16);
    }

    writeDxf(writer: DxfWriter) {
        this.header.variables['$HANDSEED'] = new Map([[5, this._nextHandle.toString(16)]]);
        this.header.writeDxf(writer);
        this.classes.writeDxf(writer);
        this.tables.writeDxf(writer);
        writer.writeGroup(0, 'EOF');
    }
}