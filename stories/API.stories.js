import React, { useCallback, useRef, useState } from "react";
import { Workbook } from "@evidential-fortune-sheet/react";
export default {
    component: Workbook,
};
var ApiExecContainer = function (_a) {
    var children = _a.children, onRun = _a.onRun;
    var _b = useState(), result = _b[0], setResult = _b[1];
    return (React.createElement("div", { style: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
        } },
        React.createElement("div", { style: { flexShrink: 0, padding: 8 } },
            React.createElement("button", { type: "button", onClick: function () {
                    setResult(onRun === null || onRun === void 0 ? void 0 : onRun());
                }, tabIndex: 0 }, "Run"),
            React.createElement("span", { style: { marginLeft: 16 } }, result && (React.createElement(React.Fragment, null,
                React.createElement("span", { style: { color: "#aaa" } }, "result: "),
                " ",
                result)))),
        React.createElement("div", { style: { flex: 1 } }, children)));
};
export var GetCellValue = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "fortune" } }],
            order: 0,
            row: 1,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getCellValue(0, 0);
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var OpenReplace = function () {
    var ref = useRef(null);
    var searchReplace = false;
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "fortune" } }],
            order: 0,
            row: 1,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setSearchReplace(!searchReplace);
            searchReplace = !searchReplace;
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var ChangeDragMode = function () {
    var ref = useRef(null);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setTouchMode("select");
        } },
        React.createElement(Workbook, { ref: ref, data: [{ name: "Sheet1", }] })));
};
export var SetCellValue = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            order: 0,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a, _b, _c, _d, _e, _f;
            for (var i = 0; i < 5; i += 1) {
                for (var j = 0; j < 5; j += 1) {
                    (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setCellValue(i, j, "".concat(i + j));
                }
            }
            (_b = ref.current) === null || _b === void 0 ? void 0 : _b.setCellValue(0, 5, "=SUM(A1:E1)");
            (_c = ref.current) === null || _c === void 0 ? void 0 : _c.setCellValue(1, 5, "=SUM(A2:E2)");
            (_d = ref.current) === null || _d === void 0 ? void 0 : _d.setCellValue(2, 5, "=SUM(A3:E3)");
            (_e = ref.current) === null || _e === void 0 ? void 0 : _e.setCellValue(3, 5, "=SUM(A4:E4)");
            (_f = ref.current) === null || _f === void 0 ? void 0 : _f.setCellValue(4, 5, "=SUM(A5:E5)");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var ClearCell = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { bg: "green", v: "fortune", m: "fortune" } },
            ],
            order: 0,
            row: 1,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.clearCell(0, 0);
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var SetCellFormat = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "set bg = green" } }],
            order: 0,
            row: 1,
            column: 1,
            config: { columnlen: { "0": 120 } },
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setCellFormat(0, 0, "bg", "green");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var AutoFillCell = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { m: "1", v: 1, ct: { t: "n", fa: "General" } } },
                { r: 0, c: 1, v: { m: "2", v: 2, ct: { t: "n", fa: "General" } } },
                { r: 1, c: 0, v: { m: "2", v: 2, ct: { t: "n", fa: "General" } } },
                { r: 1, c: 1, v: { m: "4", v: 4, ct: { t: "n", fa: "General" } } },
            ],
            order: 0,
            row: 10,
            column: 2,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.autoFillCell({ row: [0, 1], column: [0, 1] }, { row: [2, 9], column: [0, 1] }, "down");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var Freeze = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            order: 0,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.freeze("both", { row: 1, column: 1 });
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var InsertRowCol = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "original" } }],
            order: 0,
            row: 1,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a, _b, _c, _d;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.insertRowOrColumn("row", 0, 1);
            (_b = ref.current) === null || _b === void 0 ? void 0 : _b.setCellValue(1, 0, "inserted");
            (_c = ref.current) === null || _c === void 0 ? void 0 : _c.insertRowOrColumn("column", 0, 1);
            (_d = ref.current) === null || _d === void 0 ? void 0 : _d.setCellValue(0, 1, "inserted");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var DeleteRowCol = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 1, c: 0, v: { v: "1" } },
                { r: 2, c: 0, v: { v: "2" } },
                { r: 3, c: 0, v: { v: "3" } },
                { r: 4, c: 0, v: { v: "4" } },
            ],
            order: 0,
            row: 5,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.deleteRowOrColumn("row", 1, 3);
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var GetRowHeight = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            config: { rowlen: { 2: 200 } },
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 1, c: 0, v: { v: "1" } },
                { r: 2, c: 0, v: { v: "2" } },
                { r: 3, c: 0, v: { v: "3" } },
                { r: 4, c: 0, v: { v: "4" } },
            ],
            order: 0,
            row: 5,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return JSON.stringify((_a = ref.current) === null || _a === void 0 ? void 0 : _a.getRowHeight([0, 1, 2, 3, 4]));
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var GetColumnWidth = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            config: { columnlen: { 2: 200 } },
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 0, c: 1, v: { v: "1" } },
                { r: 0, c: 2, v: { v: "2" } },
                { r: 0, c: 3, v: { v: "3" } },
                { r: 0, c: 4, v: { v: "4" } },
            ],
            order: 0,
            row: 1,
            column: 5,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return JSON.stringify((_a = ref.current) === null || _a === void 0 ? void 0 : _a.getColumnWidth([0, 1, 2, 3, 4]));
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var SetRowHeight = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 1, c: 0, v: { v: "1" } },
                { r: 2, c: 0, v: { v: "height = 100" } },
                { r: 3, c: 0, v: { v: "3" } },
                { r: 4, c: 0, v: { v: "4" } },
            ],
            order: 0,
            row: 5,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setRowHeight({ "2": 100 });
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var HideRow = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 1, c: 0, v: { v: "1" } },
                { r: 2, c: 0, v: { v: "hide this!" } },
                { r: 3, c: 0, v: { v: "3" } },
                { r: 4, c: 0, v: { v: "4" } },
            ],
            order: 0,
            row: 5,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.hideRowOrColumn(["2"], "row");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var ShowRow = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 1, c: 0, v: { v: "1" } },
                { r: 2, c: 0, v: { v: "show this" } },
                { r: 3, c: 0, v: { v: "3" } },
                { r: 4, c: 0, v: { v: "4" } },
            ],
            config: {
                rowhidden: {
                    "2": 0,
                },
            },
            order: 0,
            row: 5,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.showRowOrColumn(["2"], "row");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var SetColumnWidth = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 0, c: 1, v: { v: "1" } },
                { r: 0, c: 2, v: { v: "width = 200" } },
                { r: 0, c: 3, v: { v: "3" } },
                { r: 0, c: 4, v: { v: "4" } },
            ],
            order: 0,
            row: 1,
            column: 5,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setColumnWidth({ "2": 200 });
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var GetSelection = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            luckysheet_select_save: [{ row: [0, 1], column: [1, 2] }],
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 0, c: 1, v: { v: "1" } },
                { r: 0, c: 2, v: { v: "2" } },
                { r: 0, c: 3, v: { v: "3" } },
                { r: 0, c: 4, v: { v: "4" } },
                { r: 1, c: 0, v: { v: "0" } },
                { r: 1, c: 1, v: { v: "1" } },
                { r: 1, c: 2, v: { v: "2" } },
                { r: 1, c: 3, v: { v: "3" } },
                { r: 1, c: 4, v: { v: "4" } },
            ],
            order: 0,
            row: 2,
            column: 5,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return JSON.stringify((_a = ref.current) === null || _a === void 0 ? void 0 : _a.getSelection());
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var SetSelection = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 0, c: 1, v: { v: "1" } },
                { r: 0, c: 2, v: { v: "2" } },
                { r: 0, c: 3, v: { v: "3" } },
                { r: 0, c: 4, v: { v: "4" } },
                { r: 1, c: 0, v: { v: "0" } },
                { r: 1, c: 1, v: { v: "1" } },
                { r: 1, c: 2, v: { v: "2" } },
                { r: 1, c: 3, v: { v: "3" } },
                { r: 1, c: 4, v: { v: "4" } },
            ],
            order: 0,
            row: 2,
            column: 5,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setSelection([{ row: [0, 1], column: [1, 2] }]);
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var MergeCells = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 0, c: 1, v: { v: "1" } },
                { r: 0, c: 2, v: { v: "2" } },
                { r: 0, c: 3, v: { v: "3" } },
                { r: 0, c: 4, v: { v: "4" } },
                { r: 1, c: 0, v: { v: "0" } },
                { r: 1, c: 1, v: { v: "1" } },
                { r: 1, c: 2, v: { v: "2" } },
                { r: 1, c: 3, v: { v: "3" } },
                { r: 1, c: 4, v: { v: "4" } },
            ],
            order: 0,
            row: 2,
            column: 5,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.mergeCells([{ row: [0, 1], column: [1, 2] }], "merge-all");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var GetAllSheets = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 0, c: 1, v: { v: "1" } },
            ],
            order: 0,
            row: 1,
            column: 2,
        },
        {
            name: "Sheet2",
            celldata: [
                { r: 0, c: 0, v: { v: "0" } },
                { r: 1, c: 0, v: { v: "1" } },
            ],
            order: 1,
            row: 2,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return JSON.stringify((_a = ref.current) === null || _a === void 0 ? void 0 : _a.getAllSheets());
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var AddSheet = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            id: "1",
            name: "Sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "1" } }],
            order: 0,
            row: 1,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.addSheet();
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var DeleteSheet = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            id: "1",
            name: "Sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "1" } }],
            order: 0,
            row: 1,
            column: 1,
        },
        {
            id: "2",
            name: "Sheet2",
            celldata: [{ r: 0, c: 0, v: { v: "2" } }],
            order: 1,
            row: 1,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.deleteSheet({ id: "2" });
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var UpdateSheet = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            id: "1",
            name: "sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "1" } }],
            order: 0,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.updateSheet([
                {
                    id: "1",
                    name: "lvjing",
                    data: [[{ v: "1" }]],
                    order: 0,
                    row: 10,
                    column: 20,
                    luckysheet_select_save: [
                        {
                            row: [2, 4],
                            column: [4, 6],
                            column_focus: 6,
                            height: 19,
                            height_move: 59,
                            left: 444,
                            left_move: 296,
                            row_focus: 4,
                            top: 80,
                            top_move: 40,
                            width: 73,
                            width_move: 221,
                        },
                    ],
                },
                {
                    id: "2",
                    name: "lvjing2",
                    data: [[{ v: "12" }, { v: "lvjing" }]],
                    order: 1,
                },
                {
                    id: "3",
                    name: "lvjing3",
                    celldata: [
                        {
                            r: 0,
                            c: 0,
                            v: {
                                v: "1",
                                ct: {
                                    fa: "General",
                                    t: "n",
                                },
                                m: "1",
                            },
                        },
                        {
                            r: 1,
                            c: 0,
                            v: {
                                mc: {
                                    r: 1,
                                    c: 0,
                                    rs: 2,
                                    cs: 2,
                                },
                            },
                        },
                        {
                            r: 1,
                            c: 1,
                            v: {
                                mc: {
                                    r: 1,
                                    c: 0,
                                },
                            },
                        },
                        {
                            r: 2,
                            c: 0,
                            v: {
                                mc: {
                                    r: 1,
                                    c: 0,
                                },
                            },
                        },
                        {
                            r: 2,
                            c: 1,
                            v: {
                                mc: {
                                    r: 1,
                                    c: 0,
                                },
                            },
                        },
                    ],
                    row: 20,
                    column: 20,
                    order: 3,
                },
            ]);
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var ActivateSheet = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            id: "1",
            name: "Sheet1",
            celldata: [{ r: 0, c: 0, v: { v: "1" } }],
            order: 0,
            row: 1,
            column: 1,
        },
        {
            id: "2",
            name: "Sheet2",
            celldata: [{ r: 0, c: 0, v: { v: "2" } }],
            order: 1,
            row: 1,
            column: 1,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.activateSheet({ id: "2" });
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var SetSheetName = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            order: 0,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setSheetName("Fortune");
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var SetSheetOrder = function () {
    var ref = useRef(null);
    var _a = useState([
        { id: "1", name: "Sheet1", order: 0 },
        { id: "2", name: "Sheet2", order: 1 },
        { id: "3", name: "Sheet3", order: 2 },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.setSheetOrder({
                "1": 3,
                "2": 1,
                "3": 2,
            });
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var Scroll = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            order: 0,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.scroll({
                targetRow: 60,
            });
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var Undo = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            order: 0,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return JSON.stringify((_a = ref.current) === null || _a === void 0 ? void 0 : _a.handleUndo());
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
export var Redo = function () {
    var ref = useRef(null);
    var _a = useState([
        {
            name: "Sheet1",
            order: 0,
        },
    ]), data = _a[0], setData = _a[1];
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    return (React.createElement(ApiExecContainer, { onRun: function () {
            var _a;
            return JSON.stringify((_a = ref.current) === null || _a === void 0 ? void 0 : _a.handleRedo());
        } },
        React.createElement(Workbook, { ref: ref, data: data, onChange: onChange })));
};
