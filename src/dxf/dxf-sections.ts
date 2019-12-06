import { DxfWriter } from "./dxf-writer";
import { DxfWritable } from "./dxf-writable";

export abstract class AbstractDxfSection implements DxfWritable {
    constructor(public name: string) {
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

export class DxfHeaderSection extends AbstractDxfSection {
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

export class DxfSection extends AbstractDxfSection {
    public entities: DxfWritable[] = [];

    protected writeSection(writer: DxfWriter): void {
        this.entities.forEach(x => x.writeDxf(writer));
    }
}