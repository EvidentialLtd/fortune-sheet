import { IuploadfileList } from "../common/ICommon";
import { FortuneFileBase } from "./FortuneBase";
export declare class FortuneFile {
    private files;
    private sheetNameList;
    private readXml;
    private fileName;
    private styles;
    private sharedStrings;
    private calcChain;
    private imageList;
    private sheets?;
    private info?;
    constructor(files: IuploadfileList, fileName: string);
    private getSheetNameList;
    private getSheetFileBysheetId;
    getWorkBookInfo(): void;
    getSheetsFull(isInitialCell?: boolean): void;
    private columnWidthSet;
    private rowHeightSet;
    private extendArray;
    private imagePositionCaculation;
    private getDrawingFile;
    private getDrawingRelsFile;
    getSheetsWithoutCell(): void;
    Parse(): void;
    serialize(): FortuneFileBase;
}
