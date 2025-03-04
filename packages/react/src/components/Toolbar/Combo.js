import React, { useLayoutEffect, useRef, useState, useContext, } from "react";
import { locale } from "@evidential-fortune-sheet/core";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import SVGIcon from "../SVGIcon";
import WorkbookContext from "../../context";
var Combo = function (_a) {
    var tooltip = _a.tooltip, onClick = _a.onClick, text = _a.text, iconId = _a.iconId, children = _a.children;
    var context = useContext(WorkbookContext).context;
    var style = { userSelect: "none" };
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useState({ left: 0 }), popupPosition = _c[0], setPopupPosition = _c[1];
    var popupRef = useRef(null);
    var buttonRef = useRef(null);
    var info = locale(context).info;
    useOutsideClick(popupRef, function () {
        setOpen(false);
    });
    useLayoutEffect(function () {
        if (!popupRef.current) {
            return;
        }
        if (!open) {
            setPopupPosition({ left: 0 });
        }
        var winW = window.innerWidth;
        var rect = popupRef.current.getBoundingClientRect();
        var menuW = rect.width;
        var left = rect.left;
        if (left + menuW > winW) {
            setPopupPosition({ left: -rect.width + buttonRef.current.clientWidth });
        }
    }, [open]);
    return (React.createElement("div", { className: "fortune-toobar-combo-container fortune-toolbar-item" },
        React.createElement("div", { ref: buttonRef, className: "fortune-toolbar-combo" },
            React.createElement("div", { className: "fortune-toolbar-combo-button", onClick: function (e) {
                    if (onClick)
                        onClick(e);
                    else
                        setOpen(!open);
                }, tabIndex: 0, "data-tips": tooltip, role: "button", "aria-label": "".concat(tooltip, ": ").concat(text !== undefined ? text : ""), style: style }, iconId ? (React.createElement(SVGIcon, { name: iconId })) : (React.createElement("span", { className: "fortune-toolbar-combo-text" }, text !== undefined ? text : ""))),
            React.createElement("div", { className: "fortune-toolbar-combo-arrow", onClick: function () { return setOpen(!open); }, tabIndex: 0, "data-tips": tooltip, role: "button", "aria-label": "".concat(tooltip, ": ").concat(info.Dropdown), style: style },
                React.createElement(SVGIcon, { name: "combo-arrow", width: 10 })),
            tooltip && React.createElement("div", { className: "fortune-tooltip" }, tooltip)),
        open && (React.createElement("div", { ref: popupRef, className: "fortune-toolbar-combo-popup", style: popupPosition }, children === null || children === void 0 ? void 0 : children(setOpen)))));
};
export default Combo;
