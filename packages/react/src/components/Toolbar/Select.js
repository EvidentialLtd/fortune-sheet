import React from "react";
import SVGIcon from "../SVGIcon";
var Select = function (_a) {
    var children = _a.children, style = _a.style;
    return (React.createElement("div", { className: "fortune-toolbar-select", style: style }, children));
};
var Option = function (_a) {
    var iconId = _a.iconId, onClick = _a.onClick, children = _a.children, onMouseLeave = _a.onMouseLeave, onMouseEnter = _a.onMouseEnter;
    return (React.createElement("div", { onClick: onClick, tabIndex: 0, className: "fortune-toolbar-select-option", onMouseLeave: function (e) { return onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(e); }, onMouseEnter: function (e) { return onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(e); } },
        iconId && React.createElement(SVGIcon, { name: iconId }),
        React.createElement("div", { className: "fortuen-toolbar-text" }, children)));
};
export { Option };
export default Select;
