import { DxfHeaderSection, DxfSection } from "./dxf-sections";
import { DxfWriter } from "./dxf-writer";
import { DxfWritable } from "./dxf-writable";
import { Table, LType, Layer, Style, AppId, DimStyle, BlockRecord, Block, BlockEnd } from "./entities";
import { DimStyleTable } from "./entities/table";

export class DxfDocument implements DxfWritable {
    private _nextHandle = 256;
    private header = new DxfHeaderSection();
    private classes = new DxfSection('CLASSES');
    private tables = new DxfSection('TABLES');
    private blocks = new DxfSection('BLOCKS');
    private entities = new DxfSection('ENTITIES');
    private objects = new DxfSection('OBJECTS');
    private blockRecTable: Table;

    constructor() {
        this.header.variables['$ACADVER'] = new Map([[1, 'AC1021']]);

        const vportTable = new Table('VPORT', this.nextHandle());

        const ltypeTable = new Table('LTYPE', this.nextHandle());
        const byBlock = new LType(LType.BY_BLOCK, this.nextHandle(), ltypeTable.handle);
        const byLayer = new LType(LType.BY_LAYER, this.nextHandle(), ltypeTable.handle);
        const continuous = new LType(LType.CONTINUOUS, this.nextHandle(), ltypeTable.handle);
        ltypeTable.entries.push(byBlock, byLayer, continuous);

        const layerTable = new Table('LAYER', this.nextHandle());
        const layer0 = new Layer(Layer.LAYER_0, this.nextHandle(), layerTable.handle);
        layerTable.entries.push(layer0);

        const styleTable = new Table('STYLE', this.nextHandle());
        const standard = new Style(Style.STANDARD, this.nextHandle(), styleTable.handle);
        styleTable.entries.push(standard);

        const viewTable = new Table('VIEW', this.nextHandle());

        const ucsTable = new Table('UCS', this.nextHandle());

        const appIdTable = new Table('APPID', this.nextHandle());
        const acad = new AppId('ACAD', this.nextHandle(), appIdTable.handle);
        appIdTable.entries.push(acad);

        const dimstyleTable = new DimStyleTable(this.nextHandle());
        const standardDimStyle = new DimStyle(DimStyle.STANDARD, this.nextHandle(), dimstyleTable.handle, standard);
        dimstyleTable.entries.push(standardDimStyle);

        this.blockRecTable = new Table('BLOCK_RECORD', this.nextHandle());
        this.addBlock(BlockRecord.MODEL_SPACE);
        this.addBlock(BlockRecord.PAPER_SPACE);

        this.tables.entities.push(vportTable, ltypeTable, layerTable, styleTable, viewTable, ucsTable, appIdTable, dimstyleTable, this.blockRecTable);
    }

    private addBlock(name: string) {
        const blockRec = new BlockRecord(name, this.nextHandle(), this.blockRecTable.handle);
        this.blockRecTable.entries.push(blockRec);
        const block = new Block(name, this.nextHandle(), blockRec.handle);
        const blockEnd = new BlockEnd(this.nextHandle(), blockRec.handle);
        this.blocks.entities.push(block, blockEnd);
    }

    nextHandle(): string {
        const handle = this._nextHandle;
        this._nextHandle++;
        return handle.toString(16).toUpperCase();
    }

    writeDxf(writer: DxfWriter) {
        this.header.variables['$HANDSEED'] = new Map([[5, this._nextHandle.toString(16).toUpperCase()]]);
        this.header.writeDxf(writer);
        this.classes.writeDxf(writer);
        this.tables.writeDxf(writer);
        this.blocks.writeDxf(writer);
        this.entities.writeDxf(writer);
        this.objects.writeDxf(writer);
        writer.writeGroup(0, 'EOF');
    }
}