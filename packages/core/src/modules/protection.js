import _ from "lodash";
import { getSheetByIndex } from "../utils";
export function checkCellIsLocked(ctx, r, c, sheetId) {
    var _a, _b;
    var sheetFile = getSheetByIndex(ctx, sheetId);
    if (_.isNil(sheetFile)) {
        return false;
    }
    var data = sheetFile.data;
    var cell = (_a = data === null || data === void 0 ? void 0 : data[r]) === null || _a === void 0 ? void 0 : _a[c];
    if (!_.isNil(cell === null || cell === void 0 ? void 0 : cell.lo)) {
        return !!(cell === null || cell === void 0 ? void 0 : cell.lo);
    }
    var aut = (_b = sheetFile.config) === null || _b === void 0 ? void 0 : _b.authority;
    var sheetInEditable = _.isNil(aut) || _.isNil(aut.sheet) || aut.sheet === 0;
    return !sheetInEditable;
}
export function checkProtectionSelectLockedOrUnLockedCells(ctx, r, c, sheetId) {
    var _a;
    var sheetFile = getSheetByIndex(ctx, sheetId);
    if (_.isNil(sheetFile)) {
        return true;
    }
    if (_.isNil(sheetFile.config) || _.isNil(sheetFile.config.authority)) {
        return true;
    }
    var aut = sheetFile.config.authority;
    if (_.isNil(aut) || _.isNil(aut.sheet) || aut.sheet === 0) {
        return true;
    }
    var data = sheetFile.data;
    var cell = (_a = data === null || data === void 0 ? void 0 : data[r]) === null || _a === void 0 ? void 0 : _a[c];
    if (cell && cell.lo === 0) {
        if (aut.selectunLockedCells === 1 || _.isNil(aut.selectunLockedCells)) {
            return true;
        }
        return false;
    }
    var isAllEdit = false;
    if (isAllEdit) {
        if (aut.selectunLockedCells === 1 || _.isNil(aut.selectunLockedCells)) {
            return true;
        }
        return false;
    }
    if (aut.selectLockedCells === 1 || _.isNil(aut.selectLockedCells)) {
        return true;
    }
    return false;
}
export function checkProtectionAllSelected(ctx, sheetId) {
    var sheetFile = getSheetByIndex(ctx, sheetId);
    if (_.isNil(sheetFile)) {
        return true;
    }
    if (_.isNil(sheetFile.config) || _.isNil(sheetFile.config.authority)) {
        return true;
    }
    var aut = sheetFile.config.authority;
    if (_.isNil(aut) || _.isNil(aut.sheet) || aut.sheet === 0) {
        return true;
    }
    var selectunLockedCells = false;
    if (aut.selectunLockedCells === 1 || _.isNil(aut.selectunLockedCells)) {
        selectunLockedCells = true;
    }
    var selectLockedCells = false;
    if (aut.selectLockedCells === 1 || _.isNil(aut.selectLockedCells)) {
        selectLockedCells = true;
    }
    if (selectunLockedCells && selectLockedCells) {
        return true;
    }
    return false;
}
export function checkProtectionFormatCells(ctx) {
    var sheetFile = getSheetByIndex(ctx, ctx.currentSheetId);
    if (_.isNil(sheetFile)) {
        return true;
    }
    if (_.isNil(sheetFile.config) || _.isNil(sheetFile.config.authority)) {
        return true;
    }
    var aut = sheetFile.config.authority;
    if (_.isNil(aut) || _.isNil(aut.sheet) || aut.sheet === 0) {
        return true;
    }
    var ht = "";
    if (!_.isNil(aut.hintText) && aut.hintText.length > 0) {
        ht = aut.hintText;
    }
    else {
        ht = aut.defaultSheetHintText;
    }
    ctx.warnDialog = ht;
    return false;
}
