import { editSheetName, cancelNormalSelected, cancelActiveImgItem, locale, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import React, { useContext, useState, useEffect, useRef, useCallback, } from "react";
import WorkbookContext from "../../context";
import { useAlert } from "../../hooks/useAlert";
import SVGIcon from "../SVGIcon";
var SheetItem = function (_a) {
    var sheet = _a.sheet, isDropPlaceholder = _a.isDropPlaceholder;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var _c = useState(false), editing = _c[0], setEditing = _c[1];
    var containerRef = useRef(null);
    var editable = useRef(null);
    var _d = useState(false), dragOver = _d[0], setDragOver = _d[1];
    var _e = useState("#c3c3c3"), svgColor = _e[0], setSvgColor = _e[1];
    var showAlert = useAlert().showAlert;
    var info = locale(context).info;
    useEffect(function () {
        setContext(function (draftCtx) {
            var _a, _b, _c, _d;
            var r = context.sheetScrollRecord[draftCtx === null || draftCtx === void 0 ? void 0 : draftCtx.currentSheetId];
            if (r) {
                draftCtx.scrollLeft = (_a = r.scrollLeft) !== null && _a !== void 0 ? _a : 0;
                draftCtx.scrollTop = (_b = r.scrollTop) !== null && _b !== void 0 ? _b : 0;
                draftCtx.luckysheet_select_status = (_c = r.luckysheet_select_status) !== null && _c !== void 0 ? _c : false;
                draftCtx.luckysheet_select_save = (_d = r.luckysheet_select_save) !== null && _d !== void 0 ? _d : undefined;
            }
            else {
                draftCtx.scrollLeft = 0;
                draftCtx.scrollTop = 0;
                draftCtx.luckysheet_select_status = false;
                draftCtx.luckysheet_select_save = undefined;
            }
            draftCtx.luckysheet_selection_range = [];
        });
    }, [context.currentSheetId, context.sheetScrollRecord, setContext]);
    useEffect(function () {
        if (!editable.current)
            return;
        if (editing) {
            if (window.getSelection) {
                var range = document.createRange();
                range.selectNodeContents(editable.current);
                if (range.startContainer &&
                    document.body.contains(range.startContainer)) {
                    var selection = window.getSelection();
                    selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
                    selection === null || selection === void 0 ? void 0 : selection.addRange(range);
                }
            }
            else if (document.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(editable.current);
                range.select();
            }
        }
        editable.current.dataset.oldText = editable.current.innerText;
    }, [editing]);
    var onBlur = useCallback(function () {
        setContext(function (draftCtx) {
            try {
                editSheetName(draftCtx, editable.current);
            }
            catch (e) {
                showAlert(e.message);
            }
        });
        setEditing(false);
    }, [setContext, showAlert]);
    var onKeyDown = useCallback(function (e) {
        var _a;
        if (e.key === "Enter") {
            (_a = editable.current) === null || _a === void 0 ? void 0 : _a.blur();
        }
        e.stopPropagation();
    }, []);
    var onDragStart = useCallback(function (e) {
        if (context.allowEdit === true)
            e.dataTransfer.setData("sheetId", "".concat(sheet.id));
        e.stopPropagation();
    }, [context.allowEdit, sheet.id]);
    var onDrop = useCallback(function (e) {
        if (context.allowEdit === false)
            return;
        var draggingId = e.dataTransfer.getData("sheetId");
        setContext(function (draftCtx) {
            var droppingId = sheet.id;
            var draggingSheet;
            var droppingSheet;
            _.sortBy(draftCtx.luckysheetfile, ["order"]).forEach(function (f, i) {
                f.order = i;
                if (f.id === draggingId) {
                    draggingSheet = f;
                }
                else if (f.id === droppingId) {
                    droppingSheet = f;
                }
            });
            if (draggingSheet && droppingSheet) {
                draggingSheet.order = droppingSheet.order - 0.1;
                _.sortBy(draftCtx.luckysheetfile, ["order"]).forEach(function (f, i) {
                    f.order = i;
                });
            }
            else if (draggingSheet && isDropPlaceholder) {
                draggingSheet.order = draftCtx.luckysheetfile.length;
            }
        });
        setDragOver(false);
        e.stopPropagation();
    }, [context.allowEdit, isDropPlaceholder, setContext, sheet.id]);
    return (React.createElement("div", { role: "button", onDragOver: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }, onDragEnter: function (e) {
            setDragOver(true);
            e.stopPropagation();
        }, onDragLeave: function (e) {
            setDragOver(false);
            e.stopPropagation();
        }, onDragEnd: function (e) {
            setDragOver(false);
            e.stopPropagation();
        }, onDrop: onDrop, onDragStart: onDragStart, draggable: context.allowEdit && !editing, key: sheet.id, ref: containerRef, className: isDropPlaceholder
            ? "fortune-sheettab-placeholder"
            : "luckysheet-sheets-item".concat(context.currentSheetId === sheet.id
                ? " luckysheet-sheets-item-active"
                : ""), onClick: function () {
            if (isDropPlaceholder)
                return;
            setContext(function (draftCtx) {
                draftCtx.sheetScrollRecord[draftCtx.currentSheetId] = {
                    scrollLeft: draftCtx.scrollLeft,
                    scrollTop: draftCtx.scrollTop,
                    luckysheet_select_status: draftCtx.luckysheet_select_status,
                    luckysheet_select_save: draftCtx.luckysheet_select_save,
                    luckysheet_selection_range: draftCtx.luckysheet_selection_range,
                };
                draftCtx.dataVerificationDropDownList = false;
                draftCtx.currentSheetId = sheet.id;
                draftCtx.zoomRatio = sheet.zoomRatio || 1;
                cancelActiveImgItem(draftCtx, refs.globalCache);
                cancelNormalSelected(draftCtx);
            });
        }, tabIndex: 0, onContextMenu: function (e) {
            if (isDropPlaceholder)
                return;
            var rect = refs.workbookContainer.current.getBoundingClientRect();
            var pageX = e.pageX, pageY = e.pageY;
            setContext(function (ctx) {
                ctx.dataVerificationDropDownList = false;
                ctx.currentSheetId = sheet.id;
                ctx.zoomRatio = sheet.zoomRatio || 1;
                ctx.sheetTabContextMenu = {
                    x: pageX - rect.left - window.scrollX,
                    y: pageY - rect.top - window.scrollY,
                    sheet: sheet,
                    onRename: function () { return setEditing(true); },
                };
            });
        }, style: {
            borderLeft: dragOver ? "2px solid #0188fb" : "",
            display: sheet.hide === 1 ? "none" : "",
        } },
        React.createElement("span", { className: "luckysheet-sheets-item-name", spellCheck: "false", suppressContentEditableWarning: true, contentEditable: isDropPlaceholder ? false : editing, onDoubleClick: function () { return setEditing(true); }, onBlur: onBlur, onKeyDown: onKeyDown, ref: editable, style: dragOver ? { pointerEvents: "none" } : {} }, sheet.name),
        React.createElement("span", { className: "luckysheet-sheets-item-function", onMouseEnter: function () { return setSvgColor("#5c5c5c"); }, onMouseLeave: function () { return setSvgColor("#c3c3c3"); }, onClick: function (e) {
                if (isDropPlaceholder || context.allowEdit === false)
                    return;
                var rect = refs.workbookContainer.current.getBoundingClientRect();
                var pageX = e.pageX, pageY = e.pageY;
                setContext(function (ctx) {
                    ctx.currentSheetId = sheet.id;
                    ctx.sheetTabContextMenu = {
                        x: pageX - rect.left - window.scrollX,
                        y: pageY - rect.top - window.scrollY,
                        sheet: sheet,
                        onRename: function () { return setEditing(true); },
                    };
                });
            }, tabIndex: 0, "aria-label": info.sheetOptions },
            React.createElement(SVGIcon, { name: "downArrow", width: 12, style: { fill: svgColor } })),
        !!sheet.color && (React.createElement("div", { className: "luckysheet-sheets-item-color", style: { background: sheet.color } }))));
};
export default SheetItem;
