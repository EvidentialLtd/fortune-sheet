import { getSheet } from "./common";
import { Context } from "../context";
import { CellMatrix, Sheet, SingleRange } from "../types";
export declare function getAllSheets(ctx: Context): Sheet[];
export { getSheet };
export declare function initSheetData(draftCtx: Context, index: number, newData: Sheet): CellMatrix | null;
export declare function hideSheet(ctx: Context, sheetId: string): void;
export declare function showSheet(ctx: Context, sheetId: string): void;
export declare function copySheet(ctx: Context, sheetId: string): void;
export declare function calculateFormula(ctx: Context, id?: string, range?: SingleRange): void;
