import _ from "lodash";
import ExcelJS, { CellHyperlinkValue, CellValue } from "exceljs";
import { fillConvert, fontConvert, alignmentConvert } from "./ExcelConvert";

const isTime = (d: string) => {
  return d === "hh:mm";
};

const formatHyperlink = (address: string) => {
  const sheetCell = address.split("!");
  return `#\'${sheetCell[0]}\'!${sheetCell[1] || "A1"}`;
};

var setStyleAndValue = function (
  luckysheet: any,
  table: any,
  worksheet: ExcelJS.Worksheet
) {
  const cellArr = table?.data;
  if (!Array.isArray(cellArr)) return;

  cellArr.forEach(function (row, rowid) {
    const dbrow = worksheet.getRow(rowid + 1);
    //设置单元格行高,默认乘以1.2倍
    dbrow.height = luckysheet.getRowHeight([rowid])[rowid] / 1.2;
    row.every(function (cell: any, columnid: any) {
      // Modifed the exporter 
      // if (!cell || _.isNil(cell.v) || _.isNaN(cell.v)) return true;
      if (!cell || (!cell.ct && (_.isNaN(cell.v) || _.isNil(cell.v))))
        return true;
      if (rowid == 0) {
        const dobCol = worksheet.getColumn(columnid + 1);
        //设置单元格列宽除以8
        dobCol.width = luckysheet.getColumnWidth([columnid])[columnid] / 8;
      }
      let fill = fillConvert(cell.bg);
      let font = fontConvert(
        cell.ff as string,
        cell.fc,
        cell.bl,
        cell.it,
        cell.fs,
        cell.cl,
        cell.un
      );
      let alignment = alignmentConvert(
        cell.vt,
        cell.ht,
        cell.tb && parseInt(cell.tb, 10),
        cell.tr && parseInt(cell.tr, 10)
      );
      let value: CellValue;

      var v: number | string | boolean | Date | CellHyperlinkValue = "";
      var numFmt: string = undefined;

      if (cell.hl) {
        const hlData = table.hyperlink?.[`${cell.hl.r}_${cell.hl.c}`];
        if (hlData?.linkType === "webpage") {
          v = {
            text: cell.v,
            hyperlink: hlData?.linkAddress,
            tooltip: cell.v,
          };
        }
        // will not work in Google Sheets but will work in excel (open issue in exceljs)
        else if (
          hlData.linkType === "cellrange" ||
          hlData.linkType === "sheet"
        ) {
          v = { text: cell.v, hyperlink: formatHyperlink(hlData?.linkAddress) };
        }
      } else if (cell.ct && cell.ct.t == "inlineStr") {
        var s = cell.ct.s;
        s.forEach(function (val: any) {
          v += val.v;
        });
      } else if (cell.ct && cell.ct.t == "n") {
        v = +cell.v;
        if (cell.ct !== "General") numFmt = cell.ct.fa;
      } else if (cell.ct && cell.ct.t == "d") {
        const mockDate = isTime(cell.ct.fa) ? "2000-01-01 " : "";
        v = new Date(mockDate + cell.m);
        numFmt = cell.ct.fa;
      } else {
        v = cell.v as string;
      }
      if (cell.f && typeof v !== "object") {
        value = {
          formula: cell.f.startsWith("=") ? cell.f.slice(1) : cell.f,
          result: v,
        };
      } else {
        value = v;
      }
      let target = worksheet.getCell(rowid + 1, columnid + 1);
      target.fill = fill;
      target.font = font;
      target.alignment = alignment;
      target.value = value;
      target.numFmt = numFmt;
      return true;
    });
  });
};

export { setStyleAndValue };
