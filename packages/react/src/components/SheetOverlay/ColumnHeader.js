import { colLocation, colLocationByIndex, selectTitlesMap, selectTitlesRange, handleColSizeHandleMouseDown, handleColumnHeaderMouseDown, handleContextMenu, isAllowEdit, getFlowdata, fixColumnStyleOverflowInFreeze, handleColFreezeHandleMouseDown, getSheetIndex, fixPositionOnFrozenCells, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import React, { useContext, useState, useRef, useCallback, useEffect, useMemo, } from "react";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
var ColumnHeader = function () {
    var _a;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, settings = _b.settings, refs = _b.refs;
    var containerRef = useRef(null);
    var colChangeSizeRef = useRef(null);
    var _c = useState({
        col: -1,
        col_pre: -1,
        col_index: -1,
    }), hoverLocation = _c[0], setHoverLocation = _c[1];
    var _d = useState(false), hoverInFreeze = _d[0], setHoverInFreeze = _d[1];
    var _e = useState([]), selectedLocation = _e[0], setSelectedLocation = _e[1];
    var allowEditRef = useRef(true);
    var sheetIndex = getSheetIndex(context, context.currentSheetId);
    var sheet = sheetIndex == null ? null : context.luckysheetfile[sheetIndex];
    var freezeHandleLeft = useMemo(function () {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _a === void 0 ? void 0 : _a.type) === "column" ||
            ((_b = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _b === void 0 ? void 0 : _b.type) === "rangeColumn" ||
            ((_c = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _c === void 0 ? void 0 : _c.type) === "rangeBoth" ||
            ((_d = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _d === void 0 ? void 0 : _d.type) === "both") {
            return (colLocationByIndex(((_f = (_e = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _e === void 0 ? void 0 : _e.range) === null || _f === void 0 ? void 0 : _f.column_focus) || 0, context.visibledatacolumn)[1] -
                2 +
                context.scrollLeft);
        }
        return context.scrollLeft;
    }, [context.visibledatacolumn, sheet === null || sheet === void 0 ? void 0 : sheet.frozen, context.scrollLeft]);
    var onMouseMove = useCallback(function (e) {
        var _a;
        if (context.luckysheet_cols_change_size) {
            return;
        }
        var mouseX = e.pageX -
            containerRef.current.getBoundingClientRect().left -
            window.scrollX;
        var _x = mouseX + containerRef.current.scrollLeft;
        var freeze = (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[context.currentSheetId];
        var _b = fixPositionOnFrozenCells(freeze, _x, 0, mouseX, 0), x = _b.x, inVerticalFreeze = _b.inVerticalFreeze;
        var col_location = colLocation(x, context.visibledatacolumn);
        var col_pre = col_location[0], col = col_location[1], col_index = col_location[2];
        if (col_index !== hoverLocation.col_index) {
            setHoverLocation({ col_pre: col_pre, col: col, col_index: col_index });
            setHoverInFreeze(inVerticalFreeze);
        }
        var flowdata = getFlowdata(context);
        if (!_.isNil(flowdata))
            allowEditRef.current =
                isAllowEdit(context) &&
                    isAllowEdit(context, [
                        {
                            row: [0, flowdata.length - 1],
                            column: col_location,
                        },
                    ]);
    }, [context, hoverLocation.col_index, refs.globalCache.freezen]);
    var onMouseDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleColumnHeaderMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.cellInput.current, refs.fxInput.current);
        });
    }, [refs.globalCache, refs.cellInput, refs.fxInput, setContext]);
    var onMouseLeave = useCallback(function () {
        if (context.luckysheet_cols_change_size) {
            return;
        }
        setHoverLocation({ col: -1, col_pre: -1, col_index: -1 });
    }, [context.luckysheet_cols_change_size]);
    var onColSizeHandleMouseDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleColSizeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    var onColFreezeHandleMouseDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleColFreezeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    var onContextMenu = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleContextMenu(draftCtx, settings, nativeEvent, refs.workbookContainer.current, refs.cellArea.current, "columnHeader");
        });
    }, [refs.workbookContainer, setContext, settings, refs.cellArea]);
    useEffect(function () {
        var s = context.luckysheet_select_save;
        if (_.isNil(s))
            return;
        var columnTitleMap = {};
        for (var i = 0; i < s.length; i += 1) {
            var c1 = s[i].column[0];
            var c2 = s[i].column[1];
            columnTitleMap = selectTitlesMap(columnTitleMap, c1, c2);
        }
        var columnTitleRange = selectTitlesRange(columnTitleMap);
        var selects = [];
        for (var j = 0; j < columnTitleRange.length; j += 1) {
            var c1 = columnTitleRange[j][0];
            var c2 = columnTitleRange[j][columnTitleRange[j].length - 1];
            var col = colLocationByIndex(c2, context.visibledatacolumn)[1];
            var col_pre = colLocationByIndex(c1, context.visibledatacolumn)[0];
            if (_.isNumber(col) && _.isNumber(col_pre)) {
                selects.push({ col: col, col_pre: col_pre, c1: c1, c2: c2 });
            }
        }
        setSelectedLocation(selects);
    }, [context.luckysheet_select_save, context.visibledatacolumn]);
    useEffect(function () {
        containerRef.current.scrollLeft = context.scrollLeft;
    }, [context.scrollLeft]);
    return (React.createElement("div", { ref: containerRef, className: "fortune-col-header", style: {
            height: context.columnHeaderHeight - 1.5,
        }, onMouseMove: onMouseMove, onMouseDown: onMouseDown, onMouseLeave: onMouseLeave, onContextMenu: onContextMenu },
        React.createElement("div", { className: "fortune-cols-freeze-handle", onMouseDown: onColFreezeHandleMouseDown, style: {
                left: freezeHandleLeft || 0,
            } }),
        React.createElement("div", { className: "fortune-cols-change-size", ref: colChangeSizeRef, id: "fortune-cols-change-size", onMouseDown: onColSizeHandleMouseDown, style: {
                left: hoverLocation.col - 5 + (hoverInFreeze ? context.scrollLeft : 0),
                opacity: context.luckysheet_cols_change_size ? 1 : 0,
            } }),
        !context.luckysheet_cols_change_size && hoverLocation.col_index >= 0 ? (React.createElement("div", { className: "fortune-col-header-hover", style: _.assign({
                left: hoverLocation.col_pre,
                width: hoverLocation.col - hoverLocation.col_pre - 1,
                display: "block",
            }, fixColumnStyleOverflowInFreeze(context, hoverLocation.col_index, hoverLocation.col_index, (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[context.currentSheetId])) }, allowEditRef.current && (React.createElement("span", { className: "header-arrow", onClick: function (e) {
                setContext(function (ctx) {
                    ctx.contextMenu = {
                        x: e.pageX,
                        y: 90,
                        headerMenu: true,
                    };
                });
            }, tabIndex: 0 },
            React.createElement(SVGIcon, { name: "headDownArrow", width: 12 }))))) : null,
        selectedLocation.map(function (_a, i) {
            var _b;
            var col = _a.col, col_pre = _a.col_pre, c1 = _a.c1, c2 = _a.c2;
            return (React.createElement("div", { className: "fortune-col-header-selected", key: i, style: _.assign({
                    left: col_pre,
                    width: col - col_pre - 1,
                    display: "block",
                    backgroundColor: "rgba(76, 76, 76, 0.1)",
                }, fixColumnStyleOverflowInFreeze(context, c1, c2, (_b = refs.globalCache.freezen) === null || _b === void 0 ? void 0 : _b[context.currentSheetId])) }));
        }),
        React.createElement("div", { className: "luckysheet-cols-h-cells luckysheetsheetchange", id: "luckysheet-cols-h-cells_0", style: { width: context.ch_width, height: 1 } },
            React.createElement("div", { className: "luckysheet-cols-h-cells-c" },
                React.createElement("div", { className: "luckysheet-grdblkpush" })))));
};
export default ColumnHeader;
