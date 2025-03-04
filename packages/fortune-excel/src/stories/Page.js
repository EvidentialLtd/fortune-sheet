import React from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { exportToolBarItem, importToolBarItem } from "@corbe30/fortune-excel";
import { ImportHelper } from "@corbe30/fortune-excel";
export var Page = function () {
    var _a = React.useState(0), key = _a[0], setKey = _a[1];
    var _b = React.useState([{ name: "Sheet1" }]), sheets = _b[0], setSheets = _b[1];
    var sheetRef = React.useRef(null);
    return (React.createElement("div", { style: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
        } },
        React.createElement(ImportHelper, { setKey: setKey, setSheets: setSheets, sheetRef: sheetRef }),
        React.createElement(Workbook, { key: key, data: sheets, ref: sheetRef, customToolbarItems: [importToolBarItem(), exportToolBarItem(sheetRef)] })));
};
