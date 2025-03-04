import { locale, searchAll, searchNext, normalizeSelection, onSearchDialogMoveStart, replace, replaceAll, scrollToHighlightCell, } from "@evidential-fortune-sheet/core";
import produce from "immer";
import React, { useContext, useState, useCallback } from "react";
import _ from "lodash";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import { useAlert } from "../../hooks/useAlert";
import "./index.css";
var SearchReplace = function (_a) {
    var getContainer = _a.getContainer;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var _c = locale(context), findAndReplace = _c.findAndReplace, button = _c.button;
    var _d = useState(""), searchText = _d[0], setSearchText = _d[1];
    var _e = useState(""), replaceText = _e[0], setReplaceText = _e[1];
    var _f = useState(context.showReplace), showReplace = _f[0], setShowReplace = _f[1];
    var _g = useState([]), searchResult = _g[0], setSearchResult = _g[1];
    var _h = useState(), selectedCell = _h[0], setSelectedCell = _h[1];
    var showAlert = useAlert().showAlert;
    var _j = useState({
        regCheck: false,
        wordCheck: false,
        caseCheck: false,
    }), checkMode = _j[0], checkModeReplace = _j[1];
    var closeDialog = useCallback(function () {
        _.set(refs.globalCache, "searchDialog.mouseEnter", false);
        setContext(function (draftCtx) {
            draftCtx.showSearch = false;
            draftCtx.showReplace = false;
        });
    }, [refs.globalCache, setContext]);
    var setCheckMode = useCallback(function (mode, value) {
        return checkModeReplace(produce(function (draft) {
            _.set(draft, mode, value);
        }));
    }, []);
    var getInitialPosition = useCallback(function (container) {
        var rect = container.getBoundingClientRect();
        return {
            left: (rect.width - 500) / 2,
            top: (rect.height - 200) / 3,
        };
    }, []);
    return (React.createElement("div", { id: "fortune-search-replace", className: "fortune-search-replace fortune-dialog", style: getInitialPosition(getContainer()), onMouseEnter: function () {
            _.set(refs.globalCache, "searchDialog.mouseEnter", true);
        }, onMouseLeave: function () {
            _.set(refs.globalCache, "searchDialog.mouseEnter", false);
        }, onMouseDown: function (e) {
            var nativeEvent = e.nativeEvent;
            onSearchDialogMoveStart(refs.globalCache, nativeEvent, getContainer());
            e.stopPropagation();
        } },
        React.createElement("div", { className: "container", onMouseDown: function (e) { return e.stopPropagation(); } },
            React.createElement("div", { className: "icon-close fortune-modal-dialog-icon-close", onClick: closeDialog, tabIndex: 0 },
                React.createElement(SVGIcon, { name: "close", style: { padding: 7, cursor: "pointer" } })),
            React.createElement("div", { className: "tabBox" },
                React.createElement("span", { id: "searchTab", className: showReplace ? "" : "on", onClick: function () { return setShowReplace(false); }, tabIndex: 0 }, findAndReplace.find),
                React.createElement("span", { id: "replaceTab", className: showReplace ? "on" : "", onClick: function () { return setShowReplace(true); }, tabIndex: 0 }, findAndReplace.replace)),
            React.createElement("div", { className: "ctBox" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "inputBox" },
                        React.createElement("div", { className: "textboxs", id: "searchInput" },
                            findAndReplace.findTextbox,
                            "\uFF1A",
                            React.createElement("input", { className: "formulaInputFocus", autoFocus: true, spellCheck: "false", onKeyDown: function (e) { return e.stopPropagation(); }, value: searchText, onChange: function (e) { return setSearchText(e.target.value); } })),
                        showReplace && (React.createElement("div", { className: "textboxs", id: "replaceInput" },
                            findAndReplace.replaceTextbox,
                            "\uFF1A",
                            React.createElement("input", { className: "formulaInputFocus", spellCheck: "false", onKeyDown: function (e) { return e.stopPropagation(); }, value: replaceText, onChange: function (e) { return setReplaceText(e.target.value); } })))),
                    React.createElement("div", { className: "checkboxs" },
                        React.createElement("div", { id: "regCheck" },
                            React.createElement("input", { type: "checkbox", onChange: function (e) { return setCheckMode("regCheck", e.target.checked); } }),
                            React.createElement("span", null, findAndReplace.regexTextbox)),
                        React.createElement("div", { id: "wordCheck" },
                            React.createElement("input", { type: "checkbox", onChange: function (e) { return setCheckMode("wordCheck", e.target.checked); } }),
                            React.createElement("span", null, findAndReplace.wholeTextbox)),
                        React.createElement("div", { id: "caseCheck" },
                            React.createElement("input", { type: "checkbox", onChange: function (e) { return setCheckMode("caseCheck", e.target.checked); } }),
                            React.createElement("span", null, findAndReplace.distinguishTextbox)))),
                React.createElement("div", { className: "btnBox" },
                    showReplace && (React.createElement(React.Fragment, null,
                        React.createElement("div", { id: "replaceAllBtn", className: "fortune-message-box-button button-default", onClick: function () {
                                setContext(function (draftCtx) {
                                    setSelectedCell(undefined);
                                    var alertMsg = replaceAll(draftCtx, searchText, replaceText, checkMode);
                                    showAlert(alertMsg);
                                });
                            }, tabIndex: 0 }, findAndReplace.allReplaceBtn),
                        React.createElement("div", { id: "replaceBtn", className: "fortune-message-box-button button-default", onClick: function () {
                                return setContext(function (draftCtx) {
                                    setSelectedCell(undefined);
                                    var alertMsg = replace(draftCtx, searchText, replaceText, checkMode);
                                    if (alertMsg != null) {
                                        showAlert(alertMsg);
                                    }
                                });
                            }, tabIndex: 0 }, findAndReplace.replaceBtn))),
                    React.createElement("div", { id: "searchAllBtn", className: "fortune-message-box-button button-default", onClick: function () {
                            return setContext(function (draftCtx) {
                                setSelectedCell(undefined);
                                if (!searchText)
                                    return;
                                var res = searchAll(draftCtx, searchText, checkMode);
                                setSearchResult(res);
                                if (_.isEmpty(res))
                                    showAlert(findAndReplace.noFindTip);
                            });
                        }, tabIndex: 0 }, findAndReplace.allFindBtn),
                    React.createElement("div", { id: "searchNextBtn", className: "fortune-message-box-button button-default", onClick: function () {
                            return setContext(function (draftCtx) {
                                setSearchResult([]);
                                var alertMsg = searchNext(draftCtx, searchText, checkMode);
                                if (alertMsg != null)
                                    showAlert(alertMsg);
                            });
                        }, tabIndex: 0 }, findAndReplace.findBtn))),
            React.createElement("div", { className: "close-button fortune-message-box-button button-default", onClick: closeDialog, tabIndex: 0 }, button.close),
            searchResult.length > 0 && (React.createElement("div", { id: "searchAllbox" },
                React.createElement("div", { className: "boxTitle" },
                    React.createElement("span", null, findAndReplace.searchTargetSheet),
                    React.createElement("span", null, findAndReplace.searchTargetCell),
                    React.createElement("span", null, findAndReplace.searchTargetValue)),
                React.createElement("div", { className: "boxMain" }, searchResult.map(function (v) {
                    return (React.createElement("div", { className: "boxItem ".concat(_.isEqual(selectedCell, { r: v.r, c: v.c }) ? "on" : ""), key: v.cellPosition, onClick: function () {
                            setContext(function (draftCtx) {
                                draftCtx.luckysheet_select_save = normalizeSelection(draftCtx, [
                                    {
                                        row: [v.r, v.r],
                                        column: [v.c, v.c],
                                    },
                                ]);
                                scrollToHighlightCell(draftCtx, v.r, v.c);
                            });
                            setSelectedCell({ r: v.r, c: v.c });
                        }, tabIndex: 0 },
                        React.createElement("span", null, v.sheetName),
                        React.createElement("span", null, v.cellPosition),
                        React.createElement("span", null, v.value)));
                })))))));
};
export default SearchReplace;
