var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { locale, handleCopy, handlePasteByClick, deleteRowCol, insertRowCol, removeActiveImage, deleteSelectedCellText, sortSelection, createFilter, showImgChooser, handleLink, hideSelected, showSelected, getSheetIndex, api, isAllowEdit, jfrefreshgrid, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import React, { useContext, useRef, useCallback, useLayoutEffect } from "react";
import regeneratorRuntime from "regenerator-runtime";
import WorkbookContext from "../../context";
import { useAlert } from "../../hooks/useAlert";
import { useDialog } from "../../hooks/useDialog";
import Divider from "./Divider";
import "./index.css";
import Menu from "./Menu";
import CustomSort from "../CustomSort";
var ContextMenu = function () {
    var showDialog = useDialog().showDialog;
    var containerRef = useRef(null);
    var _a = useContext(WorkbookContext), context = _a.context, setContext = _a.setContext, settings = _a.settings, refs = _a.refs;
    var contextMenu = context.contextMenu;
    var showAlert = useAlert().showAlert;
    var _b = locale(context), rightclick = _b.rightclick, drag = _b.drag, generalDialog = _b.generalDialog, info = _b.info;
    var getMenuElement = useCallback(function (name, i) {
        var _a, _b, _c, _d, _e;
        var selection = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[0];
        if (name === "|") {
            return React.createElement(Divider, { key: "divider-".concat(i) });
        }
        if (name === "copy") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        var _a;
                        if (((_a = draftCtx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                            showAlert(rightclick.noMulti, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        handleCopy(draftCtx);
                        draftCtx.contextMenu = {};
                    });
                } }, rightclick.copy));
        }
        if (name === "paste" && regeneratorRuntime) {
            return (React.createElement(Menu, { key: name, onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clipboardText, sessionClipboardText, err_1, finalText;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                clipboardText = "";
                                sessionClipboardText = sessionStorage.getItem("localClipboard") || "";
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, navigator.clipboard.readText()];
                            case 2:
                                clipboardText = _a.sent();
                                return [3, 4];
                            case 3:
                                err_1 = _a.sent();
                                console.warn("Clipboard access blocked. Attempting to use sessionStorage fallback.");
                                return [3, 4];
                            case 4:
                                finalText = clipboardText || sessionClipboardText;
                                setContext(function (draftCtx) {
                                    handlePasteByClick(draftCtx, finalText);
                                    draftCtx.contextMenu = {};
                                });
                                return [2];
                        }
                    });
                }); } }, rightclick.paste));
        }
        if (name === "insert-column") {
            return (selection === null || selection === void 0 ? void 0 : selection.row_select)
                ? null
                : ["left", "right"].map(function (dir) {
                    var _a, _b;
                    return (React.createElement(Menu, { key: "add-col-".concat(dir), onClick: function (e) {
                            var _a, _b, _c, _d;
                            var position = (_c = (_b = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.column) === null || _c === void 0 ? void 0 : _c[0];
                            if (position == null)
                                return;
                            var countStr = (_d = e.target.querySelector("input")) === null || _d === void 0 ? void 0 : _d.value;
                            if (countStr == null)
                                return;
                            var count = parseInt(countStr, 10);
                            if (count < 1)
                                return;
                            var direction = dir === "left" ? "lefttop" : "rightbottom";
                            var insertRowColOp = {
                                type: "column",
                                index: position,
                                count: count,
                                direction: direction,
                                id: context.currentSheetId,
                            };
                            setContext(function (draftCtx) {
                                try {
                                    insertRowCol(draftCtx, insertRowColOp);
                                    draftCtx.contextMenu = {};
                                }
                                catch (err) {
                                    if (err.message === "maxExceeded")
                                        showAlert(rightclick.columnOverLimit, "ok");
                                    else if (err.message === "readOnly")
                                        showAlert(rightclick.cannotInsertOnColumnReadOnly, "ok");
                                    draftCtx.contextMenu = {};
                                }
                            }, {
                                insertRowColOp: insertRowColOp,
                            });
                        } },
                        React.createElement(React.Fragment, null,
                            _.startsWith((_a = context.lang) !== null && _a !== void 0 ? _a : "", "zh") && (React.createElement(React.Fragment, null,
                                rightclick.to,
                                React.createElement("span", { className: "luckysheet-cols-rows-shift-".concat(dir) }, rightclick[dir]))), "".concat(rightclick.insert, "  "),
                            React.createElement("input", { onClick: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) { return e.stopPropagation(); }, tabIndex: 0, type: "text", className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: "1" }),
                            React.createElement("span", { className: "luckysheet-cols-rows-shift-word luckysheet-mousedown-cancel" }, "".concat(rightclick.column, "  ")),
                            !_.startsWith((_b = context.lang) !== null && _b !== void 0 ? _b : "", "zh") && (React.createElement("span", { className: "luckysheet-cols-rows-shift-".concat(dir) }, rightclick[dir])))));
                });
        }
        if (name === "insert-row") {
            return (selection === null || selection === void 0 ? void 0 : selection.column_select)
                ? null
                : ["top", "bottom"].map(function (dir) {
                    var _a, _b;
                    return (React.createElement(Menu, { key: "add-row-".concat(dir), onClick: function (e, container) {
                            var _a, _b, _c, _d;
                            var position = (_c = (_b = (_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.row) === null || _c === void 0 ? void 0 : _c[0];
                            if (position == null)
                                return;
                            var countStr = (_d = container.querySelector("input")) === null || _d === void 0 ? void 0 : _d.value;
                            if (countStr == null)
                                return;
                            var count = parseInt(countStr, 10);
                            if (count < 1)
                                return;
                            var direction = dir === "top" ? "lefttop" : "rightbottom";
                            var insertRowColOp = {
                                type: "row",
                                index: position,
                                count: count,
                                direction: direction,
                                id: context.currentSheetId,
                            };
                            setContext(function (draftCtx) {
                                try {
                                    insertRowCol(draftCtx, insertRowColOp);
                                    draftCtx.contextMenu = {};
                                }
                                catch (err) {
                                    if (err.message === "maxExceeded")
                                        showAlert(rightclick.rowOverLimit, "ok");
                                    else if (err.message === "readOnly")
                                        showAlert(rightclick.cannotInsertOnRowReadOnly, "ok");
                                    draftCtx.contextMenu = {};
                                }
                            }, { insertRowColOp: insertRowColOp });
                        } },
                        React.createElement(React.Fragment, null,
                            _.startsWith((_a = context.lang) !== null && _a !== void 0 ? _a : "", "zh") && (React.createElement(React.Fragment, null,
                                rightclick.to,
                                React.createElement("span", { className: "luckysheet-cols-rows-shift-".concat(dir) }, rightclick[dir]))), "".concat(rightclick.insert, "  "),
                            React.createElement("input", { onClick: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) { return e.stopPropagation(); }, tabIndex: 0, type: "text", className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: "1" }),
                            React.createElement("span", { className: "luckysheet-cols-rows-shift-word luckysheet-mousedown-cancel" }, "".concat(rightclick.row, "  ")),
                            !_.startsWith((_b = context.lang) !== null && _b !== void 0 ? _b : "", "zh") && (React.createElement("span", { className: "luckysheet-cols-rows-shift-".concat(dir) }, rightclick[dir])))));
                });
        }
        if (name === "delete-column") {
            return ((selection === null || selection === void 0 ? void 0 : selection.column_select) && (React.createElement(Menu, { key: "delete-col", onClick: function () {
                    if (!selection)
                        return;
                    var _a = selection.column, st_index = _a[0], ed_index = _a[1];
                    var deleteRowColOp = {
                        type: "column",
                        start: st_index,
                        end: ed_index,
                        id: context.currentSheetId,
                    };
                    setContext(function (draftCtx) {
                        var _a, _b, _c;
                        if (((_a = draftCtx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                            showAlert(rightclick.noMulti, "ok");
                            draftCtx.contextMenu = {};
                            draftCtx.dataVerificationDropDownList = false;
                            return;
                        }
                        var slen = ed_index - st_index + 1;
                        var index = getSheetIndex(draftCtx, context.currentSheetId);
                        if (((_c = (_b = draftCtx.luckysheetfile[index].data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.length) <= slen) {
                            showAlert(rightclick.cannotDeleteAllColumn, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        try {
                            deleteRowCol(draftCtx, deleteRowColOp);
                        }
                        catch (e) {
                            if (e.message === "readOnly") {
                                showAlert(rightclick.cannotDeleteColumnReadOnly, "ok");
                            }
                        }
                        draftCtx.contextMenu = {};
                    }, { deleteRowColOp: deleteRowColOp });
                } },
                rightclick.deleteSelected,
                rightclick.column)));
        }
        if (name === "delete-row") {
            return ((selection === null || selection === void 0 ? void 0 : selection.row_select) && (React.createElement(Menu, { key: "delete-row", onClick: function () {
                    if (!selection)
                        return;
                    var _a = selection.row, st_index = _a[0], ed_index = _a[1];
                    var deleteRowColOp = {
                        type: "row",
                        start: st_index,
                        end: ed_index,
                        id: context.currentSheetId,
                    };
                    setContext(function (draftCtx) {
                        var _a, _b;
                        if (((_a = draftCtx.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) > 1) {
                            showAlert(rightclick.noMulti, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        var slen = ed_index - st_index + 1;
                        var index = getSheetIndex(draftCtx, context.currentSheetId);
                        if (((_b = draftCtx.luckysheetfile[index].data) === null || _b === void 0 ? void 0 : _b.length) <= slen) {
                            showAlert(rightclick.cannotDeleteAllRow, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        try {
                            deleteRowCol(draftCtx, deleteRowColOp);
                        }
                        catch (e) {
                            if (e.message === "readOnly") {
                                showAlert(rightclick.cannotDeleteRowReadOnly, "ok");
                            }
                        }
                        draftCtx.contextMenu = {};
                    }, { deleteRowColOp: deleteRowColOp });
                } },
                rightclick.deleteSelected,
                rightclick.row)));
        }
        if (name === "hide-row") {
            return ((selection === null || selection === void 0 ? void 0 : selection.row_select) === true &&
                ["hideSelected", "showHide"].map(function (item) { return (React.createElement(Menu, { key: item, onClick: function () {
                        setContext(function (draftCtx) {
                            var msg = "";
                            if (item === "hideSelected") {
                                msg = hideSelected(draftCtx, "row");
                            }
                            else if (item === "showHide") {
                                showSelected(draftCtx, "row");
                            }
                            if (msg === "noMulti") {
                                showDialog(drag.noMulti);
                            }
                            draftCtx.contextMenu = {};
                        });
                    } }, rightclick[item] + rightclick.row)); }));
        }
        if (name === "hide-column") {
            return ((selection === null || selection === void 0 ? void 0 : selection.column_select) === true &&
                ["hideSelected", "showHide"].map(function (item) { return (React.createElement(Menu, { key: item, onClick: function () {
                        setContext(function (draftCtx) {
                            var msg = "";
                            if (item === "hideSelected") {
                                msg = hideSelected(draftCtx, "column");
                            }
                            else if (item === "showHide") {
                                showSelected(draftCtx, "column");
                            }
                            if (msg === "noMulti") {
                                showDialog(drag.noMulti);
                            }
                            draftCtx.contextMenu = {};
                        });
                    } }, rightclick[item] + rightclick.column)); }));
        }
        if (name === "set-row-height") {
            var rowHeight_1 = (selection === null || selection === void 0 ? void 0 : selection.height) || context.defaultrowlen;
            var shownRowHeight = ((_b = context.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b.some(function (section) {
                return section.height_move !==
                    (rowHeight_1 + 1) * (section.row[1] - section.row[0] + 1) - 1;
            }))
                ? ""
                : rowHeight_1;
            return ((_c = context.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c.some(function (section) { return section.row_select; })) ? (React.createElement(Menu, { key: "set-row-height", onClick: function (e, container) {
                    var _a;
                    var targetRowHeight = (_a = container.querySelector("input")) === null || _a === void 0 ? void 0 : _a.value;
                    setContext(function (draftCtx) {
                        if (_.isUndefined(targetRowHeight) ||
                            targetRowHeight === "" ||
                            parseInt(targetRowHeight, 10) <= 0 ||
                            parseInt(targetRowHeight, 10) > 545) {
                            showAlert(info.tipRowHeightLimit, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        var numRowHeight = parseInt(targetRowHeight, 10);
                        var rowHeightList = {};
                        _.forEach(draftCtx.luckysheet_select_save, function (section) {
                            for (var rowNum = section.row[0]; rowNum <= section.row[1]; rowNum += 1) {
                                rowHeightList[rowNum] = numRowHeight;
                            }
                        });
                        api.setRowHeight(draftCtx, rowHeightList, {}, true);
                        draftCtx.contextMenu = {};
                    });
                } },
                rightclick.row,
                rightclick.height,
                React.createElement("input", { onClick: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) { return e.stopPropagation(); }, tabIndex: 0, type: "number", min: 1, max: 545, className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: shownRowHeight, style: { width: "40px" } }),
                "px")) : null;
        }
        if (name === "set-column-width") {
            var colWidth_1 = (selection === null || selection === void 0 ? void 0 : selection.width) || context.defaultcollen;
            var shownColWidth = ((_d = context.luckysheet_select_save) === null || _d === void 0 ? void 0 : _d.some(function (section) {
                return section.width_move !==
                    (colWidth_1 + 1) * (section.column[1] - section.column[0] + 1) - 1;
            }))
                ? ""
                : colWidth_1;
            return ((_e = context.luckysheet_select_save) === null || _e === void 0 ? void 0 : _e.some(function (section) { return section.column_select; })) ? (React.createElement(Menu, { key: "set-column-width", onClick: function (e, container) {
                    var _a;
                    var targetColWidth = (_a = container.querySelector("input")) === null || _a === void 0 ? void 0 : _a.value;
                    setContext(function (draftCtx) {
                        if (_.isUndefined(targetColWidth) ||
                            targetColWidth === "" ||
                            parseInt(targetColWidth, 10) <= 0 ||
                            parseInt(targetColWidth, 10) > 2038) {
                            showAlert(info.tipColumnWidthLimit, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        var numColWidth = parseInt(targetColWidth, 10);
                        var colWidthList = {};
                        _.forEach(draftCtx.luckysheet_select_save, function (section) {
                            for (var colNum = section.column[0]; colNum <= section.column[1]; colNum += 1) {
                                colWidthList[colNum] = numColWidth;
                            }
                        });
                        api.setColumnWidth(draftCtx, colWidthList, {}, true);
                        draftCtx.contextMenu = {};
                    });
                } },
                rightclick.column,
                rightclick.width,
                React.createElement("input", { onClick: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) { return e.stopPropagation(); }, tabIndex: 0, type: "number", min: 1, max: 545, className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: shownColWidth, style: { width: "40px" } }),
                "px")) : null;
        }
        if (name === "clear") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        var allowEdit = isAllowEdit(draftCtx);
                        if (!allowEdit)
                            return;
                        if (draftCtx.activeImg != null) {
                            removeActiveImage(draftCtx);
                        }
                        else {
                            var msg = deleteSelectedCellText(draftCtx);
                            if (msg === "partMC") {
                                showDialog(generalDialog.partiallyError, "ok");
                            }
                            else if (msg === "allowEdit") {
                                showDialog(generalDialog.readOnlyError, "ok");
                            }
                            else if (msg === "dataNullError") {
                                showDialog(generalDialog.dataNullError, "ok");
                            }
                        }
                        draftCtx.contextMenu = {};
                        jfrefreshgrid(draftCtx, null, undefined);
                    });
                } }, rightclick.clearContent));
        }
        if (name === "orderAZ") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        sortSelection(draftCtx, true);
                        draftCtx.contextMenu = {};
                    });
                } }, rightclick.orderAZ));
        }
        if (name === "orderZA") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        sortSelection(draftCtx, false);
                        draftCtx.contextMenu = {};
                    });
                } }, rightclick.orderZA));
        }
        if (name === "sort") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        showDialog(React.createElement(CustomSort, null));
                        draftCtx.contextMenu = {};
                    });
                } }, rightclick.sortSelection));
        }
        if (name === "filter") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        createFilter(draftCtx);
                        draftCtx.contextMenu = {};
                    });
                } }, rightclick.filterSelection));
        }
        if (name === "image") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        showImgChooser();
                        draftCtx.contextMenu = {};
                    });
                } }, rightclick.image));
        }
        if (name === "link") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    setContext(function (draftCtx) {
                        handleLink(draftCtx);
                        draftCtx.contextMenu = {};
                    });
                } }, rightclick.link));
        }
        return null;
    }, [
        context.currentSheetId,
        context.lang,
        context.luckysheet_select_save,
        context.defaultrowlen,
        context.defaultcollen,
        rightclick,
        info,
        setContext,
        showAlert,
        showDialog,
        drag,
        generalDialog,
    ]);
    useLayoutEffect(function () {
        var _a;
        if (!containerRef.current) {
            return;
        }
        var winH = window.innerHeight;
        var winW = window.innerWidth;
        var rect = containerRef.current.getBoundingClientRect();
        var workbookRect = (_a = refs.workbookContainer.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (!workbookRect) {
            return;
        }
        var menuW = rect.width;
        var menuH = rect.height;
        var top = contextMenu.y || 0;
        var left = contextMenu.x || 0;
        var hasOverflow = false;
        if (workbookRect.left + left + menuW > winW) {
            left -= menuW;
            hasOverflow = true;
        }
        if (workbookRect.top + top + menuH > winH) {
            top -= menuH;
            hasOverflow = true;
        }
        if (top < 0) {
            top = 0;
            hasOverflow = true;
        }
        if (hasOverflow) {
            setContext(function (draftCtx) {
                draftCtx.contextMenu.x = left;
                draftCtx.contextMenu.y = top;
            });
        }
    }, [contextMenu.x, contextMenu.y, refs.workbookContainer, setContext]);
    if (_.isEmpty(context.contextMenu))
        return null;
    return (React.createElement("div", { className: "fortune-context-menu luckysheet-cols-menu", ref: containerRef, onContextMenu: function (e) { return e.stopPropagation(); }, style: { left: contextMenu.x, top: contextMenu.y } }, context.contextMenu.headerMenu === true
        ? settings.headerContextMenu.map(function (menu, i) { return getMenuElement(menu, i); })
        : settings.cellContextMenu.map(function (menu, i) { return getMenuElement(menu, i); })));
};
export default ContextMenu;
