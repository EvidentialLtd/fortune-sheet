import { getRangetxt, locale } from "@evidential-fortune-sheet/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import DataVerification from ".";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
import ConditionRules from "../ConditionFormat/ConditionRules";
import "./index.css";
var RangeDialog = function () {
    var _a, _b;
    var _c = useContext(WorkbookContext), context = _c.context, setContext = _c.setContext;
    var showDialog = useDialog().showDialog;
    var _d = locale(context), dataVerification = _d.dataVerification, button = _d.button;
    var _e = useState((_b = (_a = context.rangeDialog) === null || _a === void 0 ? void 0 : _a.rangeTxt) !== null && _b !== void 0 ? _b : ""), rangeTxt2 = _e[0], setRangeTxt2 = _e[1];
    var close = useCallback(function () {
        setContext(function (ctx) {
            ctx.rangeDialog.show = false;
            ctx.rangeDialog.singleSelect = false;
        });
        if (!context.rangeDialog)
            return;
        var rangeDialogType = context.rangeDialog.type;
        if (rangeDialogType.indexOf("between") >= 0) {
            showDialog(React.createElement(ConditionRules, { type: "between" }));
            return;
        }
        if (rangeDialogType.indexOf("conditionRules") >= 0) {
            var rulesType = rangeDialogType.substring("conditionRules".length, rangeDialogType.length);
            showDialog(React.createElement(ConditionRules, { type: rulesType }));
            return;
        }
        showDialog(React.createElement(DataVerification, null));
    }, [context.rangeDialog, setContext, showDialog]);
    useEffect(function () {
        setRangeTxt2(function (r) {
            if (context.luckysheet_select_save) {
                var range = context.luckysheet_select_save[context.luckysheet_select_save.length - 1];
                r = getRangetxt(context, context.currentSheetId, range, context.currentSheetId);
                return r;
            }
            return "";
        });
    }, [context, context.luckysheet_select_save]);
    return (React.createElement("div", { id: "range-dialog", onClick: function (e) { return e.stopPropagation(); }, onChange: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) { return e.stopPropagation(); }, onMouseDown: function (e) { return e.stopPropagation(); }, onMouseUp: function (e) { return e.stopPropagation(); }, tabIndex: 0 },
        React.createElement("div", { className: "dialog-title" }, dataVerification.selectCellRange),
        React.createElement("input", { readOnly: true, placeholder: dataVerification.selectCellRange2, value: rangeTxt2 }),
        React.createElement("div", { className: "button-basic button-primary", style: { marginLeft: "6px" }, onClick: function () {
                setContext(function (ctx) {
                    ctx.rangeDialog.rangeTxt = rangeTxt2;
                });
                close();
            }, tabIndex: 0 }, button.confirm),
        React.createElement("div", { className: "button-basic button-close", onClick: function () {
                close();
            }, tabIndex: 0 }, button.close)));
};
export default RangeDialog;
