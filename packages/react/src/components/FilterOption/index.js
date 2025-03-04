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
import { createFilterOptions, fixColumnStyleOverflowInFreeze, fixRowStyleOverflowInFreeze, getSheetIndex, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import React, { useCallback, useContext, useEffect } from "react";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
var FilterOptions = function (_a) {
    var _b, _c, _d, _e;
    var getContainer = _a.getContainer;
    var _f = useContext(WorkbookContext), context = _f.context, setContext = _f.setContext, refs = _f.refs;
    var filterOptions = context.filterOptions, currentSheetId = context.currentSheetId, filter = context.filter, visibledatarow = context.visibledatarow, visibledatacolumn = context.visibledatacolumn;
    var sheetIndex = getSheetIndex(context, context.currentSheetId);
    var _g = context.luckysheetfile[sheetIndex], filter_select = _g.filter_select, frozen = _g.frozen;
    useEffect(function () {
        setContext(function (draftCtx) {
            var sheetIdx = getSheetIndex(draftCtx, draftCtx.currentSheetId);
            if (sheetIdx == null)
                return;
            draftCtx.luckysheet_filter_save =
                draftCtx.luckysheetfile[sheetIdx].filter_select;
            draftCtx.filter = draftCtx.luckysheetfile[sheetIdx].filter || {};
            createFilterOptions(draftCtx, draftCtx.luckysheet_filter_save, undefined);
        });
    }, [
        visibledatarow,
        visibledatacolumn,
        setContext,
        currentSheetId,
        filter_select,
    ]);
    var showFilterContextMenu = useCallback(function (v, i) {
        if (filterOptions == null)
            return;
        setContext(function (draftCtx) {
            var _a, _b;
            if (((_a = draftCtx.filterContextMenu) === null || _a === void 0 ? void 0 : _a.col) === filterOptions.startCol + i)
                return;
            draftCtx.filterContextMenu = {
                x: v.left +
                    draftCtx.rowHeaderWidth -
                    refs.scrollbarX.current.scrollLeft,
                y: v.top +
                    23 +
                    draftCtx.toolbarHeight +
                    draftCtx.calculatebarHeight +
                    draftCtx.columnHeaderHeight -
                    refs.scrollbarY.current.scrollTop,
                col: filterOptions.startCol + i,
                startRow: filterOptions.startRow,
                endRow: filterOptions.endRow,
                startCol: filterOptions.startCol,
                endCol: filterOptions.endCol,
                hiddenRows: _.keys((_b = draftCtx.filter[i]) === null || _b === void 0 ? void 0 : _b.rowhidden).map(function (r) {
                    return parseInt(r, 10);
                }),
                listBoxMaxHeight: 400,
            };
        });
    }, [filterOptions, getContainer, refs.scrollbarX, refs.scrollbarY, setContext]);
    var freezeType = frozen === null || frozen === void 0 ? void 0 : frozen.type;
    var frozenColumns = -1;
    var frozenRows = -1;
    if (freezeType === "row")
        frozenRows = 0;
    else if (freezeType === "column")
        frozenColumns = 0;
    else if (freezeType === "both") {
        frozenColumns = 0;
        frozenRows = 0;
    }
    else {
        frozenColumns = ((_b = frozen === null || frozen === void 0 ? void 0 : frozen.range) === null || _b === void 0 ? void 0 : _b.column_focus) || -1;
        frozenRows = ((_c = frozen === null || frozen === void 0 ? void 0 : frozen.range) === null || _c === void 0 ? void 0 : _c.row_focus) || -1;
    }
    return filterOptions == null ? (React.createElement("div", null)) : (React.createElement(React.Fragment, null,
        React.createElement("div", { id: "luckysheet-filter-selected-sheet", className: "luckysheet-cell-selected luckysheet-filter-selected", style: _.assign({
                left: filterOptions.left,
                width: filterOptions.width,
                top: filterOptions.top,
                height: filterOptions.height,
                display: "block",
            }, fixRowStyleOverflowInFreeze(context, filterOptions.startRow, filterOptions.endRow, (_d = refs.globalCache.freezen) === null || _d === void 0 ? void 0 : _d[context.currentSheetId]), fixColumnStyleOverflowInFreeze(context, filterOptions.startCol, filterOptions.endCol, (_e = refs.globalCache.freezen) === null || _e === void 0 ? void 0 : _e[context.currentSheetId])) }),
        filterOptions.items.map(function (v, i) {
            var _a, _b;
            var filterParam = filter[i];
            var columnOverflowFreezeStyle = fixColumnStyleOverflowInFreeze(context, i + filterOptions.startCol, i + filterOptions.startCol, (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[context.currentSheetId]);
            var rowOverflowFreezeStyle = fixRowStyleOverflowInFreeze(context, filterOptions.startRow, filterOptions.startRow, (_b = refs.globalCache.freezen) === null || _b === void 0 ? void 0 : _b[context.currentSheetId]);
            var col = visibledatacolumn[v.col];
            var col_pre = v.col > 0 ? visibledatacolumn[v.col - 1] : 0;
            var left = v.col <= frozenColumns && columnOverflowFreezeStyle.left
                ? columnOverflowFreezeStyle.left + col - col_pre - 20
                : v.left;
            var top = filterOptions.startRow <= frozenRows && rowOverflowFreezeStyle.top
                ? rowOverflowFreezeStyle.top
                : v.top;
            var v_adjusted = __assign(__assign({}, v), { left: left, top: top });
            return (React.createElement("div", { onMouseDown: function (e) { return e.stopPropagation(); }, onClick: function (e) {
                    e.stopPropagation();
                    showFilterContextMenu(v_adjusted, i);
                }, onDoubleClick: function (e) { return e.stopPropagation(); }, tabIndex: 0, key: i, style: _.assign(rowOverflowFreezeStyle, columnOverflowFreezeStyle, {
                    left: left,
                    top: top,
                    height: undefined,
                    width: undefined,
                }), className: "luckysheet-filter-options ".concat(filterParam == null ? "" : "luckysheet-filter-options-active") }, filterParam == null ? (React.createElement("div", { className: "caret down" })) : (React.createElement(SVGIcon, { name: "filter-fill-white", style: { width: 15, height: 15 } }))));
        })));
};
export default FilterOptions;
