import React, { useMemo } from "react";
var CustomIcon = function (_a) {
    var iconName = _a.iconName, _b = _a.width, width = _b === void 0 ? 24 : _b, _c = _a.height, height = _c === void 0 ? 24 : _c, content = _a.content;
    var innrContent = useMemo(function () {
        if (iconName) {
            return (React.createElement("svg", { width: width, height: height },
                React.createElement("use", { xlinkHref: "#".concat(iconName) })));
        }
        if (content) {
            return content;
        }
        return (React.createElement("svg", { width: width, height: width },
            React.createElement("use", { xlinkHref: "#default" })));
    }, [content, height, iconName, width]);
    return (React.createElement("div", { style: {
            width: width,
            height: height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        } }, innrContent));
};
export default CustomIcon;
