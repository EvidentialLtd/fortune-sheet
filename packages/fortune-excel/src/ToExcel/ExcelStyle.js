import _ from "lodash";
import { fillConvert, fontConvert, alignmentConvert } from "./ExcelConvert";
var isTime = function (d) {
    return d === "hh:mm";
};
var formatHyperlink = function (address) {
    var sheetCell = address.split("!");
    return "#'".concat(sheetCell[0], "'!").concat(sheetCell[1] || "A1");
};
var setStyleAndValue = function (luckysheet, table, worksheet) {
    var cellArr = table === null || table === void 0 ? void 0 : table.data;
    if (!Array.isArray(cellArr))
        return;
    cellArr.forEach(function (row, rowid) {
        var dbrow = worksheet.getRow(rowid + 1);
        dbrow.height = luckysheet.getRowHeight([rowid])[rowid] / 1.2;
        row.every(function (cell, columnid) {
            var _a;
            if (!cell || _.isNil(cell.v) || _.isNaN(cell.v))
                return true;
            if (rowid == 0) {
                var dobCol = worksheet.getColumn(columnid + 1);
                dobCol.width = luckysheet.getColumnWidth([columnid])[columnid] / 8;
            }
            var fill = fillConvert(cell.bg);
            var font = fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.un);
            var alignment = alignmentConvert(cell.vt, cell.ht, cell.tb && parseInt(cell.tb, 10), cell.tr && parseInt(cell.tr, 10));
            var value;
            var v = "";
            var numFmt = undefined;
            if (cell.hl) {
                var hlData = (_a = table.hyperlink) === null || _a === void 0 ? void 0 : _a["".concat(cell.hl.r, "_").concat(cell.hl.c)];
                if ((hlData === null || hlData === void 0 ? void 0 : hlData.linkType) === "webpage") {
                    v = {
                        text: cell.v,
                        hyperlink: hlData === null || hlData === void 0 ? void 0 : hlData.linkAddress,
                        tooltip: cell.v,
                    };
                }
                else if (hlData.linkType === "cellrange" ||
                    hlData.linkType === "sheet") {
                    v = { text: cell.v, hyperlink: formatHyperlink(hlData === null || hlData === void 0 ? void 0 : hlData.linkAddress) };
                }
            }
            else if (cell.ct && cell.ct.t == "inlineStr") {
                var s = cell.ct.s;
                s.forEach(function (val, num) {
                    v += val.v;
                });
            }
            else if (cell.ct && cell.ct.t == "n") {
                v = +cell.v;
                if (cell.ct !== "General")
                    numFmt = cell.ct.fa;
            }
            else if (cell.ct && cell.ct.t == "d") {
                var mockDate = isTime(cell.ct.fa) ? "2000-01-01 " : "";
                v = new Date(mockDate + cell.m);
                numFmt = cell.ct.fa;
            }
            else {
                v = cell.v;
            }
            if (cell.f && typeof v !== "object") {
                value = {
                    formula: cell.f.startsWith("=") ? cell.f.slice(1) : cell.f,
                    result: v,
                };
            }
            else {
                value = v;
            }
            var target = worksheet.getCell(rowid + 1, columnid + 1);
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
