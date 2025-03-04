import React from "react";
import SVGIcon from "../SVGIcon";
var Button = function (_a) {
    var tooltip = _a.tooltip, onClick = _a.onClick, iconId = _a.iconId, disabled = _a.disabled, selected = _a.selected, children = _a.children;
    return (React.createElement("div", { className: "fortune-toolbar-button fortune-toolbar-item", onClick: onClick, tabIndex: 0, "data-tips": tooltip, role: "button", "aria-label": tooltip, style: selected ? { backgroundColor: "#E7E5EB" } : {} },
        React.createElement(SVGIcon, { name: iconId, style: disabled ? { opacity: 0.3 } : {} }),
        tooltip && React.createElement("div", { className: "fortune-tooltip" }, tooltip),
        children));
};
export default Button;
