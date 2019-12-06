import { DxfNode } from "./dxf-node";
import { DxfWriter } from "./dxf-writer";
import { DxfWritable } from "./dxf-writable";
import { Table } from "./entities/table";

export abstract class DxfSection extends DxfNode implements DxfWritable {
    constructor(public name: string) {
        super();
    }

    public writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, 'SECTION');
        writer.writeGroup(2, this.name);
        this.writeSection(writer);
        writer.writeGroup(0, 'ENDSEC');
    }

    protected abstract writeSection(writer: DxfWriter): void;
}

export type DxfHeaderVariableGroups = Map<number, string | number>;

export class DxfHeaderSection extends DxfSection {
    variables: {[name: string]: DxfHeaderVariableGroups} = {};

    constructor() {
        super('HEADER');
    }

    protected writeSection(writer: DxfWriter): void {
        Object.keys(this.variables).forEach(varName => {
            writer.writeGroup(9, varName);
            const varGroups = this.variables[varName];
            varGroups.forEach((value, code) => writer.writeGroup(code, value));
        });
    }
}

export class DxfClassesSection extends DxfSection {
    constructor() {
        super('CLASSES');
    }

    protected writeSection(writer: DxfWriter): void {
    }
}

export class DxfTablesSection extends DxfSection {
    tables: Table<any>[] = [];

    constructor() {
        super('TABLES');
    }

    protected writeSection(writer: DxfWriter): void {
        this.tables.forEach(x => x.writeDxf(writer));
    }
}