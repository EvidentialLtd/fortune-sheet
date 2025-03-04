import React from "react";
import CustomIcon from "./CustomIcon";
var CustomButton = function (_a) {
    var tooltip = _a.tooltip, onClick = _a.onClick, selected = _a.selected, children = _a.children, iconName = _a.iconName, icon = _a.icon;
    return (React.createElement("div", { className: "fortune-toolbar-button fortune-toolbar-item", onClick: onClick, tabIndex: 0, "data-tips": tooltip, role: "button", style: selected ? { backgroundColor: "#E7E5EB" } : {} },
        React.createElement(CustomIcon, { iconName: iconName, content: icon }),
        tooltip && React.createElement("div", { className: "fortune-tooltip" }, tooltip),
        children));
};
export default CustomButton;
