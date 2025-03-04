import _ from "lodash";
import React, { useCallback, useContext, useEffect, useRef, useState, } from "react";
import { updateCell, addSheet, locale } from "@evidential-fortune-sheet/core";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import "./index.css";
import SheetItem from "./SheetItem";
import ZoomControl from "../ZoomControl";
var SheetTab = function () {
    var _a = useContext(WorkbookContext), context = _a.context, setContext = _a.setContext, settings = _a.settings, refs = _a.refs;
    var tabContainerRef = useRef(null);
    var leftScrollRef = useRef(null);
    var rightScrollRef = useRef(null);
    var _b = useState(false), isShowScrollBtn = _b[0], setIsShowScrollBtn = _b[1];
    var _c = useState(true), isShowBoundary = _c[0], setIsShowBoundary = _c[1];
    var info = locale(context).info;
    var scrollDelta = 150;
    var scrollBy = useCallback(function (amount) {
        var _a;
        if (tabContainerRef.current == null ||
            tabContainerRef.current.scrollLeft == null) {
            return;
        }
        var scrollLeft = tabContainerRef.current.scrollLeft;
        if (scrollLeft + amount <= 0)
            setIsShowBoundary(true);
        else if (scrollLeft > 0)
            setIsShowBoundary(false);
        (_a = tabContainerRef.current) === null || _a === void 0 ? void 0 : _a.scrollBy({
            left: amount,
            behavior: "smooth",
        });
    }, []);
    useEffect(function () {
        var tabCurrent = tabContainerRef.current;
        if (!tabCurrent)
            return;
        setIsShowScrollBtn(tabCurrent.scrollWidth - 2 > tabCurrent.clientWidth);
    }, [context.luckysheetfile]);
    var onAddSheetClick = useCallback(function () {
        return setTimeout(function () {
            setContext(function (draftCtx) {
                if (draftCtx.luckysheetCellUpdate.length > 0) {
                    updateCell(draftCtx, draftCtx.luckysheetCellUpdate[0], draftCtx.luckysheetCellUpdate[1], refs.cellInput.current);
                }
                addSheet(draftCtx, settings);
            }, { addSheetOp: true });
            var tabCurrent = tabContainerRef.current;
            setIsShowScrollBtn(tabCurrent.scrollWidth > tabCurrent.clientWidth);
        });
    }, [refs.cellInput, setContext, settings]);
    return (React.createElement("div", { className: "luckysheet-sheet-area luckysheet-noselected-text", onContextMenu: function (e) { return e.preventDefault(); }, id: "luckysheet-sheet-area" },
        React.createElement("div", { id: "luckysheet-sheet-content" },
            context.allowEdit && (React.createElement("div", { className: "fortune-sheettab-button", onClick: onAddSheetClick, tabIndex: 0, "aria-label": info.newSheet, role: "button" },
                React.createElement(SVGIcon, { name: "plus", width: 16, height: 16 }))),
            context.allowEdit && (React.createElement("div", { className: "sheet-list-container" },
                React.createElement("div", { id: "all-sheets", className: "fortune-sheettab-button", ref: tabContainerRef, onMouseDown: function (e) {
                        e.stopPropagation();
                        setContext(function (ctx) {
                            ctx.showSheetList = _.isUndefined(ctx.showSheetList)
                                ? true
                                : !ctx.showSheetList;
                            ctx.sheetTabContextMenu = {};
                        });
                    } },
                    React.createElement(SVGIcon, { name: "all-sheets", width: 16, height: 16 })))),
            React.createElement("div", { id: "luckysheet-sheets-m", className: "luckysheet-sheets-m lucky-button-custom" },
                React.createElement("i", { className: "iconfont luckysheet-iconfont-caidan2" })),
            React.createElement("div", { className: "fortune-sheettab-container", id: "fortune-sheettab-container" },
                !isShowBoundary && React.createElement("div", { className: "boundary boundary-left" }),
                React.createElement("div", { className: "fortune-sheettab-container-c", id: "fortune-sheettab-container-c", ref: tabContainerRef }, _.sortBy(context.luckysheetfile, function (s) { return Number(s.order); }).map(function (sheet) {
                    return React.createElement(SheetItem, { key: sheet.id, sheet: sheet });
                })),
                isShowBoundary && isShowScrollBtn && (React.createElement("div", { className: "boundary boundary-right" }))),
            isShowScrollBtn && (React.createElement("div", { id: "fortune-sheettab-leftscroll", className: "fortune-sheettab-scroll", ref: leftScrollRef, onClick: function () {
                    scrollBy(-scrollDelta);
                }, tabIndex: 0 },
                React.createElement(SVGIcon, { name: "arrow-doubleleft", width: 12, height: 12 }))),
            isShowScrollBtn && (React.createElement("div", { id: "fortune-sheettab-rightscroll", className: "fortune-sheettab-scroll", ref: rightScrollRef, onClick: function () {
                    scrollBy(scrollDelta);
                }, tabIndex: 0 },
                React.createElement(SVGIcon, { name: "arrow-doubleright", width: 12, height: 12 })))),
        React.createElement("div", { className: "fortune-sheet-area-right" },
            React.createElement(ZoomControl, null))));
};
export default SheetTab;
