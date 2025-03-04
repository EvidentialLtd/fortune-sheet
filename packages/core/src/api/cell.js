var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import _ from "lodash";
import { delFunctionGroup, dropCellCache, functionHTMLGenerate, getTypeItemHide, setCellValue as setCellValueInternal, updateCell, updateDropCell, updateFormatCell, } from "../modules";
import { getSheet } from "./common";
import { SHEET_NOT_FOUND } from "./errors";
import SSF from "../modules/ssf";
export function getCellValue(ctx, row, column, options) {
    var _a;
    if (options === void 0) { options = {}; }
    if (!_.isNumber(row) || !_.isNumber(column)) {
        throw new Error("row or column cannot be null or undefined");
    }
    var sheet = getSheet(ctx, options);
    var _b = options.type, type = _b === void 0 ? "v" : _b;
    var targetSheetData = sheet.data;
    if (!targetSheetData) {
        throw SHEET_NOT_FOUND;
    }
    var cellData = targetSheetData[row][column];
    var ret;
    if (cellData && _.isPlainObject(cellData)) {
        ret = cellData[type];
        if (type === "f" && ret != null) {
            ret = functionHTMLGenerate(ret);
        }
        else if (type === "f") {
            ret = cellData.v;
        }
        else if (cellData && cellData.ct && cellData.ct.fa === "yyyy-MM-dd") {
            ret = cellData.m;
        }
        else if (((_a = cellData.ct) === null || _a === void 0 ? void 0 : _a.t) === "inlineStr") {
            ret = cellData.ct.s.reduce(function (prev, cur) { var _a; return prev + ((_a = cur.v) !== null && _a !== void 0 ? _a : ""); }, "");
        }
    }
    if (ret === undefined) {
        ret = null;
    }
    return ret;
}
export function setCellValue(ctx, row, column, value, cellInput, options) {
    var _a;
    if (options === void 0) { options = {}; }
    if (!_.isNumber(row) || !_.isNumber(column)) {
        throw new Error("row or column cannot be null or undefined");
    }
    var sheet = getSheet(ctx, options);
    var data = sheet.data;
    var formatList = {
        bg: 1,
        ff: 1,
        fc: 1,
        bl: 1,
        it: 1,
        fs: 1,
        cl: 1,
        un: 1,
        vt: 1,
        ht: 1,
        mc: 1,
        tr: 1,
        tb: 1,
        rt: 1,
        qp: 1,
    };
    if (value == null || value.toString().length === 0) {
        delFunctionGroup(ctx, row, column);
        setCellValueInternal(ctx, row, column, data, value);
    }
    else if (value instanceof Object) {
        var curv = {};
        if (((_a = data === null || data === void 0 ? void 0 : data[row]) === null || _a === void 0 ? void 0 : _a[column]) == null) {
            data[row][column] = {};
        }
        var cell_1 = data[row][column];
        if (value.f != null && value.v == null) {
            curv.f = value.f;
            if (value.ct != null) {
                curv.ct = value.ct;
            }
            updateCell(ctx, row, column, cellInput, curv);
        }
        else {
            if (value.ct != null) {
                curv.ct = value.ct;
            }
            if (value.f != null) {
                curv.f = value.f;
            }
            if (value.v != null) {
                curv.v = value.v;
            }
            else {
                curv.v = cell_1.v;
            }
            if (value.m != null) {
                curv.m = value.m;
            }
            delFunctionGroup(ctx, row, column);
            setCellValueInternal(ctx, row, column, data, curv);
        }
        _.forEach(value, function (v, attr) {
            if (attr in formatList) {
                updateFormatCell(ctx, data, attr, v, row, row, column, column);
            }
            else {
                cell_1[attr] = v;
            }
        });
        data[row][column] = cell_1;
    }
    else {
        if (value.toString().substr(0, 1) === "=" ||
            value.toString().substr(0, 5) === "<span") {
            updateCell(ctx, row, column, cellInput, value);
        }
        else {
            delFunctionGroup(ctx, row, column);
            setCellValueInternal(ctx, row, column, data, value);
        }
    }
}
export function clearCell(ctx, row, column, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    if (!_.isNumber(row) || !_.isNumber(column)) {
        throw new Error("row or column cannot be null or undefined");
    }
    var sheet = getSheet(ctx, options);
    var cell = (_b = (_a = sheet.data) === null || _a === void 0 ? void 0 : _a[row]) === null || _b === void 0 ? void 0 : _b[column];
    if (cell && _.isPlainObject(cell)) {
        delete cell.m;
        delete cell.v;
        if (cell.f != null) {
            delete cell.f;
            delFunctionGroup(ctx, row, column, sheet.id);
            delete cell.spl;
        }
    }
}
export function setCellFormat(ctx, row, column, attr, value, options) {
    var _a;
    if (options === void 0) { options = {}; }
    if (!_.isNumber(row) || !_.isNumber(column)) {
        throw new Error("row or column cannot be null or undefined");
    }
    if (!attr) {
        throw new Error("attr cannot be null or undefined");
    }
    var sheet = getSheet(ctx, options);
    var targetSheetData = sheet.data;
    var cellData = ((_a = targetSheetData === null || targetSheetData === void 0 ? void 0 : targetSheetData[row]) === null || _a === void 0 ? void 0 : _a[column]) || {};
    var cfg = sheet.config || {};
    if (attr === "ct" && (!value || value.fa == null || value.t == null)) {
        throw new Error("'fa' and 't' should be present in value when attr is 'ct'");
    }
    else if (attr === "ct" && !_.isNil(cellData.v)) {
        cellData.m = SSF.format(value.fa, cellData.v);
    }
    if (attr === "bd") {
        if (cfg.borderInfo == null) {
            cfg.borderInfo = [];
        }
        var borderInfo = __assign({ rangeType: "range", borderType: "border-all", color: "#000", style: "1", range: [
                {
                    column: [column, column],
                    row: [row, row],
                },
            ] }, value);
        cfg.borderInfo.push(borderInfo);
    }
    else {
        cellData[attr] = value;
    }
    targetSheetData[row][column] = cellData;
    sheet.config = cfg;
    ctx.config = cfg;
}
export function autoFillCell(ctx, copyRange, applyRange, direction) {
    dropCellCache.copyRange = copyRange;
    dropCellCache.applyRange = applyRange;
    dropCellCache.direction = direction;
    var typeItemHide = getTypeItemHide(ctx);
    if (!typeItemHide[0] &&
        !typeItemHide[1] &&
        !typeItemHide[2] &&
        !typeItemHide[3] &&
        !typeItemHide[4] &&
        !typeItemHide[5] &&
        !typeItemHide[6]) {
        dropCellCache.applyType = "0";
    }
    else {
        dropCellCache.applyType = "1";
    }
    updateDropCell(ctx);
}
