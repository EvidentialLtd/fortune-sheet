import { getDataArr, getFlowdata, getRegStr, locale, updateMoreCell, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import React, { useContext, useEffect, useState, useCallback, useRef, } from "react";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
import "./index.css";
export var SplitColumn = function () {
    var _a = useContext(WorkbookContext), context = _a.context, setContext = _a.setContext;
    var _b = locale(context), splitText = _b.splitText, button = _b.button;
    var _c = useState(""), splitOperate = _c[0], setSplitOperate = _c[1];
    var _d = useState(false), otherFlag = _d[0], setOtherFlag = _d[1];
    var _e = useState([]), tableData = _e[0], setTableData = _e[1];
    var splitSymbols = useRef(null);
    var _f = useDialog(), showDialog = _f.showDialog, hideDialog = _f.hideDialog;
    var certainBtn = useCallback(function () {
        hideDialog();
        var dataArr = getDataArr(splitOperate, context);
        var r = context.luckysheet_select_save[0].row[0];
        var c = context.luckysheet_select_save[0].column[0];
        if (dataArr[0].length === 1) {
            return;
        }
        var dataCover = false;
        var data = getFlowdata(context);
        for (var i = 0; i < dataArr.length; i += 1) {
            for (var j = 1; j < dataArr[0].length; j += 1) {
                var cell = data[r + i][c + j];
                if (!_.isNull(cell) && !_.isNull(cell.v)) {
                    dataCover = true;
                    break;
                }
            }
        }
        if (dataCover) {
            showDialog(splitText.splitConfirmToExe, "yesno", function () {
                hideDialog();
                setContext(function (ctx) {
                    updateMoreCell(r, c, dataArr, ctx);
                });
            });
        }
        else {
            setContext(function (ctx) {
                updateMoreCell(r, c, dataArr, ctx);
            });
        }
    }, [
        context,
        hideDialog,
        setContext,
        showDialog,
        splitOperate,
        splitText.splitConfirmToExe,
    ]);
    useEffect(function () {
        setTableData(function (table) {
            table = getDataArr(splitOperate, context);
            return table;
        });
    }, [context, splitOperate]);
    return (React.createElement("div", { id: "fortune-split-column" },
        React.createElement("div", { className: "title" }, splitText.splitTextTitle),
        React.createElement("div", { className: "splitDelimiters" }, splitText.splitDelimiters),
        React.createElement("div", { className: "splitSymbols", ref: splitSymbols },
            splitText.splitSymbols.map(function (o) { return (React.createElement("div", { key: o.value, className: "splitSymbol" },
                React.createElement("input", { id: o.value, name: o.value, type: "checkbox", onClick: function () {
                        return setSplitOperate(function (regStr) {
                            var _a;
                            return getRegStr(regStr, (_a = splitSymbols.current) === null || _a === void 0 ? void 0 : _a.childNodes);
                        });
                    }, tabIndex: 0 }),
                React.createElement("label", { htmlFor: o.value }, o.name))); }),
            React.createElement("div", { className: "splitSymbol" },
                React.createElement("input", { id: "other", name: "other", type: "checkbox", onClick: function () {
                        setOtherFlag(!otherFlag);
                        setSplitOperate(function (regStr) {
                            var _a;
                            return getRegStr(regStr, (_a = splitSymbols.current) === null || _a === void 0 ? void 0 : _a.childNodes);
                        });
                    }, tabIndex: 0 }),
                React.createElement("label", { htmlFor: "other" }, splitText.splitOther),
                React.createElement("input", { id: "otherValue", name: "otherValue", type: "text", onBlur: function () {
                        if (otherFlag) {
                            setSplitOperate(function (regStr) {
                                var _a;
                                return getRegStr(regStr, (_a = splitSymbols.current) === null || _a === void 0 ? void 0 : _a.childNodes);
                            });
                        }
                    } })),
            React.createElement("div", { className: "splitSymbol splitSimple" },
                React.createElement("input", { id: "splitsimple", name: "splitsimple", type: "checkbox", onClick: function () {
                        setSplitOperate(function (regStr) {
                            var _a;
                            return getRegStr(regStr, (_a = splitSymbols.current) === null || _a === void 0 ? void 0 : _a.childNodes);
                        });
                    }, tabIndex: 0 }),
                React.createElement("label", { htmlFor: "splitsimple" }, splitText.splitContinueSymbol))),
        React.createElement("div", { className: "splitDataPreview" }, splitText.splitDataPreview),
        React.createElement("div", { className: "splitColumnData" },
            React.createElement("table", null,
                React.createElement("tbody", null, tableData.map(function (o, index) {
                    if (o.length >= 1) {
                        return (React.createElement("tr", { key: index }, o.map(function (o1) { return (React.createElement("td", { key: o + o1 }, o1)); })));
                    }
                    return (React.createElement("tr", null,
                        React.createElement("td", null)));
                })))),
        React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                certainBtn();
            }, tabIndex: 0 }, button.confirm),
        React.createElement("div", { className: "button-basic button-close", onClick: function () {
                hideDialog();
            }, tabIndex: 0 }, button.cancel)));
};
