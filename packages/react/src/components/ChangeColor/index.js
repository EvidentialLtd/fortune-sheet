import { getSheetIndex, locale } from "@evidential-fortune-sheet/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import WorkbookContext from "../../context";
import ColorPicker from "../Toolbar/ColorPicker";
import "./index.css";
export var ChangeColor = function (_a) {
    var triggerParentUpdate = _a.triggerParentUpdate;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext;
    var _c = locale(context), toolbar = _c.toolbar, sheetconfig = _c.sheetconfig, button = _c.button;
    var _d = useState("#000000"), inputColor = _d[0], setInputColor = _d[1];
    var _e = useState(context.luckysheetfile[getSheetIndex(context, context.currentSheetId)].color), selectColor = _e[0], setSelectColor = _e[1];
    var certainBtn = useCallback(function () {
        setSelectColor(inputColor);
    }, [inputColor]);
    useEffect(function () {
        setContext(function (ctx) {
            if (ctx.allowEdit === false)
                return;
            var index = getSheetIndex(ctx, ctx.currentSheetId);
            ctx.luckysheetfile[index].color = selectColor;
        });
    }, [selectColor, setContext]);
    return (React.createElement("div", { id: "fortune-change-color" },
        React.createElement("div", { className: "color-reset", onClick: function () { return setSelectColor(undefined); }, tabIndex: 0 }, sheetconfig.resetColor),
        React.createElement("div", { className: "custom-color" },
            React.createElement("div", null,
                toolbar.customColor,
                ":"),
            React.createElement("input", { type: "color", value: inputColor, onChange: function (e) { return setInputColor(e.target.value); }, onFocus: function () {
                    triggerParentUpdate(true);
                }, onBlur: function () {
                    triggerParentUpdate(false);
                } }),
            React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                    certainBtn();
                }, tabIndex: 0 }, button.confirm)),
        React.createElement(ColorPicker, { onPick: function (color) {
                setInputColor(color);
                setSelectColor(color);
            } })));
};
