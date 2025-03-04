import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { initSheetData } from "../api/sheet";
import { locale } from "../locale";
import { generateRandomSheetName, getSheetIndex } from "../utils";
import { setFormulaCellInfo } from "./formulaHelper";
function storeSheetParam(ctx) {
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    if (index == null)
        return;
    var file = ctx.luckysheetfile[index];
    file.config = ctx.config;
    file.luckysheet_select_save = ctx.luckysheet_select_save;
    file.luckysheet_selection_range = ctx.luckysheet_selection_range;
    file.zoomRatio = ctx.zoomRatio;
}
export function storeSheetParamALL(ctx) {
    storeSheetParam(ctx);
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    if (index == null)
        return;
    ctx.luckysheetfile[index].config = ctx.config;
}
export function changeSheet(ctx, id, isPivotInitial, isNewSheet, isCopySheet) {
    var _a, _b;
    if (id === ctx.currentSheetId) {
        return;
    }
    var file = ctx.luckysheetfile[getSheetIndex(ctx, id)];
    if (((_b = (_a = ctx.hooks).beforeActivateSheet) === null || _b === void 0 ? void 0 : _b.call(_a, id)) === false) {
        return;
    }
    storeSheetParamALL(ctx);
    ctx.currentSheetId = id;
    if (file.isPivotTable) {
        ctx.luckysheetcurrentisPivotTable = true;
    }
    else {
        ctx.luckysheetcurrentisPivotTable = false;
    }
    if (ctx.hooks.afterActivateSheet) {
        setTimeout(function () {
            var _a, _b;
            (_b = (_a = ctx.hooks).afterActivateSheet) === null || _b === void 0 ? void 0 : _b.call(_a, id);
        });
    }
}
export function addSheet(ctx, settings, newSheetID, isPivotTable, sheetName, sheetData) {
    var _a, _b;
    if (newSheetID === void 0) { newSheetID = undefined; }
    if (isPivotTable === void 0) { isPivotTable = false; }
    if (sheetName === void 0) { sheetName = undefined; }
    if (sheetData === void 0) { sheetData = undefined; }
    if (ctx.allowEdit === false) {
        return;
    }
    var order = ctx.luckysheetfile.length;
    var id = newSheetID !== null && newSheetID !== void 0 ? newSheetID : settings === null || settings === void 0 ? void 0 : settings.generateSheetId();
    var sheetname = sheetName || generateRandomSheetName(ctx.luckysheetfile, isPivotTable, ctx);
    if (!_.isNil(sheetData)) {
        delete sheetData.data;
        ctx.luckysheetfile.forEach(function (sheet) {
            sheet.order =
                sheet.order < sheetData.order
                    ? sheet.order
                    : sheet.order + 1;
            return sheet;
        });
    }
    var sheetconfig = _.isNil(sheetData)
        ? {
            name: sheetName === undefined ? sheetname : sheetName,
            status: 0,
            order: order,
            id: id,
            row: ctx.defaultrowNum,
            column: ctx.defaultcolumnNum,
            config: {},
            pivotTable: null,
            isPivotTable: !!isPivotTable,
            zoomRatio: 1,
        }
        : sheetData;
    if (sheetName !== undefined)
        sheetconfig.name = sheetName;
    if (sheetconfig.id === undefined)
        sheetconfig.id = uuidv4();
    if (((_b = (_a = ctx.hooks).beforeAddSheet) === null || _b === void 0 ? void 0 : _b.call(_a, sheetconfig)) === false) {
        return;
    }
    ctx.luckysheetfile.push(sheetconfig);
    if (!newSheetID) {
        changeSheet(ctx, id, isPivotTable, true);
    }
    if (ctx.hooks.afterAddSheet) {
        setTimeout(function () {
            var _a, _b;
            (_b = (_a = ctx.hooks).afterAddSheet) === null || _b === void 0 ? void 0 : _b.call(_a, sheetconfig);
        });
    }
}
export function deleteSheet(ctx, id) {
    var _a, _b, _c;
    if (ctx.allowEdit === false) {
        return;
    }
    var arrIndex = getSheetIndex(ctx, id);
    if (arrIndex == null) {
        return;
    }
    if (((_b = (_a = ctx.hooks).beforeDeleteSheet) === null || _b === void 0 ? void 0 : _b.call(_a, id)) === false) {
        return;
    }
    ctx.luckysheetfile = ctx.luckysheetfile.map(function (sheet) {
        sheet.order =
            sheet.order < ctx.luckysheetfile[arrIndex].order
                ? sheet.order
                : sheet.order - 1;
        return sheet;
    });
    ctx.luckysheetfile.splice(arrIndex, 1);
    if (id === ctx.currentSheetId) {
        var shownSheets = _.cloneDeep(ctx.luckysheetfile).filter(function (singleSheet) { return _.isUndefined(singleSheet.hide) || singleSheet.hide !== 1; });
        var orderSheets = _.sortBy(shownSheets, function (sheet) { return sheet.order; });
        ctx.currentSheetId = (_c = orderSheets === null || orderSheets === void 0 ? void 0 : orderSheets[0]) === null || _c === void 0 ? void 0 : _c.id;
    }
    if (ctx.hooks.afterDeleteSheet) {
        setTimeout(function () {
            var _a, _b;
            (_b = (_a = ctx.hooks).afterDeleteSheet) === null || _b === void 0 ? void 0 : _b.call(_a, id);
        });
    }
}
export function updateSheet(ctx, newData) {
    newData.forEach(function (newDatum) {
        var _a;
        var data = newDatum.data, row = newDatum.row, column = newDatum.column;
        var index = getSheetIndex(ctx, newDatum.id);
        if (data != null) {
            var lastRowNum = data.length;
            var lastColNum_1 = data[0].length;
            if (row != null && column != null && row > 0 && column > 0) {
                lastRowNum = Math.max(lastRowNum, row);
                lastColNum_1 = Math.max(lastColNum_1, column);
            }
            else {
                lastRowNum = Math.max(lastRowNum, ctx.defaultrowNum);
                lastColNum_1 = Math.max(lastColNum_1, ctx.defaultcolumnNum);
            }
            var expandedData = _.times(lastRowNum, function () {
                return _.times(lastColNum_1, function () { return null; });
            });
            for (var i = 0; i < data.length; i += 1) {
                for (var j = 0; j < data[i].length; j += 1) {
                    expandedData[i][j] = data[i][j];
                    setFormulaCellInfo(ctx, { r: i, c: j, id: newDatum.id }, data);
                }
            }
            newDatum.data = expandedData;
            if (ctx.luckysheetfile[index] == null) {
                ctx.luckysheetfile.push(newDatum);
            }
            else {
                ctx.luckysheetfile[index] = newDatum;
            }
        }
        else if (newDatum.celldata != null) {
            initSheetData(ctx, index, newDatum);
            var _index_1 = getSheetIndex(ctx, newDatum.id);
            (_a = newDatum.celldata) === null || _a === void 0 ? void 0 : _a.forEach(function (d) {
                setFormulaCellInfo(ctx, { r: d.r, c: d.c, id: newDatum.id }, ctx.luckysheetfile[_index_1].data);
            });
        }
    });
}
export function editSheetName(ctx, editable) {
    var _a, _b;
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    if (ctx.allowEdit === false) {
        if (index == null)
            return;
        editable.innerText = ctx.luckysheetfile[index].name;
        return;
    }
    var sheetconfig = locale(ctx).sheetconfig;
    var oldtxt = editable.dataset.oldText || "";
    var txt = editable.innerText;
    if (((_b = (_a = ctx.hooks).beforeUpdateSheetName) === null || _b === void 0 ? void 0 : _b.call(_a, ctx.currentSheetId, oldtxt, txt)) === false) {
        return;
    }
    if (txt.length === 0) {
        editable.innerText = oldtxt;
        throw new Error(sheetconfig.sheetNamecannotIsEmptyError);
    }
    if (txt.length > 31 ||
        txt.charAt(0) === "'" ||
        txt.charAt(txt.length - 1) === "'" ||
        /[：:\\/？?*[\]]+/.test(txt)) {
        editable.innerText = oldtxt;
        throw new Error(sheetconfig.sheetNameSpecCharError);
    }
    if (index == null)
        return;
    for (var i = 0; i < ctx.luckysheetfile.length; i += 1) {
        if (index !== i && ctx.luckysheetfile[i].name === txt) {
            editable.innerText = oldtxt;
            return;
        }
    }
    ctx.luckysheetfile[index].name = txt;
    if (ctx.hooks.afterUpdateSheetName) {
        setTimeout(function () {
            var _a, _b;
            (_b = (_a = ctx.hooks).afterUpdateSheetName) === null || _b === void 0 ? void 0 : _b.call(_a, ctx.currentSheetId, oldtxt, txt);
        });
    }
}
export function expandRowsAndColumns(data, rowsToAdd, columnsToAdd) {
    if (rowsToAdd <= 0 && columnsToAdd <= 0) {
        return data;
    }
    if (data.length + rowsToAdd >= 10000) {
        throw new Error("This action would increase the number of rows in the workbook above the limit of 10000.");
    }
    if (data[0].length + columnsToAdd >= 1000) {
        throw new Error("This action would increase the number of columns in the workbook above the limit of 1000.");
    }
    if (rowsToAdd <= 0) {
        rowsToAdd = 0;
    }
    if (columnsToAdd <= 0) {
        columnsToAdd = 0;
    }
    var currentColLen = 0;
    if (data.length > 0) {
        currentColLen = data[0].length;
    }
    for (var r = 0; r < data.length; r += 1) {
        for (var i = 0; i < columnsToAdd; i += 1) {
            data[r].push(null);
        }
    }
    for (var r = 0; r < rowsToAdd; r += 1) {
        data.push(_.times(currentColLen + columnsToAdd, function () { return null; }));
    }
    return data;
}
