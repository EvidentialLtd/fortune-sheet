import _ from "lodash";
import { getFlowdata } from "../context";
import { normalizeSelection } from "./selection";
export function deleteCellInSave(cellSave, range) {
    for (var r = range.row[0]; r <= range.row[1]; r += 1) {
        for (var c = range.column[0]; c <= range.column[1]; c += 1) {
            delete cellSave["".concat(r, "_").concat(c)];
        }
    }
    return cellSave;
}
export function getRangeArr(minR, maxR, minC, maxC, cellSave, rangeArr, ctx) {
    var _a, _b, _c;
    if (Object.keys(cellSave).length === 0) {
        return rangeArr;
    }
    var stack_str = null;
    var stack_edr = null;
    var stack_stc = null;
    var stack_edc = null;
    var flowData = getFlowdata(ctx, ctx.currentSheetId);
    for (var r = minR; r <= maxR; r += 1) {
        for (var c = minC; c <= maxC; c += 1) {
            if (_.isNil(flowData))
                break;
            var cell = flowData[r][c];
            if ("".concat(r, "_").concat(c) in cellSave) {
                if (!!((_a = cell === null || cell === void 0 ? void 0 : cell.mc) === null || _a === void 0 ? void 0 : _a.cs) && !!((_b = cell === null || cell === void 0 ? void 0 : cell.mc) === null || _b === void 0 ? void 0 : _b.rs) && !!((_c = cell === null || cell === void 0 ? void 0 : cell.mc) === null || _c === void 0 ? void 0 : _c.r)) {
                    if (stack_stc === null) {
                        var range = {
                            row: [cell.mc.r, cell.mc.r + cell.mc.rs - 1],
                            column: [cell.mc.c, cell.mc.c + cell.mc.cs - 1],
                        };
                        rangeArr.push(range);
                        cellSave = deleteCellInSave(cellSave, range);
                        return getRangeArr(minR, maxR, minC, maxC, cellSave, rangeArr, ctx);
                    }
                    if (stack_edc !== null && c < stack_edc) {
                        var range = {
                            row: [stack_str, stack_edr],
                            column: [stack_stc, stack_edc],
                        };
                        rangeArr.push(range);
                        cellSave = deleteCellInSave(cellSave, range);
                        return getRangeArr(minR, maxR, minC, maxC, cellSave, rangeArr, ctx);
                    }
                    break;
                }
                else if (stack_stc === null) {
                    stack_stc = c;
                    stack_edc = c;
                    stack_str = r;
                    stack_edr = r;
                }
                else if (stack_edc !== null && c > stack_edc) {
                    stack_edc = c;
                }
            }
            else if (stack_stc !== null) {
                if (cell !== null && cell.mc !== null) {
                    break;
                }
                else if (c < stack_stc) {
                }
                else if (stack_edc !== null && c <= stack_edc) {
                    var range = {
                        row: [stack_str, stack_edr],
                        column: [stack_stc, stack_edc],
                    };
                    rangeArr.push(range);
                    cellSave = deleteCellInSave(cellSave, range);
                    return getRangeArr(minR, maxR, minC, maxC, cellSave, rangeArr, ctx);
                }
                else {
                    stack_edr = r;
                }
            }
        }
    }
    if (stack_stc !== null) {
        var range = {
            row: [stack_str, stack_edr],
            column: [stack_stc, stack_edc],
        };
        rangeArr.push(range);
        cellSave = deleteCellInSave(cellSave, range);
        return getRangeArr(minR, maxR, minC, maxC, cellSave, rangeArr, ctx);
    }
    return rangeArr;
}
export function getOptionValue(constants) {
    var tempConstans = _.cloneDeep(constants);
    var len = _.filter(tempConstans, function (o) { return o; }).length;
    var value;
    if (len === 0) {
        value = "";
    }
    else if (len === 5) {
        value = "all";
    }
    else {
        var arr_1 = [];
        _.toPairs(constants).forEach(function (entry) {
            var k = entry[0], v = entry[1];
            if (v) {
                if (k === "locationDate") {
                    arr_1.push("d");
                }
                else if (k === "locationDigital") {
                    arr_1.push("n");
                }
                else if (k === "locationString") {
                    arr_1.push("s,g");
                }
                else if (k === "locationBool") {
                    arr_1.push("b");
                }
                else if (k === "locationError") {
                    arr_1.push("e");
                }
            }
        });
        value = arr_1.join(",");
    }
    return value;
}
export function getSelectRange(ctx) {
    var _a, _b;
    var range;
    if (((_a = ctx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) === 0 ||
        (((_b = ctx.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b.length) === 1 &&
            ctx.luckysheet_select_save[0].row[0] ===
                ctx.luckysheet_select_save[0].row[1] &&
            ctx.luckysheet_select_save[0].column[0] ===
                ctx.luckysheet_select_save[0].column[1])) {
        var flowdata = getFlowdata(ctx, ctx.currentSheetId);
        if (_.isNil(flowdata))
            return [];
        range = [
            { row: [0, flowdata.length - 1], column: [0, flowdata[0].length - 1] },
        ];
    }
    else {
        range = _.assignIn([], ctx.luckysheet_select_save);
    }
    return range;
}
export function applyLocation(range, type, value, ctx) {
    var _a;
    var rangeArr = [];
    if (type === "locationFormula" ||
        type === "locationConstant" ||
        type === "locationNull") {
        var minR = null;
        var maxR = null;
        var minC = null;
        var maxC = null;
        var cellSave = {};
        var flowData = getFlowdata(ctx, ctx.currentSheetId);
        if (_.isNil(flowData))
            return [];
        for (var s = 0; s < range.length; s += 1) {
            var st_r = range[s].row[0];
            var ed_r = range[s].row[1];
            var st_c = range[s].column[0];
            var ed_c = range[s].column[1];
            if (minR === null || minR < st_r) {
                minR = st_r;
            }
            if (maxR === null || maxR > ed_r) {
                maxR = ed_r;
            }
            if (minC === null || minC < st_c) {
                minC = st_c;
            }
            if (maxC === null || maxC > ed_c) {
                maxC = ed_c;
            }
            for (var r = st_r; r <= ed_r; r += 1) {
                for (var c = st_c; c <= ed_c; c += 1) {
                    var cell = flowData[r][c];
                    if (cell === null || cell === void 0 ? void 0 : cell.mc) {
                        cell = flowData[cell.mc.r][cell.mc.c];
                    }
                    if (type === "locationFormula" &&
                        !!cell &&
                        cell.v !== null &&
                        !!cell.f &&
                        (value === "all" ||
                            (!!cell.ct &&
                                !!value &&
                                !!cell.ct.t &&
                                value.indexOf(cell.ct.t) > -1))) {
                        cellSave["".concat(r, "_").concat(c)] = 0;
                    }
                    else if (type === "locationConstant" &&
                        (cell === null || cell === void 0 ? void 0 : cell.v) &&
                        (value === "all" || (((_a = cell === null || cell === void 0 ? void 0 : cell.ct) === null || _a === void 0 ? void 0 : _a.t) && value.indexOf(cell.ct.t) > -1))) {
                        cellSave["".concat(r, "_").concat(c)] = 0;
                    }
                    else if (type === "locationNull" &&
                        (cell === null || cell.v === null)) {
                        cellSave["".concat(r, "_").concat(c)] = 0;
                    }
                }
            }
        }
        rangeArr = getRangeArr(minR, maxR, minC, maxC, cellSave, rangeArr, ctx);
    }
    else if (type === "locationCF") {
    }
    else if (type === "locationRowSpan") {
        for (var s = 0; s < range.length; s += 1) {
            if (range[s].row[0] === range[s].row[1]) {
                continue;
            }
            var st_r = range[s].row[0];
            var ed_r = range[s].row[1];
            var st_c = range[s].column[0];
            var ed_c = range[s].column[1];
            for (var r = st_r; r <= ed_r; r += 1) {
                if ((r - st_r) % 2 === 0) {
                    rangeArr.push({ row: [r, r], column: [st_c, ed_c] });
                }
            }
        }
    }
    else if (type === "locationColumnSpan") {
        for (var s = 0; s < range.length; s += 1) {
            if (range[s].column[0] === range[s].column[1]) {
                continue;
            }
            var st_r = range[s].row[0];
            var ed_r = range[s].row[1];
            var st_c = range[s].column[0];
            var ed_c = range[s].column[1];
            for (var c = st_c; c <= ed_c; c += 1) {
                if ((c - st_c) % 2 === 0) {
                    rangeArr.push({ row: [st_r, ed_r], column: [c, c] });
                }
            }
        }
    }
    if (rangeArr.length === 0) {
        return rangeArr;
    }
    ctx.luckysheet_select_save = normalizeSelection(ctx, rangeArr);
    return rangeArr;
}
