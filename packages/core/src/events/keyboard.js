import _ from "lodash";
import { hideCRCount, removeActiveImage } from "..";
import { getFlowdata } from "../context";
import { updateCell, cancelNormalSelected } from "../modules/cell";
import { handleFormulaInput } from "../modules/formula";
import { copy, deleteSelectedCellText, moveHighlightCell, moveHighlightRange, selectAll, selectionCache, } from "../modules/selection";
import { cancelPaintModel, handleBold } from "../modules/toolbar";
import { hasPartMC } from "../modules/validation";
import { getNowDateTime, getSheetIndex, isAllowEdit } from "../utils";
import { handleCopy } from "./copy";
import { jfrefreshgrid } from "../modules/refresh";
export function handleGlobalEnter(ctx, cellInput, e, canvas) {
    var _a, _b, _c;
    if ((e.altKey || e.metaKey) && ctx.luckysheetCellUpdate.length > 0) {
        var last = (_a = ctx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[ctx.luckysheet_select_save.length - 1];
        if (last && !_.isNil(last.row_focus) && !_.isNil(last.column_focus)) {
        }
        e.preventDefault();
    }
    else if (ctx.luckysheetCellUpdate.length > 0) {
        var lastCellUpdate = _.clone(ctx.luckysheetCellUpdate);
        updateCell(ctx, ctx.luckysheetCellUpdate[0], ctx.luckysheetCellUpdate[1], cellInput, undefined, canvas);
        ctx.luckysheet_select_save = [
            {
                row: [lastCellUpdate[0], lastCellUpdate[0]],
                column: [lastCellUpdate[1], lastCellUpdate[1]],
                row_focus: lastCellUpdate[0],
                column_focus: lastCellUpdate[1],
            },
        ];
        moveHighlightCell(ctx, "down", 1, "rangeOfSelect");
        e.preventDefault();
    }
    else {
        if (((_c = (_b = ctx.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0) {
            var last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
            var row_index = last.row_focus;
            var col_index = last.column_focus;
            ctx.luckysheetCellUpdate = [row_index, col_index];
            e.preventDefault();
        }
    }
}
function moveToEdge(sheetData, key, curr, rowDelta, colDelta, startR, endR, startC, endC, maxRow, maxCol) {
    var _a, _b, _c, _d, _e, _f;
    var selectedLimit = -1;
    if (key === "ArrowUp")
        selectedLimit = startR - 1;
    else if (key === "ArrowDown")
        selectedLimit = endR + 1;
    else if (key === "ArrowLeft")
        selectedLimit = startC - 1;
    else if (key === "ArrowRight")
        selectedLimit = endC + 1;
    var maxRowCol = colDelta === 0 ? maxRow : maxCol;
    var r = colDelta === 0 ? selectedLimit : curr;
    var c = colDelta === 0 ? curr : selectedLimit;
    while (r >= 0 && c >= 0 && (colDelta === 0 ? r : c) < maxRowCol - 1) {
        if (!_.isNil((_b = (_a = sheetData === null || sheetData === void 0 ? void 0 : sheetData[r]) === null || _a === void 0 ? void 0 : _a[c]) === null || _b === void 0 ? void 0 : _b.v) &&
            (_.isNil((_d = (_c = sheetData === null || sheetData === void 0 ? void 0 : sheetData[r - rowDelta]) === null || _c === void 0 ? void 0 : _c[c - colDelta]) === null || _d === void 0 ? void 0 : _d.v) ||
                _.isNil((_f = (_e = sheetData === null || sheetData === void 0 ? void 0 : sheetData[r + rowDelta]) === null || _e === void 0 ? void 0 : _e[c + colDelta]) === null || _f === void 0 ? void 0 : _f.v))) {
            break;
        }
        else {
            r += 1 * rowDelta;
            c += 1 * colDelta;
        }
    }
    return colDelta === 0 ? r : c;
}
function handleControlPlusArrowKey(ctx, e, shiftPressed) {
    if (ctx.luckysheetCellUpdate.length > 0)
        return;
    var idx = getSheetIndex(ctx, ctx.currentSheetId);
    if (_.isNil(idx))
        return;
    var file = ctx.luckysheetfile[idx];
    if (!file || !file.row || !file.column)
        return;
    var maxRow = file.row;
    var maxCol = file.column;
    var last;
    if (ctx.luckysheet_select_save && ctx.luckysheet_select_save.length > 0)
        last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
    if (!last)
        return;
    var currR = last.row_focus;
    var currC = last.column_focus;
    if (_.isNil(currR) || _.isNil(currC))
        return;
    var startR = last.row[0];
    var endR = last.row[1];
    var startC = last.column[0];
    var endC = last.column[1];
    var horizontalOffset = currC - endC !== 0 ? currC - endC : currC - startC;
    var verticalOffset = currR - endR !== 0 ? currR - endR : currR - startR;
    var sheetData = file.data;
    if (!sheetData)
        return;
    var selectedLimit;
    switch (e.key) {
        case "ArrowUp":
            selectedLimit = moveToEdge(sheetData, e.key, currC, -1, 0, startR, endR, startC, endC, maxRow, maxCol);
            if (shiftPressed) {
                moveHighlightRange(ctx, "down", verticalOffset, "rangeOfSelect");
                moveHighlightRange(ctx, "down", selectedLimit - currR, "rangeOfSelect");
            }
            else {
                moveHighlightCell(ctx, "down", selectedLimit - currR, "rangeOfSelect");
            }
            break;
        case "ArrowDown":
            selectedLimit = moveToEdge(sheetData, e.key, currC, 1, 0, startR, endR, startC, endC, maxRow, maxCol);
            if (shiftPressed) {
                moveHighlightRange(ctx, "down", verticalOffset, "rangeOfSelect");
                moveHighlightRange(ctx, "down", selectedLimit - currR, "rangeOfSelect");
            }
            else {
                moveHighlightCell(ctx, "down", selectedLimit - currR, "rangeOfSelect");
            }
            break;
        case "ArrowLeft":
            selectedLimit = moveToEdge(sheetData, e.key, currR, 0, -1, startR, endR, startC, endC, maxRow, maxCol);
            if (shiftPressed) {
                moveHighlightRange(ctx, "right", horizontalOffset, "rangeOfSelect");
                moveHighlightRange(ctx, "right", selectedLimit - currC, "rangeOfSelect");
            }
            else {
                moveHighlightCell(ctx, "right", selectedLimit - currC, "rangeOfSelect");
            }
            break;
        case "ArrowRight":
            selectedLimit = moveToEdge(sheetData, e.key, currR, 0, 1, startR, endR, startC, endC, maxRow, maxCol);
            if (shiftPressed) {
                moveHighlightRange(ctx, "right", horizontalOffset, "rangeOfSelect");
                moveHighlightRange(ctx, "right", selectedLimit - currC, "rangeOfSelect");
            }
            else {
                moveHighlightCell(ctx, "right", selectedLimit - currC, "rangeOfSelect");
            }
            break;
        default:
            break;
    }
}
export function handleWithCtrlOrMetaKey(ctx, cache, e, cellInput, fxInput, handleUndo, handleRedo) {
    var _a, _b, _c, _d, _e, _f;
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    if (e.shiftKey) {
        ctx.luckysheet_shiftpositon = _.cloneDeep((_a = ctx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[ctx.luckysheet_select_save.length - 1]);
        ctx.luckysheet_shiftkeydown = true;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            handleControlPlusArrowKey(ctx, e, true);
        }
        else if (_.includes([";", '"', ":", "'"], e.key)) {
            var last = (_b = ctx.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b[ctx.luckysheet_select_save.length - 1];
            if (!last)
                return;
            var row_index = last.row_focus;
            var col_index = last.column_focus;
            updateCell(ctx, row_index, col_index, cellInput);
            ctx.luckysheetCellUpdate = [row_index, col_index];
            cache.ignoreWriteCell = true;
            var value = getNowDateTime(2);
            cellInput.innerText = value;
            handleFormulaInput(ctx, fxInput, cellInput, e.keyCode);
        }
        else if (e.code === "KeyZ") {
            handleRedo();
            e.stopPropagation();
            return;
        }
    }
    else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        handleControlPlusArrowKey(ctx, e, false);
    }
    else if (e.code === "KeyB") {
        handleBold(ctx, cellInput);
    }
    else if (e.code === "KeyC") {
        handleCopy(ctx);
        e.stopPropagation();
        return;
    }
    else if (e.code === "KeyF") {
        ctx.showSearch = true;
    }
    else if (e.code === "KeyH") {
        ctx.showReplace = true;
    }
    else if (e.code === "KeyV") {
        if (((_d = (_c = ctx.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 1) {
            return;
        }
        selectionCache.isPasteAction = true;
        e.stopPropagation();
        return;
    }
    else if (e.code === "KeyX") {
        if (ctx.luckysheetPaintModelOn) {
            cancelPaintModel(ctx);
        }
        var selection = ctx.luckysheet_select_save;
        if (!selection || _.isEmpty(selection)) {
            return;
        }
        if (ctx.config.merge != null) {
            var has_PartMC = false;
            for (var s = 0; s < selection.length; s += 1) {
                var r1 = selection[s].row[0];
                var r2 = selection[s].row[1];
                var c1 = selection[s].column[0];
                var c2 = selection[s].column[1];
                has_PartMC = hasPartMC(ctx, ctx.config, r1, r2, c1, c2);
                if (has_PartMC) {
                    break;
                }
            }
            if (has_PartMC) {
                return;
            }
        }
        if (selection.length > 1) {
            return;
        }
        copy(ctx);
        ctx.luckysheet_paste_iscut = true;
        e.stopPropagation();
        return;
    }
    else if (e.code === "KeyZ") {
        handleUndo();
        e.stopPropagation();
        return;
    }
    else if (e.code === "KeyA") {
        selectAll(ctx);
    }
    else if (e.code === "KeyD") {
        if (!ctx.luckysheet_select_save ||
            ctx.luckysheet_select_save.length === 0) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var selectedRange = ctx.luckysheet_select_save[0];
        var row_1 = selectedRange.row, column = selectedRange.column;
        if (!row_1 || !column)
            return;
        if (!isAllowEdit(ctx))
            return;
        for (var col = column[0]; col <= column[1]; col += 1) {
            var sourceCell = (_e = flowdata === null || flowdata === void 0 ? void 0 : flowdata[row_1[0]]) === null || _e === void 0 ? void 0 : _e[col];
            if (!sourceCell)
                continue;
            var sourceValue = sourceCell.v;
            var sourceFormula = sourceCell.f;
            var _loop_1 = function (r) {
                if (sourceFormula) {
                    var newFormula = sourceFormula.replace(/(\$?[A-Z]+)(\$?)(\d+)/g, function (match, colRef, dollar, rowNum) {
                        return dollar
                            ? match
                            : "".concat(colRef).concat(parseInt(rowNum, 10) + (r - row_1[0]));
                    });
                    updateCell(ctx, r, col, null, newFormula);
                }
                else {
                    updateCell(ctx, r, col, null, sourceValue);
                }
            };
            for (var r = row_1[0] + 1; r <= row_1[1]; r += 1) {
                _loop_1(r);
            }
        }
        jfrefreshgrid(ctx, null, undefined);
    }
    else if (e.code === "KeyR") {
        if (!ctx.luckysheet_select_save ||
            ctx.luckysheet_select_save.length === 0) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var selectedRange = ctx.luckysheet_select_save[0];
        var row = selectedRange.row, column_1 = selectedRange.column;
        if (!row || !column_1)
            return;
        if (!isAllowEdit(ctx))
            return;
        for (var r = row[0]; r <= row[1]; r += 1) {
            var sourceCell = (_f = flowdata === null || flowdata === void 0 ? void 0 : flowdata[r]) === null || _f === void 0 ? void 0 : _f[column_1[0]];
            if (!sourceCell)
                continue;
            var sourceValue = sourceCell.v;
            var sourceFormula = sourceCell.f;
            var _loop_2 = function (c) {
                if (sourceFormula) {
                    var newFormula = sourceFormula.replace(/(\$?[A-Z]+)(\$?)(\d+)/g, function (match, colRef, dollar, rowNum) {
                        if (dollar)
                            return match;
                        var colIndex = colRef.charCodeAt(0) - 65 + (c - column_1[0]);
                        return "".concat(String.fromCharCode(65 + colIndex)).concat(rowNum);
                    });
                    updateCell(ctx, r, c, null, newFormula);
                }
                else {
                    updateCell(ctx, r, c, null, sourceValue);
                }
            };
            for (var c = column_1[0] + 1; c <= column_1[1]; c += 1) {
                _loop_2(c);
            }
        }
        jfrefreshgrid(ctx, null, undefined);
    }
    e.preventDefault();
}
function handleShiftWithArrowKey(ctx, e) {
    var _a;
    if (ctx.luckysheetCellUpdate.length > 0) {
        return;
    }
    ctx.luckysheet_shiftpositon = _.cloneDeep((_a = ctx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[ctx.luckysheet_select_save.length - 1]);
    ctx.luckysheet_shiftkeydown = true;
    switch (e.key) {
        case "ArrowUp":
            moveHighlightRange(ctx, "down", -1, "rangeOfSelect");
            break;
        case "ArrowDown":
            moveHighlightRange(ctx, "down", 1, "rangeOfSelect");
            break;
        case "ArrowLeft":
            moveHighlightRange(ctx, "right", -1, "rangeOfSelect");
            break;
        case "ArrowRight":
            moveHighlightRange(ctx, "right", 1, "rangeOfSelect");
            break;
        default:
            break;
    }
    e.preventDefault();
}
export function handleArrowKey(ctx, e) {
    if (ctx.luckysheetCellUpdate.length > 0 ||
        ctx.luckysheet_cell_selected_move ||
        ctx.luckysheet_cell_selected_extend) {
        return;
    }
    var moveCount = hideCRCount(ctx, e.key);
    switch (e.key) {
        case "ArrowUp":
            moveHighlightCell(ctx, "down", -moveCount, "rangeOfSelect");
            break;
        case "ArrowDown":
            moveHighlightCell(ctx, "down", moveCount, "rangeOfSelect");
            break;
        case "ArrowLeft":
            moveHighlightCell(ctx, "right", -moveCount, "rangeOfSelect");
            break;
        case "ArrowRight":
            moveHighlightCell(ctx, "right", moveCount, "rangeOfSelect");
            break;
        default:
            break;
    }
}
export function handleGlobalKeyDown(ctx, cellInput, fxInput, e, cache, handleUndo, handleRedo, canvas) {
    var _a;
    ctx.luckysheet_select_status = false;
    var kcode = e.keyCode;
    var kstr = e.key;
    if (!_.isEmpty(ctx.contextMenu) || ctx.filterContextMenu) {
        return;
    }
    if (kstr === "Escape" && !!ctx.luckysheet_selection_range) {
        ctx.luckysheet_selection_range = [];
    }
    var allowEdit = isAllowEdit(ctx);
    if (ctx.luckysheetCellUpdate.length > 0 &&
        kstr !== "Enter" &&
        kstr !== "Tab" &&
        kstr !== "ArrowUp" &&
        kstr !== "ArrowDown" &&
        kstr !== "ArrowLeft" &&
        kstr !== "ArrowRight") {
        return;
    }
    if (e.ctrlKey && e.shiftKey && kstr === "F") {
        ctx.sheetFocused = !ctx.sheetFocused;
        e.preventDefault();
        if (ctx.sheetFocused) {
            var selectedCell = document.querySelector(".luckysheet-cell-input");
            if (selectedCell) {
                selectedCell.setAttribute("tabindex", "-1");
                selectedCell.focus();
            }
        }
        else {
            var toolbar_1 = document.querySelector(".fortune-toolbar");
            if (toolbar_1) {
                toolbar_1.setAttribute("tabindex", "-1");
                toolbar_1.focus();
            }
        }
        return;
    }
    if (!ctx.sheetFocused) {
        return;
    }
    if (kstr === "Enter") {
        if (!allowEdit)
            return;
        handleGlobalEnter(ctx, cellInput, e, canvas);
    }
    else if (kstr === "Tab") {
        if (ctx.luckysheetCellUpdate.length > 0) {
            return;
        }
        if (e.shiftKey) {
            moveHighlightCell(ctx, "right", -1, "rangeOfSelect");
        }
        else {
            moveHighlightCell(ctx, "right", 1, "rangeOfSelect");
        }
        e.preventDefault();
    }
    else if (kstr === "F2") {
        if (!allowEdit)
            return;
        if (ctx.luckysheetCellUpdate.length > 0) {
            return;
        }
        var last = (_a = ctx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[ctx.luckysheet_select_save.length - 1];
        if (!last)
            return;
        var row_index = last.row_focus;
        var col_index = last.column_focus;
        ctx.luckysheetCellUpdate = [row_index, col_index];
        e.preventDefault();
    }
    else if (kstr === "F4" && ctx.luckysheetCellUpdate.length > 0) {
        e.preventDefault();
    }
    else if (kstr === "Escape" && ctx.luckysheetCellUpdate.length > 0) {
        cancelNormalSelected(ctx);
        moveHighlightCell(ctx, "down", 0, "rangeOfSelect");
        e.preventDefault();
    }
    else {
        if (e.ctrlKey || e.metaKey) {
            handleWithCtrlOrMetaKey(ctx, cache, e, cellInput, fxInput, handleUndo, handleRedo);
            return;
        }
        if (e.shiftKey &&
            (kstr === "ArrowUp" ||
                kstr === "ArrowDown" ||
                kstr === "ArrowLeft" ||
                kstr === "ArrowRight")) {
            handleShiftWithArrowKey(ctx, e);
        }
        else if (kstr === "Escape") {
            ctx.contextMenu = {};
        }
        else if (kstr.toLowerCase() === "delete" ||
            kstr.toLowerCase() === "backspace") {
            if (!allowEdit)
                return;
            if (ctx.activeImg != null) {
                removeActiveImage(ctx);
            }
            else {
                deleteSelectedCellText(ctx);
            }
            jfrefreshgrid(ctx, null, undefined);
            e.preventDefault();
        }
        else if (kstr === "ArrowUp" ||
            kstr === "ArrowDown" ||
            kstr === "ArrowLeft" ||
            kstr === "ArrowRight") {
            handleArrowKey(ctx, e);
        }
        else if (!((kcode >= 112 && kcode <= 123) ||
            kcode <= 46 ||
            kcode === 144 ||
            kcode === 108 ||
            e.ctrlKey ||
            e.altKey ||
            (e.shiftKey &&
                (kcode === 37 || kcode === 38 || kcode === 39 || kcode === 40))) ||
            kcode === 8 ||
            kcode === 32 ||
            kcode === 46 ||
            kcode === 0 ||
            (e.ctrlKey && kcode === 86)) {
            if (!allowEdit)
                return;
            if (String.fromCharCode(kcode) != null &&
                !_.isEmpty(ctx.luckysheet_select_save) &&
                kstr !== "CapsLock" &&
                kstr !== "Win" &&
                kcode !== 18) {
                var last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
                var row_index = last.row_focus;
                var col_index = last.column_focus;
                ctx.luckysheetCellUpdate = [row_index, col_index];
                cache.overwriteCell = true;
                handleFormulaInput(ctx, fxInput, cellInput, kcode);
            }
        }
    }
    if (cellInput !== document.activeElement) {
        cellInput === null || cellInput === void 0 ? void 0 : cellInput.focus();
    }
    e.stopPropagation();
}
