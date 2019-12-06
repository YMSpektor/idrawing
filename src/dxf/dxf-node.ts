import { DxfWriter } from "./dxf-writer";

export abstract class DxfNode {
    public abstract writeGroups(writer: DxfWriter): void;
}