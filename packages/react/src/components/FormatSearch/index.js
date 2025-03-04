import React, { useContext, useState, useCallback, useMemo } from "react";
import { cancelNormalSelected, getSheetIndex, locale, update, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import "./index.css";
import { useDialog } from "../../hooks/useDialog";
export var FormatSearch = function (_a) {
    var type = _a.type, _onCancel = _a.onCancel;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, cellInput = _b.refs.cellInput;
    var _c = useState(2), decimalPlace = _c[0], setDecimalPlace = _c[1];
    var _d = useState(0), selectedFormatIndex = _d[0], setSelectedFormatIndex = _d[1];
    var _e = locale(context), button = _e.button, format = _e.format, currencyDetail = _e.currencyDetail, dateFmtList = _e.dateFmtList, numberFmtList = _e.numberFmtList;
    var showDialog = useDialog().showDialog;
    var toolbarFormatAll = useMemo(function () { return ({
        currency: currencyDetail,
        date: dateFmtList,
        number: numberFmtList,
    }); }, [currencyDetail, dateFmtList, numberFmtList]);
    var toolbarFormat = useMemo(function () { return toolbarFormatAll[type]; }, [toolbarFormatAll, type]);
    var tips = _.get(format, type);
    var onConfirm = useCallback(function () {
        if (decimalPlace < 0 || decimalPlace > 9) {
            _onCancel();
            showDialog(format.tipDecimalPlaces, "ok");
            return;
        }
        setContext(function (ctx) {
            var index = getSheetIndex(ctx, ctx.currentSheetId);
            if (_.isNil(index))
                return;
            var selectedFormatVal = toolbarFormat[selectedFormatIndex].value;
            var selectedFormatPos;
            if ("pos" in toolbarFormat[selectedFormatIndex])
                selectedFormatPos = toolbarFormat[selectedFormatIndex].pos || "before";
            _.forEach(ctx.luckysheet_select_save, function (selection) {
                var _a, _b, _c, _d;
                for (var r = selection.row[0]; r <= selection.row[1]; r += 1) {
                    for (var c = selection.column[0]; c <= selection.column[1]; c += 1) {
                        if (((_a = ctx.luckysheetfile[index].data) === null || _a === void 0 ? void 0 : _a[r][c]) &&
                            ((_d = (_c = (_b = ctx.luckysheetfile[index].data) === null || _b === void 0 ? void 0 : _b[r][c]) === null || _c === void 0 ? void 0 : _c.ct) === null || _d === void 0 ? void 0 : _d.t) === "n") {
                            var zero = 0;
                            if (selectedFormatPos === "after") {
                                ctx.luckysheetfile[index].data[r][c].ct.fa = zero
                                    .toFixed(decimalPlace)
                                    .concat("".concat(selectedFormatVal));
                                ctx.luckysheetfile[index].data[r][c].m = update(zero.toFixed(decimalPlace).concat("".concat(selectedFormatVal)), ctx.luckysheetfile[index].data[r][c].v);
                            }
                            else {
                                ctx.luckysheetfile[index].data[r][c].ct.fa =
                                    "".concat(selectedFormatVal).concat(zero.toFixed(decimalPlace));
                                ctx.luckysheetfile[index].data[r][c].m = update("".concat(selectedFormatVal).concat(zero.toFixed(decimalPlace)), ctx.luckysheetfile[index].data[r][c].v);
                            }
                        }
                    }
                }
            });
            _onCancel();
        });
    }, [
        _onCancel,
        decimalPlace,
        format.tipDecimalPlaces,
        selectedFormatIndex,
        setContext,
        showDialog,
        toolbarFormat,
    ]);
    var onCancel = useCallback(function () {
        setContext(function (ctx) {
            cancelNormalSelected(ctx);
            if (cellInput.current) {
                cellInput.current.innerHTML = "";
            }
        });
        _onCancel();
    }, [_onCancel, cellInput, setContext]);
    return (React.createElement("div", { id: "luckysheet-search-format" },
        React.createElement("div", { className: "listbox", style: { height: 200 } },
            React.createElement("div", { style: { marginBottom: 16 } },
                tips,
                format.format,
                "\uFF1A"),
            React.createElement("div", { className: "inpbox", style: { display: "block" } },
                format.decimalPlaces,
                "\uFF1A",
                React.createElement("input", { className: "decimal-places-input", id: "decimal-places-input", min: 0, max: 9, defaultValue: 2, type: "number", onChange: function (e) {
                        setDecimalPlace(parseInt(e.target.value, 10));
                    } })),
            React.createElement("div", { className: "format-list" }, toolbarFormat.map(function (v, index) { return (React.createElement("div", { className: "listBox".concat(index === selectedFormatIndex ? " on" : ""), key: v.name, onClick: function () {
                    setSelectedFormatIndex(index);
                }, tabIndex: 0 },
                React.createElement("div", null, v.name),
                React.createElement("div", null, v.value))); }))),
        React.createElement("div", { className: "fortune-dialog-box-button-container", style: { marginTop: 40 } },
            React.createElement("div", { className: "fortune-message-box-button button-primary", onClick: onConfirm, tabIndex: 0 }, button.confirm),
            React.createElement("div", { className: "fortune-message-box-button button-default", onClick: onCancel, tabIndex: 0 }, button.cancel))));
};
