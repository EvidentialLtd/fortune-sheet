import _ from "lodash";
import { getFlowdata } from "../context";
import { getSheetIndex } from "../utils";
import { getCellValue, getRangeByTxt } from "./cell";
import { genarate } from "./format";
import { execfunction, functionCopy } from "./formula";
import { checkProtectionFormatCells } from "./protection";
import { isRealNull } from "./validation";
export function getHistoryRules(fileH) {
    var historyRules = [];
    for (var h = 0; h < fileH.length; h += 1) {
        historyRules.push({
            sheetIndex: h,
            luckysheet_conditionformat_save: fileH[h].luckysheet_conditionformat_save,
        });
    }
    return historyRules;
}
export function getCurrentRules(fileC) {
    var currentRules = [];
    for (var c = 0; c < fileC.length; c += 1) {
        currentRules.push({
            sheetIndex: c,
            luckysheet_conditionformat_save: fileC[c].luckysheet_conditionformat_save,
        });
    }
    return currentRules;
}
export function setConditionRules(ctx, protection, generalDialog, conditionformat, rules) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    if (!checkProtectionFormatCells(ctx)) {
        return;
    }
    var conditionName = rules.rulesType;
    var conditionRange = [];
    var conditionValue = [];
    if (conditionName === "greaterThan" ||
        conditionName === "lessThan" ||
        conditionName === "equal" ||
        conditionName === "textContains") {
        var v = rules.rulesValue;
        var rangeArr = getRangeByTxt(ctx, v);
        if (rangeArr.length > 1) {
            var r1 = (_a = rangeArr[0]) === null || _a === void 0 ? void 0 : _a.row[0];
            var r2 = (_b = rangeArr[0]) === null || _b === void 0 ? void 0 : _b.row[1];
            var c1 = (_c = rangeArr[0]) === null || _c === void 0 ? void 0 : _c.column[0];
            var c2 = (_d = rangeArr[0]) === null || _d === void 0 ? void 0 : _d.column[1];
            if (r1 === r2 && c1 === c2) {
                var d = getFlowdata(ctx);
                if (!d || _.isNil(r1) || _.isNil(c1))
                    return;
                v = getCellValue(r1, c1, d);
                conditionRange.push({
                    row: (_e = rangeArr === null || rangeArr === void 0 ? void 0 : rangeArr[0]) === null || _e === void 0 ? void 0 : _e.row,
                    column: (_f = rangeArr === null || rangeArr === void 0 ? void 0 : rangeArr[0]) === null || _f === void 0 ? void 0 : _f.column,
                });
                conditionValue.push(v);
            }
            else {
                ctx.warnDialog = conditionformat.onlySingleCell;
            }
        }
        else if (rangeArr.length === 0) {
            if (_.isNaN(v) || v === "") {
                ctx.warnDialog = conditionformat.conditionValueCanOnly;
                return;
            }
            conditionValue.push(v);
        }
    }
    else if (conditionName === "between") {
        var v1 = rules.betweenValue.value1;
        var v2 = rules.betweenValue.value2;
        var rangeArr1 = getRangeByTxt(ctx, v1);
        if (rangeArr1.length > 1) {
            ctx.warnDialog = conditionformat.onlySingleCell;
            return;
        }
        if (rangeArr1.length === 1) {
            var r1 = (_g = rangeArr1[0]) === null || _g === void 0 ? void 0 : _g.row[0];
            var r2 = (_h = rangeArr1[0]) === null || _h === void 0 ? void 0 : _h.row[1];
            var c1 = (_j = rangeArr1[0]) === null || _j === void 0 ? void 0 : _j.column[0];
            var c2 = (_k = rangeArr1[0]) === null || _k === void 0 ? void 0 : _k.column[1];
            if (r1 === r2 && c1 === c2) {
                var d = getFlowdata(ctx);
                if (!d || _.isNil(r1) || _.isNil(c1))
                    return;
                v1 = getCellValue(r1, c1, d);
                conditionRange.push({
                    row: (_l = rangeArr1 === null || rangeArr1 === void 0 ? void 0 : rangeArr1[0]) === null || _l === void 0 ? void 0 : _l.row,
                    column: (_m = rangeArr1 === null || rangeArr1 === void 0 ? void 0 : rangeArr1[0]) === null || _m === void 0 ? void 0 : _m.column,
                });
                conditionValue.push(v1);
            }
            else {
                ctx.warnDialog = conditionformat.onlySingleCell;
                return;
            }
        }
        else if (rangeArr1.length === 0) {
            if (_.isNaN(v1) || v1 === "") {
                ctx.warnDialog = conditionformat.conditionValueCanOnly;
                return;
            }
            conditionValue.push(v1);
        }
        var rangeArr2 = getRangeByTxt(ctx, v2);
        if (rangeArr2.length > 1) {
            ctx.warnDialog = conditionformat.onlySingleCell;
            return;
        }
        if (rangeArr2.length === 1) {
            var r1 = (_o = rangeArr2[0]) === null || _o === void 0 ? void 0 : _o.row[0];
            var r2 = (_p = rangeArr2[0]) === null || _p === void 0 ? void 0 : _p.row[1];
            var c1 = (_q = rangeArr2[0]) === null || _q === void 0 ? void 0 : _q.column[0];
            var c2 = (_r = rangeArr2[0]) === null || _r === void 0 ? void 0 : _r.column[1];
            if (r1 === r2 && c1 === c2) {
                var d = getFlowdata(ctx);
                if (!d || _.isNil(r1) || _.isNil(c1))
                    return;
                v2 = getCellValue(r1, c1, d);
                conditionRange.push({
                    row: (_s = rangeArr2 === null || rangeArr2 === void 0 ? void 0 : rangeArr2[0]) === null || _s === void 0 ? void 0 : _s.row,
                    column: (_t = rangeArr2 === null || rangeArr2 === void 0 ? void 0 : rangeArr2[0]) === null || _t === void 0 ? void 0 : _t.column,
                });
            }
            else {
                ctx.warnDialog = conditionformat.onlySingleCell;
                return;
            }
        }
        else if (rangeArr2.length === 0) {
            if (_.isNaN(v2) || v2 === "") {
                ctx.warnDialog = conditionformat.conditionValueCanOnly;
            }
            else {
                conditionValue.push(v2);
            }
        }
    }
    else if (conditionName === "occurrenceDate") {
        var v = rules.dateValue;
        if (!v) {
            ctx.warnDialog = conditionformat.pleaseSelectADate;
            return;
        }
        conditionValue.push(v);
    }
    else if (conditionName === "duplicateValue") {
        conditionValue.push(rules.repeatValue);
    }
    else if (conditionName === "top10" ||
        conditionName === "top10_percent" ||
        conditionName === "last10" ||
        conditionName === "last10_percent") {
        var v = rules.projectValue;
        if (parseInt(v, 10).toString() !== v ||
            parseInt(v, 10) < 1 ||
            parseInt(v, 10) > 1000) {
            ctx.warnDialog = conditionformat.pleaseEnterInteger;
            return;
        }
        conditionValue.push(v);
    }
    else {
        conditionValue.push(conditionName);
    }
    var textColor = null;
    if (rules.textColor.check) {
        textColor = rules.textColor.color;
    }
    var cellColor = null;
    if (rules.cellColor.check) {
        cellColor = rules.cellColor.color;
    }
    var rule = {
        type: "default",
        cellrange: (_u = ctx.luckysheet_select_save) !== null && _u !== void 0 ? _u : [],
        format: {
            textColor: textColor,
            cellColor: cellColor,
        },
        conditionName: conditionName,
        conditionRange: conditionRange,
        conditionValue: conditionValue,
    };
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    var ruleArr = (_v = ctx.luckysheetfile[index].luckysheet_conditionformat_save) !== null && _v !== void 0 ? _v : [];
    ruleArr === null || ruleArr === void 0 ? void 0 : ruleArr.push(rule);
    ctx.luckysheetfile[index].luckysheet_conditionformat_save = ruleArr;
}
export function getColorGradation(color1, color2, value1, value2, value) {
    var rgb1 = color1.split(",");
    var r1 = parseInt(rgb1[0].split("(")[1], 10);
    var g1 = parseInt(rgb1[1], 10);
    var b1 = parseInt(rgb1[2].split(")")[0], 10);
    var rgb2 = color2.split(",");
    var r2 = parseInt(rgb2[0].split("(")[1], 10);
    var g2 = parseInt(rgb2[1], 10);
    var b2 = parseInt(rgb2[2].split(")")[0], 10);
    var v12 = value1 - value2;
    var v10 = value1 - value;
    var r = Math.round(r1 - ((r1 - r2) / v12) * v10);
    var g = Math.round(g1 - ((g1 - g2) / v12) * v10);
    var b = Math.round(b1 - ((b1 - b2) / v12) * v10);
    return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
}
export function compute(ctx, ruleArr, d) {
    if (_.isNil(ruleArr)) {
        ruleArr = [];
    }
    var computeMap = {};
    if (ruleArr.length > 0) {
        var _loop_1 = function (i) {
            var _a = ruleArr[i], type = _a.type, cellrange = _a.cellrange, format = _a.format;
            if (type === "dataBar") {
                var max = null;
                var min = null;
                for (var s = 0; s < cellrange.length; s += 1) {
                    for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                        for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                            if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                continue;
                            }
                            var cell = d[r][c];
                            if (!_.isNil(cell) &&
                                !_.isNil(cell.ct) &&
                                cell.ct.t === "n" &&
                                _.isNil(cell.v)) {
                                if (_.isNil(max) || parseInt("".concat(cell.v), 10) > max) {
                                    max = parseInt("".concat(cell.v), 10);
                                }
                                if (_.isNil(min) || parseInt("".concat(cell.v), 10) < min) {
                                    min = parseInt("".concat(cell.v), 10);
                                }
                            }
                        }
                    }
                }
                if (!_.isNil(max) && !_.isNil(min)) {
                    if (min < 0) {
                        var plusLen = Math.round((max / (max - min)) * 10) / 10;
                        var minusLen = Math.round((Math.abs(min) / (max - min)) * 10) / 10;
                        for (var s = 0; s < cellrange.length; s += 1) {
                            for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                                for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                    if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                        continue;
                                    }
                                    var cell = d[r][c];
                                    if (!_.isNil(cell) &&
                                        !_.isNil(cell.ct) &&
                                        cell.ct.t === "n" &&
                                        !_.isNil(cell.v)) {
                                        if (parseInt("".concat(cell.v), 10) < 0) {
                                            var valueLen = Math.round((Math.abs(parseInt("".concat(cell.v), 10)) /
                                                Math.abs(min)) *
                                                100) / 100;
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].dataBar = {
                                                    valueType: "minus",
                                                    minusLen: minusLen,
                                                    valueLen: valueLen,
                                                    format: format,
                                                };
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    dataBar: {
                                                        valueType: "minus",
                                                        minusLen: minusLen,
                                                        valueLen: valueLen,
                                                        format: format,
                                                    },
                                                };
                                            }
                                        }
                                        if (parseInt("".concat(cell.v), 10) > 0) {
                                            var valueLen = Math.round((parseInt("".concat(cell.v), 10) / max) * 100) /
                                                100;
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].dataBar = {
                                                    valueType: "plus",
                                                    plusLen: plusLen,
                                                    minusLen: minusLen,
                                                    valueLen: valueLen,
                                                    format: format,
                                                };
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    dataBar: {
                                                        valueType: "plus",
                                                        plusLen: plusLen,
                                                        minusLen: minusLen,
                                                        valueLen: valueLen,
                                                        format: format,
                                                    },
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        var plusLen = 1;
                        for (var s = 0; s < cellrange.length; s += 1) {
                            for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                                for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                    if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                        continue;
                                    }
                                    var cell = d[r][c];
                                    if (!_.isNil(cell) &&
                                        !_.isNil(cell.ct) &&
                                        cell.ct.t === "n" &&
                                        !_.isNil(cell.v)) {
                                        var valueLen = void 0;
                                        if (max === 0) {
                                            valueLen = 1;
                                        }
                                        else {
                                            valueLen =
                                                Math.round((parseInt("".concat(cell.v), 10) / max) * 100) /
                                                    100;
                                        }
                                        if ("".concat(r, "_").concat(c) in computeMap) {
                                            computeMap["".concat(r, "_").concat(c)].dataBar = {
                                                valueType: "plus",
                                                plusLen: plusLen,
                                                valueLen: valueLen,
                                                format: format,
                                            };
                                        }
                                        else {
                                            computeMap["".concat(r, "_").concat(c)] = {
                                                dataBar: {
                                                    valueType: "plus",
                                                    plusLen: plusLen,
                                                    valueLen: valueLen,
                                                    format: format,
                                                },
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (type === "colorGradation") {
                var max = null;
                var min = null;
                var sum = 0;
                var count = 0;
                for (var s = 0; s < cellrange.length; s += 1) {
                    for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                        for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                            if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                continue;
                            }
                            var cell = d[r][c];
                            if (!_.isNil(cell) &&
                                !_.isNil(cell.ct) &&
                                cell.ct.t === "n" &&
                                !_.isNil(cell.v)) {
                                count += 1;
                                sum += parseInt("".concat(cell.v), 10);
                                if (_.isNil(max) || parseInt("".concat(cell.v), 10) > max) {
                                    max = parseInt("".concat(cell.v), 10);
                                }
                                if (_.isNil(min) || parseInt("".concat(cell.v), 10) < min) {
                                    min = parseInt("".concat(cell.v), 10);
                                }
                            }
                        }
                    }
                }
                if (!_.isNil(max) && !_.isNil(min)) {
                    if (format.length === 3) {
                        var avg = Math.floor(sum / count);
                        for (var s = 0; s < cellrange.length; s += 1) {
                            for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                                for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                    if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                        continue;
                                    }
                                    var cell = d[r][c];
                                    if (!_.isNil(cell) &&
                                        !_.isNil(cell.ct) &&
                                        cell.ct.t === "n" &&
                                        !_.isNil(cell.v)) {
                                        if (parseInt("".concat(cell.v), 10) === min) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = format.cellColor;
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    cellColor: format.cellColor,
                                                };
                                            }
                                        }
                                        else if (parseInt("".concat(cell.v), 10) > min &&
                                            parseInt("".concat(cell.v), 10) < avg) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = getColorGradation(format.cellColor, format.textColor, min, avg, parseInt("".concat(cell.v), 10));
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    cellColor: getColorGradation(format[2], format[1], min, avg, parseInt("".concat(cell.v), 10)),
                                                };
                                            }
                                        }
                                        else if (parseInt("".concat(cell.v), 10) === avg) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = format.cellColor;
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = { cellColor: format[1] };
                                            }
                                        }
                                        else if (parseInt("".concat(cell.v), 10) > avg &&
                                            parseInt("".concat(cell.v), 10) < max) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = getColorGradation(format[1], format[0], avg, max, parseInt("".concat(cell.v), 10));
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    cellColor: getColorGradation(format[1], format[0], avg, max, parseInt("".concat(cell.v), 10)),
                                                };
                                            }
                                        }
                                        else if (parseInt("".concat(cell.v), 10) === max) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = format.cellColor;
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = { cellColor: format[0] };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (format.length === 2) {
                        for (var s = 0; s < cellrange.length; s += 1) {
                            for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                                for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                    if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                        continue;
                                    }
                                    var cell = d[r][c];
                                    if (!_.isNil(cell) &&
                                        !_.isNil(cell.ct) &&
                                        cell.ct.t === "n" &&
                                        !_.isNil(cell.v)) {
                                        if (parseInt("".concat(cell.v), 10) === min) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = format.cellColor;
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = { cellColor: format[1] };
                                            }
                                        }
                                        else if (parseInt("".concat(cell.v), 10) > min &&
                                            parseInt("".concat(cell.v), 10) < max) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = getColorGradation(format[1], format[0], min, max, parseInt("".concat(cell.v), 10));
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    cellColor: getColorGradation(format[1], format[0], min, max, parseInt("".concat(cell.v), 10)),
                                                };
                                            }
                                        }
                                        else if (parseInt("".concat(cell.v), 10) === max) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].cellColor = format.textColor;
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = { cellColor: format[0] };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (type === "icons") {
            }
            else {
                var conditionName = ruleArr[i].conditionName;
                var conditionValue0 = ruleArr[i].conditionValue[0];
                var conditionValue1 = ruleArr[i].conditionValue[1];
                var textColor_1 = format.textColor, cellColor_1 = format.cellColor;
                for (var s = 0; s < cellrange.length; s += 1) {
                    if (conditionName === "greaterThan" ||
                        conditionName === "lessThan" ||
                        conditionName === "equal" ||
                        conditionName === "textContains") {
                        for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                            for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                    continue;
                                }
                                var cell = d[r][c];
                                if (_.isNil(cell) || _.isNil(cell.v) || isRealNull(cell.v)) {
                                    continue;
                                }
                                if (conditionName === "greaterThan" &&
                                    cell.v > conditionValue0) {
                                    if ("".concat(r, "_").concat(c) in computeMap) {
                                        computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                        computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                    }
                                    else {
                                        computeMap["".concat(r, "_").concat(c)] = { textColor: textColor_1, cellColor: cellColor_1 };
                                    }
                                }
                                else if (conditionName === "lessThan" &&
                                    cell.v < conditionValue0) {
                                    if ("".concat(r, "_").concat(c) in computeMap) {
                                        computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                        computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                    }
                                    else {
                                        computeMap["".concat(r, "_").concat(c)] = {
                                            textColor: textColor_1,
                                            cellColor: cellColor_1,
                                        };
                                    }
                                }
                                else if (conditionName === "equal" &&
                                    cell.v.toString() === conditionValue0) {
                                    if ("".concat(r, "_").concat(c) in computeMap) {
                                        computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                        computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                    }
                                    else {
                                        computeMap["".concat(r, "_").concat(c)] = {
                                            textColor: textColor_1,
                                            cellColor: cellColor_1,
                                        };
                                    }
                                }
                                else if (conditionName === "textContains" &&
                                    cell.v.toString().indexOf(conditionValue0) !== -1) {
                                    if ("".concat(r, "_").concat(c) in computeMap) {
                                        computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                        computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                    }
                                    else {
                                        computeMap["".concat(r, "_").concat(c)] = {
                                            textColor: textColor_1,
                                            cellColor: cellColor_1,
                                        };
                                    }
                                }
                            }
                        }
                    }
                    else if (conditionName === "between") {
                        var vBig = 0;
                        var vSmall = 0;
                        if (conditionValue0 > conditionValue1) {
                            vBig = conditionValue0;
                            vSmall = conditionValue1;
                        }
                        else {
                            vBig = conditionValue1;
                            vSmall = conditionValue0;
                        }
                        for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                            for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                    continue;
                                }
                                var cell = d[r][c];
                                if (_.isNil(cell) || _.isNil(cell.v) || isRealNull(cell.v)) {
                                    continue;
                                }
                                if (typeof cell.v === "number" &&
                                    cell.v >= vSmall &&
                                    cell.v <= vBig) {
                                    if ("".concat(r, "_").concat(c) in computeMap) {
                                        computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                        computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                    }
                                    else {
                                        computeMap["".concat(r, "_").concat(c)] = {
                                            textColor: textColor_1,
                                            cellColor: cellColor_1,
                                        };
                                    }
                                }
                            }
                        }
                    }
                    else if (conditionName === "occurrenceDate") {
                        var dBig = void 0;
                        var dSmall = void 0;
                        if (conditionValue0.toString().indexOf("-") === -1) {
                            dBig = genarate(conditionValue0)[2].toString();
                            dSmall = genarate(conditionValue0)[2].toString();
                        }
                        else {
                            var str = conditionValue0.toString().split("-");
                            dBig = genarate(str[1].trim())[2].toString();
                            dSmall = genarate(str[0].trim()[2].toString());
                        }
                        for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                            for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                    continue;
                                }
                                if (!_.isNil(d[r][c]) &&
                                    !_.isNil(d[r][c].ct) &&
                                    d[r][c].ct.t === "d") {
                                    var cellVal = getCellValue(r, c, d);
                                    if (cellVal >= dSmall && cellVal <= dBig) {
                                        if ("".concat(r, "_").concat(c) in computeMap) {
                                            computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                            computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                        }
                                        else {
                                            computeMap["".concat(r, "_").concat(c)] = {
                                                textColor: textColor_1,
                                                cellColor: cellColor_1,
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (conditionName === "duplicateValue") {
                        var dmap = {};
                        for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                            for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                var item = getCellValue(r, c, d);
                                if (!(item in dmap)) {
                                    dmap[item] = [];
                                }
                                dmap[item].push({ r: r, c: c });
                            }
                        }
                        if (conditionValue0 === "0") {
                            _.forEach(dmap, function (x) {
                                if (x.length > 1) {
                                    for (var j = 0; j < x.length; j += 1) {
                                        if ("".concat(x[j].r, "_").concat(x[j].c) in computeMap) {
                                            computeMap["".concat(x[j].r, "_").concat(x[j].c)].textColor = textColor_1;
                                            computeMap["".concat(x[j].r, "_").concat(x[j].c)].cellColor = cellColor_1;
                                        }
                                        else {
                                            computeMap["".concat(x[j].r, "_").concat(x[j].c)] = {
                                                textColor: textColor_1,
                                                cellColor: cellColor_1,
                                            };
                                        }
                                    }
                                }
                            });
                        }
                        else if (conditionValue0 === "1") {
                            _.forEach(dmap, function (x) {
                                if (x.length === 1) {
                                    if ("".concat(x[0].r, "_").concat(x[0].c) in computeMap) {
                                        computeMap["".concat(x[0].r, "_").concat(x[0].c)].textColor = textColor_1;
                                        computeMap["".concat(x[0].r, "_").concat(x[0].c)].cellColor = cellColor_1;
                                    }
                                    else {
                                        computeMap["".concat(x[0].r, "_").concat(x[0].c)] = {
                                            textColor: textColor_1,
                                            cellColor: cellColor_1,
                                        };
                                    }
                                }
                            });
                        }
                    }
                    else if (conditionName === "top10" ||
                        conditionName === "top10_percent" ||
                        conditionName === "last10" ||
                        conditionName === "last10_percent" ||
                        conditionName === "aboveAverage" ||
                        conditionName === "belowAverage") {
                        var dArr = [];
                        for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                            for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                    continue;
                                }
                                if (!_.isNil(d[r][c]) &&
                                    !_.isNil(d[r][c].ct) &&
                                    d[r][c].ct.t === "n") {
                                    dArr.push(getCellValue(r, c, d));
                                }
                            }
                        }
                        if (conditionName === "top10" ||
                            conditionName === "top10_percent" ||
                            conditionName === "last10" ||
                            conditionName === "last10_percent") {
                            for (var j = 0; j < dArr.length; j += 1) {
                                for (var k = 0; k < dArr.length - 1 - j; k += 1) {
                                    if (dArr[k] < dArr[k + 1]) {
                                        var temp = dArr[k];
                                        dArr[k] = dArr[k + 1];
                                        dArr[k + 1] = temp;
                                    }
                                }
                            }
                            var cArr = void 0;
                            if (conditionName === "top10") {
                                cArr = dArr.slice(0, conditionValue0);
                            }
                            else if (conditionName === "top10_percent") {
                                cArr = dArr.slice(0, Math.floor((conditionValue0 * dArr.length) / 100));
                            }
                            else if (conditionName === "last10") {
                                cArr = dArr.slice(dArr.length - conditionValue0, dArr.length);
                            }
                            else if (conditionName === "last10_percent") {
                                cArr = dArr.slice(dArr.length -
                                    Math.floor((conditionValue0 * dArr.length) / 100), dArr.length);
                            }
                            for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                                for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                    if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                        continue;
                                    }
                                    var cellVal = getCellValue(r, c, d);
                                    if (!_.isNil(cArr) && cArr.indexOf(cellVal) !== -1) {
                                        if ("".concat(r, "_").concat(c) in computeMap) {
                                            computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                            computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                        }
                                        else {
                                            computeMap["".concat(r, "_").concat(c)] = {
                                                textColor: textColor_1,
                                                cellColor: cellColor_1,
                                            };
                                        }
                                    }
                                }
                            }
                        }
                        else if (conditionName === "aboveAverage" ||
                            conditionName === "belowAverage") {
                            var sum = 0;
                            for (var j = 0; j < dArr.length; j += 1) {
                                sum += dArr[j];
                            }
                            var averageNum = sum / dArr.length;
                            if (conditionName === "aboveAverage") {
                                for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                                    for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                        if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                            continue;
                                        }
                                        var cellVal = getCellValue(r, c, d);
                                        if (cellVal > averageNum) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                                computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    textColor: textColor_1,
                                                    cellColor: cellColor_1,
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                            else if (conditionName === "belowAverage") {
                                for (var r = cellrange[s].row[0]; r <= cellrange[s].row[1]; r += 1) {
                                    for (var c = cellrange[s].column[0]; c <= cellrange[s].column[1]; c += 1) {
                                        if (_.isNil(d[r]) || _.isNil(d[r][c])) {
                                            continue;
                                        }
                                        var cellVal = getCellValue(r, c, d);
                                        if (cellVal < averageNum) {
                                            if ("".concat(r, "_").concat(c) in computeMap) {
                                                computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                                computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                            }
                                            else {
                                                computeMap["".concat(r, "_").concat(c)] = {
                                                    textColor: textColor_1,
                                                    cellColor: cellColor_1,
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (conditionName === "formula") {
                        var str = cellrange[s].row[0];
                        var edr = cellrange[s].row[1];
                        var stc = cellrange[s].column[0];
                        var edc = cellrange[s].column[1];
                        var formulaTxt = conditionValue0;
                        if (conditionValue0.toString().slice(0, 1) !== "=") {
                            formulaTxt = "=".concat(conditionValue0);
                        }
                        for (var r = str; r <= edr; r += 1) {
                            for (var c = stc; c <= edc; c += 1) {
                                var func = formulaTxt;
                                var offsetRow = r - str;
                                var offsetCol = c - stc;
                                if (offsetRow > 0) {
                                    func = "=".concat(functionCopy(ctx, func, "down", offsetRow));
                                }
                                if (offsetCol > 0) {
                                    func = "=".concat(functionCopy(ctx, func, "right", offsetCol));
                                }
                                var funcV = execfunction(ctx, func, r, c);
                                var v = funcV[1];
                                if (typeof v !== "boolean") {
                                    v = !!Number(v);
                                }
                                if (!v) {
                                    continue;
                                }
                                if ("".concat(r, "_").concat(c) in computeMap) {
                                    computeMap["".concat(r, "_").concat(c)].textColor = textColor_1;
                                    computeMap["".concat(r, "_").concat(c)].cellColor = cellColor_1;
                                }
                                else {
                                    computeMap["".concat(r, "_").concat(c)] = {
                                        textColor: textColor_1,
                                        cellColor: cellColor_1,
                                    };
                                }
                            }
                        }
                    }
                }
            }
        };
        for (var i = 0; i < ruleArr.length; i += 1) {
            _loop_1(i);
        }
    }
    return computeMap;
}
export function getComputeMap(ctx) {
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    var ruleArr = ctx.luckysheetfile[index].luckysheet_conditionformat_save;
    var data = ctx.luckysheetfile[index].data;
    if (_.isNil(data))
        return null;
    var computeMap = compute(ctx, ruleArr, data);
    return computeMap;
}
export function checkCF(r, c, computeMap) {
    if (!_.isNil(computeMap) && "".concat(r, "_").concat(c) in computeMap) {
        return computeMap["".concat(r, "_").concat(c)];
    }
    return null;
}
export function updateItem(ctx, type) {
    var _a, _b;
    if (!checkProtectionFormatCells(ctx)) {
        return;
    }
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    var ruleArr = [];
    if (type === "delSheet") {
        ruleArr = [];
    }
    else {
        var rule = {
            type: type,
            cellrange: (_a = ctx.luckysheet_select_save) !== null && _a !== void 0 ? _a : [],
            format: {
                textColor: ctx.conditionRules.textColor,
                cellColor: ctx.conditionRules.cellColor,
            },
        };
        ruleArr = (_b = ctx.luckysheetfile[index].luckysheet_conditionformat_save) !== null && _b !== void 0 ? _b : [];
        ruleArr.push(rule);
    }
    ctx.luckysheetfile[index].luckysheet_conditionformat_save = ruleArr;
}
export function CFSplitRange(range1, range2, range3, type) {
    var range = [];
    var offset_r = range3.row[0] - range2.row[0];
    var offset_c = range3.column[0] - range2.column[0];
    var r1 = range1.row[0];
    var r2 = range1.row[1];
    var c1 = range1.column[0];
    var c2 = range1.column[1];
    if (r1 >= range2.row[0] &&
        r2 <= range2.row[1] &&
        c1 >= range2.column[0] &&
        c2 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (r1 >= range2.row[0] &&
        r1 <= range2.row[1] &&
        c1 >= range2.column[0] &&
        c2 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [{ row: [range2.row[1] + 1, r2], column: [c1, c2] }];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (r2 >= range2.row[0] &&
        r2 <= range2.row[1] &&
        c1 >= range2.column[0] &&
        c2 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [{ row: [r1, range2.row[0] - 1], column: [c1, c2] }];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (r1 < range2.row[0] &&
        r2 > range2.row[1] &&
        c1 >= range2.column[0] &&
        c2 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (c1 >= range2.column[0] &&
        c1 <= range2.column[1] &&
        r1 >= range2.row[0] &&
        r2 <= range2.row[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, r2], column: [range2.column[1] + 1, c2] },
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [{ row: [r1, r2], column: [range2.column[1] + 1, c2] }];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else if (c2 >= range2.column[0] &&
        c2 <= range2.column[1] &&
        r1 >= range2.row[0] &&
        r2 <= range2.row[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, r2], column: [c1, range2.column[0] - 1] },
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [{ row: [r1, r2], column: [c1, range2.column[0] - 1] }];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (c1 < range2.column[0] &&
        c2 > range2.column[1] &&
        r1 >= range2.row[0] &&
        r2 <= range2.row[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, r2], column: [c1, range2.column[0] - 1] },
                { row: [r1, r2], column: [range2.column[1] + 1, c2] },
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, r2], column: [c1, range2.column[0] - 1] },
                { row: [r1, r2], column: [range2.column[1] + 1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else if (r1 >= range2.row[0] &&
        r1 <= range2.row[1] &&
        c1 >= range2.column[0] &&
        c1 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[1]], column: [range2.column[1] + 1, c2] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[1]], column: [range2.column[1] + 1, c2] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else if (r1 >= range2.row[0] &&
        r1 <= range2.row[1] &&
        c2 >= range2.column[0] &&
        c2 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[1]], column: [c1, range2.column[0] - 1] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[1]], column: [c1, range2.column[0] - 1] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (r2 >= range2.row[0] &&
        r2 <= range2.row[1] &&
        c1 >= range2.column[0] &&
        c1 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[0], r2], column: [range2.column[1] + 1, c2] },
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[0], r2], column: [range2.column[1] + 1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else if (r2 >= range2.row[0] &&
        r2 <= range2.row[1] &&
        c2 >= range2.column[0] &&
        c2 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[0], r2], column: [c1, range2.column[0] - 1] },
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[0], r2], column: [c1, range2.column[0] - 1] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (r1 < range2.row[0] &&
        r2 > range2.row[1] &&
        c1 >= range2.column[0] &&
        c1 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [range2.column[1] + 1, c2],
                },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [range2.column[1] + 1, c2],
                },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [c1 + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else if (r1 < range2.row[0] &&
        r2 > range2.row[1] &&
        c2 >= range2.column[0] &&
        c2 <= range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [c1, range2.column[0] - 1],
                },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [c1, range2.column[0] - 1],
                },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, c2 + offset_c],
                },
            ];
        }
    }
    else if (c1 < range2.column[0] &&
        c2 > range2.column[1] &&
        r1 >= range2.row[0] &&
        r1 <= range2.row[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[1]], column: [c1, range2.column[0] - 1] },
                { row: [r1, range2.row[1]], column: [range2.column[1] + 1, c2] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[1]], column: [c1, range2.column[0] - 1] },
                { row: [r1, range2.row[1]], column: [range2.column[1] + 1, c2] },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [r1 + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else if (c1 < range2.column[0] &&
        c2 > range2.column[1] &&
        r2 >= range2.row[0] &&
        r2 <= range2.row[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[0], r2], column: [c1, range2.column[0] - 1] },
                { row: [range2.row[0], r2], column: [range2.column[1] + 1, c2] },
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                { row: [range2.row[0], r2], column: [c1, range2.column[0] - 1] },
                { row: [range2.row[0], r2], column: [range2.column[1] + 1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, r2 + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else if (r1 < range2.row[0] &&
        r2 > range2.row[1] &&
        c1 < range2.column[0] &&
        c2 > range2.column[1]) {
        if (type === "allPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [c1, range2.column[0] - 1],
                },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [range2.column[1] + 1, c2],
                },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
        else if (type === "restPart") {
            range = [
                { row: [r1, range2.row[0] - 1], column: [c1, c2] },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [c1, range2.column[0] - 1],
                },
                {
                    row: [range2.row[0], range2.row[1]],
                    column: [range2.column[1] + 1, c2],
                },
                { row: [range2.row[1] + 1, r2], column: [c1, c2] },
            ];
        }
        else if (type === "operatePart") {
            range = [
                {
                    row: [range2.row[0] + offset_r, range2.row[1] + offset_r],
                    column: [range2.column[0] + offset_c, range2.column[1] + offset_c],
                },
            ];
        }
    }
    else {
        if (type === "allPart") {
            range = [{ row: [r1, r2], column: [c1, c2] }];
        }
        else if (type === "restPart") {
            range = [{ row: [r1, r2], column: [c1, c2] }];
        }
        else if (type === "operatePart") {
            range = [];
        }
    }
    return range;
}
