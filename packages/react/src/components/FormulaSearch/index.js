import React, { useContext, useState, useMemo, useCallback } from "react";
import { cancelNormalSelected, locale, setCaretPosition, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import "./index.css";
export var FormulaSearch = function (_a) {
    var _onCancel = _a.onCancel;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, _c = _b.refs, cellInput = _c.cellInput, globalCache = _c.globalCache;
    var _d = useState(0), selectedType = _d[0], setSelectedType = _d[1];
    var _e = useState(0), selectedFuncIndex = _e[0], setSelectedFuncIndex = _e[1];
    var _f = useState(""), searchText = _f[0], setSearchText = _f[1];
    var _g = locale(context), formulaMore = _g.formulaMore, functionlist = _g.functionlist, button = _g.button;
    var typeList = useMemo(function () { return [
        { t: 0, n: formulaMore.Math },
        { t: 1, n: formulaMore.Statistical },
        { t: 2, n: formulaMore.Lookup },
        { t: 3, n: formulaMore.luckysheet },
        { t: 4, n: formulaMore.dataMining },
        { t: 5, n: formulaMore.Database },
        { t: 6, n: formulaMore.Date },
        { t: 7, n: formulaMore.Filter },
        { t: 8, n: formulaMore.Financial },
        { t: 9, n: formulaMore.Engineering },
        { t: 10, n: formulaMore.Logical },
        { t: 11, n: formulaMore.Operator },
        { t: 12, n: formulaMore.Text },
        { t: 13, n: formulaMore.Parser },
        { t: 14, n: formulaMore.Array },
        { t: -1, n: formulaMore.other },
    ]; }, [formulaMore]);
    var filteredFunctionList = useMemo(function () {
        if (searchText) {
            var list = [];
            var text = _.cloneDeep(searchText.toUpperCase());
            for (var i = 0; i < functionlist.length; i += 1) {
                if (/^[a-zA-Z]+$/.test(text)) {
                    if (functionlist[i].n.indexOf(text) !== -1) {
                        list.push(functionlist[i]);
                    }
                }
                else if (functionlist[i].a.indexOf(text) !== -1) {
                    list.push(functionlist[i]);
                }
            }
            return list;
        }
        return _.filter(functionlist, function (v) { return v.t === selectedType; });
    }, [functionlist, selectedType, searchText]);
    var onConfirm = useCallback(function () {
        var _a;
        var last = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[context.luckysheet_select_save.length - 1];
        var row_index = last === null || last === void 0 ? void 0 : last.row_focus;
        var col_index = last === null || last === void 0 ? void 0 : last.column_focus;
        if (!last) {
            row_index = 0;
            col_index = 0;
        }
        else {
            if (row_index == null) {
                row_index = last.row[0];
            }
            if (col_index == null) {
                col_index = last.column[0];
            }
        }
        var formulaTxt = "<span dir=\"auto\" class=\"luckysheet-formula-text-color\">=</span><span dir=\"auto\" class=\"luckysheet-formula-text-color\">".concat(filteredFunctionList[selectedFuncIndex].n.toUpperCase(), "</span><span dir=\"auto\" class=\"luckysheet-formula-text-color\">(</span>");
        setContext(function (ctx) {
            if (cellInput.current != null) {
                ctx.luckysheetCellUpdate = [row_index, col_index];
                globalCache.doNotUpdateCell = true;
                cellInput.current.innerHTML = formulaTxt;
                var spans = cellInput.current.childNodes;
                if (!_.isEmpty(spans)) {
                    setCaretPosition(ctx, spans[spans.length - 1], 0, 1);
                }
                ctx.functionHint =
                    filteredFunctionList[selectedFuncIndex].n.toUpperCase();
                ctx.functionCandidates = [];
                if (_.isEmpty(ctx.formulaCache.functionlistMap)) {
                    for (var i = 0; i < functionlist.length; i += 1) {
                        ctx.formulaCache.functionlistMap[functionlist[i].n] =
                            functionlist[i];
                    }
                }
                _onCancel();
            }
        });
    }, [
        cellInput,
        context.luckysheet_select_save,
        filteredFunctionList,
        globalCache,
        selectedFuncIndex,
        setContext,
        _onCancel,
        functionlist,
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
    return (React.createElement("div", { id: "luckysheet-search-formula" },
        React.createElement("div", { className: "inpbox" },
            React.createElement("div", null,
                formulaMore.findFunctionTitle,
                "\uFF1A"),
            React.createElement("input", { className: "formulaInputFocus", id: "searchFormulaListInput", placeholder: formulaMore.tipInputFunctionName, spellCheck: "false", onChange: function (e) { return setSearchText(e.target.value); } })),
        React.createElement("div", { className: "selbox" },
            React.createElement("span", null,
                formulaMore.selectCategory,
                "\uFF1A"),
            React.createElement("select", { id: "formulaTypeSelect", onChange: function (e) {
                    setSelectedType(parseInt(e.target.value, 10));
                    setSelectedFuncIndex(0);
                } }, typeList.map(function (v) { return (React.createElement("option", { key: v.t, value: v.t }, v.n)); }))),
        React.createElement("div", { className: "listbox", style: { height: 200 } },
            React.createElement("div", null,
                formulaMore.selectFunctionTitle,
                "\uFF1A"),
            React.createElement("div", { className: "formulaList" }, filteredFunctionList.map(function (v, index) { return (React.createElement("div", { className: "listBox".concat(index === selectedFuncIndex ? " on" : ""), key: v.n, onClick: function () { return setSelectedFuncIndex(index); }, tabIndex: 0 },
                React.createElement("div", null, v.n),
                React.createElement("div", null, v.a))); }))),
        React.createElement("div", { className: "fortune-dialog-box-button-container" },
            React.createElement("div", { className: "fortune-message-box-button button-primary", onClick: onConfirm, tabIndex: 0 }, button.confirm),
            React.createElement("div", { className: "fortune-message-box-button button-default", onClick: onCancel, tabIndex: 0 }, button.cancel))));
};
