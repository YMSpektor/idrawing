import { DxfWriter } from ".";

export interface DxfWritable {
    writeDxf(writer: DxfWriter): void;
}