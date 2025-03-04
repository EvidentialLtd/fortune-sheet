import React, { useContext, useCallback, useRef, useEffect, useState, } from "react";
import { toolbarItemClickHandler, handleTextBackground, handleTextColor, handleTextSize, normalizedCellAttr, getFlowdata, newComment, editComment, deleteComment, showHideComment, showHideAllComments, autoSelectionFormula, handleSum, locale, handleMerge, handleBorder, toolbarItemSelectedFunc, handleFreeze, insertImage, showImgChooser, updateFormat, handleSort, handleHorizontalAlign, handleVerticalAlign, handleScreenShot, createFilter, clearFilter, applyLocation, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import "./index.css";
import Button from "./Button";
import Divider, { MenuDivider } from "./Divider";
import Combo from "./Combo";
import Select, { Option } from "./Select";
import SVGIcon from "../SVGIcon";
import { useDialog } from "../../hooks/useDialog";
import { FormulaSearch } from "../FormulaSearch";
import { SplitColumn } from "../SplitColumn";
import { LocationCondition } from "../LocationCondition";
import DataVerification from "../DataVerification";
import ConditionalFormat from "../ConditionFormat";
import CustomButton from "./CustomButton";
import { CustomColor } from "./CustomColor";
import CustomBorder from "./CustomBorder";
import { FormatSearch } from "../FormatSearch";
var Toolbar = function (_a) {
    var _b, _c, _d;
    var setMoreItems = _a.setMoreItems, moreItemsOpen = _a.moreItemsOpen;
    var _e = useContext(WorkbookContext), context = _e.context, setContext = _e.setContext, refs = _e.refs, settings = _e.settings, handleUndo = _e.handleUndo, handleRedo = _e.handleRedo;
    var contextRef = useRef(context);
    var containerRef = useRef(null);
    var _f = useState(-1), toolbarWrapIndex = _f[0], setToolbarWrapIndex = _f[1];
    var _g = useState([]), itemLocations = _g[0], setItemLocations = _g[1];
    var _h = useDialog(), showDialog = _h.showDialog, hideDialog = _h.hideDialog;
    var firstSelection = (_b = context.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b[0];
    var flowdata = getFlowdata(context);
    contextRef.current = context;
    var row = firstSelection === null || firstSelection === void 0 ? void 0 : firstSelection.row_focus;
    var col = firstSelection === null || firstSelection === void 0 ? void 0 : firstSelection.column_focus;
    var cell = flowdata && row != null && col != null ? (_c = flowdata === null || flowdata === void 0 ? void 0 : flowdata[row]) === null || _c === void 0 ? void 0 : _c[col] : undefined;
    var _j = locale(context), toolbar = _j.toolbar, merge = _j.merge, border = _j.border, freezen = _j.freezen, defaultFmt = _j.defaultFmt, formula = _j.formula, sort = _j.sort, align = _j.align, textWrap = _j.textWrap, rotation = _j.rotation, screenshot = _j.screenshot, filter = _j.filter, splitText = _j.splitText, findAndReplace = _j.findAndReplace, comment = _j.comment, fontarray = _j.fontarray;
    var toolbarFormat = locale(context).format;
    var sheetWidth = context.luckysheetTableContentHW[0];
    var currency = settings.currency;
    var defaultFormat = defaultFmt(currency);
    var _k = useState("#000000"), customColor = _k[0], setcustomColor = _k[1];
    var _l = useState("1"), customStyle = _l[0], setcustomStyle = _l[1];
    var showSubMenu = useCallback(function (e, className) {
        var target = e.target;
        var menuItem = target.className === "fortune-toolbar-menu-line"
            ? target.parentElement
            : target;
        var menuItemRect = menuItem.getBoundingClientRect();
        var workbookContainerRect = refs.workbookContainer.current.getBoundingClientRect();
        var subMenu = menuItem.querySelector(".".concat(className));
        if (_.isNil(subMenu))
            return;
        var menuItemStyle = window.getComputedStyle(menuItem);
        var menuItemPaddingRight = parseFloat(menuItemStyle.getPropertyValue("padding-right").replace("px", ""));
        if (workbookContainerRect.right - menuItemRect.right <
            parseFloat(subMenu.style.width.replace("px", ""))) {
            subMenu.style.display = "block";
            subMenu.style.right = "".concat(menuItemRect.width - menuItemPaddingRight, "px");
        }
        else {
            subMenu.style.display = "block";
            subMenu.style.right =
                className === "more-format"
                    ? "".concat(-(parseFloat(subMenu.style.width.replace("px", "")) + 0), "px")
                    : "".concat(-(parseFloat(subMenu.style.width.replace("px", "")) +
                        menuItemPaddingRight), "px");
        }
    }, [refs.workbookContainer]);
    var hideSubMenu = useCallback(function (e, className) {
        var target = e.target;
        if (target.className === "".concat(className)) {
            target.style.display = "none";
            return;
        }
        var subMenu = (target.className === "condition-format-item"
            ? target.parentElement
            : target.querySelector(".".concat(className)));
        if (_.isNil(subMenu))
            return;
        subMenu.style.display = "none";
    }, []);
    useEffect(function () {
        setToolbarWrapIndex(-1);
    }, [settings.toolbarItems, settings.customToolbarItems]);
    useEffect(function () {
        if (toolbarWrapIndex === -1) {
            var container = containerRef.current;
            if (!container)
                return;
            var items = container.querySelectorAll(".fortune-toolbar-item");
            if (!items)
                return;
            var locations = [];
            var containerRect = container.getBoundingClientRect();
            for (var i = 0; i < items.length; i += 1) {
                var item = items[i];
                var itemRect = item.getBoundingClientRect();
                locations.push(itemRect.left - containerRect.left + itemRect.width);
            }
            setItemLocations(locations);
        }
    }, [toolbarWrapIndex, sheetWidth]);
    useEffect(function () {
        if (itemLocations.length === 0)
            return;
        var container = containerRef.current;
        if (!container)
            return;
        var moreButtonWidth = 50;
        for (var i = itemLocations.length - 1; i >= 0; i -= 1) {
            var loc = itemLocations[i];
            if (loc + moreButtonWidth < container.clientWidth) {
                setToolbarWrapIndex(i - itemLocations.length + settings.toolbarItems.length);
                if (i === itemLocations.length - 1) {
                    setMoreItems(null);
                }
                break;
            }
        }
    }, [itemLocations, setMoreItems, settings.toolbarItems.length, sheetWidth]);
    var getToolbarItem = useCallback(function (name, i) {
        var _a, _b, _c, _d, _e, _f;
        var tooltip = toolbar[name];
        if (name === "|") {
            return React.createElement(Divider, { key: i });
        }
        if (["font-color", "background"].includes(name)) {
            var pick_1 = function (color) {
                setContext(function (draftCtx) {
                    return (name === "font-color" ? handleTextColor : handleTextBackground)(draftCtx, refs.cellInput.current, color);
                });
                if (name === "font-color") {
                    refs.globalCache.recentTextColor = color;
                }
                else {
                    refs.globalCache.recentBackgroundColor = color;
                }
            };
            return (React.createElement("div", { style: { position: "relative" }, key: name },
                React.createElement("div", { style: {
                        width: 17,
                        height: 2,
                        backgroundColor: name === "font-color"
                            ? refs.globalCache.recentTextColor
                            : refs.globalCache.recentBackgroundColor,
                        position: "absolute",
                        bottom: 8,
                        left: 9,
                        zIndex: 100,
                    } }),
                React.createElement(Combo, { iconId: name, tooltip: tooltip, onClick: function () {
                        var color = name === "font-color"
                            ? refs.globalCache.recentTextColor
                            : refs.globalCache.recentBackgroundColor;
                        if (color)
                            pick_1(color);
                    } }, function (setOpen) { return (React.createElement(CustomColor, { onCustomPick: function (color) {
                        pick_1(color);
                        setOpen(false);
                    }, onColorPick: pick_1 })); })));
        }
        if (name === "format") {
            var currentFmt = defaultFormat[0].text;
            if (cell) {
                var curr_1 = normalizedCellAttr(cell, "ct");
                var format = _.find(defaultFormat, function (v) { return v.value === (curr_1 === null || curr_1 === void 0 ? void 0 : curr_1.fa); });
                if ((curr_1 === null || curr_1 === void 0 ? void 0 : curr_1.fa) != null) {
                    if (format != null) {
                        currentFmt = format.text;
                    }
                    else {
                        currentFmt = defaultFormat[defaultFormat.length - 1].text;
                    }
                }
            }
            return (React.createElement(Combo, { text: currentFmt, key: name, tooltip: tooltip }, function (setOpen) { return (React.createElement(Select, null, defaultFormat.map(function (_a, ii) {
                var text = _a.text, value = _a.value, example = _a.example;
                if (value === "split") {
                    return React.createElement(MenuDivider, { key: ii });
                }
                if (value === "fmtOtherSelf") {
                    return (React.createElement(Option, { key: value, onMouseEnter: function (e) { return showSubMenu(e, "more-format"); }, onMouseLeave: function (e) { return hideSubMenu(e, "more-format"); } },
                        React.createElement("div", { className: "fortune-toolbar-menu-line" },
                            React.createElement("div", null, text),
                            React.createElement(SVGIcon, { name: "rightArrow", width: 14 })),
                        React.createElement("div", { className: "more-format toolbar-item-sub-menu fortune-toolbar-select", style: {
                                display: "none",
                                width: 150,
                                bottom: 10,
                                top: undefined,
                            } }, [
                            {
                                text: toolbarFormat.moreCurrency,
                                onclick: function () {
                                    showDialog(React.createElement(FormatSearch, { onCancel: hideDialog, type: "currency" }));
                                    setOpen(false);
                                },
                            },
                            {
                                text: toolbarFormat.moreNumber,
                                onclick: function () {
                                    showDialog(React.createElement(FormatSearch, { onCancel: hideDialog, type: "number" }));
                                    setOpen(false);
                                },
                            },
                        ].map(function (v) { return (React.createElement("div", { className: "set-background-item fortune-toolbar-select-option", key: v.text, onClick: function () {
                                v.onclick();
                                setOpen(false);
                            }, tabIndex: 0 }, v.text)); }))));
                }
                return (React.createElement(Option, { key: value, onClick: function () {
                        setOpen(false);
                        setContext(function (ctx) {
                            var d = getFlowdata(ctx);
                            if (d == null)
                                return;
                            updateFormat(ctx, refs.cellInput.current, d, "ct", value);
                        });
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        React.createElement("div", null, text),
                        React.createElement("div", { className: "fortune-toolbar-subtext" }, example))));
            }))); }));
        }
        if (name === "font") {
            var current_1 = fontarray[0];
            if ((cell === null || cell === void 0 ? void 0 : cell.ff) != null) {
                if (_.isNumber(cell.ff)) {
                    current_1 = fontarray[cell.ff];
                }
                else {
                    current_1 = cell.ff;
                }
            }
            return (React.createElement(Combo, { text: current_1, key: name, tooltip: tooltip }, function (setOpen) { return (React.createElement(Select, null, fontarray.map(function (o) { return (React.createElement(Option, { key: o, onClick: function () {
                    setContext(function (ctx) {
                        current_1 = o;
                        var d = getFlowdata(ctx);
                        if (!d)
                            return;
                        updateFormat(ctx, refs.cellInput.current, d, "ff", o);
                    });
                    setOpen(false);
                } }, o)); }))); }));
        }
        if (name === "font-size") {
            return (React.createElement(Combo, { text: cell
                    ? normalizedCellAttr(cell, "fs", context.defaultFontSize)
                    : context.defaultFontSize.toString(), key: name, tooltip: tooltip }, function (setOpen) { return (React.createElement(Select, null, [
                9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
            ].map(function (num) { return (React.createElement(Option, { key: num, onClick: function () {
                    setContext(function (draftContext) {
                        return handleTextSize(draftContext, refs.cellInput.current, num, refs.canvas.current.getContext("2d"));
                    });
                    setOpen(false);
                } }, num)); }))); }));
        }
        if (name === "horizontal-align") {
            var items_1 = [
                {
                    title: "align-left",
                    text: align.left,
                    value: 1,
                },
                {
                    title: "align-center",
                    text: align.center,
                    value: 0,
                },
                {
                    title: "align-right",
                    text: align.right,
                    value: 2,
                },
            ];
            return (React.createElement(Combo, { iconId: ((_a = _.find(items_1, function (item) { return "".concat(item.value) === "".concat(cell === null || cell === void 0 ? void 0 : cell.ht); })) === null || _a === void 0 ? void 0 : _a.title) || "align-left", key: name, tooltip: toolbar.horizontalAlign }, function (setOpen) { return (React.createElement(Select, null, items_1.map(function (_a) {
                var text = _a.text, title = _a.title;
                return (React.createElement(Option, { key: title, onClick: function () {
                        setContext(function (ctx) {
                            handleHorizontalAlign(ctx, refs.cellInput.current, title.replace("align-", ""));
                        });
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        text,
                        React.createElement(SVGIcon, { name: title }))));
            }))); }));
        }
        if (name === "vertical-align") {
            var items_2 = [
                {
                    title: "align-top",
                    text: align.top,
                    value: 1,
                },
                {
                    title: "align-middle",
                    text: align.middle,
                    value: 0,
                },
                {
                    title: "align-bottom",
                    text: align.bottom,
                    value: 2,
                },
            ];
            return (React.createElement(Combo, { iconId: ((_b = _.find(items_2, function (item) { return "".concat(item.value) === "".concat(cell === null || cell === void 0 ? void 0 : cell.vt); })) === null || _b === void 0 ? void 0 : _b.title) || "align-top", key: name, tooltip: toolbar.verticalAlign }, function (setOpen) { return (React.createElement(Select, null, items_2.map(function (_a) {
                var text = _a.text, title = _a.title;
                return (React.createElement(Option, { key: title, onClick: function () {
                        setContext(function (ctx) {
                            handleVerticalAlign(ctx, refs.cellInput.current, title.replace("align-", ""));
                        });
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        text,
                        React.createElement(SVGIcon, { name: title }))));
            }))); }));
        }
        if (name === "undo") {
            return (React.createElement(Button, { iconId: name, tooltip: tooltip, key: name, disabled: refs.globalCache.undoList.length === 0, onClick: function () { return handleUndo(); } }));
        }
        if (name === "redo") {
            return (React.createElement(Button, { iconId: name, tooltip: tooltip, key: name, disabled: refs.globalCache.redoList.length === 0, onClick: function () { return handleRedo(); } }));
        }
        if (name === "screenshot") {
            return (React.createElement(Button, { iconId: name, tooltip: tooltip, key: name, onClick: function () {
                    var imgsrc = handleScreenShot(contextRef.current);
                    if (imgsrc) {
                        showDialog(React.createElement("div", null,
                            React.createElement("div", null, screenshot.screenshotTipSuccess),
                            React.createElement("img", { src: imgsrc, alt: "", style: { maxWidth: "100%", maxHeight: "100%" } })));
                    }
                } }));
        }
        if (name === "splitColumn") {
            return (React.createElement(Button, { iconId: name, tooltip: tooltip, key: name, onClick: function () {
                    if (context.allowEdit === false)
                        return;
                    if (_.isUndefined(context.luckysheet_select_save)) {
                        showDialog(splitText.tipNoSelect, "ok");
                    }
                    else {
                        var currentColumn = context.luckysheet_select_save[context.luckysheet_select_save.length - 1].column;
                        if (context.luckysheet_select_save.length > 1) {
                            showDialog(splitText.tipNoMulti, "ok");
                        }
                        else if (currentColumn[0] !== currentColumn[1]) {
                            showDialog(splitText.tipNoMultiColumn, "ok");
                        }
                        else {
                            showDialog(React.createElement(SplitColumn, null));
                        }
                    }
                } }));
        }
        if (name === "dataVerification") {
            return (React.createElement(Button, { iconId: name, tooltip: tooltip, key: name, onClick: function () {
                    if (context.allowEdit === false)
                        return;
                    showDialog(React.createElement(DataVerification, null));
                } }));
        }
        if (name === "locationCondition") {
            var items_3 = [
                {
                    text: findAndReplace.location,
                    value: "location",
                },
                {
                    text: findAndReplace.locationFormula,
                    value: "locationFormula",
                },
                {
                    text: findAndReplace.locationDate,
                    value: "locationDate",
                },
                {
                    text: findAndReplace.locationDigital,
                    value: "locationDigital",
                },
                {
                    text: findAndReplace.locationString,
                    value: "locationString",
                },
                {
                    text: findAndReplace.locationError,
                    value: "locationError",
                },
                {
                    text: findAndReplace.locationRowSpan,
                    value: "locationRowSpan",
                },
                {
                    text: findAndReplace.columnSpan,
                    value: "locationColumnSpan",
                },
            ];
            return (React.createElement(Combo, { iconId: "locationCondition", key: name, tooltip: findAndReplace.location }, function (setOpen) { return (React.createElement(Select, null, items_3.map(function (_a) {
                var text = _a.text, value = _a.value;
                return (React.createElement(Option, { key: value, onClick: function () {
                        var _a, _b, _c, _d, _e, _f;
                        if (context.luckysheet_select_save == null) {
                            showDialog(freezen.noSeletionError, "ok");
                            return;
                        }
                        var last = context.luckysheet_select_save[0];
                        var range;
                        var rangeArr = [];
                        if (((_a = context.luckysheet_select_save) === null || _a === void 0 ? void 0 : _a.length) === 0 ||
                            (((_b = context.luckysheet_select_save) === null || _b === void 0 ? void 0 : _b.length) === 1 &&
                                last.row[0] === last.row[1] &&
                                last.column[0] === last.column[1])) {
                            range = [
                                {
                                    row: [0, flowdata.length - 1],
                                    column: [0, flowdata[0].length - 1],
                                },
                            ];
                        }
                        else {
                            range = _.assignIn([], context.luckysheet_select_save);
                        }
                        if (value === "location") {
                            showDialog(React.createElement(LocationCondition, null));
                        }
                        else if (value === "locationFormula") {
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationFormula", "all", ctx);
                            });
                        }
                        else if (value === "locationDate") {
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationConstant", "d", ctx);
                            });
                        }
                        else if (value === "locationDigital") {
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationConstant", "n", ctx);
                            });
                        }
                        else if (value === "locationString") {
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationConstant", "s,g", ctx);
                            });
                        }
                        else if (value === "locationError") {
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationConstant", "e", ctx);
                            });
                        }
                        else if (value === "locationCondition") {
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationCF", undefined, ctx);
                            });
                        }
                        else if (value === "locationRowSpan") {
                            if (((_c = context.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c.length) === 0 ||
                                (((_d = context.luckysheet_select_save) === null || _d === void 0 ? void 0 : _d.length) === 1 &&
                                    context.luckysheet_select_save[0].row[0] ===
                                        context.luckysheet_select_save[0].row[1])) {
                                showDialog(findAndReplace.locationTiplessTwoRow, "ok");
                                return;
                            }
                            range = _.assignIn([], context.luckysheet_select_save);
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationRowSpan", undefined, ctx);
                            });
                        }
                        else if (value === "locationColumnSpan") {
                            if (((_e = context.luckysheet_select_save) === null || _e === void 0 ? void 0 : _e.length) === 0 ||
                                (((_f = context.luckysheet_select_save) === null || _f === void 0 ? void 0 : _f.length) === 1 &&
                                    context.luckysheet_select_save[0].column[0] ===
                                        context.luckysheet_select_save[0].column[1])) {
                                showDialog(findAndReplace.locationTiplessTwoColumn, "ok");
                                return;
                            }
                            range = _.assignIn([], context.luckysheet_select_save);
                            setContext(function (ctx) {
                                rangeArr = applyLocation(range, "locationColumnSpan", undefined, ctx);
                            });
                        }
                        if (rangeArr.length === 0 && value !== "location")
                            showDialog(findAndReplace.locationTipNotFindCell, "ok");
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" }, text)));
            }))); }));
        }
        if (name === "conditionFormat") {
            var items_4 = [
                "highlightCellRules",
                "itemSelectionRules",
                "-",
                "deleteRule",
            ];
            return (React.createElement(Combo, { iconId: "conditionFormat", key: name, tooltip: toolbar.conditionalFormat }, function (setOpen) { return React.createElement(ConditionalFormat, { items: items_4, setOpen: setOpen }); }));
        }
        if (name === "image") {
            return (React.createElement(Button, { iconId: name, tooltip: toolbar.insertImage, key: name, onClick: function () {
                    if (context.allowEdit === false)
                        return;
                    showImgChooser();
                } },
                React.createElement("input", { id: "fortune-img-upload", type: "file", accept: "image/*", style: { display: "none" }, onChange: function (e) {
                        var _a;
                        var file = (_a = e.currentTarget.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!file)
                            return;
                        var render = new FileReader();
                        render.readAsDataURL(file);
                        render.onload = function (event) {
                            var _a;
                            if (event.target == null)
                                return;
                            var src = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                            var image = new Image();
                            image.onload = function () {
                                setContext(function (draftCtx) {
                                    insertImage(draftCtx, image);
                                });
                            };
                            image.src = src;
                        };
                        e.currentTarget.value = "";
                    } })));
        }
        if (name === "comment") {
            var last = (_c = context.luckysheet_select_save) === null || _c === void 0 ? void 0 : _c[context.luckysheet_select_save.length - 1];
            var row_index_1 = last === null || last === void 0 ? void 0 : last.row_focus;
            var col_index_1 = last === null || last === void 0 ? void 0 : last.column_focus;
            if (!last) {
                row_index_1 = 0;
                col_index_1 = 0;
            }
            else {
                if (row_index_1 == null) {
                    row_index_1 = last.row[0];
                }
                if (col_index_1 == null) {
                    col_index_1 = last.column[0];
                }
            }
            var itemData_1;
            if (((_e = (_d = flowdata === null || flowdata === void 0 ? void 0 : flowdata[row_index_1]) === null || _d === void 0 ? void 0 : _d[col_index_1]) === null || _e === void 0 ? void 0 : _e.ps) != null) {
                itemData_1 = [
                    { key: "edit", text: comment.edit, onClick: editComment },
                    { key: "delete", text: comment.delete, onClick: deleteComment },
                    {
                        key: "showOrHide",
                        text: comment.showOne,
                        onClick: showHideComment,
                    },
                    {
                        key: "showOrHideAll",
                        text: comment.showAll,
                        onClick: showHideAllComments,
                    },
                ];
            }
            else {
                itemData_1 = [
                    { key: "new", text: comment.insert, onClick: newComment },
                    {
                        key: "showOrHideAll",
                        text: comment.showAll,
                        onClick: showHideAllComments,
                    },
                ];
            }
            return (React.createElement(Combo, { iconId: name, key: name, tooltip: tooltip }, function (setOpen) { return (React.createElement(Select, null, itemData_1.map(function (_a) {
                var key = _a.key, text = _a.text, onClick = _a.onClick;
                return (React.createElement(Option, { key: key, onClick: function () {
                        setContext(function (draftContext) {
                            return onClick(draftContext, refs.globalCache, row_index_1, col_index_1);
                        });
                        setOpen(false);
                    } }, text));
            }))); }));
        }
        if (name === "quick-formula") {
            var itemData_2 = [
                { text: formula.sum, value: "SUM" },
                { text: formula.average, value: "AVERAGE" },
                { text: formula.count, value: "COUNT" },
                { text: formula.max, value: "MAX" },
                { text: formula.min, value: "MIN" },
            ];
            return (React.createElement(Combo, { iconId: "formula-sum", key: name, tooltip: toolbar.autoSum, onClick: function () {
                    return setContext(function (ctx) {
                        handleSum(ctx, refs.cellInput.current, refs.fxInput.current, refs.globalCache);
                    });
                } }, function (setOpen) { return (React.createElement(Select, null,
                itemData_2.map(function (_a) {
                    var value = _a.value, text = _a.text;
                    return (React.createElement(Option, { key: value, onClick: function () {
                            setContext(function (ctx) {
                                autoSelectionFormula(ctx, refs.cellInput.current, refs.fxInput.current, value, refs.globalCache);
                            });
                            setOpen(false);
                        } },
                        React.createElement("div", { className: "fortune-toolbar-menu-line" },
                            React.createElement("div", null, text),
                            React.createElement("div", { className: "fortune-toolbar-subtext" }, value))));
                }),
                React.createElement(MenuDivider, null),
                React.createElement(Option, { key: "formula", onClick: function () {
                        showDialog(React.createElement(FormulaSearch, { onCancel: hideDialog }));
                        setOpen(false);
                    } }, "".concat(formula.find, "...")))); }));
        }
        if (name === "merge-cell") {
            var itemdata_1 = [
                { text: merge.mergeAll, value: "merge-all" },
                { text: merge.mergeV, value: "merge-vertical" },
                { text: merge.mergeH, value: "merge-horizontal" },
                { text: merge.mergeCancel, value: "merge-cancel" },
            ];
            return (React.createElement(Combo, { iconId: "merge-all", key: name, tooltip: tooltip, text: "\u5408\u5E76\u5355\u5143\u683C", onClick: function () {
                    return setContext(function (ctx) {
                        handleMerge(ctx, "merge-all");
                    });
                } }, function (setOpen) { return (React.createElement(Select, null, itemdata_1.map(function (_a) {
                var text = _a.text, value = _a.value;
                return (React.createElement(Option, { key: value, onClick: function () {
                        setContext(function (ctx) {
                            handleMerge(ctx, value);
                        });
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        React.createElement(SVGIcon, { name: value, style: { marginRight: 4 } }),
                        text)));
            }))); }));
        }
        if (name === "border") {
            var items_5 = [
                {
                    text: border.borderTop,
                    value: "border-top",
                },
                {
                    text: border.borderBottom,
                    value: "border-bottom",
                },
                {
                    text: border.borderLeft,
                    value: "border-left",
                },
                {
                    text: border.borderRight,
                    value: "border-right",
                },
                { text: "", value: "divider" },
                {
                    text: border.borderNone,
                    value: "border-none",
                },
                {
                    text: border.borderAll,
                    value: "border-all",
                },
                {
                    text: border.borderOutside,
                    value: "border-outside",
                },
                { text: "", value: "divider" },
                {
                    text: border.borderInside,
                    value: "border-inside",
                },
                {
                    text: border.borderHorizontal,
                    value: "border-horizontal",
                },
                {
                    text: border.borderVertical,
                    value: "border-vertical",
                },
                {
                    text: border.borderSlash,
                    value: "border-slash",
                },
                { text: "", value: "divider" },
            ];
            return (React.createElement(Combo, { iconId: "border-all", key: name, tooltip: tooltip, text: "\u8FB9\u6846\u8BBE\u7F6E", onClick: function () {
                    return setContext(function (ctx) {
                        handleBorder(ctx, "border-all", customColor, customStyle);
                    });
                } }, function (setOpen) { return (React.createElement(Select, null,
                items_5.map(function (_a, ii) {
                    var text = _a.text, value = _a.value;
                    return value !== "divider" ? (React.createElement(Option, { key: value, onClick: function () {
                            setContext(function (ctx) {
                                handleBorder(ctx, value, customColor, customStyle);
                            });
                            setOpen(false);
                        } },
                        React.createElement("div", { className: "fortune-toolbar-menu-line" },
                            text,
                            React.createElement(SVGIcon, { name: value })))) : (React.createElement(MenuDivider, { key: ii }));
                }),
                React.createElement(CustomBorder, { onPick: function (color, style) {
                        setcustomColor(color);
                        setcustomStyle(style);
                    } }))); }));
        }
        if (name === "freeze") {
            var items_6 = [
                {
                    text: freezen.freezenRowRange,
                    value: "freeze-row",
                },
                {
                    text: freezen.freezenColumnRange,
                    value: "freeze-col",
                },
                {
                    text: freezen.freezenRCRange,
                    value: "freeze-row-col",
                },
                {
                    text: freezen.freezenCancel,
                    value: "freeze-cancel",
                },
            ];
            return (React.createElement(Combo, { iconId: "freeze-row-col", key: name, tooltip: tooltip, onClick: function () {
                    return setContext(function (ctx) {
                        handleFreeze(ctx, "freeze-row-col");
                    });
                } }, function (setOpen) { return (React.createElement(Select, null, items_6.map(function (_a) {
                var text = _a.text, value = _a.value;
                return (React.createElement(Option, { key: value, onClick: function () {
                        setContext(function (ctx) {
                            handleFreeze(ctx, value);
                        });
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        text,
                        React.createElement(SVGIcon, { name: value }))));
            }))); }));
        }
        if (name === "text-wrap") {
            var items_7 = [
                {
                    text: textWrap.clip,
                    iconId: "text-clip",
                    value: "clip",
                },
                {
                    text: textWrap.overflow,
                    iconId: "text-overflow",
                    value: "overflow",
                },
                {
                    text: textWrap.wrap,
                    iconId: "text-wrap",
                    value: "wrap",
                },
            ];
            var curr = items_7[0];
            if ((cell === null || cell === void 0 ? void 0 : cell.tb) != null) {
                curr = _.get(items_7, cell.tb);
            }
            return (React.createElement(Combo, { iconId: curr.iconId, key: name, tooltip: toolbar.textWrap }, function (setOpen) { return (React.createElement(Select, null, items_7.map(function (_a) {
                var text = _a.text, iconId = _a.iconId, value = _a.value;
                return (React.createElement(Option, { key: value, onClick: function () {
                        setContext(function (ctx) {
                            var d = getFlowdata(ctx);
                            if (d == null)
                                return;
                            updateFormat(ctx, refs.cellInput.current, d, "tb", value);
                        });
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        text,
                        React.createElement(SVGIcon, { name: iconId }))));
            }))); }));
        }
        if (name === "text-rotation") {
            var items_8 = [
                { text: rotation.none, iconId: "text-rotation-none", value: "none" },
                {
                    text: rotation.angleup,
                    iconId: "text-rotation-angleup",
                    value: "angleup",
                },
                {
                    text: rotation.angledown,
                    iconId: "text-rotation-angledown",
                    value: "angledown",
                },
                {
                    text: rotation.vertical,
                    iconId: "text-rotation-vertical",
                    value: "vertical",
                },
                {
                    text: rotation.rotationUp,
                    iconId: "text-rotation-up",
                    value: "rotation-up",
                },
                {
                    text: rotation.rotationDown,
                    iconId: "text-rotation-down",
                    value: "rotation-down",
                },
            ];
            var curr = items_8[0];
            if ((cell === null || cell === void 0 ? void 0 : cell.tr) != null) {
                curr = _.get(items_8, cell.tr);
            }
            return (React.createElement(Combo, { iconId: curr.iconId, key: name, tooltip: toolbar.textRotate }, function (setOpen) { return (React.createElement(Select, null, items_8.map(function (_a) {
                var text = _a.text, iconId = _a.iconId, value = _a.value;
                return (React.createElement(Option, { key: value, onClick: function () {
                        setContext(function (ctx) {
                            var d = getFlowdata(ctx);
                            if (d == null)
                                return;
                            updateFormat(ctx, refs.cellInput.current, d, "tr", value);
                        });
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        text,
                        React.createElement(SVGIcon, { name: iconId }))));
            }))); }));
        }
        if (name === "filter") {
            var items_9 = [
                {
                    iconId: "sort-asc",
                    value: "sort-asc",
                    text: sort.asc,
                    onClick: function () {
                        setContext(function (ctx) {
                            handleSort(ctx, true);
                        });
                    },
                },
                {
                    iconId: "sort-desc",
                    value: "sort-desc",
                    text: sort.desc,
                    onClick: function () {
                        setContext(function (ctx) {
                            handleSort(ctx, false);
                        });
                    },
                },
                { iconId: "", value: "divider" },
                {
                    iconId: "filter1",
                    value: "filter",
                    text: filter.filter,
                    onClick: function () {
                        return setContext(function (draftCtx) {
                            createFilter(draftCtx);
                        });
                    },
                },
                {
                    iconId: "eraser",
                    value: "eraser",
                    text: filter.clearFilter,
                    onClick: function () {
                        return setContext(function (draftCtx) {
                            clearFilter(draftCtx);
                        });
                    },
                },
            ];
            return (React.createElement(Combo, { iconId: "filter", key: name, tooltip: toolbar.sortAndFilter }, function (setOpen) { return (React.createElement(Select, null, items_9.map(function (_a, index) {
                var text = _a.text, iconId = _a.iconId, value = _a.value, onClick = _a.onClick;
                return value !== "divider" ? (React.createElement(Option, { key: value, onClick: function () {
                        onClick === null || onClick === void 0 ? void 0 : onClick();
                        setOpen(false);
                    } },
                    React.createElement("div", { className: "fortune-toolbar-menu-line" },
                        text,
                        React.createElement(SVGIcon, { name: iconId })))) : (React.createElement(MenuDivider, { key: "divider-".concat(index) }));
            }))); }));
        }
        return (React.createElement(Button, { iconId: name, tooltip: tooltip, key: name, selected: (_f = toolbarItemSelectedFunc(name)) === null || _f === void 0 ? void 0 : _f(cell), onClick: function () {
                return setContext(function (draftCtx) {
                    var _a;
                    (_a = toolbarItemClickHandler(name)) === null || _a === void 0 ? void 0 : _a(draftCtx, refs.cellInput.current, refs.globalCache);
                });
            } }));
    }, [
        toolbar,
        cell,
        setContext,
        refs.cellInput,
        refs.fxInput,
        refs.globalCache,
        defaultFormat,
        align,
        handleUndo,
        handleRedo,
        flowdata,
        formula,
        showDialog,
        hideDialog,
        merge,
        border,
        freezen,
        screenshot,
        sort,
        textWrap,
        rotation,
        filter,
        splitText,
        findAndReplace,
        context.luckysheet_select_save,
        context.defaultFontSize,
        context.allowEdit,
        comment,
        fontarray,
        hideSubMenu,
        showSubMenu,
        refs.canvas,
        customColor,
        customStyle,
        toolbarFormat.moreCurrency,
        toolbarFormat.moreNumber,
    ]);
    return (React.createElement("header", null,
        React.createElement("div", { ref: containerRef, className: "fortune-toolbar", role: "toolbar", "aria-label": toolbar.toolbar },
            settings.customToolbarItems.map(function (n) {
                return (React.createElement(CustomButton, { tooltip: n.tooltip, onClick: n.onClick, key: n.key, icon: n.icon, iconName: n.iconName }, n.children));
            }),
            ((_d = settings.customToolbarItems) === null || _d === void 0 ? void 0 : _d.length) > 0 ? (React.createElement(Divider, { key: "customDivider" })) : null,
            (toolbarWrapIndex === -1
                ? settings.toolbarItems
                : settings.toolbarItems.slice(0, toolbarWrapIndex + 1)).map(function (name, i) { return getToolbarItem(name, i); }),
            toolbarWrapIndex !== -1 &&
                toolbarWrapIndex < settings.toolbarItems.length - 1 ? (React.createElement(Button, { iconId: "more", tooltip: toolbar.toolMore, onClick: function () {
                    if (moreItemsOpen) {
                        setMoreItems(null);
                    }
                    else {
                        setMoreItems(settings.toolbarItems
                            .slice(toolbarWrapIndex + 1)
                            .map(function (name, i) { return getToolbarItem(name, i); }));
                    }
                } })) : null)));
};
export default Toolbar;
