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
import { cancelNormalSelected, getCellValue, getInlineStringHTML, getStyleByCell, isInlineStringCell, moveToEnd, getFlowdata, handleFormulaInput, moveHighlightCell, escapeScriptTag, valueShowEs, createRangeHightlight, isShowHidenCR, israngeseleciton, escapeHTMLTag, isAllowEdit, getrangeseleciton, } from "@evidential-fortune-sheet/core";
import React, { useContext, useEffect, useMemo, useRef, useCallback, useLayoutEffect, useState, } from "react";
import _ from "lodash";
import WorkbookContext from "../../context";
import ContentEditable from "./ContentEditable";
import FormulaSearch from "./FormulaSearch";
import FormulaHint from "./FormulaHint";
import usePrevious from "../../hooks/usePrevious";
var InputBox = function () {
    var _a, _b;
    var _c = useContext(WorkbookContext), context = _c.context, setContext = _c.setContext, refs = _c.refs;
    var inputRef = useRef(null);
    var lastKeyDownEventRef = useRef();
    var prevCellUpdate = usePrevious(context.luckysheetCellUpdate);
    var prevSheetId = usePrevious(context.currentSheetId);
    var _d = useState(false), isHidenRC = _d[0], setIsHidenRC = _d[1];
    var firstSelection = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[0];
    var row_index = firstSelection === null || firstSelection === void 0 ? void 0 : firstSelection.row_focus;
    var col_index = firstSelection === null || firstSelection === void 0 ? void 0 : firstSelection.column_focus;
    var preText = useRef("");
    var inputBoxStyle = useMemo(function () {
        if (firstSelection && context.luckysheetCellUpdate.length > 0) {
            var flowdata = getFlowdata(context);
            if (!flowdata)
                return {};
            return getStyleByCell(context, flowdata, firstSelection.row_focus, firstSelection.column_focus);
        }
        return {};
    }, [
        context.luckysheetfile,
        context.currentSheetId,
        context.luckysheetCellUpdate,
        firstSelection,
    ]);
    useLayoutEffect(function () {
        var _a;
        if (!context.allowEdit) {
            setContext(function (ctx) {
                var flowdata = getFlowdata(ctx);
                if (!_.isNil(flowdata) && ctx.forceFormulaRef) {
                    var value = getCellValue(row_index, col_index, flowdata, "f");
                    createRangeHightlight(ctx, value);
                }
            });
        }
        if (firstSelection && context.luckysheetCellUpdate.length > 0) {
            if (refs.globalCache.doNotUpdateCell) {
                delete refs.globalCache.doNotUpdateCell;
                return;
            }
            if (_.isEqual(prevCellUpdate, context.luckysheetCellUpdate) &&
                prevSheetId === context.currentSheetId) {
                return;
            }
            var flowdata = getFlowdata(context);
            var cell = (_a = flowdata === null || flowdata === void 0 ? void 0 : flowdata[row_index]) === null || _a === void 0 ? void 0 : _a[col_index];
            var value_1 = "";
            if (cell && !refs.globalCache.overwriteCell) {
                if (isInlineStringCell(cell)) {
                    value_1 = getInlineStringHTML(row_index, col_index, flowdata);
                }
                else if (cell.f) {
                    value_1 = getCellValue(row_index, col_index, flowdata, "f");
                    setContext(function (ctx) {
                        createRangeHightlight(ctx, value_1);
                    });
                }
                else {
                    value_1 = valueShowEs(row_index, col_index, flowdata);
                    if (Number(cell.qp) === 1) {
                        value_1 = value_1 ? "".concat(value_1) : value_1;
                    }
                }
            }
            refs.globalCache.overwriteCell = false;
            if (!refs.globalCache.ignoreWriteCell)
                inputRef.current.innerHTML = escapeHTMLTag(escapeScriptTag(value_1));
            refs.globalCache.ignoreWriteCell = false;
            if (!refs.globalCache.doNotFocus) {
                setTimeout(function () {
                    moveToEnd(inputRef.current);
                });
            }
            delete refs.globalCache.doNotFocus;
        }
    }, [
        context.luckysheetCellUpdate,
        context.luckysheetfile,
        context.currentSheetId,
        firstSelection,
    ]);
    useEffect(function () {
        if (_.isEmpty(context.luckysheetCellUpdate)) {
            if (inputRef.current) {
                inputRef.current.innerHTML = "";
            }
        }
    }, [context.luckysheetCellUpdate]);
    useEffect(function () {
        setIsHidenRC(isShowHidenCR(context));
    }, [context.luckysheet_select_save]);
    var getActiveFormula = useCallback(function () { return document.querySelector(".luckysheet-formula-search-item-active"); }, []);
    var clearSearchItemActiveClass = useCallback(function () {
        var activeFormula = getActiveFormula();
        if (activeFormula) {
            activeFormula.classList.remove("luckysheet-formula-search-item-active");
        }
    }, [getActiveFormula]);
    var selectActiveFormula = useCallback(function (e) {
        var _a;
        var activeFormula = getActiveFormula();
        var formulaNameDiv = activeFormula === null || activeFormula === void 0 ? void 0 : activeFormula.querySelector(".luckysheet-formula-search-func");
        if (formulaNameDiv) {
            var formulaName_1 = formulaNameDiv.textContent;
            var textEditor = document.getElementById("luckysheet-rich-text-editor");
            if (textEditor) {
                var searchTxt = ((_a = getrangeseleciton()) === null || _a === void 0 ? void 0 : _a.textContent) || "";
                var deleteCount = searchTxt.length;
                textEditor.focus();
                var selection = window.getSelection();
                if ((selection === null || selection === void 0 ? void 0 : selection.rangeCount) === 0)
                    return;
                var range = selection === null || selection === void 0 ? void 0 : selection.getRangeAt(0);
                if (deleteCount !== 0 && range) {
                    var startOffset = Math.max(range.startOffset - deleteCount, 0);
                    var endOffset = range.startOffset;
                    range.setStart(range.startContainer, startOffset);
                    range.setEnd(range.startContainer, endOffset);
                    range.deleteContents();
                }
                var functionStr = "<span dir=\"auto\" class=\"luckysheet-formula-text-func\">".concat(formulaName_1, "</span>");
                var lParStr = "<span dir=\"auto\" class=\"luckysheet-formula-text-lpar\">(</span>";
                var functionNode = new DOMParser().parseFromString(functionStr, "text/html").body.childNodes[0];
                var lParNode = new DOMParser().parseFromString(lParStr, "text/html")
                    .body.childNodes[0];
                if (range === null || range === void 0 ? void 0 : range.startContainer.parentNode) {
                    range === null || range === void 0 ? void 0 : range.setStart(range.startContainer.parentNode, 1);
                }
                range === null || range === void 0 ? void 0 : range.insertNode(lParNode);
                range === null || range === void 0 ? void 0 : range.insertNode(functionNode);
                range === null || range === void 0 ? void 0 : range.collapse();
                selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
                if (range)
                    selection === null || selection === void 0 ? void 0 : selection.addRange(range);
                setContext(function (draftCtx) {
                    draftCtx.functionCandidates = [];
                    draftCtx.functionHint = formulaName_1;
                });
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }, [getActiveFormula, setContext]);
    var onKeyDown = useCallback(function (e) {
        lastKeyDownEventRef.current = new KeyboardEvent(e.type, e.nativeEvent);
        preText.current = inputRef.current.innerText;
        if (e.key === "Escape" && context.luckysheetCellUpdate.length > 0) {
            setContext(function (draftCtx) {
                cancelNormalSelected(draftCtx);
                moveHighlightCell(draftCtx, "down", 0, "rangeOfSelect");
            });
            e.preventDefault();
        }
        else if (e.key === "Enter" && context.luckysheetCellUpdate.length > 0) {
            if (e.altKey || e.metaKey) {
                document.execCommand("insertHTML", false, "\n ");
                document.execCommand("delete", false);
                e.stopPropagation();
            }
            else
                selectActiveFormula(e);
        }
        else if (e.key === "Tab" && context.luckysheetCellUpdate.length > 0) {
            selectActiveFormula(e);
            e.preventDefault();
        }
        else if (e.key === "F4" && context.luckysheetCellUpdate.length > 0) {
            e.preventDefault();
        }
        else if (e.key === "ArrowUp" &&
            context.luckysheetCellUpdate.length > 0) {
            if (document.getElementById("luckysheet-formula-search-c")) {
                var formulaSearchContainer = document.getElementById("luckysheet-formula-search-c");
                var activeItem = formulaSearchContainer === null || formulaSearchContainer === void 0 ? void 0 : formulaSearchContainer.querySelector(".luckysheet-formula-search-item-active");
                var previousItem = activeItem
                    ? activeItem.previousElementSibling
                    : null;
                if (!previousItem) {
                    previousItem =
                        (formulaSearchContainer === null || formulaSearchContainer === void 0 ? void 0 : formulaSearchContainer.querySelector(".luckysheet-formula-search-item:last-child")) || null;
                }
                clearSearchItemActiveClass();
                if (previousItem) {
                    previousItem.classList.add("luckysheet-formula-search-item-active");
                }
            }
            e.preventDefault();
        }
        else if (e.key === "ArrowDown" &&
            context.luckysheetCellUpdate.length > 0) {
            if (document.getElementById("luckysheet-formula-search-c")) {
                var formulaSearchContainer = document.getElementById("luckysheet-formula-search-c");
                var activeItem = formulaSearchContainer === null || formulaSearchContainer === void 0 ? void 0 : formulaSearchContainer.querySelector(".luckysheet-formula-search-item-active");
                var nextItem = activeItem ? activeItem.nextElementSibling : null;
                if (!nextItem) {
                    nextItem =
                        (formulaSearchContainer === null || formulaSearchContainer === void 0 ? void 0 : formulaSearchContainer.querySelector(".luckysheet-formula-search-item:first-child")) || null;
                }
                clearSearchItemActiveClass();
                if (nextItem) {
                    nextItem.classList.add("luckysheet-formula-search-item-active");
                }
            }
            e.preventDefault();
        }
    }, [
        clearSearchItemActiveClass,
        context.luckysheetCellUpdate.length,
        selectActiveFormula,
        setContext,
    ]);
    var onChange = useCallback(function (__, isBlur) {
        var e = lastKeyDownEventRef.current;
        if (!e)
            return;
        var kcode = e.keyCode;
        if (!kcode)
            return;
        if (!(((kcode >= 112 && kcode <= 123) ||
            kcode <= 46 ||
            kcode === 144 ||
            kcode === 108 ||
            e.ctrlKey ||
            e.altKey ||
            (e.shiftKey &&
                (kcode === 37 || kcode === 38 || kcode === 39 || kcode === 40)))) ||
            kcode === 8 ||
            kcode === 32 ||
            kcode === 46 ||
            (e.ctrlKey && kcode === 86)) {
            setContext(function (draftCtx) {
                if ((draftCtx.formulaCache.rangestart ||
                    draftCtx.formulaCache.rangedrag_column_start ||
                    draftCtx.formulaCache.rangedrag_row_start ||
                    israngeseleciton(draftCtx)) &&
                    isBlur)
                    return;
                if (!isAllowEdit(draftCtx, draftCtx.luckysheet_select_save)) {
                    return;
                }
                handleFormulaInput(draftCtx, refs.fxInput.current, refs.cellInput.current, kcode, preText.current);
            });
        }
    }, [refs.cellInput, refs.fxInput, setContext]);
    var onPaste = useCallback(function (e) {
        if (_.isEmpty(context.luckysheetCellUpdate)) {
            e.preventDefault();
        }
    }, [context.luckysheetCellUpdate]);
    var cfg = context.config || {};
    var rowReadOnly = cfg.rowReadOnly || {};
    var colReadOnly = cfg.colReadOnly || {};
    var edit = !((colReadOnly[col_index] || rowReadOnly[row_index]) &&
        context.allowEdit === true);
    return (React.createElement("div", { className: "luckysheet-input-box", style: firstSelection && !((_b = context.rangeDialog) === null || _b === void 0 ? void 0 : _b.show)
            ? {
                left: firstSelection.left,
                top: firstSelection.top,
                zIndex: _.isEmpty(context.luckysheetCellUpdate) ? -1 : 19,
                display: "block",
            }
            : { left: -10000, top: -10000, display: "block" }, onMouseDown: function (e) { return e.stopPropagation(); }, onMouseUp: function (e) { return e.stopPropagation(); } },
        React.createElement("div", { className: "luckysheet-input-box-inner", style: firstSelection
                ? __assign({ minWidth: firstSelection.width, minHeight: firstSelection.height }, inputBoxStyle) : {} },
            React.createElement(ContentEditable, { innerRef: function (e) {
                    inputRef.current = e;
                    refs.cellInput.current = e;
                }, className: "luckysheet-cell-input", id: "luckysheet-rich-text-editor", style: {
                    transform: "scale(".concat(context.zoomRatio, ")"),
                    transformOrigin: "left top",
                    width: "".concat(100 / context.zoomRatio, "%"),
                    height: "".concat(100 / context.zoomRatio, "%"),
                }, onChange: onChange, onKeyDown: onKeyDown, onPaste: onPaste, allowEdit: edit ? !isHidenRC : edit })),
        document.activeElement === inputRef.current && (React.createElement(React.Fragment, null,
            React.createElement(FormulaSearch, { style: {
                    top: ((firstSelection === null || firstSelection === void 0 ? void 0 : firstSelection.height_move) || 0) + 4,
                } }),
            React.createElement(FormulaHint, { style: {
                    top: ((firstSelection === null || firstSelection === void 0 ? void 0 : firstSelection.height_move) || 0) + 4,
                } })))));
};
export default InputBox;
