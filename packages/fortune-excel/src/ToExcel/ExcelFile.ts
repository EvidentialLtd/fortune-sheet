import ExcelJS from "exceljs";
import * as fileSaver from "file-saver";
import { setStyleAndValue } from "./ExcelStyle";
import { setMerge } from "../common/method";
import { setImages } from "./ExcelImage";
import { setBorder } from "./ExcelBorder";
import { setDataValidations } from "./ExcelValidation";
import { setHiddenRowCol } from "./ExcelConfig";


async function exportSheetExcel(workbookRef: any): Promise<Blob> {
  const luckysheet = workbookRef.current.getAllSheets();
  const workbook = new ExcelJS.Workbook();
  
  luckysheet.every(function (table: any) {
    if (table?.data?.length === 0) return true;
    const worksheet = workbook.addWorksheet(table.name);
    setStyleAndValue(workbookRef.current, table, worksheet);
    setMerge(table?.config?.merge, worksheet);
    setBorder(table, worksheet);
    setImages(table, worksheet, workbook);
    setDataValidations(table, worksheet);
    setHiddenRowCol(table, worksheet);
    return true;
  });

  // convert workbook to buffer
  const buffer = await workbook.xlsx.writeBuffer();
  const spreadsheetBlob = new Blob([buffer]);
  return spreadsheetBlob;
}

export { exportSheetExcel };
