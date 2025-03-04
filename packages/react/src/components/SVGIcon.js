import React from "react";
var SVGIcon = function (_a) {
    var _b = _a.width, width = _b === void 0 ? 24 : _b, _c = _a.height, height = _c === void 0 ? 24 : _c, name = _a.name, style = _a.style;
    return (React.createElement("svg", { width: width, height: height, style: style, "aria-hidden": "true" },
        React.createElement("use", { xlinkHref: "#".concat(name) })));
};
export default SVGIcon;
