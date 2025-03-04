import React, { useContext, useEffect } from "react";
import WorkbookContext from "../../../context";
import "./index.css";
var ScrollBar = function (_a) {
    var axis = _a.axis;
    var _b = useContext(WorkbookContext), context = _b.context, refs = _b.refs, setContext = _b.setContext;
    useEffect(function () {
        if (axis === "x") {
            refs.scrollbarX.current.scrollLeft = context.scrollLeft;
        }
        else {
            refs.scrollbarY.current.scrollTop = context.scrollTop;
        }
    }, [axis === "x" ? context.scrollLeft : context.scrollTop]);
    return (React.createElement("div", { ref: axis === "x" ? refs.scrollbarX : refs.scrollbarY, style: axis === "x"
            ? {
                left: context.rowHeaderWidth,
                width: "calc(100% - ".concat(context.rowHeaderWidth, "px)"),
            }
            : { height: "100%" }, className: "luckysheet-scrollbars luckysheet-scrollbar-ltr luckysheet-scrollbar-".concat(axis), onScroll: function () {
            if (axis === "x") {
                setContext(function (draftCtx) {
                    draftCtx.scrollLeft = refs.scrollbarX.current.scrollLeft;
                });
            }
            else {
                setContext(function (draftCtx) {
                    draftCtx.scrollTop = refs.scrollbarY.current.scrollTop;
                });
            }
        } },
        React.createElement("div", { style: axis === "x"
                ? { width: context.ch_width, height: 10 }
                : { width: 10, height: context.rh_height } })));
};
export default ScrollBar;
