import _ from "lodash";
import React, { useContext, useRef, useCallback } from "react";
import WorkbookContext from "../../context";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import "./index.css";
import SheetListItem from "./SheetListItem";
var SheetList = function () {
    var _a = useContext(WorkbookContext), context = _a.context, setContext = _a.setContext;
    var containerRef = useRef(null);
    var close = useCallback(function () {
        setContext(function (ctx) {
            ctx.showSheetList = false;
        });
    }, [setContext]);
    useOutsideClick(containerRef, close, [close]);
    return (React.createElement("div", { className: "fortune-context-menu luckysheet-cols-menu fortune-sheet-list", ref: containerRef }, _.sortBy(context.luckysheetfile, function (s) { return Number(s.order); }).map(function (singleSheet) {
        return React.createElement(SheetListItem, { sheet: singleSheet, key: singleSheet.id });
    })));
};
export default SheetList;
