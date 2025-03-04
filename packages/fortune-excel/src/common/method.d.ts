import { IfortuneSheetSelection } from "../ToFortuneSheet/IFortune";
import { IattributeList, stringToNum } from "./ICommon";
export declare function getRangetxt(range: IfortuneSheetSelection, sheettxt: string): string;
export declare function getcellrange(txt: string, sheets?: IattributeList, sheetId?: string): {
    row: number[];
    column: number[];
    sheetIndex: number;
} | null;
export declare function getptToPxRatioByDPI(): number;
export declare function getPxByEMUs(emus: number): number;
export declare function getXmlAttibute(dom: IattributeList, attr: string, d: string): string;
export declare function getColumnWidthPixel(columnWidth: number): number;
export declare function getRowHeightPixel(rowHeight: number): number;
export declare function LightenDarkenColor(sixColor: string, tint: number): string;
export declare function generateRandomIndex(prefix: string): string;
export declare function escapeCharacter(str: string): string;
export declare class fromulaRef {
    static operator: string;
    static error: {
        v: string;
        n: string;
        na: string;
        r: string;
        d: string;
        nm: string;
        nl: string;
        sp: string;
    };
    static operatorjson: stringToNum;
    static trim(str: string): string;
    static functionCopy(txt: string, mode: string, step: number): string;
    static downparam(txt: string, step: number): string;
    static upparam(txt: string, step: number): string;
    static leftparam(txt: string, step: number): string;
    static rightparam(txt: string, step: number): string;
    static updateparam(orient: string, txt: string, step: number): string;
    static iscelldata(txt: string): boolean;
    static isfreezonFuc(txt: string): boolean[];
}
export declare function isChinese(temp: string): boolean;
export declare function isJapanese(temp: string): boolean;
export declare function isKoera(chr: any): boolean;
export declare function isContainMultiType(str: string): boolean;
export declare function getMultiSequenceToNum(sqref: string): string[];
export declare function getRegionSequence(arr: string[]): string[];
export declare function getSqrefRawArrFormat(arr: string[]): string[];
export declare function getSingleSequenceToNum(sqref: string): string;
export declare function getTransR1C1ToSequence(value: string): string;
export declare function getPeelOffX14(value: string): {
    [key: string]: any;
};
export declare function getMultiFormulaValue(value: string): string[];
export declare var setMerge: (luckyMerge: {} | undefined, worksheet: ExcelJS.Worksheet) => void;
export declare var getObjType: (obj: Object) => string;
export declare var rgb2hex: (rgb: string) => string;
