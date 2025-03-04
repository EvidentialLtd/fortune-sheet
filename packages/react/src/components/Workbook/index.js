var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defaultContext, defaultSettings, initSheetIndex, handleGlobalKeyDown, getSheetIndex, handlePaste, filterPatch, patchToOp, inverseRowColOptions, ensureSheetIndex, insertRowCol, locale, calcSelectionInfo, groupValuesRefresh, setFormulaCellInfoMap, } from "@evidential-fortune-sheet/core";
import React, { useMemo, useState, useCallback, useEffect, useRef, useImperativeHandle, } from "react";
import "./index.css";
import produce, { applyPatches, enablePatches, produceWithPatches, } from "immer";
import _ from "lodash";
import Sheet from "../Sheet";
import WorkbookContext from "../../context";
import Toolbar from "../Toolbar";
import FxEditor from "../FxEditor";
import SheetTab from "../SheetTab";
import ContextMenu from "../ContextMenu";
import SVGDefines from "../SVGDefines";
import SheetTabContextMenu from "../ContextMenu/SheetTab";
import MoreItemsContaier from "../Toolbar/MoreItemsContainer";
import { generateAPIs } from "./api";
import { ModalProvider } from "../../context/modal";
import FilterMenu from "../ContextMenu/FilterMenu";
import SheetList from "../SheetList";
enablePatches();
var triggerGroupValuesRefresh = function (ctx) {
    if (ctx.groupValuesRefreshData.length > 0) {
        groupValuesRefresh(ctx);
    }
};
var concatProducer = function () {
    var producers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        producers[_i] = arguments[_i];
    }
    return function (ctx) {
        producers.forEach(function (producer) {
            producer(ctx);
        });
    };
};
var Workbook = React.forwardRef(function (_a, ref) {
    var _b;
    var onChange = _a.onChange, onOp = _a.onOp, originalData = _a.data, props = __rest(_a, ["onChange", "onOp", "data"]);
    var globalCache = useRef({ undoList: [], redoList: [] });
    var cellInput = useRef(null);
    var fxInput = useRef(null);
    var canvas = useRef(null);
    var scrollbarX = useRef(null);
    var scrollbarY = useRef(null);
    var cellArea = useRef(null);
    var workbookContainer = useRef(null);
    var refs = useMemo(function () { return ({
        globalCache: globalCache.current,
        cellInput: cellInput,
        fxInput: fxInput,
        canvas: canvas,
        scrollbarX: scrollbarX,
        scrollbarY: scrollbarY,
        cellArea: cellArea,
        workbookContainer: workbookContainer,
    }); }, []);
    var _c = useState(defaultContext(refs)), context = _c[0], setContext = _c[1];
    var _d = locale(context), formula = _d.formula, info = _d.info;
    var _e = useState(null), moreToolbarItems = _e[0], setMoreToolbarItems = _e[1];
    var _f = useState({
        numberC: 0,
        count: 0,
        sum: 0,
        max: 0,
        min: 0,
        average: "",
    }), calInfo = _f[0], setCalInfo = _f[1];
    var mergedSettings = useMemo(function () { return _.assign(_.cloneDeep(defaultSettings), props); }, __spreadArray([], _.values(props), true));
    useEffect(function () {
        var selection = context.luckysheet_select_save;
        var lang = props.lang;
        if (selection) {
            var re = calcSelectionInfo(context, lang);
            setCalInfo(re);
        }
    }, [context.luckysheet_select_save]);
    var initSheetData = useCallback(function (draftCtx, newData, index) {
        var _a, _b;
        var celldata = newData.celldata, row = newData.row, column = newData.column;
        var lastRow = _.maxBy(celldata, "r");
        var lastCol = _.maxBy(celldata, "c");
        var lastRowNum = ((_a = lastRow === null || lastRow === void 0 ? void 0 : lastRow.r) !== null && _a !== void 0 ? _a : 0) + 1;
        var lastColNum = ((_b = lastCol === null || lastCol === void 0 ? void 0 : lastCol.c) !== null && _b !== void 0 ? _b : 0) + 1;
        if (row != null && column != null && row > 0 && column > 0) {
            lastRowNum = Math.max(lastRowNum, row);
            lastColNum = Math.max(lastColNum, column);
        }
        else {
            lastRowNum = Math.max(lastRowNum, draftCtx.defaultrowNum);
            lastColNum = Math.max(lastColNum, draftCtx.defaultcolumnNum);
        }
        if (lastRowNum && lastColNum) {
            var expandedData_1 = _.times(lastRowNum, function () {
                return _.times(lastColNum, function () { return null; });
            });
            celldata === null || celldata === void 0 ? void 0 : celldata.forEach(function (d) {
                expandedData_1[d.r][d.c] = d.v;
            });
            draftCtx.luckysheetfile = produce(draftCtx.luckysheetfile, function (d) {
                d[index].data = expandedData_1;
                delete d[index].celldata;
                return d;
            });
            return expandedData_1;
        }
        return null;
    }, []);
    var emitOp = useCallback(function (ctx, patches, options, undo) {
        if (undo === void 0) { undo = false; }
        if (onOp) {
            onOp(patchToOp(ctx, patches, options, undo));
        }
    }, [onOp]);
    function reduceUndoList(ctx, ctxBefore) {
        var sheetsId = ctx.luckysheetfile.map(function (sheet) { return sheet.id; });
        var sheetDeletedByMe = globalCache.current.undoList
            .filter(function (undo) { var _a; return (_a = undo.options) === null || _a === void 0 ? void 0 : _a.deleteSheetOp; })
            .map(function (item) { var _a, _b; return (_b = (_a = item.options) === null || _a === void 0 ? void 0 : _a.deleteSheetOp) === null || _b === void 0 ? void 0 : _b.id; });
        globalCache.current.undoList = globalCache.current.undoList.filter(function (undo) {
            var _a, _b, _c, _d;
            return ((_a = undo.options) === null || _a === void 0 ? void 0 : _a.deleteSheetOp) ||
                ((_b = undo.options) === null || _b === void 0 ? void 0 : _b.id) === undefined ||
                _.indexOf(sheetsId, (_c = undo.options) === null || _c === void 0 ? void 0 : _c.id) !== -1 ||
                _.indexOf(sheetDeletedByMe, (_d = undo.options) === null || _d === void 0 ? void 0 : _d.id) !== -1;
        });
        if (ctxBefore.luckysheetfile.length > ctx.luckysheetfile.length) {
            var sheetDeleted = ctxBefore.luckysheetfile
                .filter(function (oneSheet) {
                return _.indexOf(ctx.luckysheetfile.map(function (item) { return item.id; }), oneSheet.id) === -1;
            })
                .map(function (item) { return getSheetIndex(ctxBefore, item.id); });
            var deletedIndex_1 = sheetDeleted[0];
            globalCache.current.undoList = globalCache.current.undoList.map(function (oneStep) {
                oneStep.patches = oneStep.patches.map(function (onePatch) {
                    if (typeof onePatch.path[1] === "number" &&
                        onePatch.path[1] > deletedIndex_1) {
                        onePatch.path[1] -= 1;
                    }
                    return onePatch;
                });
                oneStep.inversePatches = oneStep.inversePatches.map(function (onePatch) {
                    if (typeof onePatch.path[1] === "number" &&
                        onePatch.path[1] > deletedIndex_1) {
                        onePatch.path[1] -= 1;
                    }
                    return onePatch;
                });
                return oneStep;
            });
        }
    }
    function dataToCelldata(data) {
        var _a;
        var cellData = [];
        for (var row = 0; row < (data === null || data === void 0 ? void 0 : data.length); row += 1) {
            for (var col = 0; col < ((_a = data[row]) === null || _a === void 0 ? void 0 : _a.length); col += 1) {
                if (data[row][col] !== null) {
                    cellData.push({
                        r: row,
                        c: col,
                        v: data[row][col],
                    });
                }
            }
        }
        return cellData;
    }
    var setContextWithProduce = useCallback(function (recipe, options) {
        if (options === void 0) { options = {}; }
        setContext(function (ctx_) {
            var _a, _b, _c;
            var _d = produceWithPatches(ctx_, concatProducer(recipe, triggerGroupValuesRefresh)), result = _d[0], patches = _d[1], inversePatches = _d[2];
            if (patches.length > 0 && !options.noHistory) {
                if (options.logPatch) {
                    console.info("patch", patches);
                }
                var filteredPatches = filterPatch(patches);
                var filteredInversePatches = filterPatch(inversePatches);
                if (filteredInversePatches.length > 0) {
                    options.id = ctx_.currentSheetId;
                    if (options.deleteSheetOp) {
                        var target = ctx_.luckysheetfile.filter(function (sheet) { var _a; return sheet.id === ((_a = options.deleteSheetOp) === null || _a === void 0 ? void 0 : _a.id); });
                        if (target) {
                            var index = getSheetIndex(ctx_, options.deleteSheetOp.id);
                            options.deletedSheet = {
                                id: options.deleteSheetOp.id,
                                index: index,
                                value: _.cloneDeep(ctx_.luckysheetfile[index]),
                            };
                            options.deletedSheet.value.celldata = dataToCelldata(options.deletedSheet.value.data);
                            delete options.deletedSheet.value.data;
                            options.deletedSheet.value.status = 0;
                            filteredInversePatches = [
                                {
                                    op: "add",
                                    path: ["luckysheetfile", 0],
                                    value: options.deletedSheet.value,
                                },
                            ];
                        }
                    }
                    else if (options.addSheetOp) {
                        options.addSheet = {};
                        options.addSheet.id =
                            result.luckysheetfile[result.luckysheetfile.length - 1].id;
                    }
                    globalCache.current.undoList.push({
                        patches: filteredPatches,
                        inversePatches: filteredInversePatches,
                        options: options,
                    });
                    globalCache.current.redoList = [];
                    emitOp(result, filteredPatches, options);
                }
            }
            else {
                if (((_b = (_a = patches === null || patches === void 0 ? void 0 : patches[0]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.length) < ((_c = ctx_ === null || ctx_ === void 0 ? void 0 : ctx_.luckysheetfile) === null || _c === void 0 ? void 0 : _c.length)) {
                    reduceUndoList(result, ctx_);
                }
            }
            return result;
        });
    }, [emitOp]);
    var handleUndo = useCallback(function () {
        var history = globalCache.current.undoList.pop();
        if (history) {
            setContext(function (ctx_) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if ((_a = history.options) === null || _a === void 0 ? void 0 : _a.deleteSheetOp) {
                    history.inversePatches[0].path[1] = ctx_.luckysheetfile.length;
                    var order_1 = (_c = (_b = history.options.deletedSheet) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.order;
                    var sheetsRight = ctx_.luckysheetfile.filter(function (sheet) {
                        var _a, _b;
                        return (sheet === null || sheet === void 0 ? void 0 : sheet.order) >= order_1 &&
                            sheet.id !== ((_b = (_a = history === null || history === void 0 ? void 0 : history.options) === null || _a === void 0 ? void 0 : _a.deleteSheetOp) === null || _b === void 0 ? void 0 : _b.id);
                    });
                    _.forEach(sheetsRight, function (sheet) {
                        history.inversePatches.push({
                            op: "replace",
                            path: [
                                "luckysheetfile",
                                getSheetIndex(ctx_, sheet.id),
                                "order",
                            ],
                            value: (sheet === null || sheet === void 0 ? void 0 : sheet.order) + 1,
                        });
                    });
                }
                var newContext = applyPatches(ctx_, history.inversePatches);
                globalCache.current.redoList.push(history);
                var inversedOptions = inverseRowColOptions(history.options);
                if (inversedOptions === null || inversedOptions === void 0 ? void 0 : inversedOptions.insertRowColOp) {
                    inversedOptions.restoreDeletedCells = true;
                }
                if ((_d = history.options) === null || _d === void 0 ? void 0 : _d.addSheetOp) {
                    var index = getSheetIndex(ctx_, history.options.addSheet.id);
                    inversedOptions.addSheet = {
                        id: history.options.addSheet.id,
                        index: index,
                        value: _.cloneDeep(ctx_.luckysheetfile[index]),
                    };
                    inversedOptions.addSheet.value.celldata = dataToCelldata((_e = inversedOptions.addSheet.value) === null || _e === void 0 ? void 0 : _e.data);
                    delete inversedOptions.addSheet.value.data;
                }
                emitOp(newContext, history.inversePatches, inversedOptions, true);
                if (((_f = history.options) === null || _f === void 0 ? void 0 : _f.deleteRowColOp) ||
                    ((_g = history.options) === null || _g === void 0 ? void 0 : _g.insertRowColOp) ||
                    ((_h = history.options) === null || _h === void 0 ? void 0 : _h.restoreDeletedCells))
                    newContext.formulaCache.formulaCellInfoMap = null;
                else
                    newContext.formulaCache.updateFormulaCache(newContext, history, "undo");
                return newContext;
            });
        }
    }, [emitOp]);
    var handleRedo = useCallback(function () {
        var history = globalCache.current.redoList.pop();
        if (history) {
            setContext(function (ctx_) {
                var _a, _b, _c;
                var newContext = applyPatches(ctx_, history.patches);
                globalCache.current.undoList.push(history);
                emitOp(newContext, history.patches, history.options);
                if (((_a = history.options) === null || _a === void 0 ? void 0 : _a.deleteRowColOp) ||
                    ((_b = history.options) === null || _b === void 0 ? void 0 : _b.insertRowColOp) ||
                    ((_c = history.options) === null || _c === void 0 ? void 0 : _c.restoreDeletedCells))
                    newContext.formulaCache.formulaCellInfoMap = null;
                else
                    newContext.formulaCache.updateFormulaCache(newContext, history, "redo");
                return newContext;
            });
        }
    }, [emitOp]);
    useEffect(function () {
        var _a, _b;
        if (context.luckysheet_select_save != null) {
            (_b = (_a = mergedSettings.hooks) === null || _a === void 0 ? void 0 : _a.afterSelectionChange) === null || _b === void 0 ? void 0 : _b.call(_a, context.currentSheetId, context.luckysheet_select_save[0]);
        }
    }, [
        context.currentSheetId,
        context.luckysheet_select_save,
        mergedSettings.hooks,
    ]);
    var providerValue = useMemo(function () { return ({
        context: context,
        setContext: setContextWithProduce,
        settings: mergedSettings,
        handleUndo: handleUndo,
        handleRedo: handleRedo,
        refs: refs,
    }); }, [
        context,
        handleRedo,
        handleUndo,
        mergedSettings,
        refs,
        setContextWithProduce,
    ]);
    useEffect(function () {
        if (!_.isEmpty(context.luckysheetfile)) {
            onChange === null || onChange === void 0 ? void 0 : onChange(context.luckysheetfile);
        }
    }, [context.luckysheetfile, onChange]);
    useEffect(function () {
        setContextWithProduce(function (draftCtx) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            draftCtx.defaultcolumnNum = mergedSettings.column;
            draftCtx.defaultrowNum = mergedSettings.row;
            draftCtx.defaultFontSize = mergedSettings.defaultFontSize;
            if (_.isEmpty(draftCtx.luckysheetfile)) {
                var newData = produce(originalData, function (draftData) {
                    ensureSheetIndex(draftData, mergedSettings.generateSheetId);
                });
                draftCtx.luckysheetfile = newData;
                newData.forEach(function (newDatum) {
                    var _a;
                    var index = getSheetIndex(draftCtx, newDatum.id);
                    var sheet = (_a = draftCtx.luckysheetfile) === null || _a === void 0 ? void 0 : _a[index];
                    var cellMatrixData = initSheetData(draftCtx, sheet, index);
                    setFormulaCellInfoMap(draftCtx, sheet.calcChain, cellMatrixData || undefined);
                });
            }
            if (mergedSettings.devicePixelRatio > 0) {
                draftCtx.devicePixelRatio = mergedSettings.devicePixelRatio;
            }
            draftCtx.lang = mergedSettings.lang;
            draftCtx.allowEdit = mergedSettings.allowEdit;
            draftCtx.hooks = mergedSettings.hooks;
            if (_.isEmpty(draftCtx.currentSheetId)) {
                initSheetIndex(draftCtx);
            }
            var sheetIdx = getSheetIndex(draftCtx, draftCtx.currentSheetId);
            if (sheetIdx == null) {
                if (((_b = (_a = draftCtx.luckysheetfile) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0) {
                    sheetIdx = 0;
                    draftCtx.currentSheetId = draftCtx.luckysheetfile[0].id;
                }
            }
            if (sheetIdx == null)
                return;
            var sheet = (_c = draftCtx.luckysheetfile) === null || _c === void 0 ? void 0 : _c[sheetIdx];
            if (!sheet)
                return;
            var data = sheet.data;
            if (_.isEmpty(data)) {
                var temp = initSheetData(draftCtx, sheet, sheetIdx);
                if (!_.isNull(temp)) {
                    data = temp;
                }
            }
            if (_.isEmpty(draftCtx.luckysheet_select_save) &&
                !_.isEmpty(sheet.luckysheet_select_save)) {
                draftCtx.luckysheet_select_save = sheet.luckysheet_select_save;
            }
            if (((_d = draftCtx.luckysheet_select_save) === null || _d === void 0 ? void 0 : _d.length) === 0) {
                if (((_f = (_e = data === null || data === void 0 ? void 0 : data[0]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.mc) &&
                    !_.isNil((_j = (_h = (_g = data === null || data === void 0 ? void 0 : data[0]) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.mc) === null || _j === void 0 ? void 0 : _j.rs) &&
                    !_.isNil((_m = (_l = (_k = data === null || data === void 0 ? void 0 : data[0]) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.mc) === null || _m === void 0 ? void 0 : _m.cs)) {
                    draftCtx.luckysheet_select_save = [
                        {
                            row: [0, data[0][0].mc.rs - 1],
                            column: [0, data[0][0].mc.cs - 1],
                        },
                    ];
                }
                else {
                    draftCtx.luckysheet_select_save = [
                        {
                            row: [0, 0],
                            column: [0, 0],
                        },
                    ];
                }
            }
            draftCtx.config = _.isNil(sheet.config) ? {} : sheet.config;
            draftCtx.insertedImgs = sheet.images;
            draftCtx.currency = mergedSettings.currency || "¥";
            draftCtx.zoomRatio = _.isNil(sheet.zoomRatio) ? 1 : sheet.zoomRatio;
            draftCtx.rowHeaderWidth =
                mergedSettings.rowHeaderWidth * draftCtx.zoomRatio;
            draftCtx.columnHeaderHeight =
                mergedSettings.columnHeaderHeight * draftCtx.zoomRatio;
            if (!_.isNil(sheet.defaultRowHeight)) {
                draftCtx.defaultrowlen = Number(sheet.defaultRowHeight);
            }
            else {
                draftCtx.defaultrowlen = mergedSettings.defaultRowHeight;
            }
            if (!_.isNil(sheet.addRows)) {
                draftCtx.addDefaultRows = Number(sheet.addRows);
            }
            else {
                draftCtx.addDefaultRows = mergedSettings.addRows;
            }
            if (!_.isNil(sheet.defaultColWidth)) {
                draftCtx.defaultcollen = Number(sheet.defaultColWidth);
            }
            else {
                draftCtx.defaultcollen = mergedSettings.defaultColWidth;
            }
            if (!_.isNil(sheet.showGridLines)) {
                var showGridLines = sheet.showGridLines;
                if (showGridLines === 0 || showGridLines === false) {
                    draftCtx.showGridLines = false;
                }
                else {
                    draftCtx.showGridLines = true;
                }
            }
            else {
                draftCtx.showGridLines = true;
            }
            if (_.isNil(mergedSettings.lang)) {
                var lang = (navigator.languages && navigator.languages[0]) ||
                    navigator.language ||
                    navigator.userLanguage;
                draftCtx.lang = lang;
            }
        }, { noHistory: true });
    }, [
        context.currentSheetId,
        context.luckysheetfile.length,
        originalData,
        mergedSettings.defaultRowHeight,
        mergedSettings.defaultColWidth,
        mergedSettings.column,
        mergedSettings.row,
        mergedSettings.defaultFontSize,
        mergedSettings.devicePixelRatio,
        mergedSettings.lang,
        mergedSettings.allowEdit,
        mergedSettings.hooks,
        mergedSettings.generateSheetId,
        setContextWithProduce,
        initSheetData,
        mergedSettings.rowHeaderWidth,
        mergedSettings.columnHeaderHeight,
        mergedSettings.addRows,
        mergedSettings.currency,
    ]);
    var onKeyDown = useCallback(function (e) {
        var nativeEvent = e.nativeEvent;
        if ((e.ctrlKey || e.metaKey) && e.code === "KeyZ") {
            if (e.shiftKey) {
                handleRedo();
            }
            else {
                handleUndo();
            }
            e.stopPropagation();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.code === "KeyY") {
            handleRedo();
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        setContextWithProduce(function (draftCtx) {
            handleGlobalKeyDown(draftCtx, cellInput.current, fxInput.current, nativeEvent, globalCache.current, handleUndo, handleRedo, canvas.current.getContext("2d"));
        });
    }, [handleRedo, handleUndo, setContextWithProduce]);
    var onPaste = useCallback(function (e) {
        var _a;
        if (cellInput.current === document.activeElement ||
            ((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.className) === "fortune-sheet-overlay") {
            var clipboardData = e.clipboardData;
            if (!clipboardData) {
                clipboardData = window.clipboardData;
            }
            var txtdata = clipboardData.getData("text/html") ||
                clipboardData.getData("text/plain");
            var ele = document.createElement("div");
            ele.innerHTML = txtdata;
            var trList = ele.querySelectorAll("table tr");
            var maxRow = trList.length + context.luckysheet_select_save[0].row[0];
            var rowToBeAdded = maxRow -
                context.luckysheetfile[getSheetIndex(context, context.currentSheetId)].data.length;
            var range_1 = context.luckysheet_select_save;
            if (rowToBeAdded > 0) {
                var insertRowColOp_1 = {
                    type: "row",
                    index: context.luckysheetfile[getSheetIndex(context, context.currentSheetId)].data.length - 1,
                    count: rowToBeAdded,
                    direction: "rightbottom",
                    id: context.currentSheetId,
                };
                setContextWithProduce(function (draftCtx) {
                    insertRowCol(draftCtx, insertRowColOp_1);
                    draftCtx.luckysheet_select_save = range_1;
                }, {
                    insertRowColOp: insertRowColOp_1,
                });
            }
            setContextWithProduce(function (draftCtx) {
                try {
                    handlePaste(draftCtx, e);
                }
                catch (err) {
                    console.error(err);
                }
            });
        }
    }, [context, setContextWithProduce]);
    var onMoreToolbarItemsClose = useCallback(function () {
        setMoreToolbarItems(null);
    }, []);
    useEffect(function () {
        document.addEventListener("paste", onPaste);
        return function () {
            document.removeEventListener("paste", onPaste);
        };
    }, [onPaste]);
    useImperativeHandle(ref, function () {
        return generateAPIs(context, setContextWithProduce, handleUndo, handleRedo, mergedSettings, cellInput.current, scrollbarX.current, scrollbarY.current);
    }, [context, setContextWithProduce, handleUndo, handleRedo, mergedSettings]);
    var i = getSheetIndex(context, context.currentSheetId);
    if (i == null) {
        return null;
    }
    var sheet = (_b = context.luckysheetfile) === null || _b === void 0 ? void 0 : _b[i];
    if (!sheet) {
        return null;
    }
    return (React.createElement(WorkbookContext.Provider, { value: providerValue },
        React.createElement(ModalProvider, null,
            React.createElement("div", { className: "fortune-container", ref: workbookContainer, onKeyDown: onKeyDown },
                React.createElement("section", { "aria-labelledby": "shortcuts-heading", id: "shortcut-list", className: "sr-only", tabIndex: 0, "aria-live": "polite" },
                    React.createElement("h2", { id: "shortcuts-heading" }, info.shortcuts),
                    React.createElement("ul", null,
                        React.createElement("li", null, info.toggleSheetFocusShortcut),
                        React.createElement("li", null, info.selectRangeShortcut),
                        React.createElement("li", null, info.autoFillDownShortcut),
                        React.createElement("li", null, info.autoFillRightShortcut),
                        React.createElement("li", null, info.boldTextShortcut),
                        React.createElement("li", null, info.copyShortcut),
                        React.createElement("li", null, info.pasteShortcut),
                        React.createElement("li", null, info.undoShortcut),
                        React.createElement("li", null, info.redoShortcut),
                        React.createElement("li", null, info.deleteCellContentShortcut),
                        React.createElement("li", null, info.confirmCellEditShortcut),
                        React.createElement("li", null, info.moveRightShortcut),
                        React.createElement("li", null, info.moveLeftShortcut))),
                React.createElement(SVGDefines, { currency: mergedSettings.currency }),
                React.createElement("div", { className: "fortune-workarea" },
                    mergedSettings.showToolbar && (React.createElement(Toolbar, { moreItemsOpen: moreToolbarItems !== null, setMoreItems: setMoreToolbarItems })),
                    mergedSettings.showFormulaBar && React.createElement(FxEditor, null)),
                React.createElement(Sheet, { sheet: sheet }),
                mergedSettings.showSheetTabs && React.createElement(SheetTab, null),
                React.createElement(ContextMenu, null),
                React.createElement(FilterMenu, null),
                React.createElement(SheetTabContextMenu, null),
                context.showSheetList && React.createElement(SheetList, null),
                moreToolbarItems && (React.createElement(MoreItemsContaier, { onClose: onMoreToolbarItemsClose }, moreToolbarItems)),
                !_.isEmpty(context.contextMenu) && (React.createElement("div", { onMouseDown: function () {
                        setContextWithProduce(function (draftCtx) {
                            draftCtx.contextMenu = {};
                            draftCtx.filterContextMenu = undefined;
                            draftCtx.showSheetList = undefined;
                        });
                    }, onMouseMove: function (e) { return e.stopPropagation(); }, onMouseUp: function (e) { return e.stopPropagation(); }, onContextMenu: function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }, className: "fortune-popover-backdrop" })),
                React.createElement("div", { className: "fortune-stat-area" },
                    React.createElement("div", { className: "luckysheet-sheet-selection-calInfo" },
                        !!calInfo.count && (React.createElement("div", { style: { width: "60px" } },
                            formula.count,
                            ": ",
                            calInfo.count)),
                        !!calInfo.numberC && !!calInfo.sum && (React.createElement("div", null,
                            formula.sum,
                            ": ",
                            calInfo.sum)),
                        !!calInfo.numberC && !!calInfo.average && (React.createElement("div", null,
                            formula.average,
                            ": ",
                            calInfo.average)),
                        !!calInfo.numberC && !!calInfo.max && (React.createElement("div", null,
                            formula.max,
                            ": ",
                            calInfo.max)),
                        !!calInfo.numberC && !!calInfo.min && (React.createElement("div", null,
                            formula.min,
                            ": ",
                            calInfo.min))))))));
});
export default Workbook;
