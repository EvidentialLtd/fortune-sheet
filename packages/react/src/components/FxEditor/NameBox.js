import React, { useContext, useMemo } from "react";
import _ from "lodash";
import { getRangetxt } from "@evidential-fortune-sheet/core";
import WorkbookContext from "../../context";
var LocationBox = function () {
    var context = useContext(WorkbookContext).context;
    var rangeText = useMemo(function () {
        var lastSelection = _.last(context.luckysheet_select_save);
        if (!(lastSelection &&
            lastSelection.row_focus != null &&
            lastSelection.column_focus != null))
            return "";
        var rf = lastSelection.row_focus;
        var cf = lastSelection.column_focus;
        if (context.config.merge != null && "".concat(rf, "_").concat(cf) in context.config.merge) {
            return getRangetxt(context, context.currentSheetId, {
                column: [cf, cf],
                row: [rf, rf],
            });
        }
        return getRangetxt(context, context.currentSheetId, lastSelection);
    }, [context.currentSheetId, context.luckysheet_select_save]);
    return (React.createElement("div", { className: "fortune-name-box-container" },
        React.createElement("div", { className: "fortune-name-box", tabIndex: 0, dir: "ltr" }, rangeText)));
};
export default LocationBox;
