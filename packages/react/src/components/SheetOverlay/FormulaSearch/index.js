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
import _ from "lodash";
import React, { useContext } from "react";
import WorkbookContext from "../../../context";
import "./index.css";
var FormulaSearch = function (props) {
    var context = useContext(WorkbookContext).context;
    if (_.isEmpty(context.functionCandidates))
        return null;
    return (React.createElement("div", __assign({}, props, { id: "luckysheet-formula-search-c", className: "luckysheet-formula-search-c" }), context.functionCandidates.map(function (v, index) { return (React.createElement("div", { key: v.n, "data-func": v.n, className: "luckysheet-formula-search-item ".concat(index === 0 ? "luckysheet-formula-search-item-active" : "") },
        React.createElement("div", { className: "luckysheet-formula-search-func" }, v.n),
        React.createElement("div", { className: "luckysheet-formula-search-detail" }, v.d))); })));
};
export default FormulaSearch;
