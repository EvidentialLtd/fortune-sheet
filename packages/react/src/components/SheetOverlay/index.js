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
import React, { useContext, useCallback, useRef, useEffect, useLayoutEffect, useMemo, useState, } from "react";
import "./index.css";
import { getRangetxt, locale, drawArrow, handleCellAreaDoubleClick, handleCellAreaMouseDown, handleContextMenu, handleOverlayMouseMove, handleOverlayMouseUp, selectAll, handleOverlayTouchEnd, handleOverlayTouchMove, handleOverlayTouchStart, createDropCellRange, getCellRowColumn, getCellHyperlink, showLinkCard, onCellsMoveStart, insertRowCol, getSheetIndex, fixRowStyleOverflowInFreeze, fixColumnStyleOverflowInFreeze, handleKeydownForZoom, api, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import ColumnHeader from "./ColumnHeader";
import RowHeader from "./RowHeader";
import InputBox from "./InputBox";
import ScrollBar from "./ScrollBar";
import SearchReplace from "../SearchReplace";
import LinkEditCard from "../LinkEidtCard";
import FilterOptions from "../FilterOption";
import { useAlert } from "../../hooks/useAlert";
import ImgBoxs from "../ImgBoxs";
import NotationBoxes from "../NotationBoxes";
import RangeDialog from "../DataVerification/RangeDialog";
import { useDialog } from "../../hooks/useDialog";
import SVGIcon from "../SVGIcon";
import DropDownList from "../DataVerification/DropdownList";
var SheetOverlay = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var _o = useContext(WorkbookContext), context = _o.context, setContext = _o.setContext, settings = _o.settings, refs = _o.refs;
    var _p = locale(context), info = _p.info, rightclick = _p.rightclick;
    var showDialog = useDialog().showDialog;
    var containerRef = useRef(null);
    var bottomAddRowInputRef = useRef(null);
    var dataVerificationHintBoxRef = useRef(null);
    var _q = useState(""), lastRangeText = _q[0], setLastRangeText = _q[1];
    var _r = useState(""), lastCellValue = _r[0], setLastCellValue = _r[1];
    var showAlert = useAlert().showAlert;
    var cellAreaMouseDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        if (e.button !== 2) {
            setContext(function (draftCtx) {
                var _a;
                handleCellAreaMouseDown(draftCtx, refs.globalCache, nativeEvent, refs.cellInput.current, refs.cellArea.current, refs.fxInput.current, refs.canvas.current.getContext("2d"));
                if (!_.isEmpty((_a = draftCtx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[0]) &&
                    refs.cellInput.current) {
                    setTimeout(function () {
                        var _a;
                        (_a = refs.cellInput.current) === null || _a === void 0 ? void 0 : _a.focus();
                    });
                }
            });
        }
    }, [
        setContext,
        refs.globalCache,
        refs.cellInput,
        refs.cellArea,
        refs.fxInput,
        refs.canvas,
    ]);
    var cellAreaContextMenu = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleContextMenu(draftCtx, settings, nativeEvent, refs.workbookContainer.current, refs.cellArea.current, "cell");
        });
    }, [refs.workbookContainer, setContext, settings, refs.cellArea]);
    var cellAreaDoubleClick = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleCellAreaDoubleClick(draftCtx, refs.globalCache, settings, nativeEvent, refs.cellArea.current);
        });
    }, [refs.cellArea, refs.globalCache, setContext, settings]);
    var onLeftTopClick = useCallback(function () {
        setContext(function (draftCtx) {
            selectAll(draftCtx);
        });
    }, [setContext]);
    var debouncedShowLinkCard = useMemo(function () {
        return _.debounce(function (globalCache, r, c, isEditing, skip) {
            var _a;
            if (skip === void 0) { skip = false; }
            if (skip || ((_a = globalCache.linkCard) === null || _a === void 0 ? void 0 : _a.mouseEnter))
                return;
            setContext(function (draftCtx) {
                showLinkCard(draftCtx, r, c, isEditing);
            });
        }, 800);
    }, [setContext]);
    var overShowLinkCard = useCallback(function (ctx, globalCache, e, container, scrollX, scrollY) {
        var rc = getCellRowColumn(ctx, e, container, scrollX, scrollY);
        if (rc == null)
            return;
        var link = getCellHyperlink(ctx, rc.r, rc.c);
        if (link == null) {
            debouncedShowLinkCard(globalCache, rc.r, rc.c, false);
        }
        else {
            showLinkCard(ctx, rc.r, rc.c, false);
            debouncedShowLinkCard(globalCache, rc.r, rc.c, false, true);
        }
    }, [debouncedShowLinkCard]);
    var onMouseMove = useCallback(function (nativeEvent) {
        setContext(function (draftCtx) {
            overShowLinkCard(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.scrollbarX.current, refs.scrollbarY.current);
            handleOverlayMouseMove(draftCtx, refs.globalCache, nativeEvent, refs.cellInput.current, refs.scrollbarX.current, refs.scrollbarY.current, containerRef.current, refs.fxInput.current);
        });
    }, [
        overShowLinkCard,
        refs.cellInput,
        refs.fxInput,
        refs.globalCache,
        refs.scrollbarX,
        refs.scrollbarY,
        setContext,
    ]);
    var onMouseUp = useCallback(function (nativeEvent) {
        setContext(function (draftCtx) {
            try {
                handleOverlayMouseUp(draftCtx, refs.globalCache, settings, nativeEvent, refs.scrollbarX.current, refs.scrollbarY.current, containerRef.current, refs.cellInput.current, refs.fxInput.current);
            }
            catch (e) {
                showAlert(e.message);
            }
        });
    }, [
        refs.cellInput,
        refs.fxInput,
        refs.globalCache,
        refs.scrollbarX,
        refs.scrollbarY,
        setContext,
        settings,
        showAlert,
    ]);
    var onKeyDownForZoom = useCallback(function (ev) {
        var newZoom = handleKeydownForZoom(ev, context.zoomRatio);
        if (newZoom !== context.zoomRatio) {
            setContext(function (ctx) {
                ctx.zoomRatio = newZoom;
                ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)].zoomRatio = newZoom;
            });
        }
    }, [context.zoomRatio, setContext]);
    var onTouchStart = useCallback(function (e) {
        if (context.touchMode === 'select') {
            e.stopPropagation();
            simulatMouseFromTouch(e, 'mousedown');
            return;
        }
        var nativeEvent = e.nativeEvent;
        setContext(function (draftContext) {
            handleOverlayTouchStart(draftContext, nativeEvent, refs.globalCache);
        });
        e.stopPropagation();
    }, [context.touchMode, refs.globalCache, setContext]);
    var simulatMouseFromTouch = function (e, type) {
        var touch = e.touches[0] || e.changedTouches[0];
        if (!touch)
            return;
        var simulatedEvent = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        touch.target.dispatchEvent(simulatedEvent);
    };
    var onTouchMove = useCallback(function (e) {
        if (context.touchMode === 'select') {
            e.stopPropagation();
            simulatMouseFromTouch(e, 'mousemove');
            return;
        }
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleOverlayTouchMove(draftCtx, nativeEvent, refs.globalCache, refs.scrollbarX.current, refs.scrollbarY.current);
        });
    }, [context.touchMode, refs.globalCache, refs.scrollbarX, refs.scrollbarY, setContext]);
    var onTouchEnd = useCallback(function (e) {
        if (context.touchMode === 'select') {
            e.stopPropagation();
            simulatMouseFromTouch(e, 'mouseup');
            return;
        }
        handleOverlayTouchEnd(refs.globalCache);
    }, [context.touchMode, refs.globalCache]);
    var handleBottomAddRow = useCallback(function () {
        var _a;
        var valueStr = ((_a = bottomAddRowInputRef.current) === null || _a === void 0 ? void 0 : _a.value) || context.addDefaultRows.toString();
        var value = parseInt(valueStr, 10);
        if (Number.isNaN(value)) {
            return;
        }
        if (value < 1) {
            return;
        }
        var insertRowColOp = {
            type: "row",
            index: context.luckysheetfile[getSheetIndex(context, context.currentSheetId)].data.length - 1,
            count: value,
            direction: "rightbottom",
            id: context.currentSheetId,
        };
        setContext(function (draftCtx) {
            try {
                insertRowCol(draftCtx, insertRowColOp, false);
            }
            catch (err) {
                if (err.message === "maxExceeded")
                    showAlert(rightclick.rowOverLimit);
            }
        }, { insertRowColOp: insertRowColOp });
    }, [context, rightclick.rowOverLimit, setContext, showAlert]);
    useEffect(function () {
        setContext(function (draftCtx) {
            var _a;
            var sheetIndex = getSheetIndex(draftCtx, draftCtx.currentSheetId);
            if (sheetIndex === undefined || sheetIndex === null)
                return;
            var currentSheet = draftCtx.luckysheetfile[sheetIndex];
            if (!((_a = currentSheet.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length)) {
                api.setSelection(draftCtx, [{ row: [0], column: [0] }], {});
            }
        });
    }, [context.currentSheetId, setContext]);
    useEffect(function () {
        if (context.warnDialog) {
            setTimeout(function () {
                showDialog(context.warnDialog, "ok");
            }, 240);
        }
    }, [context.warnDialog]);
    useEffect(function () {
        refs.cellArea.current.scrollLeft = context.scrollLeft;
        refs.cellArea.current.scrollTop = context.scrollTop;
    }, [
        context.scrollLeft,
        context.scrollTop,
        refs.cellArea,
        (_a = refs.cellArea.current) === null || _a === void 0 ? void 0 : _a.scrollLeft,
        (_b = refs.cellArea.current) === null || _b === void 0 ? void 0 : _b.scrollTop,
    ]);
    useLayoutEffect(function () {
        var _a;
        if (context.commentBoxes ||
            context.hoveredCommentBox ||
            context.editingCommentBox) {
            _.concat((_a = context.commentBoxes) === null || _a === void 0 ? void 0 : _a.filter(function (v) { var _a; return v.rc !== ((_a = context.editingCommentBox) === null || _a === void 0 ? void 0 : _a.rc); }), [context.hoveredCommentBox, context.editingCommentBox]).forEach(function (box) {
                if (box) {
                    drawArrow(box.rc, box.size);
                }
            });
        }
    }, [
        context.commentBoxes,
        context.hoveredCommentBox,
        context.editingCommentBox,
    ]);
    useEffect(function () {
        document.addEventListener("mousemove", onMouseMove);
        return function () {
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [onMouseMove]);
    useEffect(function () {
        document.addEventListener("mouseup", onMouseUp);
        return function () {
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseUp]);
    useEffect(function () {
        document.addEventListener("keydown", onKeyDownForZoom);
        return function () {
            document.removeEventListener("keydown", onKeyDownForZoom);
        };
    }, [onKeyDownForZoom]);
    var rangeText = useMemo(function () {
        var lastSelection = _.last(context.luckysheet_select_save);
        if (!(lastSelection &&
            lastSelection.row_focus != null &&
            lastSelection.column_focus != null))
            return "";
        var rf = lastSelection.row_focus;
        var cf = lastSelection.column_focus;
        if (context.config.merge != null && "".concat(rf, "_").concat(cf) in context.config.merge) {
            return getRangetxt(context, context.currentSheetId, {
                column: [cf, cf],
                row: [rf, rf],
            });
        }
        var rawRangeTxt = getRangetxt(context, context.currentSheetId, lastSelection);
        return rawRangeTxt.replace(/([A-Z]+)(\d+)/g, "$1. $2");
    }, [context.currentSheetId, context.luckysheet_select_save]);
    var cellValue = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (((_b = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0) {
            var selection = (_c = context.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c[context.luckysheet_select_save.length - 1];
            if (!selection)
                return "";
            var sheetIndex = getSheetIndex(context, context.currentSheetId);
            if (sheetIndex === undefined || sheetIndex === null)
                return "";
            var rowFocus = (_d = selection.row_focus) !== null && _d !== void 0 ? _d : 0;
            var columnFocus = (_e = selection.column_focus) !== null && _e !== void 0 ? _e : 0;
            var cellVal = ((_j = (_h = (_g = (_f = context.luckysheetfile[sheetIndex]) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g[rowFocus]) === null || _h === void 0 ? void 0 : _h[columnFocus]) === null || _j === void 0 ? void 0 : _j.m) || "";
            return cellVal;
        }
        return "";
    };
    var computedCellValue = cellValue();
    useEffect(function () {
        if (context.sheetFocused) {
            setLastRangeText(String(rangeText));
            setLastCellValue(String(cellValue()));
        }
    }, [context.sheetFocused]);
    return (React.createElement("main", { className: "fortune-sheet-overlay", ref: containerRef, onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, tabIndex: -1, style: {
            width: context.luckysheetTableContentHW[0],
            height: context.luckysheetTableContentHW[1],
        } },
        React.createElement("div", { className: "fortune-col-header-wrap" },
            React.createElement("div", { className: "fortune-left-top", onClick: onLeftTopClick, tabIndex: 0, style: {
                    width: context.rowHeaderWidth - 1.5,
                    height: context.columnHeaderHeight - 1.5,
                } }),
            React.createElement(ColumnHeader, null)),
        (context.showSearch || context.showReplace) && (React.createElement(SearchReplace, { getContainer: function () { return containerRef.current; } })),
        React.createElement("div", { className: "fortune-row-body" },
            React.createElement(RowHeader, null),
            React.createElement(ScrollBar, { axis: "x" }),
            React.createElement(ScrollBar, { axis: "y" }),
            React.createElement("div", { ref: refs.cellArea, className: "fortune-cell-area", onMouseDown: cellAreaMouseDown, onDoubleClick: cellAreaDoubleClick, onContextMenu: cellAreaContextMenu, style: {
                    width: context.cellmainWidth,
                    height: context.cellmainHeight,
                    cursor: context.luckysheet_cell_selected_extend
                        ? "crosshair"
                        : "default",
                } },
                React.createElement("div", { id: "fortune-formula-functionrange" }),
                context.formulaRangeSelect && (React.createElement("div", { className: "fortune-selection-copy fortune-formula-functionrange-select", style: context.formulaRangeSelect },
                    React.createElement("div", { className: "fortune-selection-copy-top fortune-copy" }),
                    React.createElement("div", { className: "fortune-selection-copy-right fortune-copy" }),
                    React.createElement("div", { className: "fortune-selection-copy-bottom fortune-copy" }),
                    React.createElement("div", { className: "fortune-selection-copy-left fortune-copy" }),
                    React.createElement("div", { className: "fortune-selection-copy-hc" }))),
                context.formulaRangeHighlight.map(function (v) {
                    var rangeIndex = v.rangeIndex, backgroundColor = v.backgroundColor;
                    return (React.createElement("div", { key: rangeIndex, id: "fortune-formula-functionrange-highlight", className: "fortune-selection-highlight fortune-formula-functionrange-highlight", style: _.omit(v, "backgroundColor") },
                        ["top", "right", "bottom", "left"].map(function (d) { return (React.createElement("div", { key: d, "data-type": d, className: "fortune-selection-copy-".concat(d, " fortune-copy"), style: { backgroundColor: backgroundColor } })); }),
                        React.createElement("div", { className: "fortune-selection-copy-hc", style: { backgroundColor: backgroundColor } }),
                        ["lt", "rt", "lb", "rb"].map(function (d) { return (React.createElement("div", { key: d, "data-type": d, className: "fortune-selection-highlight-".concat(d, " luckysheet-highlight"), style: { backgroundColor: backgroundColor } })); })));
                }),
                React.createElement("div", { className: "luckysheet-row-count-show luckysheet-count-show", id: "luckysheet-row-count-show" }),
                React.createElement("div", { className: "luckysheet-column-count-show luckysheet-count-show", id: "luckysheet-column-count-show" }),
                React.createElement("div", { className: "fortune-change-size-line", hidden: !context.luckysheet_cols_change_size &&
                        !context.luckysheet_rows_change_size &&
                        !context.luckysheet_cols_freeze_drag &&
                        !context.luckysheet_rows_freeze_drag }),
                React.createElement("div", { className: "fortune-freeze-drag-line", hidden: !context.luckysheet_cols_freeze_drag &&
                        !context.luckysheet_rows_freeze_drag }),
                React.createElement("div", { className: "luckysheet-cell-selected-focus", style: ((_d = (_c = context.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0
                        ? (function () {
                            var _a, _b;
                            var selection = _.last(context.luckysheet_select_save);
                            return _.assign({
                                left: selection.left,
                                top: selection.top,
                                width: selection.width,
                                height: selection.height,
                                display: "block",
                            }, fixRowStyleOverflowInFreeze(context, selection.row_focus || 0, selection.row_focus || 0, (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[context.currentSheetId]), fixColumnStyleOverflowInFreeze(context, selection.column_focus || 0, selection.column_focus || 0, (_b = refs.globalCache.freezen) === null || _b === void 0 ? void 0 : _b[context.currentSheetId]));
                        })()
                        : {}, onMouseDown: function (e) { return e.preventDefault(); } }),
                ((_f = (_e = context.luckysheet_selection_range) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) > 0 && (React.createElement("div", { id: "fortune-selection-copy" }, context.luckysheet_selection_range.map(function (range) {
                    var r1 = range.row[0];
                    var r2 = range.row[1];
                    var c1 = range.column[0];
                    var c2 = range.column[1];
                    var row = context.visibledatarow[r2];
                    var row_pre = r1 - 1 === -1 ? 0 : context.visibledatarow[r1 - 1];
                    var col = context.visibledatacolumn[c2];
                    var col_pre = c1 - 1 === -1 ? 0 : context.visibledatacolumn[c1 - 1];
                    return (React.createElement("div", { className: "fortune-selection-copy", key: "".concat(r1, "-").concat(r2, "-").concat(c1, "-").concat(c2), style: {
                            left: col_pre,
                            width: col - col_pre - 1,
                            top: row_pre,
                            height: row - row_pre - 1,
                        } },
                        React.createElement("div", { className: "fortune-selection-copy-top fortune-copy" }),
                        React.createElement("div", { className: "fortune-selection-copy-right fortune-copy" }),
                        React.createElement("div", { className: "fortune-selection-copy-bottom fortune-copy" }),
                        React.createElement("div", { className: "fortune-selection-copy-left fortune-copy" }),
                        React.createElement("div", { className: "fortune-selection-copy-hc" })));
                }))),
                React.createElement("div", { id: "luckysheet-chart-rangeShow" }),
                React.createElement("div", { className: "fortune-cell-selected-extend" }),
                React.createElement("div", { className: "fortune-cell-selected-move", id: "fortune-cell-selected-move", onMouseDown: function (e) { return e.preventDefault(); } }),
                ((_h = (_g = context.luckysheet_select_save) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0) > 0 && (React.createElement("div", { id: "luckysheet-cell-selected-boxs" }, context.luckysheet_select_save.map(function (selection, index) {
                    var _a, _b;
                    return (React.createElement("div", { key: index, id: "luckysheet-cell-selected", className: "luckysheet-cell-selected", style: _.assign({
                            left: selection.left_move,
                            top: selection.top_move,
                            width: selection.width_move,
                            height: selection.height_move,
                            display: "block",
                        }, fixRowStyleOverflowInFreeze(context, selection.row[0], selection.row[1], (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[context.currentSheetId]), fixColumnStyleOverflowInFreeze(context, selection.column[0], selection.column[1], (_b = refs.globalCache.freezen) === null || _b === void 0 ? void 0 : _b[context.currentSheetId])), onMouseDown: function (e) {
                            e.stopPropagation();
                            var nativeEvent = e.nativeEvent;
                            setContext(function (draftCtx) {
                                onCellsMoveStart(draftCtx, refs.globalCache, nativeEvent, refs.scrollbarX.current, refs.scrollbarY.current, containerRef.current);
                            });
                        } },
                        React.createElement("div", { className: "luckysheet-cs-inner-border" }),
                        React.createElement("div", { className: "luckysheet-cs-fillhandle", onMouseDown: function (e) {
                                var nativeEvent = e.nativeEvent;
                                setContext(function (draftContext) {
                                    createDropCellRange(draftContext, nativeEvent, containerRef.current);
                                });
                                e.stopPropagation();
                            } }),
                        React.createElement("div", { className: "luckysheet-cs-inner-border" }),
                        React.createElement("div", { className: "luckysheet-cs-draghandle-top luckysheet-cs-draghandle", onMouseDown: function (e) { return e.preventDefault(); } }),
                        React.createElement("div", { className: "luckysheet-cs-draghandle-bottom luckysheet-cs-draghandle", onMouseDown: function (e) { return e.preventDefault(); } }),
                        React.createElement("div", { className: "luckysheet-cs-draghandle-left luckysheet-cs-draghandle", onMouseDown: function (e) { return e.preventDefault(); } }),
                        React.createElement("div", { className: "luckysheet-cs-draghandle-right luckysheet-cs-draghandle", onMouseDown: function (e) { return e.preventDefault(); } }),
                        React.createElement("div", { className: "luckysheet-cs-touchhandle luckysheet-cs-touchhandle-lt" },
                            React.createElement("div", { className: "luckysheet-cs-touchhandle-btn" })),
                        React.createElement("div", { className: "luckysheet-cs-touchhandle luckysheet-cs-touchhandle-rb" },
                            React.createElement("div", { className: "luckysheet-cs-touchhandle-btn" }))));
                }))),
                ((_k = (_j = context.presences) === null || _j === void 0 ? void 0 : _j.length) !== null && _k !== void 0 ? _k : 0) > 0 &&
                    context.presences.map(function (presence, index) {
                        if (presence.sheetId !== context.currentSheetId) {
                            return null;
                        }
                        var _a = presence.selection, r = _a.r, c = _a.c, color = presence.color;
                        var row_pre = r - 1 === -1 ? 0 : context.visibledatarow[r - 1];
                        var col_pre = c - 1 === -1 ? 0 : context.visibledatacolumn[c - 1];
                        var row = context.visibledatarow[r];
                        var col = context.visibledatacolumn[c];
                        var width = col - col_pre - 1;
                        var height = row - row_pre - 1;
                        var usernameStyle = {
                            maxWidth: width + 1,
                            backgroundColor: color,
                        };
                        _.set(usernameStyle, r === 0 ? "top" : "bottom", height);
                        return (React.createElement("div", { key: (presence === null || presence === void 0 ? void 0 : presence.userId) || index, className: "fortune-presence-selection", style: {
                                left: col_pre,
                                top: row_pre - 2,
                                width: width,
                                height: height,
                                borderColor: color,
                                borderWidth: 1,
                            } },
                            React.createElement("div", { className: "fortune-presence-username", style: usernameStyle }, presence.username)));
                    }),
                ((_l = context.linkCard) === null || _l === void 0 ? void 0 : _l.sheetId) === context.currentSheetId && (React.createElement(LinkEditCard, __assign({}, context.linkCard))),
                ((_m = context.rangeDialog) === null || _m === void 0 ? void 0 : _m.show) && React.createElement(RangeDialog, null),
                React.createElement(FilterOptions, { getContainer: function () { return containerRef.current; } }),
                React.createElement(InputBox, null),
                React.createElement(NotationBoxes, null),
                React.createElement("div", { id: "luckysheet-multipleRange-show" }),
                React.createElement("div", { id: "luckysheet-dynamicArray-hightShow" }),
                React.createElement(ImgBoxs, null),
                React.createElement("div", { id: "luckysheet-dataVerification-dropdown-btn", onClick: function () {
                        setContext(function (ctx) {
                            ctx.dataVerificationDropDownList = true;
                            dataVerificationHintBoxRef.current.style.display = "none";
                        });
                    }, tabIndex: 0, style: { display: "none" } },
                    React.createElement(SVGIcon, { name: "combo-arrow", width: 16 })),
                context.dataVerificationDropDownList && React.createElement(DropDownList, null),
                React.createElement("div", { id: "luckysheet-dataVerification-showHintBox", className: "luckysheet-mousedown-cancel", ref: dataVerificationHintBoxRef }),
                React.createElement("div", { className: "luckysheet-cell-copy" }),
                React.createElement("div", { className: "luckysheet-grdblkflowpush" }),
                React.createElement("div", { id: "luckysheet-cell-flow_0", className: "luckysheet-cell-flow luckysheetsheetchange" },
                    React.createElement("div", { className: "luckysheet-cell-flow-clip" },
                        React.createElement("div", { className: "luckysheet-grdblkpush" }),
                        React.createElement("div", { id: "luckysheetcoltable_0", className: "luckysheet-cell-flow-col" },
                            React.createElement("div", { id: "luckysheet-sheettable_0", className: "luckysheet-cell-sheettable", style: {
                                    height: context.rh_height,
                                    width: context.ch_width,
                                } }),
                            React.createElement("div", { id: "luckysheet-bottom-controll-row", className: "luckysheet-bottom-controll-row", onMouseDown: function (e) { return e.stopPropagation(); }, onMouseUp: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) { return e.stopPropagation(); }, onKeyUp: function (e) { return e.stopPropagation(); }, onKeyPress: function (e) { return e.stopPropagation(); }, onClick: function (e) { return e.stopPropagation(); }, onDoubleClick: function (e) { return e.stopPropagation(); }, tabIndex: 0, style: {
                                    left: context.scrollLeft,
                                    display: context.allowEdit ? "block" : "none",
                                } },
                                React.createElement("div", { className: "fortune-add-row-button", onClick: function () {
                                        handleBottomAddRow();
                                    }, tabIndex: 0 }, info.add),
                                React.createElement("input", { ref: bottomAddRowInputRef, type: "text", style: { width: 50 }, placeholder: context.addDefaultRows.toString() }),
                                " ",
                                React.createElement("span", { style: { fontSize: 14 } }, info.row),
                                " ",
                                React.createElement("span", { style: { fontSize: 14, color: "#9c9c9c" } },
                                    "(",
                                    info.addLast,
                                    ")"),
                                React.createElement("span", { className: "fortune-add-row-button", onClick: function () {
                                        setContext(function (ctx) {
                                            ctx.scrollTop = 0;
                                        });
                                    }, tabIndex: 0 }, info.backTop))))))),
        React.createElement("div", { id: "sr-selection", className: "sr-only", role: "alert" }, !rangeText.includes("NaN")
            ? "".concat(rangeText, " ").concat(computedCellValue)
            : "A1. ".concat(info.sheetSrIntro)),
        React.createElement("div", { id: "sr-sheetFocus", className: "sr-only", role: "alert" }, context.sheetFocused
            ? "".concat(lastRangeText, " ").concat(lastCellValue ? "".concat(lastCellValue, ".") : "", " ").concat(info.sheetIsFocused)
            : "Toolbar. ".concat(info.sheetNotFocused))));
};
export default SheetOverlay;
