import React, { useCallback, useContext, useRef, useState } from "react";
import "./index.css";
import { locale } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import { CustomColor } from "./CustomColor";
var size = [
    {
        Text: "1",
        value: "Thin",
        strokeDasharray: "1,0",
        strokeWidth: "1",
    },
    {
        Text: "2",
        value: "Hair",
        strokeDasharray: "1,5",
        strokeWidth: "1",
    },
    {
        Text: "3",
        value: "Dotted",
        strokeDasharray: "2,5",
        strokeWidth: "2",
    },
    {
        Text: "4",
        value: "Dashed",
        strokeDasharray: "5,5",
        strokeWidth: "2",
    },
    {
        Text: "5",
        value: "DashDot",
        strokeDasharray: "20,5,5,10,5,5",
        strokeWidth: "2",
    },
    {
        Text: "6",
        value: "DashDotDot",
        strokeDasharray: "20,5,5,5,5,10,5,5,5,5",
        strokeWidth: "2",
    },
    {
        Text: "8",
        value: "Medium",
        strokeDasharray: "2,0",
        strokeWidth: "2",
    },
    {
        Text: "9",
        value: "MediumDashed",
        strokeDasharray: "3,5",
        strokeWidth: "3",
    },
    {
        Text: "10",
        value: "MediumDashDot",
        strokeDasharray: "20,5,5,10,5,5",
        strokeWidth: "3",
    },
    {
        Text: "11",
        value: "MediumDashDotDot",
        strokeDasharray: "5,5,5,5,20,5,5,5,5,10",
        strokeWidth: "3",
    },
    {
        Text: "13",
        value: "Thick",
        strokeDasharray: "2,0",
        strokeWidth: "3",
    },
];
var CustomBorder = function (_a) {
    var onPick = _a.onPick;
    var _b = useContext(WorkbookContext), context = _b.context, refs = _b.refs;
    var border = locale(context).border;
    var _c = useState("#000000"), changeColor = _c[0], setchangeColor = _c[1];
    var _d = useState("1"), changeStyle = _d[0], setchangeStyle = _d[1];
    var colorRef = useRef(null);
    var styleRef = useRef(null);
    var colorPreviewRef = useRef(null);
    var _e = useState(""), previewWith = _e[0], setPreviewWith = _e[1];
    var _f = useState(""), previewdasharry = _f[0], setPreviewdasharray = _f[1];
    var showBorderSubMenu = useCallback(function (e) {
        var target = e.target;
        var menuItemRect = target.getBoundingClientRect();
        var subMenuItem = target.querySelector(".fortune-border-select-menu");
        if (_.isNil(subMenuItem))
            return;
        subMenuItem.style.display = "block";
        var workbookContainerRect = refs.workbookContainer.current.getBoundingClientRect();
        if (workbookContainerRect.width - menuItemRect.right >
            parseFloat(subMenuItem.style.width.replace("px", ""))) {
            subMenuItem.style.left = "".concat(menuItemRect === null || menuItemRect === void 0 ? void 0 : menuItemRect.width, "px");
        }
        else {
            subMenuItem.style.left = "-".concat(subMenuItem.style.width);
        }
    }, [refs.workbookContainer]);
    var hideBorderSubMenu = useCallback(function () {
        styleRef.current.style.display = "none";
        colorRef.current.style.display = "none";
    }, []);
    var changePreviewStyle = useCallback(function (width, dasharray) {
        setPreviewWith(width);
        setPreviewdasharray(dasharray);
    }, []);
    return (React.createElement("div", null,
        React.createElement("div", { className: "fortune-border-select-option", key: "borderColor", onMouseEnter: function (e) {
                showBorderSubMenu(e);
            }, onMouseLeave: function () {
                hideBorderSubMenu();
            } },
            React.createElement("div", { className: "fortune-toolbar-menu-line" },
                border.borderColor,
                React.createElement(SVGIcon, { name: "rightArrow", style: { width: "14px" } })),
            React.createElement("div", { ref: colorPreviewRef, className: "fortune-border-color-preview", style: { backgroundColor: changeColor } }),
            React.createElement("div", { ref: colorRef, className: "fortune-border-select-menu", style: { display: "none", width: "166px" } },
                React.createElement(CustomColor, { onCustomPick: function (color) {
                        onPick(color, changeStyle);
                        colorPreviewRef.current.style.backgroundColor = changeColor;
                        setchangeColor(color);
                    }, onColorPick: function (color) {
                        onPick(color, changeStyle);
                        setchangeColor(color);
                    } }))),
        React.createElement("div", { className: "fortune-border-select-option", key: "borderStyle", onMouseEnter: function (e) {
                showBorderSubMenu(e);
            }, onMouseLeave: function () {
                hideBorderSubMenu();
            } },
            React.createElement("div", { className: "fortune-toolbar-menu-line" },
                border.borderStyle,
                React.createElement(SVGIcon, { name: "rightArrow", style: { width: "14px" } })),
            React.createElement("div", { className: "fortune-border-style-preview" },
                React.createElement("svg", { width: "90" },
                    React.createElement("g", { fill: "none", stroke: "black", strokeWidth: previewWith },
                        React.createElement("path", { strokeDasharray: previewdasharry, d: "M0 0 l90 0" })))),
            React.createElement("div", { ref: styleRef, className: "fortune-border-select-menu fortune-toolbar-select", style: { display: "none", width: "110px" } },
                React.createElement("div", { className: "fortune-border-style-picker-menu fortune-border-style-reset", onClick: function () {
                        onPick(changeColor, "1");
                        changePreviewStyle("1", "1,0");
                    }, tabIndex: 0 }, border.borderDefault),
                React.createElement("div", { className: "fortune-boder-style-picker" }, size.map(function (items, i) { return (React.createElement("div", { key: i, className: "fortune-border-style-picker-menu", onClick: function () {
                        onPick(changeColor, items.Text);
                        setchangeStyle(items.Text);
                        changePreviewStyle(items.strokeWidth, items.strokeDasharray);
                    }, tabIndex: 0 },
                    React.createElement("svg", { height: "10", width: "90" },
                        React.createElement("g", { fill: "none", stroke: "black", strokeWidth: items.strokeWidth },
                            React.createElement("path", { strokeDasharray: items.strokeDasharray, d: "M0 5 l85 0" }))))); }))))));
};
export default CustomBorder;
