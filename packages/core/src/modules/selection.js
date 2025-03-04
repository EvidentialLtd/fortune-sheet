import _ from "lodash";
import { getFlowdata } from "../context";
import { getCellValue, getdatabyselection, getDataBySelectionNoCopy, getStyleByCell, mergeBorder, mergeMoveMain, } from "./cell";
import clipboard from "./clipboard";
import { getBorderInfoCompute } from "./border";
import { escapeHTMLTag, getSheetIndex, isAllowEdit, replaceHtml, } from "../utils";
import { hasPartMC } from "./validation";
import { update } from "./format";
import SSF from "./ssf";
import { CFSplitRange } from "./ConditionFormat";
export var selectionCache = {
    isPasteAction: false,
};
export function scrollToHighlightCell(ctx, r, c) {
    var _a, _b, _c, _d;
    var scrollLeft = ctx.scrollLeft, scrollTop = ctx.scrollTop;
    var winH = ctx.cellmainHeight;
    var winW = ctx.cellmainWidth;
    var sheetIndex = getSheetIndex(ctx, ctx.currentSheetId);
    var sheet = sheetIndex == null ? null : ctx.luckysheetfile[sheetIndex];
    if (!sheet)
        return;
    var frozen = sheet === null || sheet === void 0 ? void 0 : sheet.frozen;
    if (r >= 0) {
        var row_focus = ((_b = (_a = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _a === void 0 ? void 0 : _a.range) === null || _b === void 0 ? void 0 : _b.row_focus) || 0;
        var freezeH = frozen && r > row_focus ? ctx.visibledatarow[row_focus] : 0;
        var row = ctx.visibledatarow[r];
        var row_pre = r - 1 === -1 ? 0 : ctx.visibledatarow[r - 1];
        if (row - scrollTop - winH + 20 > 0) {
            ctx.scrollTop = row - winH + 20;
        }
        else if (row_pre - scrollTop - freezeH < 0) {
            var scrollAmount = Math.max(20, freezeH);
            ctx.scrollTop = row_pre - scrollAmount;
        }
    }
    if (c >= 0) {
        var column_focus = ((_d = (_c = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _c === void 0 ? void 0 : _c.range) === null || _d === void 0 ? void 0 : _d.column_focus) || 0;
        var freezeW = frozen && c > column_focus ? ctx.visibledatacolumn[column_focus] : 0;
        var col = ctx.visibledatacolumn[c];
        var col_pre = c - 1 === -1 ? 0 : ctx.visibledatacolumn[c - 1];
        if (col - scrollLeft - winW + 20 > 0) {
            ctx.scrollLeft = col - winW + 20;
        }
        else if (col_pre - scrollLeft - freezeW < 0) {
            var scrollAmount = Math.max(20, freezeW);
            ctx.scrollLeft = col_pre - scrollAmount;
        }
    }
}
export function seletedHighlistByindex(ctx, r1, r2, c1, c2) {
    var row = ctx.visibledatarow[r2];
    var row_pre = r1 - 1 === -1 ? 0 : ctx.visibledatarow[r1 - 1];
    var col = ctx.visibledatacolumn[c2];
    var col_pre = c1 - 1 === -1 ? 0 : ctx.visibledatacolumn[c1 - 1];
    if (_.isNumber(row) &&
        _.isNumber(row_pre) &&
        _.isNumber(col) &&
        _.isNumber(col_pre)) {
        return {
            left: col_pre,
            width: col - col_pre - 1,
            top: row_pre,
            height: row - row_pre - 1,
        };
    }
    return null;
}
export function normalizeSelection(ctx, selection) {
    var _a, _b;
    if (!selection)
        return selection;
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return selection;
    for (var i = 0; i < selection.length; i += 1) {
        var r1 = selection[i].row[0];
        var r2 = selection[i].row[1];
        var c1 = selection[i].column[0];
        var c2 = selection[i].column[1];
        var rf = void 0;
        var cf = void 0;
        if (_.isNil(selection[i].row_focus)) {
            rf = r1;
        }
        else {
            rf = selection[i].row_focus;
        }
        if (_.isNil(selection[i].column_focus)) {
            cf = c1;
        }
        else {
            cf = selection[i].column_focus;
        }
        if (_.isNil(rf) || _.isNil(cf)) {
            console.error("normalizeSelection: rf and cf is nil");
            return selection;
        }
        var row = ctx.visibledatarow[r2];
        var row_pre = r1 - 1 === -1 ? 0 : ctx.visibledatarow[r1 - 1];
        var col = ctx.visibledatacolumn[c2];
        var col_pre = c1 - 1 === -1 ? 0 : ctx.visibledatacolumn[c1 - 1];
        var row_f = ctx.visibledatarow[rf];
        var row_pre_f = rf - 1 === -1 ? 0 : ctx.visibledatarow[rf - 1];
        var col_f = ctx.visibledatacolumn[cf];
        var col_pre_f = cf - 1 === -1 ? 0 : ctx.visibledatacolumn[cf - 1];
        var margeset = mergeBorder(ctx, flowdata, rf, cf);
        if (margeset) {
            _a = margeset.row, row_pre_f = _a[0], row_f = _a[1];
            _b = margeset.column, col_pre_f = _b[0], col_f = _b[1];
        }
        selection[i].row = [r1, r2];
        selection[i].column = [c1, c2];
        selection[i].row_focus = rf;
        selection[i].column_focus = cf;
        selection[i].left = col_pre_f;
        selection[i].width = col_f - col_pre_f <= 0 ? 0 : col_f - col_pre_f - 1;
        selection[i].top = row_pre_f;
        selection[i].height = row_f - row_pre_f <= 0 ? 0 : row_f - row_pre_f - 1;
        selection[i].left_move = col_pre;
        selection[i].width_move = col - col_pre <= 0 ? 0 : col - col_pre - 1;
        selection[i].top_move = row_pre;
        selection[i].height_move = row - row_pre <= 0 ? 0 : row - row_pre - 1;
    }
    return selection;
}
export function selectTitlesMap(rangeMap, range1, range2) {
    var map = rangeMap || {};
    for (var i = range1; i <= range2; i += 1) {
        if (i in map) {
            continue;
        }
        map[i] = 0;
    }
    return map;
}
export function selectTitlesRange(map) {
    var mapArr = Object.keys(map).map(Number);
    mapArr.sort(function (a, b) {
        return a - b;
    });
    var rangeArr;
    var item = [];
    if (mapArr.length > 1) {
        rangeArr = [];
        for (var j = 1; j < mapArr.length; j += 1) {
            if (mapArr[j] - mapArr[j - 1] === 1) {
                item.push(mapArr[j - 1]);
                if (j === mapArr.length - 1) {
                    item.push(mapArr[j]);
                    rangeArr.push(item);
                }
            }
            else {
                if (j === 1) {
                    if (j === mapArr.length - 1) {
                        item.push(mapArr[j - 1]);
                        rangeArr.push(item);
                        rangeArr.push([mapArr[j]]);
                    }
                    else {
                        rangeArr.push([mapArr[0]]);
                    }
                }
                else if (j === mapArr.length - 1) {
                    item.push(mapArr[j - 1]);
                    rangeArr.push(item);
                    rangeArr.push([mapArr[j]]);
                }
                else {
                    item.push(mapArr[j - 1]);
                    rangeArr.push(item);
                    item = [];
                }
            }
        }
    }
    else {
        rangeArr = [];
        rangeArr.push([mapArr[0]]);
    }
    return rangeArr;
}
export function pasteHandlerOfPaintModel(ctx, copyRange) {
    var cfg = ctx.config;
    if (cfg.merge == null) {
        cfg.merge = {};
    }
    if (!copyRange)
        return;
    var copyHasMC = copyRange.HasMC;
    var copySheetIndex = copyRange.dataSheetId;
    var c_r1 = copyRange.copyRange[0].row[0];
    var c_r2 = copyRange.copyRange[0].row[1];
    var c_c1 = copyRange.copyRange[0].column[0];
    var c_c2 = copyRange.copyRange[0].column[1];
    var copyData = _.cloneDeep(getdatabyselection(ctx, { row: [c_r1, c_r2], column: [c_c1, c_c2] }, copySheetIndex));
    if (!ctx.luckysheet_select_save)
        return;
    var last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
    var minh = last.row[0];
    var maxh = last.row[1];
    var minc = last.column[0];
    var maxc = last.column[1];
    var copyh = copyData.length;
    var copyc = copyData[0].length;
    if (minh === maxh && minc === maxc) {
        var has_PartMC = false;
        if (cfg.merge != null) {
            has_PartMC = hasPartMC(ctx, cfg, minh, minh + copyh - 1, minc, minc + copyc - 1);
        }
        if (has_PartMC) {
            return;
        }
        maxh = minh + copyh - 1;
        maxc = minc + copyc - 1;
    }
    var timesH = Math.ceil((maxh - minh + 1) / copyh);
    var timesC = Math.ceil((maxc - minc + 1) / copyc);
    var flowdata = getFlowdata(ctx);
    if (flowdata == null)
        return;
    var cellMaxLength = flowdata[0].length;
    var rowMaxLength = flowdata.length;
    var borderInfoCompute = getBorderInfoCompute(ctx, copySheetIndex);
    var c_dataVerification = _.cloneDeep(ctx.luckysheetfile[getSheetIndex(ctx, copySheetIndex)].dataVerification) || {};
    var dataVerification = null;
    var mth = 0;
    var mtc = 0;
    var maxcellCahe = 0;
    var maxrowCache = 0;
    for (var th = 1; th <= timesH; th += 1) {
        for (var tc = 1; tc <= timesC; tc += 1) {
            mth = minh + (th - 1) * copyh;
            mtc = minc + (tc - 1) * copyc;
            maxrowCache =
                minh + th * copyh > rowMaxLength ? rowMaxLength : minh + th * copyh;
            if (maxrowCache > maxh + 1) {
                maxrowCache = maxh + 1;
            }
            maxcellCahe =
                minc + tc * copyc > cellMaxLength ? cellMaxLength : minc + tc * copyc;
            if (maxcellCahe > maxc + 1) {
                maxcellCahe = maxc + 1;
            }
            var offsetMC = {};
            var _loop_1 = function (h) {
                if (h == null)
                    return { value: void 0 };
                if (flowdata[h] == null)
                    return { value: void 0 };
                var x = [];
                x = flowdata[h];
                var _loop_2 = function (c) {
                    if (borderInfoCompute["".concat(c_r1 + h - mth, "_").concat(c_c1 + c - mtc)]) {
                        var bd_obj = {
                            rangeType: "cell",
                            value: {
                                row_index: h,
                                col_index: c,
                                l: borderInfoCompute["".concat(c_r1 + h - mth, "_").concat(c_c1 + c - mtc)].l,
                                r: borderInfoCompute["".concat(c_r1 + h - mth, "_").concat(c_c1 + c - mtc)].r,
                                t: borderInfoCompute["".concat(c_r1 + h - mth, "_").concat(c_c1 + c - mtc)].t,
                                b: borderInfoCompute["".concat(c_r1 + h - mth, "_").concat(c_c1 + c - mtc)].b,
                            },
                        };
                        if (cfg.borderInfo == null) {
                            cfg.borderInfo = [];
                        }
                        cfg.borderInfo.push(bd_obj);
                    }
                    else if (borderInfoCompute["".concat(h, "_").concat(c)]) {
                        var bd_obj = {
                            rangeType: "cell",
                            value: {
                                row_index: h,
                                col_index: c,
                                l: null,
                                r: null,
                                t: null,
                                b: null,
                            },
                        };
                        if (cfg.borderInfo == null) {
                            cfg.borderInfo = [];
                        }
                        cfg.borderInfo.push(bd_obj);
                    }
                    if (c_dataVerification["".concat(c_r1 + h - mth, "_").concat(c_c1 + c - mtc)]) {
                        if (dataVerification == null) {
                            dataVerification = _.cloneDeep(ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)]
                                .dataVerification);
                        }
                        dataVerification["".concat(h, "_").concat(c)] =
                            c_dataVerification["".concat(c_r1 + h - mth, "_").concat(c_c1 + c - mtc)];
                    }
                    if (_.isPlainObject(x[c]) && x[c].mc) {
                        if (x[c].mc.rs) {
                            delete cfg.merge["".concat(x[c].mc.r, "_").concat(x[c].mc.c)];
                        }
                        delete x[c].mc;
                    }
                    var value = null;
                    if (copyData[h - mth] != null && copyData[h - mth][c - mtc] != null) {
                        value = copyData[h - mth][c - mtc];
                    }
                    if (_.isPlainObject(x[c])) {
                        if (x[c].ct && x[c].ct.t === "inlineStr" && value) {
                            delete value.ct;
                        }
                        else {
                            var format = [
                                "bg",
                                "fc",
                                "ct",
                                "ht",
                                "vt",
                                "bl",
                                "it",
                                "cl",
                                "un",
                                "fs",
                                "ff",
                                "tb",
                            ];
                            format.forEach(function (item) {
                                Reflect.deleteProperty(x[c], item);
                            });
                        }
                    }
                    else {
                        x[c] = { v: x[c] };
                    }
                    if (value != null) {
                        delete value.v;
                        delete value.m;
                        delete value.f;
                        delete value.spl;
                        if (value.ct && value.ct.t === "inlineStr") {
                            delete value.ct;
                        }
                        x[c] = _.assign(x[c], _.cloneDeep(value));
                        if (x[c].ct && x[c].ct.t === "inlineStr") {
                            x[c].ct.s.forEach(function (item) { return _.assign(item, value); });
                        }
                        if (copyHasMC && x[c].mc) {
                            if (x[c].mc.rs != null) {
                                x[c].mc.r = h;
                                if (x[c].mc.rs + h >= maxrowCache) {
                                    x[c].mc.rs = maxrowCache - h;
                                }
                                x[c].mc.c = c;
                                if (x[c].mc.cs + c >= maxcellCahe) {
                                    x[c].mc.cs = maxcellCahe - c;
                                }
                                cfg.merge["".concat(x[c].mc.r, "_").concat(x[c].mc.c)] = x[c].mc;
                                offsetMC["".concat(value.mc.r, "_").concat(value.mc.c)] = [
                                    x[c].mc.r,
                                    x[c].mc.c,
                                ];
                            }
                            else {
                                x[c] = {
                                    mc: {
                                        r: offsetMC["".concat(value.mc.r, "_").concat(value.mc.c)][0],
                                        c: offsetMC["".concat(value.mc.r, "_").concat(value.mc.c)][1],
                                    },
                                };
                            }
                        }
                        if (x[c].v != null) {
                            if (value.ct != null && value.ct.fa != null) {
                                var mask = update(value.ct.fa, x[c].v);
                                x[c].m = mask;
                            }
                        }
                    }
                };
                for (var c = mtc; c < maxcellCahe; c += 1) {
                    _loop_2(c);
                }
                flowdata[h] = x;
            };
            for (var h = mth; h < maxrowCache; h += 1) {
                var state_1 = _loop_1(h);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
    }
    var currFile = ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)];
    currFile.config = cfg;
    currFile.dataVerification = dataVerification;
    var cdformat = null;
    var copyIndex = getSheetIndex(ctx, copySheetIndex);
    if (!copyIndex)
        return;
    var ruleArr = _.cloneDeep(ctx.luckysheetfile[copyIndex].luckysheet_conditionformat_save);
    if (!_.isNil(ruleArr) && ruleArr.length > 0) {
        var currentIndex = getSheetIndex(ctx, ctx.currentSheetId);
        cdformat = _.cloneDeep(ctx.luckysheetfile[currentIndex].luckysheet_conditionformat_save);
        for (var i = 0; i < ruleArr.length; i += 1) {
            var cdformat_cellrange = ruleArr[i].cellrange;
            var emptyRange = [];
            for (var j = 0; j < cdformat_cellrange.length; j += 1) {
                var range = CFSplitRange(cdformat_cellrange[j], { row: [c_r1, c_r2], column: [c_c1, c_c2] }, { row: [minh, maxh], column: [minc, maxc] }, "operatePart");
                if (range.length > 0) {
                    emptyRange = emptyRange.concat(range);
                }
            }
            if (emptyRange.length > 0) {
                ruleArr[i].cellrange = [{ row: [minh, maxh], column: [minc, maxc] }];
                cdformat.push(ruleArr[i]);
            }
        }
    }
}
export function selectionCopyShow(range, ctx) {
    if (range == null) {
        range = ctx.luckysheet_selection_range;
    }
    range = JSON.parse(JSON.stringify(range));
}
export function rowHasMerged(ctx, r, c1, c2) {
    var hasMerged = false;
    var flowData = getFlowdata(ctx);
    if (_.isNil(flowData) || _.isNil(flowData[r]))
        return false;
    for (var c = c1; c <= c2; c += 1) {
        var cell = flowData[r][c];
        if (!_.isNil(cell) && "mc" in cell) {
            hasMerged = true;
            break;
        }
    }
    return hasMerged;
}
export function colHasMerged(ctx, c, r1, r2) {
    var _a;
    var hasMerged = false;
    var flowData = getFlowdata(ctx);
    if (_.isNil(flowData))
        return false;
    for (var r = r1; r <= r2; r += 1) {
        var cell = (_a = flowData[r]) === null || _a === void 0 ? void 0 : _a[c];
        if (!_.isNil(ctx.config.merge) &&
            !_.isNil(cell) &&
            "mc" in cell &&
            !_.isNil(cell.mc)) {
            hasMerged = true;
            break;
        }
    }
    return hasMerged;
}
export function getRowMerge(ctx, rIndex, c1, c2) {
    var flowData = getFlowdata(ctx);
    if (_.isNil(flowData))
        return [null, null];
    var r2 = flowData.length - 1;
    var str = null;
    if (rIndex > 0) {
        for (var r = rIndex; r >= 0; r -= 1) {
            for (var c = c1; c <= c2; c += 1) {
                var cell = flowData[r][c];
                if (!_.isNil(cell) &&
                    !_.isNil(cell.mc) &&
                    "mc" in cell &&
                    !_.isNil(ctx.config.merge)) {
                    var mc = ctx.config.merge["".concat(cell.mc.r, "_").concat(cell.mc.c)];
                    if (_.isNil(str) || mc.r < str) {
                        str = mc.r;
                    }
                }
            }
            if (!_.isNil(str) && rowHasMerged(ctx, str - 1, c1, c2) && str > 0) {
                r = str;
            }
            else {
                break;
            }
        }
    }
    else {
        str = 0;
    }
    var end = null;
    if (rIndex < r2) {
        for (var r = rIndex; r <= r2; r += 1) {
            for (var c = c1; c <= c2; c += 1) {
                var cell = flowData[r][c];
                if (!_.isNil(cell) &&
                    !_.isNil(cell.mc) &&
                    "mc" in cell &&
                    !_.isNil(ctx.config.merge)) {
                    var mc = ctx.config.merge["".concat(cell.mc.r, "_").concat(cell.mc.c)];
                    if (_.isNil(end) || mc.r + mc.rs - 1 > end) {
                        end = mc.r + mc.rs - 1;
                    }
                }
            }
            if (!_.isNil(end) && rowHasMerged(ctx, end + 1, c1, c2) && end < r2) {
                r = end;
            }
            else {
                break;
            }
        }
    }
    else {
        end = r2;
    }
    return [str, end];
}
export function getColMerge(ctx, cIndex, r1, r2) {
    var flowData = getFlowdata(ctx);
    if (_.isNil(flowData)) {
        return [null, null];
    }
    var c2 = flowData[0].length - 1;
    var str = null;
    if (cIndex > 0) {
        for (var c = cIndex; c >= 0; c -= 1) {
            for (var r = r1; r <= r2; r += 1) {
                var cell = flowData[r][c];
                if (!_.isNil(ctx.config.merge) &&
                    !_.isNil(cell) &&
                    "mc" in cell &&
                    !_.isNil(cell.mc)) {
                    var mc = ctx.config.merge["".concat(cell.mc.r, "_").concat(cell.mc.c)];
                    if (_.isNil(str) || mc.c < str) {
                        str = mc.c;
                    }
                }
            }
            if (!_.isNil(str) && colHasMerged(ctx, str - 1, r1, r2) && str > 0) {
                c = str;
            }
            else {
                break;
            }
        }
    }
    else {
        str = 0;
    }
    var end = null;
    if (cIndex < c2) {
        for (var c = cIndex; c <= c2; c += 1) {
            for (var r = r1; r <= r2; r += 1) {
                var cell = flowData[r][c];
                if (!_.isNil(ctx.config.merge) &&
                    !_.isNil(cell) &&
                    "mc" in cell &&
                    !_.isNil(cell.mc)) {
                    var mc = ctx.config.merge["".concat(cell.mc.r, "_").concat(cell.mc.c)];
                    if (_.isNil(end) || mc.c + mc.cs - 1 > end) {
                        end = mc.c + mc.cs - 1;
                    }
                }
            }
            if (!_.isNil(end) && colHasMerged(ctx, end + 1, r1, r2) && end < c2) {
                c = end;
            }
            else {
                break;
            }
        }
    }
    else {
        end = c2;
    }
    return [str, end];
}
export function moveHighlightCell(ctx, postion, index, type) {
    var _a, _b, _c, _d;
    var _e;
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    var datarowlen = flowdata.length;
    var datacolumnlen = flowdata[0].length;
    var row;
    var row_pre;
    var row_index;
    var row_index_ed;
    var col;
    var col_pre;
    var col_index;
    var col_index_ed;
    if (type === "rangeOfSelect") {
        var last = (_e = ctx.luckysheet_select_save) === null || _e === void 0 ? void 0 : _e[ctx.luckysheet_select_save.length - 1];
        if (!last) {
            console.error("moveHighlightCell: no selection found");
            return;
        }
        var curR = void 0;
        if (_.isNil(last.row_focus)) {
            curR = last.row[0];
        }
        else {
            curR = last.row_focus;
        }
        var curC = void 0;
        if (_.isNil(last.column_focus)) {
            curC = last.column[0];
        }
        else {
            curC = last.column_focus;
        }
        var margeset = mergeBorder(ctx, flowdata, curR, curC);
        if (margeset) {
            var str_r = margeset.row[2];
            var end_r = margeset.row[3];
            var str_c = margeset.column[2];
            var end_c = margeset.column[3];
            if (index > 0) {
                if (postion === "down") {
                    curR = end_r;
                    curC = str_c;
                }
                else if (postion === "right") {
                    curR = str_r;
                    curC = end_c;
                }
            }
            else {
                curR = str_r;
                curC = str_c;
            }
        }
        if (_.isNil(curR) || _.isNil(curC)) {
            console.error("moveHighlightCell: curR or curC is nil");
            return;
        }
        var moveX = _.isNil(last.moveXY) ? curR : last.moveXY.x;
        var moveY = _.isNil(last.moveXY) ? curC : last.moveXY.y;
        if (postion === "down") {
            curR += index;
            moveX = curR;
        }
        else if (postion === "right") {
            curC += index;
            moveY = curC;
        }
        if (curR >= datarowlen) {
            curR = datarowlen - 1;
            moveX = curR;
        }
        if (curR < 0) {
            curR = 0;
            moveX = curR;
        }
        if (curC >= datacolumnlen) {
            curC = datacolumnlen - 1;
            moveY = curC;
        }
        if (curC < 0) {
            curC = 0;
            moveY = curC;
        }
        var margeset2 = mergeBorder(ctx, flowdata, curR, curC);
        if (margeset2) {
            _a = margeset2.row, row_pre = _a[0], row = _a[1], row_index = _a[2], row_index_ed = _a[3];
            _b = margeset2.column, col_pre = _b[0], col = _b[1], col_index = _b[2], col_index_ed = _b[3];
        }
        else {
            row = ctx.visibledatarow[moveX];
            row_pre = moveX - 1 === -1 ? 0 : ctx.visibledatarow[moveX - 1];
            col = ctx.visibledatacolumn[moveY];
            col_pre = moveY - 1 === -1 ? 0 : ctx.visibledatacolumn[moveY - 1];
            row_index = curR;
            row_index_ed = curR;
            col_index = curC;
            col_index_ed = curC;
        }
        if (_.isNil(row_index) ||
            _.isNil(row_index_ed) ||
            _.isNil(col_index) ||
            _.isNil(col_index_ed)) {
            console.error("moveHighlightCell: row_index or row_index_ed or col_index or col_index_ed is nil");
            return;
        }
        last.row = [row_index, row_index_ed];
        last.column = [col_index, col_index_ed];
        last.row_focus = row_index;
        last.column_focus = col_index;
        last.moveXY = { x: moveX, y: moveY };
        normalizeSelection(ctx, ctx.luckysheet_select_save);
        scrollToHighlightCell(ctx, row_index, col_index);
    }
    else if (type === "rangeOfFormula") {
        var last = ctx.formulaCache.func_selectedrange;
        if (!last)
            return;
        var curR = void 0;
        if (_.isNil(last.row_focus)) {
            curR = last.row[0];
        }
        else {
            curR = last.row_focus;
        }
        var curC = void 0;
        if (_.isNil(last.column_focus)) {
            curC = last.column[0];
        }
        else {
            curC = last.column_focus;
        }
        var margeset = mergeBorder(ctx, flowdata, curR, curC);
        if (margeset) {
            var str_r = margeset.row[2];
            var end_r = margeset.row[3];
            var str_c = margeset.column[2];
            var end_c = margeset.column[3];
            if (index > 0) {
                if (postion === "down") {
                    curR = end_r;
                    curC = str_c;
                }
                else if (postion === "right") {
                    curR = str_r;
                    curC = end_c;
                }
            }
            else {
                curR = str_r;
                curC = str_c;
            }
        }
        if (_.isNil(curR) || _.isNil(curC)) {
            console.error("moveHighlightCell: curR or curC is nil");
            return;
        }
        var moveX = _.isNil(last.moveXY) ? curR : last.moveXY.x;
        var moveY = _.isNil(last.moveXY) ? curC : last.moveXY.y;
        if (postion === "down") {
            curR += index;
            moveX = curR;
        }
        else if (postion === "right") {
            curC += index;
            moveY = curC;
        }
        if (curR >= datarowlen) {
            curR = datarowlen - 1;
            moveX = curR;
        }
        if (curR < 0) {
            curR = 0;
            moveX = curR;
        }
        if (curC >= datacolumnlen) {
            curC = datacolumnlen - 1;
            moveY = curC;
        }
        if (curC < 0) {
            curC = 0;
            moveY = curC;
        }
        var margeset2 = mergeBorder(ctx, flowdata, curR, curC);
        if (margeset2) {
            _c = margeset2.row, row_pre = _c[0], row = _c[1], row_index = _c[2], row_index_ed = _c[3];
            _d = margeset2.column, col_pre = _d[0], col = _d[1], col_index = _d[2], col_index_ed = _d[3];
        }
        else {
            row = ctx.visibledatarow[moveX];
            row_pre = moveX - 1 === -1 ? 0 : ctx.visibledatarow[moveX - 1];
            row_index = moveX;
            row_index_ed = moveX;
            col = ctx.visibledatacolumn[moveY];
            col_pre = moveY - 1 === -1 ? 0 : ctx.visibledatacolumn[moveY - 1];
            col_index = moveY;
            col_index_ed = moveY;
        }
        if (_.isNil(col) ||
            _.isNil(col_pre) ||
            _.isNil(row) ||
            _.isNil(row_pre) ||
            _.isNil(row_index) ||
            _.isNil(row_index_ed) ||
            _.isNil(col_index) ||
            _.isNil(col_index_ed)) {
            console.error("moveHighlightCell: some values of func_selectedrange is nil");
            return;
        }
        ctx.formulaCache.func_selectedrange = {
            left: col_pre,
            width: col - col_pre - 1,
            top: row_pre,
            height: row - row_pre - 1,
            left_move: col_pre,
            width_move: col - col_pre - 1,
            top_move: row_pre,
            height_move: row - row_pre - 1,
            row: [row_index, row_index_ed],
            column: [col_index, col_index_ed],
            row_focus: row_index,
            column_focus: col_index,
            moveXY: { x: moveX, y: moveY },
        };
    }
}
export function moveHighlightRange(ctx, postion, index, type) {
    var row;
    var row_pre;
    var col;
    var col_pre;
    var flowData = getFlowdata(ctx);
    if (_.isNil(flowData))
        return;
    if (_.isNil(ctx.luckysheet_select_save))
        return;
    if (type === "rangeOfSelect") {
        var last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
        var curR = last.row[0];
        var endR = last.row[1];
        var curC = last.column[0];
        var endC = last.column[1];
        var rf = last.row_focus;
        var cf = last.column_focus;
        if (_.isNil(rf) || _.isNil(cf))
            return;
        var datarowlen = flowData.length;
        var datacolumnlen = flowData[0].length;
        if (postion === "down") {
            if (rowHasMerged(ctx, rf, curC, endC)) {
                var rfMerge = getRowMerge(ctx, rf, curC, endC);
                var rf_str = rfMerge[0];
                var rf_end = rfMerge[1];
                if (!_.isNil(rf_str) && rf_str > curR && rf_end === endR) {
                    if (index > 0 && rowHasMerged(ctx, curR, curC, endC)) {
                        var v = getRowMerge(ctx, curR, curC, endC)[1];
                        if (!_.isNil(v)) {
                            curR = v;
                        }
                    }
                    curR += index;
                }
                else if (!_.isNil(rf_end) && rf_end < endR && rf_str === curR) {
                    if (index < 0 && rowHasMerged(ctx, endR, curC, endC)) {
                        var v = getRowMerge(ctx, curR, curC, endC)[0];
                        if (!_.isNil(v)) {
                            endR = v;
                        }
                    }
                    endR += index;
                }
                else {
                    if (index > 0) {
                        endR += index;
                    }
                    else {
                        curR += index;
                    }
                }
            }
            else {
                if (rf > curR && rf === endR) {
                    if (index > 0 && rowHasMerged(ctx, curR, curC, endC)) {
                        var v = getRowMerge(ctx, curR, curC, endC)[1];
                        if (!_.isNil(v)) {
                            curR = v;
                        }
                    }
                    curR += index;
                }
                else if (rf < endR && rf === curR) {
                    if (index < 0 && rowHasMerged(ctx, endR, curC, endC)) {
                        var v = getRowMerge(ctx, endR, curC, endC)[0];
                        if (!_.isNil(v)) {
                            endR = v;
                        }
                    }
                    endR += index;
                }
                else if (rf === curR && rf === endR) {
                    if (index > 0) {
                        endR += index;
                    }
                    else {
                        curR += index;
                    }
                }
            }
            if (endR >= datarowlen) {
                endR = datarowlen - 1;
            }
            if (endR < 0) {
                endR = 0;
            }
            if (curR >= datarowlen) {
                curR = datarowlen - 1;
            }
            if (curR < 0) {
                curR = 0;
            }
        }
        else {
            if (colHasMerged(ctx, cf, curR, endR)) {
                var cfMerge = getColMerge(ctx, cf, curR, endR);
                var cf_str = cfMerge[0];
                var cf_end = cfMerge[1];
                if (!_.isNil(cf_str) && cf_str > curC && cf_end === endC) {
                    if (index > 0 && colHasMerged(ctx, curC, curR, endR)) {
                        var v = getColMerge(ctx, curC, curR, endR)[1];
                        if (!_.isNil(v)) {
                            curC = v;
                        }
                        curC += index;
                    }
                    curC += index;
                }
                else if (!_.isNil(cf_end) && cf_end < endC && cf_str === curC) {
                    if (index < 0 && colHasMerged(ctx, endC, curR, endR)) {
                        var v = getColMerge(ctx, endC, curR, endR)[0];
                        if (!_.isNil(v)) {
                            endC = v;
                        }
                    }
                    endC += index;
                }
                else {
                    if (index > 0) {
                        endC += index;
                    }
                    else {
                        curC += index;
                    }
                }
            }
            else {
                if (cf > curC && cf === endC) {
                    if (index > 0 && colHasMerged(ctx, curC, curR, endR)) {
                        var v = getColMerge(ctx, curC, curR, endR)[1];
                        if (!_.isNil(v)) {
                            curC = v;
                        }
                        curC += index;
                    }
                    curC += index;
                }
                else if (cf < endC && cf === curC) {
                    if (index < 0 && colHasMerged(ctx, endC, curR, endR)) {
                        var v = getColMerge(ctx, endC, curR, endR)[0];
                        if (!_.isNil(v)) {
                            endC = v;
                        }
                    }
                    endC += index;
                }
                else if (cf === curC && cf === endC) {
                    if (index > 0) {
                        endC += index;
                    }
                    else {
                        curC += index;
                    }
                }
            }
            if (endC >= datacolumnlen) {
                endC = datacolumnlen - 1;
            }
            if (endC < 0) {
                endC = 0;
            }
            if (curC >= datacolumnlen) {
                curC = datacolumnlen - 1;
            }
            if (curC < 0) {
                curC = 0;
            }
        }
        var rowseleted = [curR, endR];
        var columnseleted = [curC, endC];
        row = ctx.visibledatarow[endR];
        row_pre = curR - 1 === -1 ? 0 : ctx.visibledatarow[curR - 1];
        col = ctx.visibledatacolumn[endC];
        col_pre = curC - 1 === -1 ? 0 : ctx.visibledatacolumn[curC - 1];
        var changeparam = mergeMoveMain(ctx, columnseleted, rowseleted, last, row_pre, row - row_pre - 1, col_pre, col - col_pre - 1);
        if (!_.isNil(changeparam)) {
            columnseleted = changeparam[0], rowseleted = changeparam[1];
        }
        last.row = rowseleted;
        last.column = columnseleted;
        normalizeSelection(ctx, ctx.luckysheet_select_save);
        if (postion === "down") {
            var rowToScroll = last.row_focus === last.row[0] ? last.row[1] : last.row[0];
            scrollToHighlightCell(ctx, rowToScroll, -1);
        }
        else {
            var columnToScroll = last.column_focus === last.column[0] ? last.column[1] : last.column[0];
            scrollToHighlightCell(ctx, -1, columnToScroll);
        }
    }
    else if (type === "rangeOfFormula") {
        var last = ctx.formulaCache.func_selectedrange;
        if (_.isNil(last))
            return;
        var curR = last.row[0];
        var endR = last.row[1];
        var curC = last.column[0];
        var endC = last.column[1];
        var rf = last.row_focus;
        var cf = last.column_focus;
        var datarowlen = flowData.length;
        var datacolumnlen = flowData[0].length;
        if (postion === "down") {
            if (!_.isNil(rf) && rowHasMerged(ctx, rf, curC, endC)) {
                var rfMerge = getRowMerge(ctx, rf, curC, endC);
                var rf_str = rfMerge[0];
                var rf_end = rfMerge[1];
                if (!_.isNil(rf_str) && rf_str > curR && rf_end === endR) {
                    if (index > 0 && rowHasMerged(ctx, curR, curC, endC)) {
                        var v = getRowMerge(ctx, curR, curC, endC)[1];
                        if (!_.isNil(v)) {
                            curR = v;
                        }
                    }
                    curR += index;
                }
                else if (!_.isNil(rf_end) && rf_end < endR && rf_str === curR) {
                    if (index < 0 && rowHasMerged(ctx, endR, curC, endC)) {
                        var v = getRowMerge(ctx, endR, curC, endC)[0];
                        if (!_.isNil(v)) {
                            endR = v;
                        }
                        endR += index;
                    }
                }
                else {
                    if (index > 0) {
                        endR += index;
                    }
                    else {
                        curR += index;
                    }
                }
            }
            else {
                if (!_.isNil(rf) && rf > curR && rf === endR) {
                    if (index > 0 && rowHasMerged(ctx, curR, curC, endC)) {
                        var v = getRowMerge(ctx, curR, curC, endC)[1];
                        if (!_.isNil(v)) {
                            curR = v;
                        }
                    }
                    curR += index;
                }
                else if (!_.isNil(rf) && rf < endR && rf === curR) {
                    if (index < 0 && rowHasMerged(ctx, endR, curC, endC)) {
                        var v = getRowMerge(ctx, endR, curC, endC)[0];
                        if (!_.isNil(v)) {
                            endR = v;
                        }
                    }
                    endR += index;
                }
                else if (rf === curR && rf === endR) {
                    if (index > 0) {
                        endR += index;
                    }
                    else {
                        curR += index;
                    }
                }
            }
            if (endR >= datarowlen) {
                endR = datarowlen - 1;
            }
            if (endR < 0) {
                endR = 0;
            }
            if (curR >= datarowlen) {
                curR = datarowlen - 1;
            }
            if (curR < 0) {
                curR = 0;
            }
        }
        else {
            if (!_.isNil(cf) && colHasMerged(ctx, cf, curR, endR)) {
                var cfMerge = getColMerge(ctx, cf, curR, endR);
                var cf_str = cfMerge[0];
                var cf_end = cfMerge[1];
                if (!_.isNil(cf_str) && cf_str > curC && cf_end === endC) {
                    if (index > 0 && colHasMerged(ctx, curC, curR, endR)) {
                        var v = getColMerge(ctx, curC, curR, endR)[1];
                        if (!_.isNil(v)) {
                            curC = v;
                        }
                    }
                    curC += index;
                }
                else if (!_.isNil(cf_end) && cf_end < endC && cf_str === curC) {
                    if (index < 0 && colHasMerged(ctx, endC, curR, endR)) {
                        var v = getColMerge(ctx, endC, curR, endR)[0];
                        if (!_.isNil(v)) {
                            endC = v;
                        }
                    }
                    endC += index;
                }
                else {
                    if (index > 0) {
                        endC += index;
                    }
                    else {
                        curC += index;
                    }
                }
            }
            else {
                if (!_.isNil(cf) && cf > curC && cf === endC) {
                    if (index > 0 && colHasMerged(ctx, curC, curR, endR)) {
                        var v = getColMerge(ctx, curC, curR, endR)[1];
                        if (!_.isNil(v)) {
                            curC = v;
                        }
                    }
                    curC += index;
                }
                else if (!_.isNil(cf) && cf < endC && cf === curC) {
                    if (index < 0 && colHasMerged(ctx, endC, curR, endR)) {
                        var v = getColMerge(ctx, endC, curR, endR)[0];
                        if (!_.isNil(v)) {
                            endC = v;
                        }
                    }
                    endC += index;
                }
                else if (cf === curC && cf === endC) {
                    if (index > 0) {
                        endC += index;
                    }
                    else {
                        curC += index;
                    }
                }
            }
            if (endC >= datacolumnlen) {
                endC = datacolumnlen - 1;
            }
            if (endC < 0) {
                endC = 0;
            }
            if (curC >= datacolumnlen) {
                curC = datacolumnlen - 1;
            }
            if (curC < 0) {
                curC = 0;
            }
        }
        var rowseleted = [curR, endR];
        var columnseleted = [curC, endC];
        row = ctx.visibledatarow[endR];
        row_pre = curR - 1 === -1 ? 0 : ctx.visibledatarow[curR - 1];
        col = ctx.visibledatacolumn[endC];
        col_pre = curC - 1 === -1 ? 0 : ctx.visibledatacolumn[curC - 1];
        var top_1 = row_pre;
        var height = row - row_pre - 1;
        var left = col_pre;
        var width = col - col_pre - 1;
        var changeparam = mergeMoveMain(ctx, columnseleted, rowseleted, last, top_1, height, left, width);
        if (!_.isNil(changeparam)) {
            columnseleted = changeparam[0], rowseleted = changeparam[1], top_1 = changeparam[2], height = changeparam[3], left = changeparam[4], width = changeparam[5];
        }
        ctx.formulaCache.func_selectedrange = {
            left: left,
            width: width,
            top: top_1,
            height: height,
            left_move: left,
            width_move: width,
            top_move: top_1,
            height_move: height,
            row: rowseleted,
            column: columnseleted,
            row_focus: rf,
            column_focus: cf,
        };
    }
}
function getHtmlBorderStyle(type, color) {
    var style = "";
    var borderType = {
        "0": "none",
        "1": "Thin",
        "2": "Hair",
        "3": "Dotted",
        "4": "Dashed",
        "5": "DashDot",
        "6": "DashDotDot",
        "7": "Double",
        "8": "Medium",
        "9": "MediumDashed",
        "10": "MediumDashDot",
        "11": "MediumDashDotDot",
        "12": "SlantedDashDot",
        "13": "Thick",
    };
    type = borderType[type.toString()];
    if (type.indexOf("Medium") > -1) {
        style += "1pt ";
    }
    else if (type === "Thick") {
        style += "1.5pt ";
    }
    else {
        style += "0.5pt ";
    }
    if (type === "Hair") {
        style += "double ";
    }
    else if (type.indexOf("DashDotDot") > -1) {
        style += "dotted ";
    }
    else if (type.indexOf("DashDot") > -1) {
        style += "dashed ";
    }
    else if (type.indexOf("Dotted") > -1) {
        style += "dotted ";
    }
    else if (type.indexOf("Dashed") > -1) {
        style += "dashed ";
    }
    else {
        style += "solid ";
    }
    return "".concat(style + color, ";");
}
export function rangeValueToHtml(ctx, sheetId, ranges) {
    var _a, _b, _c;
    var idx = getSheetIndex(ctx, sheetId);
    if (idx == null)
        return "";
    var sheet = ctx.luckysheetfile[idx];
    var rowIndexArr = [];
    var colIndexArr = [];
    for (var s = 0; s < ((_a = ranges === null || ranges === void 0 ? void 0 : ranges.length) !== null && _a !== void 0 ? _a : 0); s += 1) {
        var range = ranges[s];
        var r1 = range.row[0];
        var r2 = range.row[1];
        var c1 = range.column[0];
        var c2 = range.column[1];
        for (var copyR = r1; copyR <= r2; copyR += 1) {
            if (!rowIndexArr.includes(copyR)) {
                rowIndexArr.push(copyR);
            }
            for (var copyC = c1; copyC <= c2; copyC += 1) {
                if (!colIndexArr.includes(copyC)) {
                    colIndexArr.push(copyC);
                }
            }
        }
    }
    var borderInfoCompute;
    if (((_b = sheet.config) === null || _b === void 0 ? void 0 : _b.borderInfo) && sheet.config.borderInfo.length > 0) {
        borderInfoCompute = getBorderInfoCompute(ctx, sheetId);
    }
    var cpdata = "";
    var d = sheet.data;
    if (!d)
        return null;
    var colgroup = "";
    for (var i = 0; i < rowIndexArr.length; i += 1) {
        var r = rowIndexArr[i];
        cpdata += "<tr>";
        var _loop_3 = function (j) {
            var c = colIndexArr[j];
            var column = '<td ${span} style="${style}">';
            var cell = (_c = d[r]) === null || _c === void 0 ? void 0 : _c[c];
            if (cell != null) {
                var style = "";
                var span = "";
                if (r === rowIndexArr[0]) {
                    if (_.isNil(sheet.config) ||
                        _.isNil(sheet.config.columnlen) ||
                        _.isNil(sheet.config.columnlen[c.toString()])) {
                        colgroup += '<colgroup width="72px"></colgroup>';
                    }
                    else {
                        colgroup += "<colgroup width=\"".concat(sheet.config.columnlen[c.toString()], "px\"></colgroup>");
                    }
                }
                if (c === colIndexArr[0]) {
                    if (_.isNil(sheet.config) ||
                        _.isNil(sheet.config.rowlen) ||
                        _.isNil(sheet.config.rowlen[r.toString()])) {
                        style += "height:19px;";
                    }
                    else {
                        style += "height:".concat(sheet.config.rowlen[r.toString()], "px;");
                    }
                }
                var reg = /^(w|W)((0?)|(0\.0+))$/;
                var c_value = void 0;
                if (!_.isNil(cell.ct) &&
                    !_.isNil(cell.ct.fa) &&
                    cell.ct.fa.match(reg)) {
                    c_value = getCellValue(r, c, d);
                }
                else {
                    c_value = getCellValue(r, c, d, "m");
                }
                var styleObj = getStyleByCell(ctx, d, r, c);
                style += _.map(styleObj, function (v, key) {
                    return "".concat(_.kebabCase(key), ":").concat(_.isNumber(v) ? "".concat(v, "px") : v, ";");
                }).join("");
                if (cell.mc) {
                    if ("rs" in cell.mc) {
                        span = "rowspan=\"".concat(cell.mc.rs, "\" colspan=\"").concat(cell.mc.cs, "\"");
                        if (borderInfoCompute && borderInfoCompute["".concat(r, "_").concat(c)]) {
                            var bl_obj_1 = { color: {}, style: {} };
                            var br_obj_1 = { color: {}, style: {} };
                            var bt_obj_1 = { color: {}, style: {} };
                            var bb_obj_1 = { color: {}, style: {} };
                            for (var bd_r = r; bd_r < r + cell.mc.rs; bd_r += 1) {
                                for (var bd_c = c; bd_c < c + cell.mc.cs; bd_c += 1) {
                                    if (bd_r === r &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)] &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].t) {
                                        var linetype = borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].t.style;
                                        var bcolor = borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].t.color;
                                        if (_.isNil(bt_obj_1.style[linetype])) {
                                            bt_obj_1.style[linetype] = 1;
                                        }
                                        else {
                                            bt_obj_1.style[linetype] += 1;
                                        }
                                        if (_.isNil(bt_obj_1.color[bcolor])) {
                                            bt_obj_1.color[bcolor] = 1;
                                        }
                                        else {
                                            bt_obj_1.color[bcolor] += 1;
                                        }
                                    }
                                    if (bd_r === r + cell.mc.rs - 1 &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)] &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].b) {
                                        var linetype = borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].b.style;
                                        var bcolor = borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].b.color;
                                        if (_.isNil(bb_obj_1.style[linetype])) {
                                            bb_obj_1.style[linetype] = 1;
                                        }
                                        else {
                                            bb_obj_1.style[linetype] += 1;
                                        }
                                        if (_.isNil(bb_obj_1.color[bcolor])) {
                                            bb_obj_1.color[bcolor] = 1;
                                        }
                                        else {
                                            bb_obj_1.color[bcolor] += 1;
                                        }
                                    }
                                    if (bd_c === c &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)] &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].l) {
                                        var linetype = borderInfoCompute["".concat(r, "_").concat(c)].l.style;
                                        var bcolor = borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].l.color;
                                        if (_.isNil(bl_obj_1.style[linetype])) {
                                            bl_obj_1.style[linetype] = 1;
                                        }
                                        else {
                                            bl_obj_1.style[linetype] += 1;
                                        }
                                        if (_.isNil(bl_obj_1.color[bcolor])) {
                                            bl_obj_1.color[bcolor] = 1;
                                        }
                                        else {
                                            bl_obj_1.color[bcolor] += 1;
                                        }
                                    }
                                    if (bd_c === c + cell.mc.cs - 1 &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)] &&
                                        borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].r) {
                                        var linetype = borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].r.style;
                                        var bcolor = borderInfoCompute["".concat(bd_r, "_").concat(bd_c)].r.color;
                                        if (_.isNil(br_obj_1.style[linetype])) {
                                            br_obj_1.style[linetype] = 1;
                                        }
                                        else {
                                            br_obj_1.style[linetype] += 1;
                                        }
                                        if (_.isNil(br_obj_1.color[bcolor])) {
                                            br_obj_1.color[bcolor] = 1;
                                        }
                                        else {
                                            br_obj_1.color[bcolor] += 1;
                                        }
                                    }
                                }
                            }
                            var rowlen_1 = cell.mc.rs;
                            var collen_1 = cell.mc.cs;
                            if (JSON.stringify(bl_obj_1).length > 23) {
                                var bl_color_1 = null;
                                var bl_style_1 = null;
                                Object.keys(bl_obj_1.color).forEach(function (x) {
                                    if (bl_obj_1.color[x] >= rowlen_1 / 2) {
                                        bl_color_1 = x;
                                    }
                                });
                                Object.keys(bl_obj_1.style).forEach(function (x) {
                                    if (bl_obj_1.style[x] >= rowlen_1 / 2) {
                                        bl_style_1 = x;
                                    }
                                });
                                if (!_.isNil(bl_color_1) && !_.isNil(bl_style_1)) {
                                    style += "border-left:".concat(getHtmlBorderStyle(bl_style_1, bl_color_1));
                                }
                            }
                            if (JSON.stringify(br_obj_1).length > 23) {
                                var br_color_1 = null;
                                var br_style_1 = null;
                                Object.keys(br_obj_1.color).forEach(function (x) {
                                    if (br_obj_1.color[x] >= rowlen_1 / 2) {
                                        br_color_1 = x;
                                    }
                                });
                                Object.keys(br_obj_1.style).forEach(function (x) {
                                    if (br_obj_1.style[x] >= rowlen_1 / 2) {
                                        br_style_1 = x;
                                    }
                                });
                                if (!_.isNil(br_color_1) && !_.isNil(br_style_1)) {
                                    style += "border-right:".concat(getHtmlBorderStyle(br_style_1, br_color_1));
                                }
                            }
                            if (JSON.stringify(bt_obj_1).length > 23) {
                                var bt_color_1 = null;
                                var bt_style_1 = null;
                                Object.keys(bt_obj_1.color).forEach(function (x) {
                                    if (bt_obj_1.color[x] >= collen_1 / 2) {
                                        bt_color_1 = x;
                                    }
                                });
                                Object.keys(bt_obj_1.style).forEach(function (x) {
                                    if (bt_obj_1.style[x] >= collen_1 / 2) {
                                        bt_style_1 = x;
                                    }
                                });
                                if (!_.isNil(bt_color_1) && !_.isNil(bt_style_1)) {
                                    style += "border-top:".concat(getHtmlBorderStyle(bt_style_1, bt_color_1));
                                }
                            }
                            if (JSON.stringify(bb_obj_1).length > 23) {
                                var bb_color_1 = null;
                                var bb_style_1 = null;
                                Object.keys(bb_obj_1.color).forEach(function (x) {
                                    if (bb_obj_1.color[x] >= collen_1 / 2) {
                                        bb_color_1 = x;
                                    }
                                });
                                Object.keys(bb_obj_1.style).forEach(function (x) {
                                    if (bb_obj_1.style[x] >= collen_1 / 2) {
                                        bb_style_1 = x;
                                    }
                                });
                                if (!_.isNil(bb_color_1) && !_.isNil(bb_style_1)) {
                                    style += "border-bottom:".concat(getHtmlBorderStyle(bb_style_1, bb_color_1));
                                }
                            }
                        }
                    }
                    else {
                        return "continue";
                    }
                }
                else {
                    if (borderInfoCompute && borderInfoCompute["".concat(r, "_").concat(c)]) {
                        if (borderInfoCompute["".concat(r, "_").concat(c)].l) {
                            var linetype = borderInfoCompute["".concat(r, "_").concat(c)].l.style;
                            var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].l.color;
                            style += "border-left:".concat(getHtmlBorderStyle(linetype, bcolor));
                        }
                        if (borderInfoCompute["".concat(r, "_").concat(c)].r) {
                            var linetype = borderInfoCompute["".concat(r, "_").concat(c)].r.style;
                            var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].r.color;
                            style += "border-right:".concat(getHtmlBorderStyle(linetype, bcolor));
                        }
                        if (borderInfoCompute["".concat(r, "_").concat(c)].b) {
                            var linetype = borderInfoCompute["".concat(r, "_").concat(c)].b.style;
                            var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].b.color;
                            style += "border-bottom:".concat(getHtmlBorderStyle(linetype, bcolor));
                        }
                        if (borderInfoCompute["".concat(r, "_").concat(c)].t) {
                            var linetype = borderInfoCompute["".concat(r, "_").concat(c)].t.style;
                            var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].t.color;
                            style += "border-top:".concat(getHtmlBorderStyle(linetype, bcolor));
                        }
                    }
                }
                column = replaceHtml(column, { style: style, span: span });
                if (_.isNil(c_value)) {
                    c_value = getCellValue(r, c, d);
                }
                if (_.isNil(c_value)) {
                    c_value = "";
                }
                column += escapeHTMLTag(c_value);
            }
            else {
                var style = "";
                if (borderInfoCompute && borderInfoCompute["".concat(r, "_").concat(c)]) {
                    if (borderInfoCompute["".concat(r, "_").concat(c)].l) {
                        var linetype = borderInfoCompute["".concat(r, "_").concat(c)].l.style;
                        var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].l.color;
                        style += "border-left:".concat(getHtmlBorderStyle(linetype, bcolor));
                    }
                    if (borderInfoCompute["".concat(r, "_").concat(c)].r) {
                        var linetype = borderInfoCompute["".concat(r, "_").concat(c)].r.style;
                        var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].r.color;
                        style += "border-right:".concat(getHtmlBorderStyle(linetype, bcolor));
                    }
                    if (borderInfoCompute["".concat(r, "_").concat(c)].b) {
                        var linetype = borderInfoCompute["".concat(r, "_").concat(c)].b.style;
                        var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].b.color;
                        style += "border-bottom:".concat(getHtmlBorderStyle(linetype, bcolor));
                    }
                    if (borderInfoCompute["".concat(r, "_").concat(c)].t) {
                        var linetype = borderInfoCompute["".concat(r, "_").concat(c)].t.style;
                        var bcolor = borderInfoCompute["".concat(r, "_").concat(c)].t.color;
                        style += "border-top:".concat(getHtmlBorderStyle(linetype, bcolor));
                    }
                }
                column += "";
                if (r === rowIndexArr[0]) {
                    if (_.isNil(sheet.config) ||
                        _.isNil(sheet.config.columnlen) ||
                        _.isNil(sheet.config.columnlen[c.toString()])) {
                        colgroup += '<colgroup width="72px"></colgroup>';
                    }
                    else {
                        colgroup += "<colgroup width=\"".concat(sheet.config.columnlen[c.toString()], "px\"></colgroup>");
                    }
                }
                if (c === colIndexArr[0]) {
                    if (_.isNil(sheet.config) ||
                        _.isNil(sheet.config.rowlen) ||
                        _.isNil(sheet.config.rowlen[r.toString()])) {
                        style += "height:19px;";
                    }
                    else {
                        style += "height:".concat(sheet.config.rowlen[r.toString()], "px;");
                    }
                }
                column = replaceHtml(column, { style: style, span: "" });
                column += "";
            }
            column += "</td>";
            cpdata += column;
        };
        for (var j = 0; j < colIndexArr.length; j += 1) {
            _loop_3(j);
        }
        cpdata += "</tr>";
    }
    return "<table data-type=\"fortune-copy-action-table\">".concat(colgroup).concat(cpdata, "</table>");
}
export function copy(ctx) {
    var _a, _b, _c, _d;
    var flowdata = getFlowdata(ctx);
    ctx.luckysheet_selection_range = [];
    var copyRange = [];
    var RowlChange = false;
    var HasMC = false;
    for (var s = 0; s < ((_b = (_a = ctx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); s += 1) {
        var range = ctx.luckysheet_select_save[s];
        var r1 = range.row[0];
        var r2 = range.row[1];
        var c1 = range.column[0];
        var c2 = range.column[1];
        for (var copyR = r1; copyR <= r2; copyR += 1) {
            if (!_.isNil(ctx.config.rowhidden) &&
                !_.isNil(ctx.config.rowhidden[copyR])) {
                continue;
            }
            if (!_.isNil(ctx.config.rowlen) && copyR in ctx.config.rowlen) {
                RowlChange = true;
            }
            for (var copyC = c1; copyC <= c2; copyC += 1) {
                if (!_.isNil(ctx.config.colhidden) &&
                    !_.isNil(ctx.config.colhidden[copyC])) {
                    continue;
                }
                var cell = (_c = flowdata === null || flowdata === void 0 ? void 0 : flowdata[copyR]) === null || _c === void 0 ? void 0 : _c[copyC];
                if (!_.isNil((_d = cell === null || cell === void 0 ? void 0 : cell.mc) === null || _d === void 0 ? void 0 : _d.rs)) {
                    HasMC = true;
                }
            }
        }
        ctx.luckysheet_selection_range.push({
            row: range.row,
            column: range.column,
        });
        copyRange.push({ row: range.row, column: range.column });
    }
    ctx.luckysheet_copy_save = {
        dataSheetId: ctx.currentSheetId,
        copyRange: copyRange,
        RowlChange: RowlChange,
        HasMC: HasMC,
    };
    var cpdata = rangeValueToHtml(ctx, ctx.currentSheetId, ctx.luckysheet_select_save);
    if (cpdata) {
        ctx.iscopyself = true;
        clipboard.writeHtml(cpdata);
    }
}
export function deleteSelectedCellText(ctx) {
    var _a;
    var allowEdit = isAllowEdit(ctx);
    if (allowEdit === false) {
        return "allowEdit";
    }
    var selection = ctx.luckysheet_select_save;
    if (selection && !_.isEmpty(selection)) {
        var d = getFlowdata(ctx);
        if (!d)
            return "dataNullError";
        var has_PartMC = false;
        for (var s = 0; s < selection.length; s += 1) {
            var r1 = selection[s].row[0];
            var r2 = selection[s].row[1];
            var c1 = selection[s].column[0];
            var c2 = selection[s].column[1];
            if (hasPartMC(ctx, ctx.config, r1, r2, c1, c2)) {
                has_PartMC = true;
                break;
            }
        }
        if (has_PartMC) {
            return "partMC";
        }
        var hyperlinkMap = ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)].hyperlink;
        for (var s = 0; s < selection.length; s += 1) {
            var r1 = selection[s].row[0];
            var r2 = selection[s].row[1];
            var c1 = selection[s].column[0];
            var c2 = selection[s].column[1];
            var sheetIndex = getSheetIndex(ctx, ctx.currentSheetId);
            if (sheetIndex !== null && ctx.luckysheetfile[sheetIndex].data) {
                var _b = ((_a = ctx.luckysheetfile[sheetIndex]) !== null && _a !== void 0 ? _a : {}).data, data = _b === void 0 ? [] : _b;
                for (var r = r1; r <= r2; r += 1) {
                    for (var c = c1; c <= c2; c += 1) {
                        if (!data[r])
                            data[r] = [];
                        if (data[r] && data[r][c]) {
                            data[r][c] = {};
                        }
                        if (hyperlinkMap && hyperlinkMap["".concat(r, "_").concat(c)]) {
                            delete hyperlinkMap["".concat(r, "_").concat(c)];
                        }
                    }
                }
            }
        }
    }
    return "success";
}
export function selectIsOverlap(ctx, range) {
    if (range == null) {
        range = ctx.luckysheet_select_save;
    }
    range = _.cloneDeep(range);
    var overlap = false;
    var map = {};
    for (var s = 0; s < range.length; s += 1) {
        var str_r = range[s].row[0];
        var end_r = range[s].row[1];
        var str_c = range[s].column[0];
        var end_c = range[s].column[1];
        for (var r = str_r; r <= end_r; r += 1) {
            for (var c = str_c; c <= end_c; c += 1) {
                if ("".concat(r, "_").concat(c) in map) {
                    overlap = true;
                    break;
                }
                else {
                    map["".concat(r, "_").concat(c)] = 0;
                }
            }
        }
    }
    return overlap;
}
export function selectAll(ctx) {
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    ctx.luckysheet_select_status = false;
    ctx.luckysheet_select_save = [
        {
            row: [0, flowdata.length - 1],
            column: [0, flowdata[0].length - 1],
            row_focus: 0,
            column_focus: 0,
            row_select: true,
            column_select: true,
        },
    ];
    normalizeSelection(ctx, ctx.luckysheet_select_save);
}
export function fixRowStyleOverflowInFreeze(ctx, r1, r2, freeze) {
    var _a;
    if (!freeze)
        return {};
    var ret = {};
    var scrollTop = ctx.scrollTop;
    var freezenhorizontaldata = (_a = freeze.horizontal) === null || _a === void 0 ? void 0 : _a.freezenhorizontaldata;
    var rangeshow = true;
    if (freezenhorizontaldata != null) {
        var freezenTop = freezenhorizontaldata[0];
        var freezen_rowindex = freezenhorizontaldata[1];
        var offTop = scrollTop - freezenhorizontaldata[2];
        var row = ctx.visibledatarow[r2];
        var row_pre = r1 - 1 === -1 ? 0 : ctx.visibledatarow[r1 - 1];
        var top_move = row_pre;
        var height_move = row - row_pre - 1;
        if (r1 >= freezen_rowindex) {
            if (top_move + height_move < freezenTop + offTop) {
                rangeshow = false;
            }
            else if (top_move < freezenTop + offTop) {
                ret.top = freezenTop + offTop;
                ret.height = height_move - (freezenTop + offTop - top_move);
            }
            else {
            }
        }
        else if (r2 >= freezen_rowindex) {
            if (top_move + height_move < freezenTop + offTop) {
                ret.top = top_move + offTop;
                ret.height = freezenTop - top_move;
            }
            else {
                ret.top = top_move + offTop;
                ret.height = height_move - offTop;
            }
        }
        else {
            ret.top = top_move + offTop;
        }
    }
    if (!rangeshow) {
        ret.display = "none";
    }
    return ret;
}
export function fixColumnStyleOverflowInFreeze(ctx, c1, c2, freeze) {
    var _a;
    if (!freeze)
        return {};
    var ret = {};
    var scrollLeft = ctx.scrollLeft;
    var freezenverticaldata = (_a = freeze.vertical) === null || _a === void 0 ? void 0 : _a.freezenverticaldata;
    var rangeshow = true;
    if (freezenverticaldata != null) {
        var freezenLeft = freezenverticaldata[0];
        var freezen_colindex = freezenverticaldata[1];
        var offLeft = scrollLeft - freezenverticaldata[2];
        var col = ctx.visibledatacolumn[c2];
        var col_pre = c1 - 1 === -1 ? 0 : ctx.visibledatacolumn[c1 - 1];
        var left_move = col_pre;
        var width_move = col - col_pre - 1;
        if (c1 >= freezen_colindex) {
            if (left_move + width_move < freezenLeft + offLeft) {
                rangeshow = false;
            }
            else if (left_move < freezenLeft + offLeft) {
                ret.left = freezenLeft + offLeft;
                ret.width = width_move - (freezenLeft + offLeft - left_move);
            }
            else {
            }
        }
        else if (c2 >= freezen_colindex) {
            if (left_move + width_move < freezenLeft + offLeft) {
                ret.left = left_move + offLeft;
                ret.width = freezenLeft - left_move;
            }
            else {
                ret.left = left_move + offLeft;
                ret.width = width_move - offLeft;
            }
        }
        else {
            ret.left = left_move + offLeft;
        }
    }
    if (!rangeshow) {
        ret.display = "none";
    }
    return ret;
}
export function calcSelectionInfo(ctx, lang) {
    var _a, _b, _c;
    var selection = ctx.luckysheet_select_save;
    var numberC = 0;
    var count = 0;
    var sum = 0;
    var max = -Infinity;
    var min = Infinity;
    for (var s = 0; s < selection.length; s += 1) {
        var data = getDataBySelectionNoCopy(ctx, selection[s]);
        for (var r = 0; r < data.length; r += 1) {
            for (var c = 0; c < data[0].length; c += 1) {
                if (r >= data.length || c >= data[0].length)
                    break;
                var ct = (_b = (_a = data[r][c]) === null || _a === void 0 ? void 0 : _a.ct) === null || _b === void 0 ? void 0 : _b.t;
                var value = (_c = data[r][c]) === null || _c === void 0 ? void 0 : _c.m;
                if (ct === "n" ||
                    (ct === "g" && parseFloat(value).toString() !== "NaN")) {
                    var valueNumber = parseFloat(value);
                    count += 1;
                    sum += valueNumber;
                    max = Math.max(valueNumber, max);
                    min = Math.min(valueNumber, min);
                    numberC += 1;
                }
                else if (value != null) {
                    count += 1;
                }
            }
        }
    }
    var formatString = lang && !["zh", "zh_tw"].includes(lang) ? "0.00" : "w0.00";
    var average = SSF.format(formatString, sum / numberC);
    sum = SSF.format(formatString, sum);
    max = SSF.format(formatString, max);
    min = SSF.format(formatString, min);
    return { numberC: numberC, count: count, sum: sum, max: max, min: min, average: average };
}
