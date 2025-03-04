import { applyLocation, getFlowdata, getOptionValue, getSelectRange, locale, } from "@evidential-fortune-sheet/core";
import produce from "immer";
import _ from "lodash";
import React, { useContext, useState, useCallback } from "react";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
import "./index.css";
export var LocationCondition = function () {
    var _a = useContext(WorkbookContext), context = _a.context, setContext = _a.setContext;
    var _b = useDialog(), showDialog = _b.showDialog, hideDialog = _b.hideDialog;
    var _c = locale(context), findAndReplace = _c.findAndReplace, button = _c.button;
    var _d = useState("locationConstant"), conditionType = _d[0], setConditionType = _d[1];
    var _e = useState({
        locationDate: true,
        locationDigital: true,
        locationString: true,
        locationBool: true,
        locationError: true,
    }), constants = _e[0], setConstants = _e[1];
    var _f = useState({
        locationDate: true,
        locationDigital: true,
        locationString: true,
        locationBool: true,
        locationError: true,
    }), formulas = _f[0], setFormulas = _f[1];
    var onConfirm = useCallback(function () {
        var _a, _b, _c, _d, _e, _f;
        if (conditionType === "locationConstant") {
            var value_1 = getOptionValue(constants);
            var selectRange_1 = getSelectRange(context);
            setContext(function (ctx) {
                var rangeArr = applyLocation(selectRange_1, conditionType, value_1, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else if (conditionType === "locationFormula") {
            var value_2 = getOptionValue(formulas);
            var selectRange_2 = getSelectRange(context);
            setContext(function (ctx) {
                var rangeArr = applyLocation(selectRange_2, conditionType, value_2, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else if (conditionType === "locationRowSpan") {
            if (((_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) === 0 ||
                (((_b = context.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b.length) === 1 &&
                    context.luckysheet_select_save[0].row[0] ===
                        context.luckysheet_select_save[0].row[1])) {
                showDialog(findAndReplace.locationTiplessTwoRow, "ok");
                return;
            }
            var selectRange_3 = _.assignIn([], context.luckysheet_select_save);
            setContext(function (ctx) {
                var rangeArr = applyLocation(selectRange_3, conditionType, undefined, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else if (conditionType === "locationColumnSpan") {
            if (((_c = context.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c.length) === 0 ||
                (((_d = context.luckysheet_select_save) === null || _d === void 0 ? void 0 : _d.length) === 1 &&
                    context.luckysheet_select_save[0].column[0] ===
                        context.luckysheet_select_save[0].column[1])) {
                showDialog(findAndReplace.locationTiplessTwoColumn, "ok");
                return;
            }
            var selectRange_4 = _.assignIn([], context.luckysheet_select_save);
            setContext(function (ctx) {
                var rangeArr = applyLocation(selectRange_4, conditionType, undefined, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else {
            var selectRange_5;
            if (((_e = context.luckysheet_select_save) === null || _e === void 0 ? void 0 : _e.length) === 0 ||
                (((_f = context.luckysheet_select_save) === null || _f === void 0 ? void 0 : _f.length) === 1 &&
                    context.luckysheet_select_save[0].row[0] ===
                        context.luckysheet_select_save[0].row[1] &&
                    context.luckysheet_select_save[0].column[0] ===
                        context.luckysheet_select_save[0].column[1])) {
                var flowdata = getFlowdata(context, context.currentSheetId);
                selectRange_5 = [
                    {
                        row: [0, flowdata.length - 1],
                        column: [0, flowdata[0].length - 1],
                    },
                ];
            }
            else {
                selectRange_5 = _.assignIn([], context.luckysheet_select_save);
            }
            setContext(function (ctx) {
                var rangeArr = applyLocation(selectRange_5, conditionType, undefined, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
    }, [
        conditionType,
        constants,
        context,
        findAndReplace.locationTipNotFindCell,
        findAndReplace.locationTiplessTwoColumn,
        findAndReplace.locationTiplessTwoRow,
        formulas,
        setContext,
        showDialog,
    ]);
    var isSelect = useCallback(function (currentType) { return conditionType === currentType; }, [conditionType]);
    return (React.createElement("div", { id: "fortune-location-condition" },
        React.createElement("div", { className: "title" }, findAndReplace.location),
        React.createElement("div", { className: "listbox" },
            React.createElement("div", { className: "listItem" },
                React.createElement("input", { type: "radio", name: "locationType", id: "locationConstant", checked: isSelect("locationConstant"), onChange: function () {
                        setConditionType("locationConstant");
                    } }),
                React.createElement("label", { htmlFor: "locationConstant" }, findAndReplace.locationConstant),
                React.createElement("div", { className: "subbox" }, [
                    "locationDate",
                    "locationDigital",
                    "locationString",
                    "locationBool",
                    "locationError",
                ].map(function (v) { return (React.createElement("div", { className: "subItem", key: v },
                    React.createElement("input", { type: "checkbox", disabled: !isSelect("locationConstant"), checked: constants[v], onChange: function () {
                            setConstants(produce(function (draft) {
                                _.set(draft, v, !draft[v]);
                            }));
                        } }),
                    React.createElement("label", { htmlFor: v, style: {
                            color: isSelect("locationConstant") ? "#000" : "#666",
                        } }, findAndReplace[v]))); }))),
            React.createElement("div", { className: "listItem" },
                React.createElement("input", { type: "radio", name: "locationType", id: "locationFormula", checked: isSelect("locationFormula"), onChange: function () {
                        setConditionType("locationFormula");
                    } }),
                React.createElement("label", { htmlFor: "locationFormula" }, findAndReplace.locationFormula),
                React.createElement("div", { className: "subbox" }, [
                    "locationDate",
                    "locationDigital",
                    "locationString",
                    "locationBool",
                    "locationError",
                ].map(function (v) { return (React.createElement("div", { className: "subItem", key: v },
                    React.createElement("input", { type: "checkbox", disabled: !isSelect("locationFormula"), checked: formulas[v], onChange: function () {
                            setFormulas(produce(function (draft) {
                                _.set(draft, v, !draft[v]);
                            }));
                        } }),
                    React.createElement("label", { htmlFor: v, style: {
                            color: isSelect("locationFormula") ? "#000" : "#666",
                        } }, findAndReplace[v]))); }))),
            ["locationNull", "locationRowSpan", "locationColumnSpan"].map(function (v) { return (React.createElement("div", { className: "listItem", key: v },
                React.createElement("input", { type: "radio", name: v, checked: isSelect(v), onChange: function () {
                        setConditionType(v);
                    } }),
                React.createElement("label", { htmlFor: v }, findAndReplace[v]))); })),
        React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                hideDialog();
                onConfirm();
            }, tabIndex: 0 }, button.confirm),
        React.createElement("div", { className: "button-basic button-close", onClick: function () {
                hideDialog();
            }, tabIndex: 0 }, button.cancel)));
};
