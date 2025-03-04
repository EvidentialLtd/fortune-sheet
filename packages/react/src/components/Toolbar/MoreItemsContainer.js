import React, { useRef } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
var MoreItemsContaier = function (_a) {
    var onClose = _a.onClose, children = _a.children;
    var containerRef = useRef(null);
    useOutsideClick(containerRef, function () {
        onClose === null || onClose === void 0 ? void 0 : onClose();
    }, [containerRef, onClose]);
    return (React.createElement("div", { ref: containerRef, className: "fortune-toolbar-more-container" }, children));
};
export default MoreItemsContaier;
