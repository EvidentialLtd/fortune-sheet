import _ from "lodash";
import { getFlowdata } from "../context";
import { cancelActiveImgItem, cancelPaintModel, functionHTMLGenerate, israngeseleciton, rangeHightlightselected, rangeSetValue, onCommentBoxMove, onCommentBoxMoveEnd, onCommentBoxResize, onCommentBoxResizeEnd, onImageMove, onImageMoveEnd, onImageResize, onImageResizeEnd, removeEditingComment, overShowComment, rangeDrag, onFormulaRangeDragEnd, createFormulaRangeSelect, createRangeHightlight, onCellsMoveEnd, onCellsMove, cellFocus, } from "../modules";
import { getFrozenHandleLeft, getFrozenHandleTop, scrollToFrozenRowCol, } from "../modules/freeze";
import { cancelFunctionrangeSelected, mergeBorder, mergeMoveMain, updateCell, luckysheetUpdateCell, } from "../modules/cell";
import { colLocation, colLocationByIndex, rowLocation, rowLocationByIndex, } from "../modules/location";
import { checkProtectionAllSelected, checkProtectionSelectLockedOrUnLockedCells, } from "../modules/protection";
import { normalizeSelection, pasteHandlerOfPaintModel, } from "../modules/selection";
import { getSheetIndex, isAllowEdit } from "../utils";
import { onDropCellSelectEnd, onDropCellSelect } from "../modules/dropCell";
import { handleFormulaInput, rangeDragColumn, rangeDragRow, } from "../modules/formula";
import { showLinkCard, onRangeSelectionModalMove, onRangeSelectionModalMoveEnd, } from "../modules/hyperlink";
import { onSearchDialogMove, onSearchDialogMoveEnd, } from "../modules/searchReplace";
var mouseWheelUniqueTimeout;
var scrollLockTimeout;
export function handleGlobalWheel(ctx, e, cache, scrollbarX, scrollbarY) {
    var _a;
    if (((_a = cache.searchDialog) === null || _a === void 0 ? void 0 : _a.mouseEnter) && ctx.showSearch && ctx.showReplace)
        return;
    if (ctx.filterContextMenu != null)
        return;
    var scrollLeft = scrollbarX.scrollLeft;
    var scrollTop = scrollbarY.scrollTop;
    var visibledatacolumn_c = ctx.visibledatacolumn;
    var visibledatarow_c = ctx.visibledatarow;
    clearTimeout(mouseWheelUniqueTimeout);
    clearTimeout(scrollLockTimeout);
    if (cache.visibleColumnsUnique != null) {
        visibledatacolumn_c = cache.visibleColumnsUnique;
    }
    else {
        visibledatacolumn_c = _.uniq(visibledatacolumn_c);
        cache.visibleColumnsUnique = visibledatacolumn_c;
    }
    if (cache.visibleRowsUnique != null) {
        visibledatarow_c = cache.visibleRowsUnique;
    }
    else {
        visibledatarow_c = _.uniq(visibledatarow_c);
        cache.visibleRowsUnique = visibledatarow_c;
    }
    var row_st = _.sortedIndex(visibledatarow_c, scrollTop) + 1;
    var rowscroll = 0;
    var scrollNum = 1;
    if (e.deltaY !== 0 && !cache.verticalScrollLock) {
        cache.horizontalScrollLock = true;
        var row_ed = void 0;
        var step = Math.round(scrollNum / ctx.zoomRatio);
        step = step < 1 ? 1 : step;
        if (e.deltaY > 0) {
            row_ed = row_st + step;
            if (row_ed >= visibledatarow_c.length) {
                row_ed = visibledatarow_c.length - 1;
            }
        }
        else {
            row_ed = row_st - step;
            if (row_ed < 0) {
                row_ed = 0;
            }
        }
        rowscroll = row_ed === 0 ? 0 : visibledatarow_c[row_ed - 1];
        scrollbarY.scrollTop = rowscroll;
    }
    else if (e.deltaX !== 0 && !cache.horizontalScrollLock) {
        cache.verticalScrollLock = true;
        if (e.deltaX > 0) {
            scrollLeft += 20 * ctx.zoomRatio;
        }
        else {
            scrollLeft -= 20 * ctx.zoomRatio;
        }
        scrollbarX.scrollLeft = scrollLeft;
    }
    mouseWheelUniqueTimeout = setTimeout(function () {
        delete cache.visibleColumnsUnique;
        delete cache.visibleRowsUnique;
    }, 500);
    scrollLockTimeout = setTimeout(function () {
        delete cache.verticalScrollLock;
        delete cache.horizontalScrollLock;
    }, 50);
    e.preventDefault();
}
export function fixPositionOnFrozenCells(freeze, x, y, mouseX, mouseY) {
    var _a, _b;
    var inHorizontalFreeze = false;
    var inVerticalFreeze = false;
    if (!freeze)
        return { x: x, y: y, inHorizontalFreeze: inHorizontalFreeze, inVerticalFreeze: inVerticalFreeze };
    var freezenverticaldata = (_a = freeze === null || freeze === void 0 ? void 0 : freeze.vertical) === null || _a === void 0 ? void 0 : _a.freezenverticaldata;
    var freezenhorizontaldata = (_b = freeze === null || freeze === void 0 ? void 0 : freeze.horizontal) === null || _b === void 0 ? void 0 : _b.freezenhorizontaldata;
    if (freezenverticaldata != null &&
        mouseX < freezenverticaldata[0] - freezenverticaldata[2]) {
        x = mouseX + freezenverticaldata[2];
        inVerticalFreeze = true;
    }
    if (freezenhorizontaldata != null &&
        mouseY < freezenhorizontaldata[0] - freezenhorizontaldata[2]) {
        y = mouseY + freezenhorizontaldata[2];
        inHorizontalFreeze = true;
    }
    return { x: x, y: y, inHorizontalFreeze: inHorizontalFreeze, inVerticalFreeze: inVerticalFreeze };
}
export function handleCellAreaMouseDown(ctx, globalCache, e, cellInput, container, fxInput, canvas) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    ctx.contextMenu = {};
    ctx.filterContextMenu = undefined;
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    removeEditingComment(ctx, globalCache);
    cancelActiveImgItem(ctx, globalCache);
    var rect = container.getBoundingClientRect();
    var mouseX = e.pageX - rect.left - window.scrollX;
    var mouseY = e.pageY - rect.top - window.scrollY;
    var _x = mouseX + ctx.scrollLeft;
    var _y = mouseY + ctx.scrollTop;
    if (_x >= rect.width + ctx.scrollLeft || _y >= rect.height + ctx.scrollTop) {
        return;
    }
    var freeze = (_c = globalCache.freezen) === null || _c === void 0 ? void 0 : _c[ctx.currentSheetId];
    var _p = fixPositionOnFrozenCells(freeze, _x, _y, mouseX, mouseY), x = _p.x, y = _p.y, inHorizontalFreeze = _p.inHorizontalFreeze, inVerticalFreeze = _p.inVerticalFreeze;
    var row_location = rowLocation(y, ctx.visibledatarow);
    var row = row_location[1];
    var row_pre = row_location[0];
    var row_index = row_location[2];
    var col_location = colLocation(x, ctx.visibledatacolumn);
    var col = col_location[1];
    var col_pre = col_location[0];
    var col_index = col_location[2];
    var row_index_ed = row_index;
    var col_index_ed = col_index;
    var margeset = mergeBorder(ctx, flowdata, row_index, col_index);
    if (margeset) {
        _a = margeset.row, row_pre = _a[0], row = _a[1], row_index = _a[2], row_index_ed = _a[3];
        _b = margeset.column, col_pre = _b[0], col = _b[1], col_index = _b[2], col_index_ed = _b[3];
    }
    showLinkCard(ctx, row_index, col_index, false, true);
    if (((_e = (_d = ctx.hooks).beforeCellMouseDown) === null || _e === void 0 ? void 0 : _e.call(_d, (_f = flowdata[row_index]) === null || _f === void 0 ? void 0 : _f[col_index], {
        row: row_index,
        column: col_index,
        startRow: row_pre,
        startColumn: col_pre,
        endRow: row,
        endColumn: col,
    })) === false) {
        return;
    }
    cellFocus(ctx, row_index, col_index, true);
    if (!inHorizontalFreeze && !inVerticalFreeze) {
        if (col_pre < ctx.scrollLeft) {
            ctx.scrollLeft = col_pre;
        }
        if (row_pre < ctx.scrollTop) {
            ctx.scrollTop = row_pre;
        }
    }
    if (e.button === 2) {
        var isInSelection = _.some(ctx.luckysheet_select_save, function (obj_s) {
            return obj_s.row != null &&
                row_index >= obj_s.row[0] &&
                row_index <= obj_s.row[1] &&
                col_index >= obj_s.column[0] &&
                col_index <= obj_s.column[1];
        });
        if (isInSelection)
            return;
    }
    ctx.luckysheet_scroll_status = true;
    if (ctx.luckysheetCellUpdate.length > 0) {
        if (ctx.formulaCache.rangestart ||
            ctx.formulaCache.rangedrag_column_start ||
            ctx.formulaCache.rangedrag_row_start ||
            israngeseleciton(ctx)) {
            var rowseleted = [row_index, row_index_ed];
            var columnseleted = [col_index, col_index_ed];
            var left = col_pre;
            var width = col - col_pre - 1;
            var top_1 = row_pre;
            var height = row - row_pre - 1;
            if (e.shiftKey) {
                var last = ctx.formulaCache.func_selectedrange;
                top_1 = 0;
                height = 0;
                rowseleted = [];
                if (last == null ||
                    last.top == null ||
                    last.height == null ||
                    last.row_focus == null ||
                    last.left == null ||
                    last.width == null)
                    return;
                if (last.top > row_pre) {
                    top_1 = row_pre;
                    height = last.top + last.height - row_pre;
                    if (last.row[1] > last.row_focus) {
                        last.row[1] = last.row_focus;
                    }
                    rowseleted = [row_index, last.row[1]];
                }
                else if (last.top === row_pre) {
                    top_1 = row_pre;
                    height = last.top + last.height - row_pre;
                    rowseleted = [row_index, last.row[0]];
                }
                else {
                    top_1 = last.top;
                    height = row - last.top - 1;
                    if (last.row[0] < last.row_focus) {
                        last.row[0] = last.row_focus;
                    }
                    rowseleted = [last.row[0], row_index];
                }
                left = 0;
                width = 0;
                columnseleted = [];
                if (last.left > col_pre) {
                    left = col_pre;
                    width = last.left + last.width - col_pre;
                    if (last.column == null || last.column_focus == null)
                        return;
                    if (last.column[1] > last.column_focus) {
                        last.column[1] = last.column_focus;
                    }
                    columnseleted = [col_index, last.column[1]];
                }
                else if (last.left === col_pre) {
                    left = col_pre;
                    width = last.left + last.width - col_pre;
                    columnseleted = [col_index, last.column[0]];
                }
                else {
                    left = last.left;
                    width = col - last.left - 1;
                    if (last.column == null || last.column_focus == null)
                        return;
                    if (last.column[0] < last.column_focus) {
                        last.column[0] = last.column_focus;
                    }
                    columnseleted = [last.column[0], col_index];
                }
                var changeparam = mergeMoveMain(ctx, columnseleted, rowseleted, last, top_1, height, left, width);
                if (changeparam != null) {
                    columnseleted = changeparam[0], rowseleted = changeparam[1], top_1 = changeparam[2], height = changeparam[3], left = changeparam[4], width = changeparam[5];
                }
                last.row = rowseleted;
                last.column = columnseleted;
                last.left_move = left;
                last.width_move = width;
                last.top_move = top_1;
                last.height_move = height;
                ctx.formulaCache.func_selectedrange = last;
            }
            else if (e.ctrlKey &&
                ((_g = _.last(cellInput.querySelectorAll("span"))) === null || _g === void 0 ? void 0 : _g.innerText) !== ",") {
                var vText = cellInput.innerText;
                if (vText[vText.length - 1] === ")") {
                    vText = vText.substring(0, vText.length - 1);
                }
                if (vText.length > 0) {
                    var lastWord = vText.substring(vText.length - 1, 1);
                    if (lastWord !== "," && lastWord !== "=" && lastWord !== "(") {
                        vText += ",";
                    }
                }
                if (vText.length > 0 && vText.substring(0, 1) === "=") {
                    vText = functionHTMLGenerate(vText);
                    if (window.getSelection) {
                        var currSelection = window.getSelection();
                        if (currSelection == null)
                            return;
                        ctx.formulaCache.functionRangeIndex = [
                            _.indexOf((_k = (_j = (_h = currSelection.anchorNode) === null || _h === void 0 ? void 0 : _h.parentNode) === null || _j === void 0 ? void 0 : _j.parentNode) === null || _k === void 0 ? void 0 : _k.childNodes, (_l = currSelection.anchorNode) === null || _l === void 0 ? void 0 : _l.parentNode),
                            currSelection.anchorOffset,
                        ];
                    }
                    else {
                        var textRange = document.selection.createRange();
                        ctx.formulaCache.functionRangeIndex = textRange;
                    }
                    cellInput.innerHTML = vText;
                    cancelFunctionrangeSelected(ctx);
                    createRangeHightlight(ctx, vText);
                }
                ctx.formulaCache.rangestart = false;
                ctx.formulaCache.rangedrag_column_start = false;
                ctx.formulaCache.rangedrag_row_start = false;
                if (fxInput)
                    fxInput.innerHTML = vText;
                rangeHightlightselected(ctx, cellInput);
                israngeseleciton(ctx);
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
                    row_focus: row_index,
                    column_focus: col_index,
                };
            }
            else {
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
                    row_focus: row_index,
                    column_focus: col_index,
                };
            }
            rangeSetValue(ctx, cellInput, {
                row: rowseleted,
                column: columnseleted,
            }, fxInput);
            ctx.formulaCache.rangestart = true;
            ctx.formulaCache.rangedrag_column_start = false;
            ctx.formulaCache.rangedrag_row_start = false;
            ctx.formulaCache.selectingRangeIndex = ctx.formulaCache.rangechangeindex;
            if (ctx.formulaCache.rangechangeindex > ctx.formulaRangeHighlight.length) {
                createRangeHightlight(ctx, cellInput.innerHTML, ctx.formulaCache.rangechangeindex);
            }
            createFormulaRangeSelect(ctx, {
                rangeIndex: ctx.formulaCache.rangechangeindex || 0,
                left: left,
                top: top_1,
                width: width,
                height: height,
            });
            e.preventDefault();
            return;
        }
        updateCell(ctx, ctx.luckysheetCellUpdate[0], ctx.luckysheetCellUpdate[1], cellInput, undefined, canvas);
        ctx.luckysheet_select_status = true;
    }
    if (checkProtectionSelectLockedOrUnLockedCells(ctx, row_index, col_index, ctx.currentSheetId)) {
        ctx.luckysheet_select_status = true;
    }
    if (ctx.luckysheet_select_status) {
        if (e.shiftKey) {
            var last = (_m = ctx.luckysheet_select_save) === null || _m === void 0 ? void 0 : _m[ctx.luckysheet_select_save.length - 1];
            if (last &&
                last.top != null &&
                last.left != null &&
                last.height != null &&
                last.width != null &&
                last.row_focus != null &&
                last.column_focus != null) {
                var top_2 = 0;
                var height = 0;
                var rowseleted = [];
                if (last.top > row_pre) {
                    top_2 = row_pre;
                    height = last.top + last.height - row_pre;
                    if (last.row[1] > last.row_focus) {
                        last.row[1] = last.row_focus;
                    }
                    rowseleted = [row_index, last.row[1]];
                }
                else if (last.top === row_pre) {
                    top_2 = row_pre;
                    height = last.top + last.height - row_pre;
                    rowseleted = [row_index, last.row[0]];
                }
                else {
                    top_2 = last.top;
                    height = row - last.top - 1;
                    if (last.row[0] < last.row_focus) {
                        last.row[0] = last.row_focus;
                    }
                    rowseleted = [last.row[0], row_index];
                }
                var left = 0;
                var width = 0;
                var columnseleted = [];
                if (last.left > col_pre) {
                    left = col_pre;
                    width = last.left + last.width - col_pre;
                    if (last.column[1] > last.column_focus) {
                        last.column[1] = last.column_focus;
                    }
                    columnseleted = [col_index, last.column[1]];
                }
                else if (last.left === col_pre) {
                    left = col_pre;
                    width = last.left + last.width - col_pre;
                    columnseleted = [col_index, last.column[0]];
                }
                else {
                    left = last.left;
                    width = col - last.left - 1;
                    if (last.column[0] < last.column_focus) {
                        last.column[0] = last.column_focus;
                    }
                    columnseleted = [last.column[0], col_index];
                }
                var changeparam = mergeMoveMain(ctx, columnseleted, rowseleted, last, top_2, height, left, width);
                if (changeparam != null) {
                    columnseleted = changeparam[0], rowseleted = changeparam[1], top_2 = changeparam[2], height = changeparam[3], left = changeparam[4], width = changeparam[5];
                }
                last.row = rowseleted;
                last.column = columnseleted;
                last.left_move = left;
                last.width_move = width;
                last.top_move = top_2;
                last.height_move = height;
                ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1] =
                    last;
            }
        }
        else if (e.ctrlKey || e.metaKey) {
            (_o = ctx.luckysheet_select_save) === null || _o === void 0 ? void 0 : _o.push({
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
            });
        }
        else {
            ctx.luckysheet_select_save = [
                {
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
                },
            ];
        }
    }
    ctx.luckysheet_select_save = normalizeSelection(ctx, ctx.luckysheet_select_save);
    if (ctx.hooks.afterCellMouseDown) {
        setTimeout(function () {
            var _a, _b, _c;
            (_b = (_a = ctx.hooks).afterCellMouseDown) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = flowdata[row_index]) === null || _c === void 0 ? void 0 : _c[col_index], {
                row: row_index,
                column: col_index,
                startRow: row_pre,
                startColumn: col_pre,
                endRow: row,
                endColumn: col,
            });
        });
    }
}
export function handleCellAreaDoubleClick(ctx, globalCache, settings, e, container) {
    var _a, _b;
    var _c;
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    if ((ctx.luckysheetCellUpdate.length > 0 && ctx.formulaCache.rangestart) ||
        ctx.formulaCache.rangedrag_column_start ||
        ctx.formulaCache.rangedrag_row_start ||
        israngeseleciton(ctx)) {
        return;
    }
    var allowEdit = isAllowEdit(ctx);
    if (!allowEdit)
        return;
    var rect = container.getBoundingClientRect();
    var mouseX = e.pageX - rect.left;
    var mouseY = e.pageY - rect.top;
    var _x = mouseX + ctx.scrollLeft;
    var _y = mouseY + ctx.scrollTop;
    var freeze = (_c = globalCache.freezen) === null || _c === void 0 ? void 0 : _c[ctx.currentSheetId];
    var _d = fixPositionOnFrozenCells(freeze, _x, _y, mouseX, mouseY), x = _d.x, y = _d.y;
    var row_location = rowLocation(y, ctx.visibledatarow);
    var row_index = row_location[2];
    var col_location = colLocation(x, ctx.visibledatacolumn);
    var col_index = col_location[2];
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    var dataVerification = ctx.luckysheetfile[index].dataVerification;
    if (dataVerification) {
        var item = dataVerification["".concat(row_index, "_").concat(col_index)];
        if (item && item.type === "checkbox")
            return;
    }
    var margeset = mergeBorder(ctx, flowdata, row_index, col_index);
    if (margeset) {
        _a = margeset.row, row_index = _a[2];
        _b = margeset.column, col_index = _b[2];
    }
    var _e = ctx.luckysheet_select_save[0], column_focus = _e.column_focus, row_focus = _e.row_focus;
    if (!_.isNil(column_focus) &&
        !_.isNil(row_focus) &&
        (column_focus !== col_index || row_focus !== row_index)) {
        row_index = row_focus;
        col_index = column_focus;
    }
    luckysheetUpdateCell(ctx, row_index, col_index);
}
export function handleContextMenu(ctx, settings, e, workbookContainer, container, area) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!ctx.allowEdit) {
        return;
    }
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    var workbookRect = workbookContainer.getBoundingClientRect();
    var cellContextMenu = settings.cellContextMenu;
    if (_.isEmpty(cellContextMenu)) {
        return;
    }
    var x = e.pageX - workbookRect.left;
    var y = e.pageY - workbookRect.top;
    ctx.contextMenu = {
        x: x,
        y: y,
        pageX: e.pageX,
        pageY: e.pageY,
    };
    e.preventDefault();
    if (area === "cell") {
        _.set(ctx.contextMenu, "headerMenu", undefined);
        var rect = container.getBoundingClientRect();
        var mouseX = e.pageX - rect.left - window.scrollX;
        var mouseY = e.pageY - rect.top - window.scrollY;
        var _selected_x = mouseX + ctx.scrollLeft;
        var _selected_y = mouseY + ctx.scrollTop;
        var _h = fixPositionOnFrozenCells((_a = ctx.getRefs().globalCache.freezen) === null || _a === void 0 ? void 0 : _a[ctx.currentSheetId], _selected_x, _selected_y, mouseX, mouseY), selected_x = _h.x, selected_y = _h.y;
        var row_location = rowLocation(selected_y, ctx.visibledatarow);
        var row = row_location[1];
        var row_pre = row_location[0];
        var row_index_1 = row_location[2];
        var col_location = colLocation(selected_x, ctx.visibledatacolumn);
        var col = col_location[1];
        var col_pre = col_location[0];
        var col_index_1 = col_location[2];
        var isInSelection = _.some(ctx.luckysheet_select_save, function (obj_s) {
            return obj_s.row != null &&
                row_index_1 >= obj_s.row[0] &&
                row_index_1 <= obj_s.row[1] &&
                col_index_1 >= obj_s.column[0] &&
                col_index_1 <= obj_s.column[1];
        });
        if (!isInSelection && (e.metaKey || e.ctrlKey)) {
            if ((_b = flowdata[row_index_1][col_index_1]) === null || _b === void 0 ? void 0 : _b.mc) {
                var changeparam = mergeMoveMain(ctx, [col_index_1, col_index_1], [row_index_1, row_index_1], { row_focus: row_index_1, column_focus: col_index_1 }, row_pre, row, col_pre, col);
                if (changeparam != null) {
                    var columnseleted = changeparam[0], rowseleted = changeparam[1], top_3 = changeparam[2], height = changeparam[3], left = changeparam[4], width = changeparam[5];
                    (_c = ctx.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c.push({
                        left: left,
                        width: width - 1,
                        top: top_3,
                        height: height - 1,
                        left_move: left,
                        width_move: width,
                        top_move: top_3,
                        height_move: height,
                        row: rowseleted,
                        column: columnseleted,
                        row_focus: rowseleted[0],
                        column_focus: columnseleted[0],
                    });
                    return;
                }
            }
            (_d = ctx.luckysheet_select_save) === null || _d === void 0 ? void 0 : _d.push({
                left: col_pre,
                width: col - col_pre - 1,
                top: row_pre,
                height: row - row_pre - 1,
                left_move: col_pre,
                width_move: col - col_pre - 1,
                top_move: row_pre,
                height_move: row - row_pre - 1,
                row: [row_index_1, row_index_1],
                column: [col_index_1, col_index_1],
                row_focus: row_index_1,
                column_focus: col_index_1,
            });
            return;
        }
        if (isInSelection)
            return;
        var row_index_ed = row_index_1;
        var col_index_ed = col_index_1;
        if ((_e = flowdata[row_index_1][col_index_1]) === null || _e === void 0 ? void 0 : _e.mc) {
            var changeparam = mergeMoveMain(ctx, [col_index_1, col_index_1], [row_index_1, row_index_1], { row_focus: row_index_1, column_focus: col_index_1 }, row_pre, row, col_pre, col);
            if (changeparam != null) {
                var columnseleted = changeparam[0], rowseleted = changeparam[1], top_4 = changeparam[2], height = changeparam[3], left = changeparam[4], width = changeparam[5];
                ctx.luckysheet_select_save = [
                    {
                        left: left,
                        width: width - 1,
                        top: top_4,
                        height: height - 1,
                        left_move: left,
                        width_move: width,
                        top_move: top_4,
                        height_move: height,
                        row: rowseleted,
                        column: columnseleted,
                        row_focus: rowseleted[0],
                        column_focus: columnseleted[0],
                    },
                ];
                return;
            }
        }
        ctx.luckysheet_select_save = [
            {
                left: col_pre,
                width: col - col_pre - 1,
                top: row_pre,
                height: row - row_pre - 1,
                left_move: col_pre,
                width_move: col - col_pre - 1,
                top_move: row_pre,
                height_move: row - row_pre - 1,
                row: [row_index_1, row_index_ed],
                column: [col_index_1, col_index_ed],
                row_focus: row_index_1,
                column_focus: col_index_1,
            },
        ];
    }
    else if (area === "rowHeader") {
        _.set(ctx.contextMenu, "headerMenu", "row");
        var rect = container.getBoundingClientRect();
        var mouseY = e.pageY - rect.top - window.scrollY;
        var _selected_y = mouseY + ctx.scrollTop;
        var selected_y = fixPositionOnFrozenCells((_f = ctx.getRefs().globalCache.freezen) === null || _f === void 0 ? void 0 : _f[ctx.currentSheetId], 0, _selected_y, 0, mouseY).y;
        var row_location = rowLocation(selected_y, ctx.visibledatarow);
        var row = row_location[1];
        var row_pre = row_location[0];
        var row_index_2 = row_location[2];
        var isInSelection = _.some(ctx.luckysheet_select_save, function (obj_s) {
            return obj_s.row != null &&
                row_index_2 >= obj_s.row[0] &&
                row_index_2 <= obj_s.row[1] &&
                !obj_s.column_select;
        });
        if (isInSelection)
            return;
        var col_index = ctx.visibledatacolumn.length - 1;
        var col = ctx.visibledatacolumn[col_index];
        var col_pre = 0;
        var top_5 = row_pre;
        var height = row - row_pre - 1;
        var rowseleted = [row_index_2, row_index_2];
        ctx.luckysheet_select_save = [];
        ctx.luckysheet_select_save.push({
            left: colLocationByIndex(0, ctx.visibledatacolumn)[0],
            width: colLocationByIndex(0, ctx.visibledatacolumn)[1] -
                colLocationByIndex(0, ctx.visibledatacolumn)[0] -
                1,
            top: top_5,
            height: height,
            left_move: col_pre,
            width_move: col - col_pre - 1,
            top_move: top_5,
            height_move: height,
            row: rowseleted,
            column: [0, col_index],
            row_focus: row_index_2,
            column_focus: 0,
            row_select: true,
        });
    }
    else if (area === "columnHeader") {
        _.set(ctx.contextMenu, "headerMenu", "column");
        var rect = container.getBoundingClientRect();
        var mouseX = e.pageX - rect.left - window.scrollX;
        var _selected_x = mouseX + ctx.scrollLeft;
        var selected_x = fixPositionOnFrozenCells((_g = ctx.getRefs().globalCache.freezen) === null || _g === void 0 ? void 0 : _g[ctx.currentSheetId], _selected_x, 0, mouseX, 0).x;
        var row_index = ctx.visibledatarow.length - 1;
        var row = ctx.visibledatarow[row_index];
        var row_pre = 0;
        var col_location = colLocation(selected_x, ctx.visibledatacolumn);
        var col = col_location[1];
        var col_pre = col_location[0];
        var col_index_2 = col_location[2];
        var isInSelection = _.some(ctx.luckysheet_select_save, function (obj_s) {
            return obj_s.row != null &&
                col_index_2 >= obj_s.column[0] &&
                col_index_2 <= obj_s.column[1] &&
                !obj_s.row_select;
        });
        if (isInSelection)
            return;
        var left = col_pre;
        var width = col - col_pre - 1;
        var columnseleted = [col_index_2, col_index_2];
        ctx.luckysheet_select_save = [];
        ctx.luckysheet_select_save.push({
            left: left,
            width: width,
            top: rowLocationByIndex(0, ctx.visibledatarow)[0],
            height: rowLocationByIndex(0, ctx.visibledatarow)[1] -
                rowLocationByIndex(0, ctx.visibledatarow)[0] -
                1,
            left_move: left,
            width_move: width,
            top_move: row_pre,
            height_move: row - row_pre - 1,
            row: [0, row_index],
            column: columnseleted,
            row_focus: 0,
            column_focus: col_index_2,
            column_select: true,
        });
    }
}
function mouseRender(ctx, globalCache, e, cellInput, scrollX, scrollY, container, fxInput) {
    var _a, _b, _c, _d;
    var rect = container.getBoundingClientRect();
    if (ctx.luckysheet_scroll_status &&
        !ctx.luckysheet_cols_change_size &&
        !ctx.luckysheet_rows_change_size) {
        var left = ctx.scrollLeft;
        var top_6 = ctx.scrollTop;
        var x = e.pageX - rect.left - window.scrollX;
        var y = e.pageY - rect.top - window.scrollY;
        var winH = rect.height - 20 * ctx.zoomRatio;
        var winW = rect.width - 60 * ctx.zoomRatio;
        if (y < 0 || y > winH) {
            var stop_1;
            if (y < 0) {
                stop_1 = top_6 + y / 2;
            }
            else {
                stop_1 = top_6 + (y - winH) / 2;
            }
            scrollY.scrollTop = stop_1;
        }
        if (x < 0 || x > winW) {
            var sleft = void 0;
            if (x < 0) {
                sleft = left + x / 2;
            }
            else {
                sleft = left + (x - winW) / 2;
            }
            scrollX.scrollLeft = sleft;
        }
    }
    if ((_a = ctx.rangeDialog) === null || _a === void 0 ? void 0 : _a.singleSelect) {
        return;
    }
    if (ctx.luckysheet_select_status) {
        var mouseX = e.pageX - rect.left - window.scrollX;
        var mouseY = e.pageY - rect.top - window.scrollY;
        var _x = mouseX - ctx.rowHeaderWidth + ctx.scrollLeft;
        var _y = mouseY - ctx.columnHeaderHeight + ctx.scrollTop;
        var freeze = (_b = globalCache.freezen) === null || _b === void 0 ? void 0 : _b[ctx.currentSheetId];
        var _e = fixPositionOnFrozenCells(freeze, _x, _y, mouseX - ctx.rowHeaderWidth, mouseY - ctx.columnHeaderHeight), x = _e.x, y = _e.y;
        var row_location = rowLocation(y, ctx.visibledatarow);
        var row = row_location[1];
        var row_pre = row_location[0];
        var row_index = row_location[2];
        var col_location = colLocation(x, ctx.visibledatacolumn);
        var col = col_location[1];
        var col_pre = col_location[0];
        var col_index = col_location[2];
        if (!checkProtectionSelectLockedOrUnLockedCells(ctx, row_index, col_index, ctx.currentSheetId)) {
            ctx.luckysheet_select_status = false;
            return;
        }
        var last = _.cloneDeep((_c = ctx.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c[ctx.luckysheet_select_save.length - 1]);
        if (!last ||
            _.isNil(last.left) ||
            _.isNil(last.top) ||
            _.isNil(last.height) ||
            _.isNil(last.width) ||
            _.isNil(last.row_focus) ||
            _.isNil(last.column_focus)) {
            return;
        }
        var top_7 = 0;
        var height = 0;
        var rowseleted = [];
        if (last.top > row_pre) {
            top_7 = row_pre;
            height = last.top + last.height - row_pre;
            if (last.row[1] > last.row_focus) {
                last.row[1] = last.row_focus;
            }
            rowseleted = [row_index, last.row[1]];
        }
        else if (last.top === row_pre) {
            top_7 = row_pre;
            height = last.top + last.height - row_pre;
            rowseleted = [row_index, last.row[0]];
        }
        else {
            top_7 = last.top;
            height = row - last.top - 1;
            if (last.row[0] < last.row_focus) {
                last.row[0] = last.row_focus;
            }
            rowseleted = [last.row[0], row_index];
        }
        var left = 0;
        var width = 0;
        var columnseleted = [];
        if (last.left > col_pre) {
            left = col_pre;
            width = last.left + last.width - col_pre;
            if (last.column[1] > last.column_focus) {
                last.column[1] = last.column_focus;
            }
            columnseleted = [col_index, last.column[1]];
        }
        else if (last.left === col_pre) {
            left = col_pre;
            width = last.left + last.width - col_pre;
            columnseleted = [col_index, last.column[0]];
        }
        else {
            left = last.left;
            width = col - last.left - 1;
            if (last.column[0] < last.column_focus) {
                last.column[0] = last.column_focus;
            }
            columnseleted = [last.column[0], col_index];
        }
        var changeparam = mergeMoveMain(ctx, columnseleted, rowseleted, last, top_7, height, left, width);
        if (changeparam != null) {
            columnseleted = changeparam[0], rowseleted = changeparam[1], top_7 = changeparam[2], height = changeparam[3], left = changeparam[4], width = changeparam[5];
        }
        last.row = rowseleted;
        last.column = columnseleted;
        last.left_move = left;
        last.width_move = width;
        last.top_move = top_7;
        last.height_move = height;
        var isMaxColumn = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1]
            .column;
        var colMax = ctx.visibledatacolumn.length - 1;
        if (isMaxColumn[0] === 0 && isMaxColumn[1] === colMax) {
            last.column[1] = colMax;
            last.width_move = ctx.visibledatacolumn[colMax] - 1;
        }
        var isMaxRow = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1].row;
        var rowMax = ctx.visibledatarow.length - 1;
        if (isMaxRow[0] === 0 && isMaxRow[1] === rowMax) {
            last.row[1] = rowMax;
            last.height_move = ctx.visibledatarow[rowMax] - 1;
        }
        ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1] = last;
        scrollToFrozenRowCol(ctx, (_d = globalCache.freezen) === null || _d === void 0 ? void 0 : _d[ctx.currentSheetId]);
    }
    else if (ctx.formulaCache.rangestart) {
        rangeDrag(ctx, e, cellInput, scrollX.scrollLeft, scrollY.scrollTop, container, fxInput);
    }
    else if (ctx.formulaCache.rangedrag_row_start) {
        rangeDragRow(ctx, e, cellInput, scrollX.scrollLeft, scrollY.scrollTop, container, fxInput);
    }
    else if (ctx.formulaCache.rangedrag_column_start) {
        rangeDragColumn(ctx, e, cellInput, scrollX.scrollLeft, scrollY.scrollTop, container, fxInput);
    }
    else if (ctx.luckysheet_rows_selected_status) {
    }
    else if (ctx.luckysheet_cols_selected_status) {
    }
    else if (ctx.luckysheet_cell_selected_move) {
    }
    else if (ctx.luckysheet_cell_selected_extend) {
        onDropCellSelect(ctx, e, scrollX, scrollY, container);
    }
    else if (ctx.luckysheet_cols_change_size) {
        var x = e.pageX -
            rect.left -
            ctx.rowHeaderWidth +
            scrollX.scrollLeft -
            window.scrollX;
        if (x < rect.width + ctx.scrollLeft - 100) {
            var changeSizeLine = container.querySelector(".fortune-change-size-line");
            if (changeSizeLine) {
                changeSizeLine.style.left = "".concat(x, "px");
            }
            var changeSizeCol = container.querySelector(".fortune-cols-change-size");
            if (changeSizeCol) {
                changeSizeCol.style.left = "".concat(x - 2, "px");
            }
        }
    }
    else if (ctx.luckysheet_rows_change_size) {
        var y = e.pageY -
            rect.top -
            ctx.columnHeaderHeight +
            scrollY.scrollTop -
            window.scrollY;
        if (y < rect.height + ctx.scrollTop - 20) {
            var changeSizeLine = container.querySelector(".fortune-change-size-line");
            if (changeSizeLine) {
                changeSizeLine.style.top = "".concat(y, "px");
            }
            var changeSizeRow = container.querySelector(".fortune-rows-change-size");
            if (changeSizeRow) {
                changeSizeRow.style.top = "".concat(y, "px");
            }
        }
    }
    else if (ctx.luckysheet_cols_freeze_drag) {
        var x = e.pageX -
            rect.left -
            ctx.rowHeaderWidth +
            ctx.scrollLeft -
            window.scrollX;
        var _f = colLocation(x, ctx.visibledatacolumn), col_pre = _f[0], col_curr = _f[1];
        var col = x > (col_pre + col_curr) / 2 ? col_curr : col_pre;
        if (x < rect.width + ctx.scrollLeft - 100) {
            var freezeLine = container.querySelector(".fortune-freeze-drag-line");
            if (freezeLine) {
                freezeLine.style.left = "".concat(Math.max(0, col - 2), "px");
            }
            var freezeHandle = container.querySelector(".fortune-cols-freeze-handle");
            if (freezeHandle) {
                freezeHandle.style.left = "".concat(x, "px");
            }
            var changeSizeLine = container.querySelector(".fortune-change-size-line");
            if (changeSizeLine) {
                changeSizeLine.style.left = "".concat(x, "px");
            }
        }
    }
    else if (ctx.luckysheet_rows_freeze_drag) {
        var y = e.pageY -
            rect.top -
            ctx.columnHeaderHeight +
            ctx.scrollTop -
            window.scrollY;
        var _g = rowLocation(y, ctx.visibledatarow), row_pre = _g[0], row_curr = _g[1];
        var row = y > (row_curr + row_pre) / 2 ? row_curr : row_pre;
        if (y < rect.height + ctx.scrollTop - 20) {
            var freezeLine = container.querySelector(".fortune-freeze-drag-line");
            if (freezeLine) {
                freezeLine.style.top = "".concat(Math.max(0, row - 2), "px");
            }
            var freezeHandle = container.querySelector(".fortune-rows-freeze-handle");
            if (freezeHandle) {
                freezeHandle.style.top = "".concat(y, "px");
            }
            var changeSizeLine = container.querySelector(".fortune-change-size-line");
            if (changeSizeLine) {
                changeSizeLine.style.top = "".concat(y, "px");
            }
        }
    }
}
export function handleOverlayMouseMove(ctx, globalCache, e, cellInput, scrollX, scrollY, container, fxInput) {
    if (onCommentBoxResize(ctx, globalCache, e))
        return;
    if (onCommentBoxMove(ctx, globalCache, e))
        return;
    if (onImageMove(ctx, globalCache, e))
        return;
    if (onImageResize(ctx, globalCache, e))
        return;
    onCellsMove(ctx, globalCache, e, scrollX, scrollY, container);
    overShowComment(ctx, e, scrollX, scrollY, container);
    onSearchDialogMove(globalCache, e);
    onRangeSelectionModalMove(globalCache, e);
    if (!!ctx.luckysheet_scroll_status ||
        !!ctx.luckysheet_select_status ||
        !!ctx.luckysheet_rows_selected_status ||
        !!ctx.luckysheet_cols_selected_status ||
        !!ctx.luckysheet_cell_selected_move ||
        !!ctx.luckysheet_cell_selected_extend ||
        !!ctx.luckysheet_cols_change_size ||
        !!ctx.luckysheet_rows_change_size) {
        mouseRender(ctx, globalCache, e, cellInput, scrollX, scrollY, container, fxInput);
    }
}
export function handleOverlayMouseUp(ctx, globalCache, settings, e, scrollbarX, scrollbarY, container, cellInput, fxInput) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var rect = container.getBoundingClientRect();
    onImageMoveEnd(ctx, globalCache);
    onImageResizeEnd(ctx, globalCache);
    onCommentBoxMoveEnd(ctx, globalCache);
    onCommentBoxResizeEnd(ctx, globalCache);
    onFormulaRangeDragEnd(ctx);
    onSearchDialogMoveEnd(globalCache);
    onRangeSelectionModalMoveEnd(globalCache);
    onCellsMoveEnd(ctx, globalCache, e, scrollbarX, scrollbarY, container);
    if (ctx.formulaCache.rangestart ||
        ctx.formulaCache.rangedrag_column_start ||
        ctx.formulaCache.rangedrag_row_start) {
        if (((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.id) === "luckysheet-functionbox-cell") {
            handleFormulaInput(ctx, cellInput, fxInput, 0, undefined, false);
        }
        else {
            handleFormulaInput(ctx, fxInput, cellInput, 0, undefined, false);
        }
    }
    if (ctx.luckysheet_select_status) {
        if (ctx.luckysheetPaintModelOn) {
            pasteHandlerOfPaintModel(ctx, ctx.luckysheet_copy_save);
            if (ctx.luckysheetPaintSingle) {
                cancelPaintModel(ctx);
            }
        }
    }
    ctx.luckysheet_select_status = false;
    ctx.luckysheet_scroll_status = false;
    ctx.luckysheet_rows_selected_status = false;
    ctx.luckysheet_cols_selected_status = false;
    ctx.luckysheet_model_move_state = false;
    if (ctx.luckysheet_rows_change_size) {
        ctx.luckysheet_rows_change_size = false;
        var scrollTop = ctx.scrollTop;
        var y = e.pageY - rect.top - ctx.columnHeaderHeight + scrollTop - window.scrollY;
        var winH = rect.height;
        var delta = y + 3 - ctx.luckysheet_rows_change_size_start[0];
        if (y >= winH - 20 + scrollTop) {
            delta = winH - 20 - ctx.luckysheet_rows_change_size_start[0] + scrollTop;
        }
        var cfg_1 = ctx.config;
        if (cfg_1.rowlen == null) {
            cfg_1.rowlen = {};
        }
        if (cfg_1.customHeight == null) {
            cfg_1.customHeight = {};
        }
        var size_1 = ctx.defaultrowlen;
        if (ctx.visibledatarow[ctx.luckysheet_rows_change_size_start[1]] != null) {
            size_1 =
                ctx.visibledatarow[ctx.luckysheet_rows_change_size_start[1]] -
                    (ctx.visibledatarow[ctx.luckysheet_rows_change_size_start[1] - 1] || 0);
        }
        size_1 += delta;
        if (size_1 < 10) {
            size_1 = 10;
        }
        cfg_1.customHeight[ctx.luckysheet_rows_change_size_start[1]] = 1;
        var changeRowIndex_1 = ctx.luckysheet_rows_change_size_start[1];
        var changeRowSelected_1 = false;
        if (((_c = (_b = ctx.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0) {
            (_e = (_d = ctx.luckysheet_select_save) === null || _d === void 0 ? void 0 : _d.filter(function (select) { return select.row_select; })) === null || _e === void 0 ? void 0 : _e.some(function (select) {
                if (changeRowIndex_1 >= select.row[0] &&
                    changeRowIndex_1 <= select.row[1]) {
                    changeRowSelected_1 = true;
                }
                return changeRowSelected_1;
            });
        }
        if (changeRowSelected_1) {
            cfg_1.rowlen || (cfg_1.rowlen = {});
            (_g = (_f = ctx.luckysheet_select_save) === null || _f === void 0 ? void 0 : _f.filter(function (select) { return select.row_select; })) === null || _g === void 0 ? void 0 : _g.forEach(function (select) {
                for (var r = select.row[0]; r <= select.row[1]; r += 1) {
                    cfg_1.rowlen[r] = Math.ceil(size_1 / ctx.zoomRatio);
                }
            });
        }
        else {
            cfg_1.rowlen[ctx.luckysheet_rows_change_size_start[1]] = Math.ceil(size_1 / ctx.zoomRatio);
        }
        ctx.config = cfg_1;
        var idx = getSheetIndex(ctx, ctx.currentSheetId);
        if (idx == null)
            return;
        ctx.luckysheetfile[idx].config = ctx.config;
    }
    if (ctx.luckysheet_cols_change_size) {
        ctx.luckysheet_cols_change_size = false;
        var scrollLeft = ctx.scrollLeft;
        var x = e.pageX - rect.left - ctx.rowHeaderWidth + scrollLeft - window.scrollX;
        var winW = rect.width;
        var delta = x + 3 - ctx.luckysheet_cols_change_size_start[0];
        if (x >= winW - 100 + scrollLeft) {
            delta =
                winW - 100 - ctx.luckysheet_cols_change_size_start[0] + scrollLeft;
        }
        delta /= ctx.zoomRatio;
        var cfg_2 = ctx.config;
        if (cfg_2.columnlen == null) {
            cfg_2.columnlen = {};
        }
        if (cfg_2.customWidth == null) {
            cfg_2.customWidth = {};
        }
        var firstcolumnlen = ctx.defaultcollen;
        if (ctx.config.columnlen != null &&
            ctx.config.columnlen[ctx.luckysheet_cols_change_size_start[1]] != null) {
            firstcolumnlen =
                ctx.config.columnlen[ctx.luckysheet_cols_change_size_start[1]];
        }
        var size_2 = (cfg_2.columnlen[ctx.luckysheet_cols_change_size_start[1]] ||
            ctx.defaultcollen) + delta;
        if (Math.abs(size_2 - firstcolumnlen) < 3) {
            return;
        }
        if (size_2 < 10) {
            size_2 = 10;
        }
        cfg_2.customWidth[ctx.luckysheet_cols_change_size_start[1]] = 1;
        var changeColumnIndex_1 = ctx.luckysheet_cols_change_size_start[1];
        var changeColumnSelected_1 = false;
        if (((_j = (_h = ctx.luckysheet_select_save) === null || _h === void 0 ? void 0 : _h.length) !== null && _j !== void 0 ? _j : 0) > 0) {
            (_l = (_k = ctx.luckysheet_select_save) === null || _k === void 0 ? void 0 : _k.filter(function (select) { return select.column_select; })) === null || _l === void 0 ? void 0 : _l.some(function (select) {
                if (changeColumnIndex_1 >= select.column[0] &&
                    changeColumnIndex_1 <= select.column[1]) {
                    changeColumnSelected_1 = true;
                }
                return changeColumnSelected_1;
            });
        }
        if (changeColumnSelected_1) {
            cfg_2.columnlen || (cfg_2.columnlen = {});
            (_o = (_m = ctx.luckysheet_select_save) === null || _m === void 0 ? void 0 : _m.filter(function (select) { return select.column_select; })) === null || _o === void 0 ? void 0 : _o.forEach(function (select) {
                for (var r = select.column[0]; r <= select.column[1]; r += 1) {
                    cfg_2.columnlen[r] = Math.ceil(size_2 / ctx.zoomRatio);
                }
            });
        }
        else {
            cfg_2.columnlen[ctx.luckysheet_cols_change_size_start[1]] = Math.ceil(size_2 / ctx.zoomRatio);
        }
        ctx.config = cfg_2;
        var idx = getSheetIndex(ctx, ctx.currentSheetId);
        if (idx == null)
            return;
        ctx.luckysheetfile[idx].config = ctx.config;
    }
    if (ctx.luckysheet_cols_freeze_drag) {
        ctx.luckysheet_cols_freeze_drag = false;
        var scrollLeft = ctx.scrollLeft;
        var x = e.pageX - rect.left - ctx.rowHeaderWidth + scrollLeft - window.scrollX;
        var _p = colLocation(x, ctx.visibledatacolumn), col_pre = _p[0], col_curr = _p[1], col_index_curr = _p[2];
        var col_index = x > (col_curr + col_pre) / 2 ? col_index_curr : col_index_curr - 1;
        var idx = getSheetIndex(ctx, ctx.currentSheetId);
        if (idx == null)
            return;
        if (col_index < 0) {
            var frozen = ctx.luckysheetfile[idx].frozen;
            if (frozen) {
                if (frozen.type === "rangeBoth" || frozen.type === "both") {
                    frozen.type = "rangeRow";
                }
                else if (frozen.type === "column" || frozen.type === "rangeColumn") {
                    delete ctx.luckysheetfile[idx].frozen;
                }
            }
            var freezeHandle_1 = container.querySelector(".fortune-cols-freeze-handle");
            if (freezeHandle_1) {
                freezeHandle_1.style.left = "".concat(ctx.scrollLeft, "px");
            }
        }
        else if (!ctx.luckysheetfile[idx].frozen) {
            ctx.luckysheetfile[idx].frozen = {
                type: "rangeColumn",
                range: { column_focus: col_index, row_focus: 0 },
            };
        }
        else {
            var frozen = ctx.luckysheetfile[idx].frozen;
            if (!frozen.range) {
                frozen.range = { column_focus: col_index, row_focus: 0 };
            }
            else {
                frozen.range.column_focus = col_index;
            }
            if ((frozen === null || frozen === void 0 ? void 0 : frozen.type) === "rangeRow" || (frozen === null || frozen === void 0 ? void 0 : frozen.type) === "row") {
                frozen.type = "rangeBoth";
            }
        }
        var freezeHandle = container.querySelector(".fortune-cols-freeze-handle");
        if (freezeHandle) {
            freezeHandle.style.left = "".concat(getFrozenHandleLeft(ctx), "px");
        }
    }
    if (ctx.luckysheet_rows_freeze_drag) {
        ctx.luckysheet_rows_freeze_drag = false;
        var scrollTop = ctx.scrollTop;
        var y = e.pageY - rect.top - ctx.columnHeaderHeight + scrollTop - window.scrollY;
        var _q = rowLocation(y, ctx.visibledatarow), row_pre = _q[0], row_curr = _q[1], row_index_curr = _q[2];
        var row_index = y > (row_curr + row_pre) / 2 ? row_index_curr : row_index_curr - 1;
        var idx = getSheetIndex(ctx, ctx.currentSheetId);
        if (idx == null)
            return;
        if (row_index < 0) {
            var frozen = ctx.luckysheetfile[idx].frozen;
            if (frozen) {
                if (frozen.type === "rangeBoth" || frozen.type === "both") {
                    frozen.type = "rangeColumn";
                }
                else if (frozen.type === "row" || frozen.type === "rangeRow") {
                    delete ctx.luckysheetfile[idx].frozen;
                }
            }
        }
        else if (!ctx.luckysheetfile[idx].frozen) {
            ctx.luckysheetfile[idx].frozen = {
                type: "rangeRow",
                range: { column_focus: 0, row_focus: row_index },
            };
        }
        else {
            var frozen = ctx.luckysheetfile[idx].frozen;
            if (!frozen.range) {
                frozen.range = { column_focus: 0, row_focus: row_index };
            }
            else {
                frozen.range.row_focus = row_index;
            }
            if ((frozen === null || frozen === void 0 ? void 0 : frozen.type) === "rangeColumn" || (frozen === null || frozen === void 0 ? void 0 : frozen.type) === "column") {
                frozen.type = "rangeBoth";
            }
        }
        var freezeHandle = container.querySelector(".fortune-rows-freeze-handle");
        if (freezeHandle) {
            freezeHandle.style.top = "".concat(getFrozenHandleTop(ctx), "px");
        }
    }
    if (ctx.luckysheet_cell_selected_extend) {
        onDropCellSelectEnd(ctx, e, container);
    }
}
export function handleRowHeaderMouseDown(ctx, globalCache, e, container, cellInput, fxInput) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h, _j, _k;
    if (!checkProtectionAllSelected(ctx, ctx.currentSheetId)) {
        return;
    }
    removeEditingComment(ctx, globalCache);
    cancelActiveImgItem(ctx, globalCache);
    var rect = container.getBoundingClientRect();
    var mouseY = e.pageY - rect.top - window.scrollY;
    var _y = mouseY + ctx.scrollTop;
    var freeze = (_c = globalCache.freezen) === null || _c === void 0 ? void 0 : _c[ctx.currentSheetId];
    var y = fixPositionOnFrozenCells(freeze, 0, _y, 0, mouseY).y;
    var row_location = rowLocation(y, ctx.visibledatarow);
    var row = row_location[1];
    var row_pre = row_location[0];
    var row_index = row_location[2];
    var col_index = ctx.visibledatacolumn.length - 1;
    var col = ctx.visibledatacolumn[col_index];
    var col_pre = 0;
    if (e.button === 2) {
        var flowdata_1 = getFlowdata(ctx);
        var isInSelection = _.some(ctx.luckysheet_select_save, function (obj_s) {
            var _a, _b;
            return obj_s.row != null &&
                row_index >= obj_s.row[0] &&
                row_index <= obj_s.row[1] &&
                obj_s.column[0] === 0 &&
                obj_s.column[1] === ((_b = (_a = flowdata_1 === null || flowdata_1 === void 0 ? void 0 : flowdata_1[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) - 1;
        });
        if (isInSelection)
            return;
    }
    var top = row_pre;
    var height = row - row_pre - 1;
    var rowseleted = [row_index, row_index];
    ctx.luckysheet_scroll_status = true;
    if (!_.isEmpty(ctx.luckysheetCellUpdate)) {
        if (ctx.formulaCache.rangestart ||
            ctx.formulaCache.rangedrag_column_start ||
            ctx.formulaCache.rangedrag_row_start ||
            israngeseleciton(ctx)) {
            var changeparam = mergeMoveMain(ctx, [0, col_index], rowseleted, { row_focus: row_index, column_focus: 0 }, top, height, col_pre, col);
            if (changeparam != null) {
                _a = [
                    changeparam[1],
                    changeparam[2],
                    changeparam[3],
                ], rowseleted = _a[0], top = _a[1], height = _a[2];
            }
            if (e.shiftKey) {
                var last = ctx.formulaCache.func_selectedrange;
                top = 0;
                height = 0;
                rowseleted = [];
                if (last == null ||
                    last.top == null ||
                    last.height == null ||
                    last.row == null ||
                    last.row_focus == null)
                    return;
                if (last.top > row_pre) {
                    top = row_pre;
                    height = last.top + last.height - row_pre;
                    if (last.row[1] > last.row_focus) {
                        last.row[1] = last.row_focus;
                    }
                    rowseleted = [row_index, last.row[1]];
                }
                else if (last.top === row_pre) {
                    top = row_pre;
                    height = last.top + last.height - row_pre;
                    rowseleted = [row_index, last.row[0]];
                }
                else {
                    top = last.top;
                    height = row - last.top - 1;
                    if (last.row[0] < last.row_focus) {
                        last.row[0] = last.row_focus;
                    }
                    rowseleted = [last.row[0], row_index];
                }
                changeparam = mergeMoveMain(ctx, [0, col_index], rowseleted, { row_focus: row_index, column_focus: 0 }, top, height, col_pre, col);
                if (changeparam != null) {
                    _b = [
                        changeparam[1],
                        changeparam[2],
                        changeparam[3],
                    ], rowseleted = _b[0], top = _b[1], height = _b[2];
                }
                last.row = rowseleted;
                last.top_move = top;
                last.height_move = height;
                ctx.formulaCache.func_selectedrange = last;
            }
            else if (e.ctrlKey &&
                ((_d = _.last(cellInput.querySelectorAll("span"))) === null || _d === void 0 ? void 0 : _d.innerText) !== ",") {
                var vText = "".concat(cellInput.innerText, ",");
                if (vText.length > 0 && vText.substring(0, 1) === "=") {
                    vText = functionHTMLGenerate(vText);
                    if (window.getSelection) {
                        var currSelection = window.getSelection();
                        if (currSelection == null)
                            return;
                        ctx.formulaCache.functionRangeIndex = [
                            _.indexOf((_g = (_f = (_e = currSelection.anchorNode) === null || _e === void 0 ? void 0 : _e.parentNode) === null || _f === void 0 ? void 0 : _f.parentNode) === null || _g === void 0 ? void 0 : _g.childNodes, (_h = currSelection.anchorNode) === null || _h === void 0 ? void 0 : _h.parentNode),
                            currSelection.anchorOffset,
                        ];
                    }
                    else {
                        var textRange = document.selection.createRange();
                        ctx.formulaCache.functionRangeIndex = textRange;
                    }
                    cellInput.innerHTML = vText;
                    cancelFunctionrangeSelected(ctx);
                    createRangeHightlight(ctx, vText);
                }
                ctx.formulaCache.rangestart = false;
                ctx.formulaCache.rangedrag_column_start = false;
                ctx.formulaCache.rangedrag_row_start = false;
                if (fxInput)
                    fxInput.innerHTML = vText;
                rangeHightlightselected(ctx, cellInput);
                israngeseleciton(ctx);
                ctx.formulaCache.func_selectedrange = {
                    left: colLocationByIndex(0, ctx.visibledatacolumn)[0],
                    width: colLocationByIndex(0, ctx.visibledatacolumn)[1] -
                        colLocationByIndex(0, ctx.visibledatacolumn)[0] -
                        1,
                    top: top,
                    height: height,
                    left_move: col_pre,
                    width_move: col - col_pre - 1,
                    top_move: top,
                    height_move: height,
                    row: rowseleted,
                    column: [0, col_index],
                    row_focus: row_index,
                    column_focus: 0,
                };
            }
            else {
                ctx.formulaCache.func_selectedrange = {
                    left: colLocationByIndex(0, ctx.visibledatacolumn)[0],
                    width: colLocationByIndex(0, ctx.visibledatacolumn)[1] -
                        colLocationByIndex(0, ctx.visibledatacolumn)[0] -
                        1,
                    top: top,
                    height: height,
                    left_move: col_pre,
                    width_move: col - col_pre - 1,
                    top_move: top,
                    height_move: height,
                    row: rowseleted,
                    column: [0, col_index],
                    row_focus: row_index,
                    column_focus: 0,
                };
            }
            if (ctx.formulaCache.rangestart ||
                ctx.formulaCache.rangedrag_column_start ||
                ctx.formulaCache.rangedrag_row_start ||
                israngeseleciton(ctx)) {
                rangeSetValue(ctx, cellInput, {
                    row: rowseleted,
                    column: [null, null],
                }, fxInput);
            }
            ctx.formulaCache.rangedrag_row_start = true;
            ctx.formulaCache.rangestart = false;
            ctx.formulaCache.rangedrag_column_start = false;
            ctx.formulaCache.selectingRangeIndex = ctx.formulaCache.rangechangeindex;
            if (ctx.formulaCache.rangechangeindex > ctx.formulaRangeHighlight.length) {
                createRangeHightlight(ctx, cellInput.innerHTML, ctx.formulaCache.rangechangeindex);
            }
            createFormulaRangeSelect(ctx, {
                rangeIndex: ctx.formulaCache.rangechangeindex || 0,
                left: col_pre,
                top: top,
                width: col - col_pre - 1,
                height: height,
            });
            e.preventDefault();
            return;
        }
        updateCell(ctx, ctx.luckysheetCellUpdate[0], ctx.luckysheetCellUpdate[1], cellInput);
        ctx.luckysheet_rows_selected_status = true;
    }
    else {
        ctx.luckysheet_rows_selected_status = true;
    }
    if (ctx.luckysheet_rows_selected_status) {
        if (e.shiftKey) {
            var last = _.cloneDeep((_j = ctx.luckysheet_select_save) === null || _j === void 0 ? void 0 : _j[ctx.luckysheet_select_save.length - 1]);
            if (!last ||
                _.isNil(last.top) ||
                _.isNil(last.height) ||
                _.isNil(last.row_focus)) {
                return;
            }
            var _top = 0;
            var _height = 0;
            var _rowseleted = [];
            if (last.top > row_pre) {
                _top = row_pre;
                _height = last.top + last.height - row_pre;
                if (last.row[1] > last.row_focus) {
                    last.row[1] = last.row_focus;
                }
                _rowseleted = [row_index, last.row[1]];
            }
            else if (last.top === row_pre) {
                _top = row_pre;
                _height = last.top + last.height - row_pre;
                _rowseleted = [row_index, last.row[0]];
            }
            else {
                _top = last.top;
                _height = row - last.top - 1;
                if (last.row[0] < last.row_focus) {
                    last.row[0] = last.row_focus;
                }
                _rowseleted = [last.row[0], row_index];
            }
            last.row = _rowseleted;
            last.top_move = _top;
            last.height_move = _height;
            ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1] =
                last;
        }
        else if (e.ctrlKey || e.metaKey) {
            (_k = ctx.luckysheet_select_save) === null || _k === void 0 ? void 0 : _k.push({
                left: colLocationByIndex(0, ctx.visibledatacolumn)[0],
                width: colLocationByIndex(0, ctx.visibledatacolumn)[1] -
                    colLocationByIndex(0, ctx.visibledatacolumn)[0] -
                    1,
                top: top,
                height: height,
                left_move: col_pre,
                width_move: col - col_pre - 1,
                top_move: top,
                height_move: height,
                row: rowseleted,
                column: [0, col_index],
                row_focus: row_index,
                column_focus: 0,
                row_select: true,
            });
        }
        else {
            ctx.luckysheet_select_save = [];
            ctx.luckysheet_select_save.push({
                left: colLocationByIndex(0, ctx.visibledatacolumn)[0],
                width: colLocationByIndex(0, ctx.visibledatacolumn)[1] -
                    colLocationByIndex(0, ctx.visibledatacolumn)[0] -
                    1,
                top: top,
                height: height,
                left_move: col_pre,
                width_move: col - col_pre - 1,
                top_move: top,
                height_move: height,
                row: rowseleted,
                column: [0, col_index],
                row_focus: row_index,
                column_focus: 0,
                row_select: true,
            });
            ctx.luckysheet_select_status = true;
            ctx.luckysheet_scroll_status = true;
        }
    }
}
export function handleColumnHeaderMouseDown(ctx, globalCache, e, container, cellInput, fxInput) {
    var _a, _b;
    var _c, _d, _e, _f, _g, _h, _j, _k;
    if (!checkProtectionAllSelected(ctx, ctx.currentSheetId)) {
        return;
    }
    removeEditingComment(ctx, globalCache);
    cancelActiveImgItem(ctx, globalCache);
    var rect = container.getBoundingClientRect();
    var mouseX = e.pageX - rect.left - window.scrollX;
    var _x = mouseX + ctx.scrollLeft;
    var freeze = (_c = globalCache.freezen) === null || _c === void 0 ? void 0 : _c[ctx.currentSheetId];
    var x = fixPositionOnFrozenCells(freeze, _x, 0, mouseX, 0).x;
    var row_index = ctx.visibledatarow.length - 1;
    var row = ctx.visibledatarow[row_index];
    var row_pre = 0;
    var col_location = colLocation(x, ctx.visibledatacolumn);
    var col = col_location[1];
    var col_pre = col_location[0];
    var col_index = col_location[2];
    ctx.orderbyindex = col_index;
    if (e.button === 2) {
        var flowdata_2 = getFlowdata(ctx);
        var isInSelection = _.some(ctx.luckysheet_select_save, function (obj_s) {
            var _a;
            return obj_s.column != null &&
                col_index >= obj_s.column[0] &&
                col_index <= obj_s.column[1] &&
                obj_s.row[0] === 0 &&
                obj_s.row[1] === ((_a = flowdata_2 === null || flowdata_2 === void 0 ? void 0 : flowdata_2.length) !== null && _a !== void 0 ? _a : 0) - 1;
        });
        if (isInSelection)
            return;
    }
    var left = col_pre;
    var width = col - col_pre - 1;
    var columnseleted = [col_index, col_index];
    ctx.luckysheet_scroll_status = true;
    if (!_.isEmpty(ctx.luckysheetCellUpdate)) {
        if (ctx.formulaCache.rangestart ||
            ctx.formulaCache.rangedrag_column_start ||
            ctx.formulaCache.rangedrag_row_start ||
            israngeseleciton(ctx)) {
            var changeparam = mergeMoveMain(ctx, columnseleted, [0, row_index], { row_focus: 0, column_focus: col_index }, row_pre, row, left, width);
            if (changeparam != null) {
                _a = [
                    changeparam[0],
                    changeparam[4],
                    changeparam[5],
                ], columnseleted = _a[0], left = _a[1], width = _a[2];
            }
            if (e.shiftKey) {
                var last = ctx.formulaCache.func_selectedrange;
                left = 0;
                width = 0;
                columnseleted = [];
                if (last == null ||
                    last.width == null ||
                    last.height == null ||
                    last.left == null ||
                    last.column_focus == null)
                    return;
                if (last.left > col_pre) {
                    left = col_pre;
                    width = last.left + last.width - col_pre;
                    if (last.column[1] > last.column_focus) {
                        last.column[1] = last.column_focus;
                    }
                    columnseleted = [col_index, last.column[1]];
                }
                else if (last.left === col_pre) {
                    left = col_pre;
                    width = last.left + last.width - col_pre;
                    columnseleted = [col_index, last.column[0]];
                }
                else {
                    left = last.left;
                    width = col - last.left - 1;
                    if (last.column[0] < last.column_focus) {
                        last.column[0] = last.column_focus;
                    }
                    columnseleted = [last.column[0], col_index];
                }
                changeparam = mergeMoveMain(ctx, columnseleted, [0, row_index], { row_focus: 0, column_focus: col_index }, row_pre, row, left, width);
                if (changeparam != null) {
                    _b = [
                        changeparam[0],
                        changeparam[4],
                        changeparam[5],
                    ], columnseleted = _b[0], left = _b[1], width = _b[2];
                }
                last.column = columnseleted;
                last.left_move = left;
                last.width_move = width;
                ctx.formulaCache.func_selectedrange = last;
            }
            else if (e.ctrlKey &&
                ((_d = _.last(cellInput.querySelectorAll("span"))) === null || _d === void 0 ? void 0 : _d.innerText) !== ",") {
                var vText = "".concat(cellInput.innerText, ",");
                if (vText.length > 0 && vText.substring(0, 1) === "=") {
                    vText = functionHTMLGenerate(vText);
                    if (window.getSelection) {
                        var currSelection = window.getSelection();
                        if (currSelection == null)
                            return;
                        ctx.formulaCache.functionRangeIndex = [
                            _.indexOf((_g = (_f = (_e = currSelection.anchorNode) === null || _e === void 0 ? void 0 : _e.parentNode) === null || _f === void 0 ? void 0 : _f.parentNode) === null || _g === void 0 ? void 0 : _g.childNodes, (_h = currSelection.anchorNode) === null || _h === void 0 ? void 0 : _h.parentNode),
                            currSelection.anchorOffset,
                        ];
                    }
                    else {
                        var textRange = document.selection.createRange();
                        ctx.formulaCache.functionRangeIndex = textRange;
                    }
                    cellInput.innerHTML = vText;
                    cancelFunctionrangeSelected(ctx);
                    createRangeHightlight(ctx, vText);
                }
                ctx.formulaCache.rangestart = false;
                ctx.formulaCache.rangedrag_column_start = false;
                ctx.formulaCache.rangedrag_row_start = false;
                if (fxInput) {
                    fxInput.innerHTML = vText;
                }
                rangeHightlightselected(ctx, cellInput);
                israngeseleciton(ctx);
                ctx.formulaCache.func_selectedrange = {
                    left: left,
                    width: width,
                    top: rowLocationByIndex(0, ctx.visibledatarow)[0],
                    height: rowLocationByIndex(0, ctx.visibledatarow)[1] -
                        rowLocationByIndex(0, ctx.visibledatarow)[0] -
                        1,
                    left_move: left,
                    width_move: width,
                    top_move: row_pre,
                    height_move: row - row_pre - 1,
                    row: [0, row_index],
                    column: columnseleted,
                    row_focus: 0,
                    column_focus: col_index,
                };
            }
            else {
                ctx.formulaCache.func_selectedrange = {
                    left: left,
                    width: width,
                    top: rowLocationByIndex(0, ctx.visibledatarow)[0],
                    height: rowLocationByIndex(0, ctx.visibledatarow)[1] -
                        rowLocationByIndex(0, ctx.visibledatarow)[0] -
                        1,
                    left_move: left,
                    width_move: width,
                    top_move: row_pre,
                    height_move: row - row_pre - 1,
                    row: [0, row_index],
                    column: columnseleted,
                    row_focus: 0,
                    column_focus: col_index,
                };
            }
            if (ctx.formulaCache.rangestart ||
                ctx.formulaCache.rangedrag_column_start ||
                ctx.formulaCache.rangedrag_row_start ||
                israngeseleciton(ctx)) {
                rangeSetValue(ctx, cellInput, {
                    row: [null, null],
                    column: columnseleted,
                }, fxInput);
            }
            ctx.formulaCache.rangedrag_column_start = true;
            ctx.formulaCache.rangestart = false;
            ctx.formulaCache.rangedrag_row_start = false;
            ctx.formulaCache.selectingRangeIndex = ctx.formulaCache.rangechangeindex;
            if (ctx.formulaCache.rangechangeindex > ctx.formulaRangeHighlight.length) {
                createRangeHightlight(ctx, cellInput.innerHTML, ctx.formulaCache.rangechangeindex);
            }
            createFormulaRangeSelect(ctx, {
                rangeIndex: ctx.formulaCache.rangechangeindex || 0,
                left: left,
                top: row_pre,
                width: width,
                height: row - row_pre - 1,
            });
            e.preventDefault();
            return;
        }
        updateCell(ctx, ctx.luckysheetCellUpdate[0], ctx.luckysheetCellUpdate[1], cellInput);
        ctx.luckysheet_cols_selected_status = true;
    }
    else {
        ctx.luckysheet_cols_selected_status = true;
    }
    if (ctx.luckysheet_cols_selected_status) {
        if (e.shiftKey) {
            var last = _.cloneDeep((_j = ctx.luckysheet_select_save) === null || _j === void 0 ? void 0 : _j[ctx.luckysheet_select_save.length - 1]);
            var _left = 0;
            var _width = 0;
            var _columnseleted = [];
            if (!last ||
                _.isNil(last.left) ||
                _.isNil(last.width) ||
                _.isNil(last.column_focus)) {
                return;
            }
            if (last.left > col_pre) {
                _left = col_pre;
                _width = last.left + last.width - col_pre;
                if (last.column[1] > last.column_focus) {
                    last.column[1] = last.column_focus;
                }
                _columnseleted = [col_index, last.column[1]];
            }
            else if (last.left === col_pre) {
                _left = col_pre;
                _width = last.left + last.width - col_pre;
                _columnseleted = [col_index, last.column[0]];
            }
            else {
                _left = last.left;
                _width = col - last.left - 1;
                if (last.column[0] < last.column_focus) {
                    last.column[0] = last.column_focus;
                }
                _columnseleted = [last.column[0], col_index];
            }
            last.column = _columnseleted;
            last.left_move = _left;
            last.width_move = _width;
            ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1] =
                last;
        }
        else if (e.ctrlKey || e.metaKey) {
            (_k = ctx.luckysheet_select_save) === null || _k === void 0 ? void 0 : _k.push({
                left: left,
                width: width,
                top: rowLocationByIndex(0, ctx.visibledatarow)[0],
                height: rowLocationByIndex(0, ctx.visibledatarow)[1] -
                    rowLocationByIndex(0, ctx.visibledatarow)[0] -
                    1,
                left_move: left,
                width_move: width,
                top_move: row_pre,
                height_move: row - row_pre - 1,
                row: [0, row_index],
                column: columnseleted,
                row_focus: 0,
                column_focus: col_index,
                column_select: true,
            });
        }
        else {
            ctx.luckysheet_select_save = [];
            ctx.luckysheet_select_save.push({
                left: left,
                width: width,
                top: rowLocationByIndex(0, ctx.visibledatarow)[0],
                height: rowLocationByIndex(0, ctx.visibledatarow)[1] -
                    rowLocationByIndex(0, ctx.visibledatarow)[0] -
                    1,
                left_move: left,
                width_move: width,
                top_move: row_pre,
                height_move: row - row_pre - 1,
                row: [0, row_index],
                column: columnseleted,
                row_focus: 0,
                column_focus: col_index,
                column_select: true,
            });
            ctx.luckysheet_select_status = true;
            ctx.luckysheet_scroll_status = true;
        }
    }
}
export function handleColSizeHandleMouseDown(ctx, globalCache, e, headerContainer, workbookContainer, cellArea) {
    var _a;
    removeEditingComment(ctx, globalCache);
    cancelActiveImgItem(ctx, globalCache);
    ctx.luckysheetCellUpdate = [];
    var scrollLeft = ctx.scrollLeft;
    var scrollTop = ctx.scrollTop;
    var mouseX = e.pageX - headerContainer.getBoundingClientRect().left - window.scrollX;
    var _x = mouseX + scrollLeft;
    var freeze = (_a = globalCache.freezen) === null || _a === void 0 ? void 0 : _a[ctx.currentSheetId];
    var x = fixPositionOnFrozenCells(freeze, _x, 0, mouseX, 0).x;
    var col_location = colLocation(x, ctx.visibledatacolumn);
    var col = col_location[1];
    var col_index = col_location[2];
    ctx.luckysheet_cols_change_size = true;
    ctx.luckysheet_scroll_status = true;
    var changeSizeLine = workbookContainer.querySelector(".fortune-change-size-line");
    if (changeSizeLine) {
        var ele = changeSizeLine;
        ele.style.height = "".concat(cellArea.getBoundingClientRect().height + scrollTop, "px");
        ele.style.borderWidth = "0 1px 0 0";
        ele.style.top = "0";
        ele.style.left = "".concat(col - 3, "px");
        ele.style.width = "1px";
    }
    ctx.luckysheet_cols_change_size_start = [_x, col_index];
    e.stopPropagation();
}
export function handleRowSizeHandleMouseDown(ctx, globalCache, e, headerContainer, workbookContainer, cellArea) {
    var _a;
    removeEditingComment(ctx, globalCache);
    cancelActiveImgItem(ctx, globalCache);
    if (ctx.formulaCache.rangestart ||
        ctx.formulaCache.rangedrag_column_start ||
        ctx.formulaCache.rangedrag_row_start ||
        israngeseleciton(ctx))
        return;
    ctx.luckysheetCellUpdate = [];
    var scrollLeft = ctx.scrollLeft;
    var scrollTop = ctx.scrollTop;
    var mouseY = e.pageY - headerContainer.getBoundingClientRect().top - window.scrollY;
    var _y = mouseY + scrollTop;
    var freeze = (_a = globalCache.freezen) === null || _a === void 0 ? void 0 : _a[ctx.currentSheetId];
    var y = fixPositionOnFrozenCells(freeze, 0, _y, 0, mouseY).y;
    var row_location = rowLocation(y, ctx.visibledatarow);
    var row = row_location[1];
    var row_index = row_location[2];
    ctx.luckysheet_rows_change_size = true;
    ctx.luckysheet_scroll_status = true;
    var changeSizeLine = workbookContainer.querySelector(".fortune-change-size-line");
    if (changeSizeLine) {
        var ele = changeSizeLine;
        ele.style.width = "".concat(cellArea.getBoundingClientRect().width + scrollLeft, "px");
        ele.style.borderWidth = "0 0 1px 0";
        ele.style.top = "".concat(row - 3, "px");
        ele.style.left = "0";
        ele.style.height = "1px";
    }
    ctx.luckysheet_rows_change_size_start = [_y, row_index];
    e.stopPropagation();
}
export function handleColFreezeHandleMouseDown(ctx, globalCache, e, headerContainer, workbookContainer, cellArea) {
    removeEditingComment(ctx, globalCache);
    cancelActiveImgItem(ctx, globalCache);
    ctx.luckysheetCellUpdate = [];
    var scrollLeft = ctx.scrollLeft;
    var scrollTop = ctx.scrollTop;
    var x = e.pageX - headerContainer.getBoundingClientRect().left + scrollLeft;
    var col_location = colLocation(x, ctx.visibledatacolumn);
    var col = col_location[1];
    ctx.luckysheet_cols_freeze_drag = true;
    ctx.luckysheet_scroll_status = true;
    var freezeDragLine = workbookContainer.querySelector(".fortune-freeze-drag-line");
    if (freezeDragLine) {
        var ele = freezeDragLine;
        ele.style.height = "".concat(cellArea.getBoundingClientRect().height + scrollTop, "px");
        ele.style.borderWidth = "0 3px 0 0";
        ele.style.top = "0";
        ele.style.left = "".concat(col - 3, "px");
        ele.style.width = "1px";
    }
    var changeSizeLine = workbookContainer.querySelector(".fortune-change-size-line");
    if (changeSizeLine) {
        var ele = changeSizeLine;
        ele.style.height = "".concat(cellArea.getBoundingClientRect().height + scrollTop, "px");
        ele.style.borderWidth = "0 1px 0 0";
        ele.style.top = "0";
        ele.style.left = "".concat(col - 3, "px");
        ele.style.width = "1px";
    }
    e.stopPropagation();
}
export function handleRowFreezeHandleMouseDown(ctx, globalCache, e, headerContainer, workbookContainer, cellArea) {
    removeEditingComment(ctx, globalCache);
    cancelActiveImgItem(ctx, globalCache);
    ctx.luckysheetCellUpdate = [];
    var scrollLeft = ctx.scrollLeft;
    var scrollTop = ctx.scrollTop;
    var y = e.pageY - headerContainer.getBoundingClientRect().top + scrollTop;
    var row_location = rowLocation(y, ctx.visibledatarow);
    var row = row_location[1];
    ctx.luckysheet_rows_freeze_drag = true;
    ctx.luckysheet_scroll_status = true;
    var freezeDragLine = workbookContainer.querySelector(".fortune-freeze-drag-line");
    if (freezeDragLine) {
        var ele = freezeDragLine;
        ele.style.width = "".concat(cellArea.getBoundingClientRect().width + scrollLeft, "px");
        ele.style.borderWidth = "0 0 3px 0";
        ele.style.top = "".concat(row - 3, "px");
        ele.style.left = "0";
        ele.style.height = "1px";
    }
    var changeSizeLine = workbookContainer.querySelector(".fortune-change-size-line");
    if (changeSizeLine) {
        var ele = changeSizeLine;
        ele.style.width = "".concat(cellArea.getBoundingClientRect().width + scrollLeft, "px");
        ele.style.borderWidth = "0 0 1px 0";
        ele.style.top = "".concat(row - 3, "px");
        ele.style.left = "0";
        ele.style.height = "1px";
    }
    e.stopPropagation();
}
