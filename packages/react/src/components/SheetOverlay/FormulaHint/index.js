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
import { locale } from "@evidential-fortune-sheet/core";
import React, { useContext } from "react";
import WorkbookContext from "../../../context";
import "./index.css";
var FormulaHint = function (props) {
    var context = useContext(WorkbookContext).context;
    var formulaMore = locale(context).formulaMore;
    if (!context.functionHint)
        return null;
    var fn = context.formulaCache.functionlistMap[context.functionHint];
    if (!fn)
        return null;
    return (React.createElement("div", __assign({}, props, { id: "luckysheet-formula-help-c", className: "luckysheet-formula-help-c" }),
        React.createElement("div", { className: "luckysheet-formula-help-close", title: "\u5173\u95ED" },
            React.createElement("i", { className: "fa fa-times", "aria-hidden": "true" })),
        React.createElement("div", { className: "luckysheet-formula-help-collapse", title: "\u6536\u8D77" },
            React.createElement("i", { className: "fa fa-angle-up", "aria-hidden": "true" })),
        React.createElement("div", { className: "luckysheet-formula-help-title" },
            React.createElement("div", { className: "luckysheet-formula-help-title-formula" },
                React.createElement("span", { className: "luckysheet-arguments-help-function-name" }, fn.n),
                React.createElement("span", { className: "luckysheet-arguments-paren" }, "("),
                React.createElement("span", { className: "luckysheet-arguments-parameter-holder" }, fn.p.map(function (param, i) {
                    var name = param.name;
                    if (param.repeat === "y") {
                        name += ", ...";
                    }
                    if (param.require === "o") {
                        name = "[".concat(name, "]");
                    }
                    return (React.createElement("span", { className: "luckysheet-arguments-help-parameter", dir: "auto", key: name },
                        name,
                        i !== fn.p.length - 1 && ", "));
                })),
                React.createElement("span", { className: "luckysheet-arguments-paren" }, ")"))),
        React.createElement("div", { className: "luckysheet-formula-help-content" },
            React.createElement("div", { className: "luckysheet-formula-help-content-example" },
                React.createElement("div", { className: "luckysheet-arguments-help-section-title" }, formulaMore.helpExample),
                React.createElement("div", { className: "luckysheet-arguments-help-formula" },
                    React.createElement("span", { className: "luckysheet-arguments-help-function-name" }, fn.n),
                    React.createElement("span", { className: "luckysheet-arguments-paren" }, "("),
                    React.createElement("span", { className: "luckysheet-arguments-parameter-holder" }, fn.p.map(function (param, i) { return (React.createElement("span", { key: param.name, className: "luckysheet-arguments-help-parameter", dir: "auto" },
                        param.example,
                        i !== fn.p.length - 1 && ", ")); })),
                    React.createElement("span", { className: "luckysheet-arguments-paren" }, ")"))),
            React.createElement("div", { className: "luckysheet-formula-help-content-detail" },
                React.createElement("div", { className: "luckysheet-arguments-help-section" },
                    React.createElement("div", { className: "luckysheet-arguments-help-section-title luckysheet-arguments-help-parameter-name" }, formulaMore.helpAbstract),
                    React.createElement("span", { className: "luckysheet-arguments-help-parameter-content" }, fn.d))),
            React.createElement("div", { className: "luckysheet-formula-help-content-param" }, fn.p.map(function (param) { return (React.createElement("div", { className: "luckysheet-arguments-help-section", key: param.name },
                React.createElement("div", { className: "luckysheet-arguments-help-section-title" },
                    param.name,
                    param.repeat === "y" && (React.createElement("span", { className: "luckysheet-arguments-help-argument-info" },
                        "...-",
                        formulaMore.allowRepeatText)),
                    param.require === "o" && (React.createElement("span", { className: "luckysheet-arguments-help-argument-info" },
                        "-[",
                        formulaMore.allowOptionText,
                        "]"))),
                React.createElement("span", { className: "luckysheet-arguments-help-parameter-content" }, param.detail))); }))),
        React.createElement("div", { className: "luckysheet-formula-help-foot" })));
};
export default FormulaHint;
