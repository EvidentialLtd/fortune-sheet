import React, { useCallback, useContext, useRef, useState } from "react";
import { MAX_ZOOM_RATIO, MIN_ZOOM_RATIO, getSheetIndex, locale, } from "@evidential-fortune-sheet/core";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import "./index.css";
var presets = [
    {
        text: "10%",
        value: 0.1,
    },
    {
        text: "30%",
        value: 0.3,
    },
    {
        text: "50%",
        value: 0.5,
    },
    {
        text: "70%",
        value: 0.7,
    },
    {
        text: "100%",
        value: 1,
    },
    {
        text: "150%",
        value: 1.5,
    },
    {
        text: "200%",
        value: 2,
    },
    {
        text: "300%",
        value: 3,
    },
    {
        text: "400%",
        value: 4,
    },
];
var ZoomControl = function () {
    var _a = useContext(WorkbookContext), context = _a.context, setContext = _a.setContext;
    var menuRef = useRef(null);
    var _b = useState(false), radioMenuOpen = _b[0], setRadioMenuOpen = _b[1];
    var info = locale(context).info;
    useOutsideClick(menuRef, function () {
        setRadioMenuOpen(false);
    }, []);
    var zoomTo = useCallback(function (val) {
        val = parseFloat(val.toFixed(1));
        if (val > MAX_ZOOM_RATIO || val < MIN_ZOOM_RATIO) {
            return;
        }
        setContext(function (ctx) {
            var index = getSheetIndex(ctx, ctx.currentSheetId);
            if (index == null) {
                return;
            }
            ctx.luckysheetfile[index].zoomRatio = val;
            ctx.zoomRatio = val;
        }, { noHistory: true });
    }, [setContext]);
    return (React.createElement("aside", { title: "Zoom settings", className: "fortune-zoom-container" },
        React.createElement("div", { className: "fortune-zoom-button", "aria-label": info.zoomOut, onClick: function (e) {
                zoomTo(context.zoomRatio - 0.1);
                e.stopPropagation();
            }, tabIndex: 0, role: "button" },
            React.createElement(SVGIcon, { name: "minus", width: 16, height: 16 })),
        React.createElement("div", { className: "fortune-zoom-ratio" },
            React.createElement("div", { className: "fortune-zoom-ratio-current fortune-zoom-button", onClick: function () { return setRadioMenuOpen(true); }, tabIndex: 0 },
                (context.zoomRatio * 100).toFixed(0),
                "%"),
            radioMenuOpen && (React.createElement("div", { className: "fortune-zoom-ratio-menu", ref: menuRef }, presets.map(function (v) { return (React.createElement("div", { className: "fortune-zoom-ratio-item", key: v.text, onClick: function (e) {
                    zoomTo(v.value);
                    e.preventDefault();
                }, tabIndex: 0 },
                React.createElement("div", { className: "fortune-zoom-ratio-text" }, v.text))); })))),
        React.createElement("div", { className: "fortune-zoom-button", "aria-label": info.zoomIn, onClick: function (e) {
                zoomTo(context.zoomRatio + 0.1);
                e.stopPropagation();
            }, tabIndex: 0, role: "button" },
            React.createElement(SVGIcon, { name: "plus", width: 16, height: 16 }))));
};
export default ZoomControl;
