import { locale } from "@evidential-fortune-sheet/core";
import React, { useContext, useState } from "react";
import WorkbookContext from "../../context";
import ColorPicker from "../Toolbar/ColorPicker";
import "./index.css";
export var CustomColor = function (_a) {
    var onCustomPick = _a.onCustomPick, onColorPick = _a.onColorPick;
    var context = useContext(WorkbookContext).context;
    var _b = locale(context), toolbar = _b.toolbar, sheetconfig = _b.sheetconfig, button = _b.button;
    var _c = useState("#000000"), inputColor = _c[0], setInputColor = _c[1];
    return (React.createElement("div", { id: "fortune-custom-color" },
        React.createElement("div", { className: "color-reset", onClick: function () { return onCustomPick(undefined); }, tabIndex: 0 }, sheetconfig.resetColor),
        React.createElement("div", { className: "custom-color" },
            React.createElement("div", null,
                toolbar.customColor,
                ":"),
            React.createElement("input", { type: "color", value: inputColor, onChange: function (e) { return setInputColor(e.target.value); } }),
            React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                    onCustomPick(inputColor);
                }, tabIndex: 0 }, button.confirm)),
        React.createElement(ColorPicker, { onPick: function (color) {
                onColorPick(color);
            } })));
};
