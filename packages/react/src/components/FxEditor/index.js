import { locale, getFlowdata, cancelNormalSelected, getCellValue, updateCell, getInlineStringNoStyle, isInlineStringCell, escapeScriptTag, moveHighlightCell, handleFormulaInput, rangeHightlightselected, valueShowEs, isShowHidenCR, escapeHTMLTag, isAllowEdit, } from "@evidential-fortune-sheet/core";
import React, { useContext, useState, useCallback, useEffect, useRef, useMemo, } from "react";
import "./index.css";
import _ from "lodash";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import ContentEditable from "../SheetOverlay/ContentEditable";
import FormulaSearch from "../SheetOverlay/FormulaSearch";
import FormulaHint from "../SheetOverlay/FormulaHint";
import NameBox from "./NameBox";
import usePrevious from "../../hooks/usePrevious";
var FxEditor = function () {
    var _a;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var _c = useState(false), focused = _c[0], setFocused = _c[1];
    var lastKeyDownEventRef = useRef();
    var inputContainerRef = useRef(null);
    var _d = useState(false), isHidenRC = _d[0], setIsHidenRC = _d[1];
    var firstSelection = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[0];
    var prevFirstSelection = usePrevious(firstSelection);
    var prevSheetId = usePrevious(context.currentSheetId);
    var recentText = useRef("");
    var info = locale(context).info;
    useEffect(function () {
        var _a;
        setIsHidenRC(isShowHidenCR(context));
        if (_.isEqual(prevFirstSelection, firstSelection) &&
            context.currentSheetId === prevSheetId) {
            return;
        }
        var d = getFlowdata(context);
        var value = "";
        if (firstSelection) {
            var r = firstSelection.row_focus;
            var c = firstSelection.column_focus;
            if (_.isNil(r) || _.isNil(c))
                return;
            var cell = (_a = d === null || d === void 0 ? void 0 : d[r]) === null || _a === void 0 ? void 0 : _a[c];
            if (cell) {
                if (isInlineStringCell(cell)) {
                    value = getInlineStringNoStyle(r, c, d);
                }
                else if (cell.f) {
                    value = getCellValue(r, c, d, "f");
                }
                else {
                    value = valueShowEs(r, c, d);
                }
            }
            refs.fxInput.current.innerHTML = escapeHTMLTag(escapeScriptTag(value));
        }
        else {
            refs.fxInput.current.innerHTML = "";
        }
    }, [
        context.luckysheetfile,
        context.currentSheetId,
        context.luckysheet_select_save,
    ]);
    var onFocus = useCallback(function () {
        var _a, _b;
        if (context.allowEdit === false) {
            return;
        }
        if (((_b = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0 &&
            !context.luckysheet_cell_selected_move &&
            isAllowEdit(context, context.luckysheet_select_save)) {
            setFocused(true);
            setContext(function (draftCtx) {
                var last = draftCtx.luckysheet_select_save[draftCtx.luckysheet_select_save.length - 1];
                var row_index = last.row_focus;
                var col_index = last.column_focus;
                draftCtx.luckysheetCellUpdate = [row_index, col_index];
                refs.globalCache.doNotFocus = true;
            });
        }
    }, [
        context.config,
        context.luckysheet_select_save,
        context.luckysheetfile,
        context.currentSheetId,
        refs.globalCache,
        setContext,
    ]);
    var onKeyDown = useCallback(function (e) {
        if (context.allowEdit === false) {
            return;
        }
        lastKeyDownEventRef.current = new KeyboardEvent(e.type, e.nativeEvent);
        var key = e.key;
        recentText.current = refs.fxInput.current.innerText;
        if (key === "ArrowLeft" || key === "ArrowRight") {
            e.stopPropagation();
        }
        setContext(function (draftCtx) {
            if (context.luckysheetCellUpdate.length > 0) {
                switch (key) {
                    case "Enter": {
                        var lastCellUpdate = _.clone(draftCtx.luckysheetCellUpdate);
                        updateCell(draftCtx, draftCtx.luckysheetCellUpdate[0], draftCtx.luckysheetCellUpdate[1], refs.fxInput.current);
                        draftCtx.luckysheet_select_save = [
                            {
                                row: [lastCellUpdate[0], lastCellUpdate[0]],
                                column: [lastCellUpdate[1], lastCellUpdate[1]],
                                row_focus: lastCellUpdate[0],
                                column_focus: lastCellUpdate[1],
                            },
                        ];
                        moveHighlightCell(draftCtx, "down", 1, "rangeOfSelect");
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    }
                    case "Escape": {
                        cancelNormalSelected(draftCtx);
                        moveHighlightCell(draftCtx, "down", 0, "rangeOfSelect");
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    }
                    case "ArrowLeft": {
                        rangeHightlightselected(draftCtx, refs.fxInput.current);
                        break;
                    }
                    case "ArrowRight": {
                        rangeHightlightselected(draftCtx, refs.fxInput.current);
                        break;
                    }
                    default:
                        break;
                }
            }
        });
    }, [
        context.allowEdit,
        context.luckysheetCellUpdate.length,
        refs.fxInput,
        setContext,
    ]);
    var onChange = useCallback(function () {
        var e = lastKeyDownEventRef.current;
        if (!e)
            return;
        var kcode = e.keyCode;
        if (!kcode)
            return;
        if (!((kcode >= 112 && kcode <= 123) ||
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
            (e.ctrlKey && kcode === 86)) {
            setContext(function (draftCtx) {
                handleFormulaInput(draftCtx, refs.cellInput.current, refs.fxInput.current, kcode, recentText.current);
            });
        }
    }, [refs.cellInput, refs.fxInput, setContext]);
    var allowEdit = useMemo(function () {
        if (context.allowEdit === false) {
            return false;
        }
        if (isHidenRC) {
            return false;
        }
        if (!isAllowEdit(context, context.luckysheet_select_save)) {
            return false;
        }
        return true;
    }, [
        context.config,
        context.luckysheet_select_save,
        context.luckysheetfile,
        context.currentSheetId,
        isHidenRC,
    ]);
    return (React.createElement("aside", null,
        React.createElement("div", { className: "fortune-fx-editor" },
            React.createElement(NameBox, null),
            React.createElement("div", { className: "fortune-fx-icon" },
                React.createElement(SVGIcon, { name: "fx", width: 18, height: 18 })),
            React.createElement("div", { ref: inputContainerRef, className: "fortune-fx-input-container" },
                React.createElement(ContentEditable, { innerRef: function (e) {
                        refs.fxInput.current = e;
                    }, className: "fortune-fx-input", role: "textbox", id: "luckysheet-functionbox-cell", "aria-label": info.currentCellInput, onFocus: onFocus, onKeyDown: onKeyDown, onChange: onChange, onBlur: function () { return setFocused(false); }, tabIndex: 0, allowEdit: allowEdit }),
                focused && (React.createElement(React.Fragment, null,
                    React.createElement(FormulaSearch, { style: {
                            top: inputContainerRef.current.clientHeight,
                        } }),
                    React.createElement(FormulaHint, { style: {
                            top: inputContainerRef.current.clientHeight,
                        } })))))));
};
export default FxEditor;
