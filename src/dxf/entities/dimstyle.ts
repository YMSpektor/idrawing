import { TableRecord } from "./table";
import { DxfWriter } from "..";
import { Style } from ".";

export class DimStyle extends TableRecord {
    public static STANDARD = 'Standard';

    constructor(public name: string, handle: string, public ownerHandle: string, public style: Style) {
        super('DIMSTYLE', handle, ownerHandle);
    }

    protected handleGroupCode(): number {
        return 105;
    }

    protected writeTableRecord(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbDimStyleTableRecord');
        writer.writeGroup(2, this.name);
        writer.writeGroup(70, 0);
        writer.writeGroup(40, 1);
        writer.writeGroup(41, 0.18);
        writer.writeGroup(42, 0.0625);
        writer.writeGroup(43, 0.38);
        writer.writeGroup(44, 0.18);
        writer.writeGroup(45, 0);
        writer.writeGroup(46, 0);
        writer.writeGroup(47, 0);
        writer.writeGroup(48, 0);
        writer.writeGroup(140, 0.18);
        writer.writeGroup(141, 0.09);
        writer.writeGroup(142, 0);
        writer.writeGroup(143, 25.4);
        writer.writeGroup(144, 1);
        writer.writeGroup(145, 0);
        writer.writeGroup(146, 1);
        writer.writeGroup(147, 0.09);
        writer.writeGroup(148, 0);
        writer.writeGroup(71, 0);
        writer.writeGroup(72, 0);
        writer.writeGroup(73, 0);
        writer.writeGroup(74, 1);
        writer.writeGroup(75, 0);
        writer.writeGroup(76, 0);
        writer.writeGroup(77, 0);
        writer.writeGroup(78, 0);
        writer.writeGroup(79, 0);
        writer.writeGroup(170, 0);
        writer.writeGroup(171, 2);
        writer.writeGroup(172, 0);
        writer.writeGroup(173, 0);
        writer.writeGroup(174, 0);
        writer.writeGroup(175, 0);
        writer.writeGroup(176, 0);
        writer.writeGroup(177, 0);
        writer.writeGroup(178, 0);
        writer.writeGroup(179, 0);
        writer.writeGroup(271, 4);
        writer.writeGroup(272, 4);
        writer.writeGroup(273, 2);
        writer.writeGroup(274, 2);
        writer.writeGroup(275, 0);
        writer.writeGroup(276, 0);
        writer.writeGroup(277, 2);
        writer.writeGroup(278, 46);
        writer.writeGroup(279, 0);
        writer.writeGroup(280, 0);
        writer.writeGroup(281, 0);
        writer.writeGroup(282, 0);
        writer.writeGroup(283, 1);
        writer.writeGroup(284, 0);
        writer.writeGroup(285, 0);
        writer.writeGroup(286, 0);
        writer.writeGroup(288, 0);
        writer.writeGroup(289, 3);
        writer.writeGroup(340, this.style.handle);
        writer.writeGroup(371, -2);
        writer.writeGroup(372, -2);
    }
}