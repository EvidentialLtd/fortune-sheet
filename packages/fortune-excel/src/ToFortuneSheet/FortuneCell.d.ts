import { IfortuneSheetborderInfoCellForImp } from "./IFortune";
import { ReadXml, Element, IStyleCollections } from "./ReadXml";
import { FortuneSheetCelldataBase } from "./FortuneBase";
export declare class FortuneSheetCelldata extends FortuneSheetCelldataBase {
    _borderObject: IfortuneSheetborderInfoCellForImp;
    _fomulaRef: string;
    _formulaSi: string;
    _formulaType: string;
    private sheetFile;
    private readXml;
    private cell;
    private styles;
    private sharedStrings;
    private mergeCells;
    constructor(cell: Element, styles: IStyleCollections, sharedStrings: Element[], mergeCells: Element[], sheetFile: string, ReadXml: ReadXml);
    private generateValue;
    private replaceSpecialWrap;
    private getBackgroundByFill;
    private getBorderInfo;
    private htmlDecode;
}
