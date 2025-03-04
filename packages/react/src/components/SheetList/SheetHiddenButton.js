import { api } from "@evidential-fortune-sheet/core";
import React, { useCallback, useContext } from "react";
import SVGIcon from "../SVGIcon";
import WorkbookContext from "../../context";
var SheetHiddenButton = function (_a) {
    var style = _a.style, sheet = _a.sheet;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext;
    var showSheet = useCallback(function () {
        if (context.allowEdit === false)
            return;
        if (!sheet)
            return;
        setContext(function (ctx) {
            api.showSheet(ctx, sheet.id);
        });
    }, [context.allowEdit, setContext, sheet]);
    return (React.createElement("div", { style: style, onClick: function (e) {
            e.stopPropagation();
            showSheet();
        }, tabIndex: 0, className: "fortune-sheet-hidden-button" }, (sheet === null || sheet === void 0 ? void 0 : sheet.hide) === 1 ? (React.createElement(SVGIcon, { name: "hidden", width: 16, height: 16, style: {
            marginTop: "7px",
        } })) : ("")));
};
export default SheetHiddenButton;
