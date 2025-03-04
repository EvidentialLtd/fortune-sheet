import React, { useRef, useEffect } from "react";
var Menu = function (_a) {
    var onClick = _a.onClick, onMouseLeave = _a.onMouseLeave, onMouseEnter = _a.onMouseEnter, children = _a.children;
    useEffect(function () {
        var element = document.querySelector(".luckysheet-cols-menuitem");
        if (element) {
            element.focus();
        }
    }, []);
    var containerRef = useRef(null);
    return (React.createElement("div", { ref: containerRef, className: "luckysheet-cols-menuitem luckysheet-mousedown-cancel", onClick: function (e) { return onClick === null || onClick === void 0 ? void 0 : onClick(e, containerRef.current); }, onMouseLeave: function (e) { return onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave(e, containerRef.current); }, onMouseEnter: function (e) { return onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter(e, containerRef.current); }, tabIndex: 0 },
        React.createElement("div", { className: "luckysheet-cols-menuitem-content luckysheet-mousedown-cancel" }, children)));
};
export default Menu;
