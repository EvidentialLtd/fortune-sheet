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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useState, useCallback } from "react";
import { Workbook } from "@evidential-fortune-sheet/react";
import cell from "./data/cell";
import formula from "./data/formula";
import empty from "./data/empty";
import freeze from "./data/freeze";
import dataVerification from "./data/dataVerification";
import lockcellData from "./data/protected";
export default {
    component: Workbook,
};
var Template = function (_a) {
    var data0 = _a.data, args = __rest(_a, ["data"]);
    var _b = useState(data0), data = _b[0], setData = _b[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement("div", { style: { width: "100%", height: "100vh" } },
        React.createElement(Workbook, __assign({}, args, { data: data, onChange: onChange }))));
};
export var Basic = Template.bind({});
Basic.args = { data: [cell] };
export var Formula = Template.bind({});
Formula.args = { data: [formula] };
export var Empty = Template.bind({});
Empty.args = { data: [empty] };
export var Tabs = Template.bind({});
Tabs.args = { data: [cell, formula] };
export var Freeze = Template.bind({});
Freeze.args = { data: [freeze] };
export var DataVerification = Template.bind({});
DataVerification.args = { data: [dataVerification] };
export var ProtectedSheet = Template.bind({});
ProtectedSheet.args = {
    data: lockcellData,
};
export var MultiInstance = function () {
    return (React.createElement("div", { style: {
            width: "100%",
            height: "100%",
        } },
        React.createElement("div", { style: {
                display: "inline-block",
                width: "50%",
                height: "100%",
                paddingRight: "12px",
                boxSizing: "border-box",
            } },
            React.createElement(Workbook, { data: [empty] })),
        React.createElement("div", { style: {
                display: "inline-block",
                width: "50%",
                height: "100%",
                paddingLeft: "12px",
                boxSizing: "border-box",
            } },
            React.createElement(Workbook, { data: [empty] }))));
};
export var TestingTablet = function () {
    var _a = useState([cell]), data = _a[0], setData = _a[1];
    return (React.createElement("div", { style: { width: "100%", height: "100vh" } },
        React.createElement(Workbook, { data: data })));
};
