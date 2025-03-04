import { getSheetIndex, indexToColumnChar, locale, sortSelection, } from "@evidential-fortune-sheet/core";
import React, { useCallback, useContext, useEffect, useState, } from "react";
import WorkbookContext from "../../context";
import "./index.css";
import { useDialog } from "../../hooks/useDialog";
var CustomSort = function () {
    var _a = useState([]), rangeColChar = _a[0], setRangeColChar = _a[1];
    var _b = useState(true), ascOrDesc = _b[0], setAscOrDesc = _b[1];
    var _c = useContext(WorkbookContext), context = _c.context, setContext = _c.setContext;
    var _d = useState("0"), selectedValue = _d[0], setSelectedValue = _d[1];
    var _e = useState(false), isTitleChange = _e[0], setIstitleChange = _e[1];
    var sort = locale(context).sort;
    var hideDialog = useDialog().hideDialog;
    var col_start = context.luckysheet_select_save[0].column[0];
    var col_end = context.luckysheet_select_save[0].column[1];
    var row_start = context.luckysheet_select_save[0].row[0];
    var row_end = context.luckysheet_select_save[0].row[1];
    var sheetIndex = getSheetIndex(context, context.currentSheetId);
    var handleSelectChange = function (event) {
        setSelectedValue(event.target.value);
    };
    var handleRadioChange = useCallback(function (e) {
        var sortValue = e.target.value;
        setAscOrDesc(sortValue === "asc");
    }, []);
    var handleTitleChange = useCallback(function (e) {
        var value = e.target.checked;
        setIstitleChange(value);
    }, []);
    useEffect(function () {
        var _a, _b;
        var list = [];
        if (isTitleChange) {
            for (var i = col_start; i <= col_end; i += 1) {
                var cell = (_b = (_a = context.luckysheetfile[sheetIndex].data) === null || _a === void 0 ? void 0 : _a[row_start]) === null || _b === void 0 ? void 0 : _b[i];
                var colHeaderValue = (cell === null || cell === void 0 ? void 0 : cell.m) || (cell === null || cell === void 0 ? void 0 : cell.v);
                if (colHeaderValue) {
                    list.push(colHeaderValue);
                }
                else {
                    var ColumnChar = indexToColumnChar(i);
                    list.push("".concat(sort.columnOperation, " ").concat(ColumnChar));
                }
            }
        }
        else {
            for (var i = col_start; i <= col_end; i += 1) {
                var ColumnChar = indexToColumnChar(i);
                list.push(ColumnChar);
            }
        }
        setRangeColChar(list);
    }, [
        col_end,
        col_start,
        context.luckysheetfile,
        isTitleChange,
        row_start,
        sheetIndex,
        sort.columnOperation,
    ]);
    return (React.createElement("div", { className: "fortune-sort" },
        React.createElement("div", { className: "fortune-sort-title" },
            React.createElement("span", null,
                React.createElement("span", null, sort.sortRangeTitle),
                indexToColumnChar(col_start),
                row_start + 1,
                React.createElement("span", null, sort.sortRangeTitleTo),
                indexToColumnChar(col_end),
                row_end + 1)),
        React.createElement("div", null,
            React.createElement("div", { className: "fortune-sort-modal" },
                React.createElement("div", null,
                    React.createElement("input", { type: "checkbox", id: "fortune-sort-haveheader", onChange: handleTitleChange }),
                    React.createElement("span", null, sort.hasTitle)),
                React.createElement("div", { className: "fortune-sort-tablec" },
                    React.createElement("table", { cellSpacing: "0" },
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                React.createElement("td", { style: { width: "190px" } },
                                    sort.sortBy,
                                    React.createElement("select", { name: "sort_0", onChange: handleSelectChange }, rangeColChar.map(function (col, index) {
                                        return (React.createElement("option", { value: index, key: index }, col));
                                    }))),
                                React.createElement("td", null,
                                    React.createElement("div", null,
                                        React.createElement("input", { type: "radio", value: "asc", defaultChecked: true, name: "sort_0", onChange: handleRadioChange }),
                                        React.createElement("span", null, sort.asc)),
                                    React.createElement("div", null,
                                        React.createElement("input", { type: "radio", value: "desc", name: "sort_0", onChange: handleRadioChange }),
                                        React.createElement("span", null, sort.desc))))))))),
        React.createElement("div", { className: "fortune-sort-button" },
            React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                    setContext(function (draftCtx) {
                        sortSelection(draftCtx, ascOrDesc, parseInt(selectedValue, 10));
                        draftCtx.contextMenu = {};
                    });
                    hideDialog();
                }, tabIndex: 0 }, sort.confirm))));
};
export default CustomSort;
