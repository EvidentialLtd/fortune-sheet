import { FortuneSheetBase } from "./FortuneBase";
export declare class FortuneSheet extends FortuneSheetBase {
    private readXml;
    private sheetFile;
    private isInitialCell;
    private styles;
    private sharedStrings;
    private mergeCells;
    private calcChainEles;
    private sheetList;
    private imageList;
    private formulaRefList;
    constructor(sheetName: string, sheetId: string, sheetOrder: number, isInitialCell: boolean | undefined, allFileOption: any);
    private getXdrValue;
    private getBase64ByRid;
    private generateConfigColumnLenAndHidden;
    private generateConfigRowLenAndHiddenAddCell;
    private generateConfigDataValidations;
    private generateConfigHyperlinks;
}
