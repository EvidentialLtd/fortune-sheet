import { rowLocation, rowLocationByIndex, selectTitlesMap, selectTitlesRange, handleContextMenu, handleRowHeaderMouseDown, handleRowSizeHandleMouseDown, fixRowStyleOverflowInFreeze, handleRowFreezeHandleMouseDown, getSheetIndex, fixPositionOnFrozenCells, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import React, { useContext, useState, useRef, useCallback, useEffect, useMemo, } from "react";
import WorkbookContext from "../../context";
var RowHeader = function () {
    var _a;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, settings = _b.settings, refs = _b.refs;
    var rowChangeSizeRef = useRef(null);
    var containerRef = useRef(null);
    var _c = useState({
        row: -1,
        row_pre: -1,
        row_index: -1,
    }), hoverLocation = _c[0], setHoverLocation = _c[1];
    var _d = useState(false), hoverInFreeze = _d[0], setHoverInFreeze = _d[1];
    var _e = useState([]), selectedLocation = _e[0], setSelectedLocation = _e[1];
    var sheetIndex = getSheetIndex(context, context.currentSheetId);
    var sheet = sheetIndex == null ? null : context.luckysheetfile[sheetIndex];
    var freezeHandleTop = useMemo(function () {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _a === void 0 ? void 0 : _a.type) === "row" ||
            ((_b = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _b === void 0 ? void 0 : _b.type) === "rangeRow" ||
            ((_c = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _c === void 0 ? void 0 : _c.type) === "rangeBoth" ||
            ((_d = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _d === void 0 ? void 0 : _d.type) === "both") {
            return (rowLocationByIndex(((_f = (_e = sheet === null || sheet === void 0 ? void 0 : sheet.frozen) === null || _e === void 0 ? void 0 : _e.range) === null || _f === void 0 ? void 0 : _f.row_focus) || 0, context.visibledatarow)[1] + context.scrollTop);
        }
        return context.scrollTop;
    }, [context.visibledatarow, sheet === null || sheet === void 0 ? void 0 : sheet.frozen, context.scrollTop]);
    var onMouseMove = useCallback(function (e) {
        var _a;
        if (context.luckysheet_rows_change_size) {
            return;
        }
        var mouseY = e.pageY -
            containerRef.current.getBoundingClientRect().top -
            window.scrollY;
        var _y = mouseY + containerRef.current.scrollTop;
        var freeze = (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[context.currentSheetId];
        var _b = fixPositionOnFrozenCells(freeze, 0, _y, 0, mouseY), y = _b.y, inHorizontalFreeze = _b.inHorizontalFreeze;
        var row_location = rowLocation(y, context.visibledatarow);
        var row_pre = row_location[0], row = row_location[1], row_index = row_location[2];
        if (row_pre !== hoverLocation.row_pre || row !== hoverLocation.row) {
            setHoverLocation({ row_pre: row_pre, row: row, row_index: row_index });
            setHoverInFreeze(inHorizontalFreeze);
        }
    }, [
        context.luckysheet_rows_change_size,
        context.visibledatarow,
        hoverLocation.row,
        hoverLocation.row_pre,
        refs.globalCache.freezen,
        context.currentSheetId,
    ]);
    var onMouseDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleRowHeaderMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.cellInput.current, refs.fxInput.current);
        });
    }, [refs.globalCache, refs.cellInput, refs.fxInput, setContext]);
    var onMouseLeave = useCallback(function () {
        if (context.luckysheet_rows_change_size) {
            return;
        }
        setHoverLocation({ row: -1, row_pre: -1, row_index: -1 });
    }, [context.luckysheet_rows_change_size]);
    var onRowSizeHandleMouseDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleRowSizeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    var onRowFreezeHandleMouseDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleRowFreezeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    var onContextMenu = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        setContext(function (draftCtx) {
            handleContextMenu(draftCtx, settings, nativeEvent, refs.workbookContainer.current, refs.cellArea.current, "rowHeader");
        });
    }, [refs.workbookContainer, setContext, settings, refs.cellArea]);
    useEffect(function () {
        var s = context.luckysheet_select_save || [];
        var rowTitleMap = {};
        for (var i = 0; i < s.length; i += 1) {
            var r1 = s[i].row[0];
            var r2 = s[i].row[1];
            rowTitleMap = selectTitlesMap(rowTitleMap, r1, r2);
        }
        var rowTitleRange = selectTitlesRange(rowTitleMap);
        var selects = [];
        for (var i = 0; i < rowTitleRange.length; i += 1) {
            var r1 = rowTitleRange[i][0];
            var r2 = rowTitleRange[i][rowTitleRange[i].length - 1];
            var row = rowLocationByIndex(r2, context.visibledatarow)[1];
            var row_pre = rowLocationByIndex(r1, context.visibledatarow)[0];
            if (_.isNumber(row_pre) && _.isNumber(row)) {
                selects.push({ row: row, row_pre: row_pre, r1: r1, r2: r2 });
            }
        }
        setSelectedLocation(selects);
    }, [context.luckysheet_select_save, context.visibledatarow]);
    useEffect(function () {
        containerRef.current.scrollTop = context.scrollTop;
    }, [context.scrollTop]);
    return (React.createElement("div", { ref: containerRef, className: "fortune-row-header", style: {
            width: context.rowHeaderWidth - 1.5,
            height: context.cellmainHeight,
        }, onMouseMove: onMouseMove, onMouseDown: onMouseDown, onMouseLeave: onMouseLeave, onContextMenu: onContextMenu },
        React.createElement("div", { className: "fortune-rows-freeze-handle", onMouseDown: onRowFreezeHandleMouseDown, style: {
                top: freezeHandleTop || 0,
            } }),
        React.createElement("div", { className: "fortune-rows-change-size", ref: rowChangeSizeRef, onMouseDown: onRowSizeHandleMouseDown, style: {
                top: hoverLocation.row - 3 + (hoverInFreeze ? context.scrollTop : 0),
                opacity: context.luckysheet_rows_change_size ? 1 : 0,
            } }),
        !context.luckysheet_rows_change_size && hoverLocation.row_index >= 0 ? (React.createElement("div", { className: "fortune-row-header-hover", style: _.assign({
                top: hoverLocation.row_pre,
                height: hoverLocation.row - hoverLocation.row_pre - 1,
                display: "block",
            }, fixRowStyleOverflowInFreeze(context, hoverLocation.row_index, hoverLocation.row_index, (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[context.currentSheetId])) })) : null,
        selectedLocation.map(function (_a, i) {
            var _b;
            var row = _a.row, row_pre = _a.row_pre, r1 = _a.r1, r2 = _a.r2;
            return (React.createElement("div", { className: "fortune-row-header-selected", key: i, style: _.assign({
                    top: row_pre,
                    height: row - row_pre - 1,
                    display: "block",
                    backgroundColor: "rgba(76, 76, 76, 0.1)",
                }, fixRowStyleOverflowInFreeze(context, r1, r2, (_b = refs.globalCache.freezen) === null || _b === void 0 ? void 0 : _b[context.currentSheetId])) }));
        }),
        React.createElement("div", { style: { height: context.rh_height, width: 1 }, id: "luckysheetrowHeader_0", className: "luckysheetsheetchange" })));
};
export default RowHeader;
