import React, { useCallback, useContext, useEffect, useState } from "react";
import "./index.css";
import { locale, setConditionRules } from "@evidential-fortune-sheet/core";
import produce from "immer";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
var ConditionRules = function (_a) {
    var type = _a.type;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext;
    var hideDialog = useDialog().hideDialog;
    var _c = locale(context), conditionformat = _c.conditionformat, button = _c.button, protection = _c.protection, generalDialog = _c.generalDialog;
    var _d = useState({ textColor: "#000000", cellColor: "#000000" }), colorRules = _d[0], setColorRules = _d[1];
    var close = useCallback(function (closeType) {
        if (closeType === "confirm") {
            setContext(function (ctx) {
                ctx.conditionRules.textColor.color = colorRules.textColor;
                ctx.conditionRules.cellColor.color = colorRules.cellColor;
                setConditionRules(ctx, protection, generalDialog, conditionformat, ctx.conditionRules);
            });
        }
        setContext(function (ctx) {
            ctx.conditionRules = {
                rulesType: "",
                rulesValue: "",
                textColor: { check: true, color: "#000000" },
                cellColor: { check: true, color: "#000000" },
                betweenValue: { value1: "", value2: "" },
                dateValue: "",
                repeatValue: "0",
                projectValue: "10",
            };
        });
        hideDialog();
    }, [
        colorRules,
        conditionformat,
        generalDialog,
        hideDialog,
        protection,
        setContext,
    ]);
    useEffect(function () {
        setContext(function (ctx) {
            ctx.conditionRules.rulesType = type;
            if (!ctx.rangeDialog)
                return;
            var rangeDialogType = ctx.rangeDialog.type;
            var rangeT = ctx.rangeDialog.rangeTxt;
            if (rangeDialogType === "conditionRulesbetween1") {
                ctx.conditionRules.betweenValue.value1 = rangeT;
            }
            else if (rangeDialogType === "conditionRulesbetween2") {
                ctx.conditionRules.betweenValue.value2 = rangeT;
            }
            else if (rangeDialogType.indexOf("conditionRules") >= 0) {
                ctx.conditionRules.rulesValue = rangeT;
            }
            else if (rangeDialogType === "") {
                ctx.conditionRules = {
                    rulesType: type,
                    rulesValue: "",
                    textColor: { check: true, color: "#000000" },
                    cellColor: { check: true, color: "#000000" },
                    betweenValue: { value1: "", value2: "" },
                    dateValue: "",
                    repeatValue: "0",
                    projectValue: "10",
                };
            }
            ctx.rangeDialog.type = "";
            ctx.rangeDialog.rangeTxt = "";
        });
    }, []);
    return (React.createElement("div", { className: "condition-rules" },
        React.createElement("div", { className: "condition-rules-title" }, conditionformat["conditionformat_".concat(type)]),
        React.createElement("div", { className: "conditin-rules-value" }, conditionformat["conditionformat_".concat(type, "_title")]),
        (type === "greaterThan" ||
            type === "lessThan" ||
            type === "equal" ||
            type === "textContains") && (React.createElement("div", { className: "condition-rules-inpbox" },
            React.createElement("input", { className: "condition-rules-input", type: "text", value: context.conditionRules.rulesValue, onChange: function (e) {
                    var value = e.target.value;
                    setContext(function (ctx) {
                        ctx.conditionRules.rulesValue = value;
                    });
                } }))),
        type === "between" && (React.createElement("div", { className: "condition-rules-between-box" },
            React.createElement("div", { className: "condition-rules-between-inpbox" },
                React.createElement("input", { className: "condition-rules-between-input", type: "text", value: context.conditionRules.betweenValue.value1, onChange: function (e) {
                        var value = e.target.value;
                        setContext(function (ctx) {
                            ctx.conditionRules.betweenValue.value1 = value;
                        });
                    } })),
            React.createElement("span", { style: { margin: "0px 4px" } }, conditionformat.to),
            React.createElement("div", { className: "condition-rules-between-inpbox" },
                React.createElement("input", { className: "condition-rules-between-input", type: "text", value: context.conditionRules.betweenValue.value2, onChange: function (e) {
                        var value = e.target.value;
                        setContext(function (ctx) {
                            ctx.conditionRules.betweenValue.value2 = value;
                        });
                    } })))),
        type === "occurrenceDate" && (React.createElement("div", { className: "condition-rules-inpbox" },
            React.createElement("input", { type: "date", className: "condition-rules-date", value: context.conditionRules.dateValue, onChange: function (e) {
                    var value = e.target.value;
                    setContext(function (ctx) {
                        ctx.conditionRules.dateValue = value;
                    });
                } }))),
        type === "duplicateValue" && (React.createElement("select", { className: "condition-rules-select", onChange: function (e) {
                var value = e.target.value;
                setContext(function (ctx) {
                    ctx.conditionRules.repeatValue = value;
                });
            } },
            React.createElement("option", { value: "0" }, conditionformat.duplicateValue),
            React.createElement("option", { value: "1" }, conditionformat.uniqueValue))),
        (type === "top10" ||
            type === "top10_percent" ||
            type === "last10" ||
            type === "last10_percent") && (React.createElement("div", { className: "condition-rules-project-box" },
            type === "top10" || type === "top10_percent"
                ? conditionformat.top
                : conditionformat.last,
            React.createElement("input", { className: "condition-rules-project-input", type: "number", value: context.conditionRules.projectValue, onChange: function (e) {
                    var value = e.target.value;
                    setContext(function (ctx) {
                        ctx.conditionRules.projectValue = value;
                    });
                } }),
            type === "top10" || type === "last10"
                ? conditionformat.oneself
                : "%")),
        React.createElement("div", { className: "condition-rules-set-title" }, "".concat(conditionformat.setAs, "\uFF1A")),
        React.createElement("div", { className: "condition-rules-setbox" },
            React.createElement("div", { className: "condition-rules-set" },
                React.createElement("div", { className: "condition-rules-color" },
                    React.createElement("input", { id: "checkTextColor", type: "checkbox", className: "condition-rules-check", checked: context.conditionRules.textColor.check, onChange: function (e) {
                            var checked = e.target.checked;
                            setContext(function (ctx) {
                                ctx.conditionRules.textColor.check = checked;
                            });
                        } }),
                    React.createElement("label", { htmlFor: "checkTextColor", className: "condition-rules-label" }, conditionformat.textColor),
                    React.createElement("input", { type: "color", className: "condition-rules-select-color", value: colorRules.textColor, onChange: function (e) {
                            var value = e.target.value;
                            setColorRules(produce(function (draft) {
                                draft.textColor = value;
                            }));
                        } }))),
            React.createElement("div", { className: "condition-rules-set" },
                React.createElement("div", { className: "condition-rules-color" },
                    React.createElement("input", { id: "checkCellColor", type: "checkbox", className: "condition-rules-check", checked: context.conditionRules.cellColor.check, onChange: function (e) {
                            var checked = e.target.checked;
                            setContext(function (ctx) {
                                ctx.conditionRules.cellColor.check = checked;
                            });
                        } }),
                    React.createElement("label", { htmlFor: "checkCellColor", className: "condition-rules-label" }, conditionformat.cellColor),
                    React.createElement("input", { type: "color", className: "condition-rules-select-color", value: colorRules.cellColor, onChange: function (e) {
                            var value = e.target.value;
                            setColorRules(produce(function (draft) {
                                draft.cellColor = value;
                            }));
                        } })))),
        React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                close("confirm");
            }, tabIndex: 0 }, button.confirm),
        React.createElement("div", { className: "button-basic button-close", onClick: function () {
                close("close");
            }, tabIndex: 0 }, button.cancel)));
};
export default ConditionRules;
