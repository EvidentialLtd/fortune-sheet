var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { addSheet, api, deleteRowCol, deleteSheet, insertRowCol, opToPatch, createFilterOptions, getSheetIndex, } from "@evidential-fortune-sheet/core";
import { applyPatches } from "immer";
import _ from "lodash";
export function generateAPIs(context, setContext, handleUndo, handleRedo, settings, cellInput, scrollbarX, scrollbarY) {
    return {
        applyOp: function (ops) {
            setContext(function (ctx_) {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                var _j = opToPatch(ctx_, ops), patches = _j[0], specialOps = _j[1];
                if (specialOps.length > 0) {
                    var specialOp = specialOps[0];
                    if (specialOp.op === "insertRowCol") {
                        try {
                            insertRowCol(ctx_, specialOp.value, false);
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    else if (specialOp.op === "deleteRowCol") {
                        deleteRowCol(ctx_, specialOp.value);
                    }
                    else if (specialOp.op === "addSheet") {
                        var name_1 = (_b = (_a = patches.filter(function (path) { return path.path[0] === "name"; })) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
                        if ((_c = specialOp.value) === null || _c === void 0 ? void 0 : _c.id) {
                            addSheet(ctx_, settings, specialOp.value.id, false, name_1, specialOp.value);
                        }
                        var fileIndex = getSheetIndex(ctx_, specialOp.value.id);
                        api.initSheetData(ctx_, fileIndex, specialOp.value);
                    }
                    else if (specialOp.op === "deleteSheet") {
                        deleteSheet(ctx_, specialOp.value.id);
                        patches.length = 0;
                    }
                }
                if (((_e = (_d = ops[0]) === null || _d === void 0 ? void 0 : _d.path) === null || _e === void 0 ? void 0 : _e[0]) === "filter_select")
                    ctx_.luckysheet_filter_save = ops[0].value;
                else if (((_g = (_f = ops[0]) === null || _f === void 0 ? void 0 : _f.path) === null || _g === void 0 ? void 0 : _g[0]) === "hide") {
                    if (ctx_.currentSheetId === ops[0].id) {
                        var shownSheets = ctx_.luckysheetfile.filter(function (sheet) {
                            return (_.isUndefined(sheet.hide) || (sheet === null || sheet === void 0 ? void 0 : sheet.hide) !== 1) &&
                                sheet.id !== ops[0].id;
                        });
                        ctx_.currentSheetId = _.sortBy(shownSheets, function (sheet) { return sheet.order; })[0].id;
                    }
                }
                createFilterOptions(ctx_, ctx_.luckysheet_filter_save, (_h = ops[0]) === null || _h === void 0 ? void 0 : _h.id);
                if (patches.length === 0)
                    return;
                try {
                    applyPatches(ctx_, patches);
                }
                catch (e) {
                    console.error(e);
                }
            }, { noHistory: true });
        },
        getCellValue: function (row, column, options) {
            if (options === void 0) { options = {}; }
            return api.getCellValue(context, row, column, options);
        },
        setCellValue: function (row, column, value, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) {
                return api.setCellValue(draftCtx, row, column, value, cellInput, options);
            });
        },
        clearCell: function (row, column, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.clearCell(draftCtx, row, column, options); });
        },
        setCellFormat: function (row, column, attr, value, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) {
                return api.setCellFormat(draftCtx, row, column, attr, value, options);
            });
        },
        autoFillCell: function (copyRange, applyRange, direction) {
            return setContext(function (draftCtx) {
                return api.autoFillCell(draftCtx, copyRange, applyRange, direction);
            });
        },
        freeze: function (type, range, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.freeze(draftCtx, type, range, options); });
        },
        insertRowOrColumn: function (type, index, count, direction, options) {
            if (direction === void 0) { direction = "rightbottom"; }
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) {
                return api.insertRowOrColumn(draftCtx, type, index, count, direction, options);
            });
        },
        deleteRowOrColumn: function (type, start, end, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) {
                return api.deleteRowOrColumn(draftCtx, type, start, end, options);
            });
        },
        hideRowOrColumn: function (rowOrColInfo, type) {
            return setContext(function (draftCtx) {
                return api.hideRowOrColumn(draftCtx, rowOrColInfo, type);
            });
        },
        showRowOrColumn: function (rowOrColInfo, type) {
            return setContext(function (draftCtx) {
                return api.showRowOrColumn(draftCtx, rowOrColInfo, type);
            });
        },
        setRowHeight: function (rowInfo, options, custom) {
            if (options === void 0) { options = {}; }
            if (custom === void 0) { custom = false; }
            return setContext(function (draftCtx) {
                return api.setRowHeight(draftCtx, rowInfo, options, custom);
            });
        },
        setColumnWidth: function (columnInfo, options, custom) {
            if (options === void 0) { options = {}; }
            if (custom === void 0) { custom = false; }
            return setContext(function (draftCtx) {
                return api.setColumnWidth(draftCtx, columnInfo, options, custom);
            });
        },
        getRowHeight: function (rows, options) {
            if (options === void 0) { options = {}; }
            return api.getRowHeight(context, rows, options);
        },
        getColumnWidth: function (columns, options) {
            if (options === void 0) { options = {}; }
            return api.getColumnWidth(context, columns, options);
        },
        getSelection: function () { return api.getSelection(context); },
        getFlattenRange: function (range) { return api.getFlattenRange(context, range); },
        getCellsByFlattenRange: function (range) {
            return api.getCellsByFlattenRange(context, range);
        },
        getSelectionCoordinates: function () { return api.getSelectionCoordinates(context); },
        getCellsByRange: function (range, options) {
            if (options === void 0) { options = {}; }
            return api.getCellsByRange(context, range, options);
        },
        getHtmlByRange: function (range, options) {
            if (options === void 0) { options = {}; }
            return api.getHtmlByRange(context, range, options);
        },
        setSelection: function (range, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.setSelection(draftCtx, range, options); });
        },
        setCellValuesByRange: function (data, range, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) {
                return api.setCellValuesByRange(draftCtx, data, range, cellInput, options);
            });
        },
        setCellFormatByRange: function (attr, value, range, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) {
                return api.setCellFormatByRange(draftCtx, attr, value, range, options);
            });
        },
        mergeCells: function (ranges, type, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.mergeCells(draftCtx, ranges, type, options); });
        },
        cancelMerge: function (ranges, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.cancelMerge(draftCtx, ranges, options); });
        },
        getAllSheets: function () { return api.getAllSheets(context); },
        setTouchMode: function (mode) {
            setContext(function (draftCtx) { return api.setTouchMode(draftCtx, mode); });
        },
        getSheet: function (options) {
            if (options === void 0) { options = {}; }
            return api.getSheetWithLatestCelldata(context, options);
        },
        addSheet: function (sheetId) {
            var existingSheetIds = api
                .getAllSheets(context)
                .map(function (sheet) { return sheet.id || ""; });
            if (sheetId && existingSheetIds.includes(sheetId)) {
                console.error("Failed to add new sheet: A sheet with the id \"".concat(sheetId, "\" already exists. Please use a unique sheet id."));
            }
            else {
                setContext(function (draftCtx) { return api.addSheet(draftCtx, settings, sheetId); });
            }
        },
        deleteSheet: function (options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.deleteSheet(draftCtx, options); });
        },
        updateSheet: function (data) {
            return setContext(function (draftCtx) { return api.updateSheet(draftCtx, data); });
        },
        activateSheet: function (options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.activateSheet(draftCtx, options); });
        },
        setSheetName: function (name, options) {
            if (options === void 0) { options = {}; }
            return setContext(function (draftCtx) { return api.setSheetName(draftCtx, name, options); });
        },
        setSheetOrder: function (orderList) {
            return setContext(function (draftCtx) { return api.setSheetOrder(draftCtx, orderList); });
        },
        scroll: function (options) { return api.scroll(context, scrollbarX, scrollbarY, options); },
        addPresences: function (newPresences) {
            setContext(function (draftCtx) {
                draftCtx.presences = _.differenceBy(draftCtx.presences || [], newPresences, function (v) { return (v.userId == null ? v.username : v.userId); }).concat(newPresences);
            });
        },
        removePresences: function (arr) {
            setContext(function (draftCtx) {
                if (draftCtx.presences != null) {
                    draftCtx.presences = _.differenceBy(draftCtx.presences, arr, function (v) {
                        return v.userId == null ? v.username : v.userId;
                    });
                }
            });
        },
        setSearchReplace: function (state) {
            setContext(function (draftCtx) {
                draftCtx.showSearch = state;
                draftCtx.showReplace = state;
            });
        },
        handleUndo: handleUndo,
        handleRedo: handleRedo,
        calculateFormula: function (id, range) {
            setContext(function (draftCtx) {
                api.calculateFormula(draftCtx, id, range);
            });
        },
        dataToCelldata: function (data) {
            return api.dataToCelldata(data);
        },
        celldataToData: function (celldata, rowCount, colCount) {
            return api.celldataToData(celldata, rowCount, colCount);
        },
        batchCallApis: function (apiCalls) {
            setContext(function (draftCtx) {
                apiCalls.forEach(function (apiCall) {
                    var _a;
                    var name = apiCall.name, args = apiCall.args;
                    if (typeof api[name] === "function") {
                        (_a = api)[name].apply(_a, __spreadArray([draftCtx], args, false));
                    }
                    else {
                        console.warn("API ".concat(name, " does not exist"));
                    }
                });
            });
        },
    };
}
