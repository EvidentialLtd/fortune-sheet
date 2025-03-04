import { cancelNormalSelected, cancelActiveImgItem, } from "@evidential-fortune-sheet/core";
import React, { useContext, useEffect, useRef } from "react";
import WorkbookContext from "../../context";
import "./index.css";
import SheetHiddenButton from "./SheetHiddenButton";
import SVGIcon from "../SVGIcon";
var SheetListItem = function (_a) {
    var sheet = _a.sheet, isDropPlaceholder = _a.isDropPlaceholder;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var containerRef = useRef(null);
    useEffect(function () {
        setContext(function (draftCtx) {
            var _a, _b, _c, _d;
            var r = context.sheetScrollRecord[draftCtx === null || draftCtx === void 0 ? void 0 : draftCtx.currentSheetId];
            if (r) {
                draftCtx.scrollLeft = (_a = r.scrollLeft) !== null && _a !== void 0 ? _a : 0;
                draftCtx.scrollTop = (_b = r.scrollTop) !== null && _b !== void 0 ? _b : 0;
                draftCtx.luckysheet_select_status = (_c = r.luckysheet_select_status) !== null && _c !== void 0 ? _c : false;
                draftCtx.luckysheet_select_save = (_d = r.luckysheet_select_save) !== null && _d !== void 0 ? _d : undefined;
            }
            else {
                draftCtx.scrollLeft = 0;
                draftCtx.scrollTop = 0;
                draftCtx.luckysheet_select_status = false;
                draftCtx.luckysheet_select_save = undefined;
            }
            draftCtx.luckysheet_selection_range = [];
        });
    }, [context.currentSheetId, context.sheetScrollRecord, setContext]);
    return (React.createElement("div", { className: "fortune-sheet-list-item", key: sheet.id, ref: containerRef, onClick: function () {
            if (isDropPlaceholder)
                return;
            setContext(function (draftCtx) {
                draftCtx.sheetScrollRecord[draftCtx.currentSheetId] = {
                    scrollLeft: draftCtx.scrollLeft,
                    scrollTop: draftCtx.scrollTop,
                    luckysheet_select_status: draftCtx.luckysheet_select_status,
                    luckysheet_select_save: draftCtx.luckysheet_select_save,
                    luckysheet_selection_range: draftCtx.luckysheet_selection_range,
                };
                draftCtx.currentSheetId = sheet.id;
                draftCtx.zoomRatio = sheet.zoomRatio || 1;
                cancelActiveImgItem(draftCtx, refs.globalCache);
                cancelNormalSelected(draftCtx);
            });
        }, tabIndex: 0 },
        React.createElement("span", { className: "fortune-sheet-selected-check-sapce" }, sheet.id === context.currentSheetId && (React.createElement(SVGIcon, { name: "check", width: 16, height: 16, style: { lineHeight: 30, verticalAlign: "middle" } }))),
        React.createElement("span", { className: "luckysheet-sheets-item-name fortune-sheet-list-item-name", spellCheck: "false" },
            !!sheet.color && (React.createElement("div", { className: "luckysheet-sheets-list-item-color", style: { background: sheet.color } })),
            sheet.name),
        sheet.hide && React.createElement(SheetHiddenButton, { sheet: sheet })));
};
export default SheetListItem;
