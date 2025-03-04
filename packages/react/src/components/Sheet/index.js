import React, { useRef, useEffect, useContext, useCallback } from "react";
import { Canvas, updateContextWithCanvas, updateContextWithSheetData, handleGlobalWheel, initFreeze, } from "@evidential-fortune-sheet/core";
import "./index.css";
import WorkbookContext from "../../context";
import SheetOverlay from "../SheetOverlay";
var Sheet = function (_a) {
    var _b, _c, _d;
    var sheet = _a.sheet;
    var data = sheet.data;
    var containerRef = useRef(null);
    var placeholderRef = useRef(null);
    var _e = useContext(WorkbookContext), context = _e.context, setContext = _e.setContext, refs = _e.refs, settings = _e.settings;
    useEffect(function () {
        function resize() {
            if (!data)
                return;
            setContext(function (draftCtx) {
                if (settings.devicePixelRatio === 0) {
                    draftCtx.devicePixelRatio = (typeof globalThis !== "undefined" ? globalThis : window).devicePixelRatio;
                }
                updateContextWithSheetData(draftCtx, data);
                updateContextWithCanvas(draftCtx, refs.canvas.current, placeholderRef.current);
            });
        }
        window.addEventListener("resize", resize);
        return function () {
            window.removeEventListener("resize", resize);
        };
    }, [data, refs.canvas, setContext, settings.devicePixelRatio]);
    useEffect(function () {
        if (!data)
            return;
        setContext(function (draftCtx) { return updateContextWithSheetData(draftCtx, data); });
    }, [
        (_b = context.config) === null || _b === void 0 ? void 0 : _b.rowlen,
        (_c = context.config) === null || _c === void 0 ? void 0 : _c.columnlen,
        (_d = context.config) === null || _d === void 0 ? void 0 : _d.rowhidden,
        context.config.colhidden,
        data,
        context.zoomRatio,
        setContext,
    ]);
    useEffect(function () {
        setContext(function (draftCtx) {
            return updateContextWithCanvas(draftCtx, refs.canvas.current, placeholderRef.current);
        });
    }, [
        refs.canvas,
        setContext,
        context.rowHeaderWidth,
        context.columnHeaderHeight,
        context.devicePixelRatio,
    ]);
    useEffect(function () {
        initFreeze(context, refs.globalCache, context.currentSheetId);
    }, [
        refs.globalCache,
        sheet.frozen,
        context.currentSheetId,
        context.visibledatacolumn,
        context.visibledatarow,
    ]);
    useEffect(function () {
        var _a, _b, _c, _d, _e;
        if (context.groupValuesRefreshData.length > 0) {
            return;
        }
        var tableCanvas = new Canvas(refs.canvas.current, context);
        if (tableCanvas == null)
            return;
        var freeze = (_a = refs.globalCache.freezen) === null || _a === void 0 ? void 0 : _a[sheet.id];
        if (((_b = freeze === null || freeze === void 0 ? void 0 : freeze.horizontal) === null || _b === void 0 ? void 0 : _b.freezenhorizontaldata) ||
            ((_c = freeze === null || freeze === void 0 ? void 0 : freeze.vertical) === null || _c === void 0 ? void 0 : _c.freezenverticaldata)) {
            var horizontalData = (_d = freeze === null || freeze === void 0 ? void 0 : freeze.horizontal) === null || _d === void 0 ? void 0 : _d.freezenhorizontaldata;
            var verticallData = (_e = freeze === null || freeze === void 0 ? void 0 : freeze.vertical) === null || _e === void 0 ? void 0 : _e.freezenverticaldata;
            if (horizontalData && verticallData) {
                var horizontalPx = horizontalData[0], horizontalScrollTop = horizontalData[2];
                var verticalPx = verticallData[0], verticalScrollWidth = verticallData[2];
                tableCanvas.drawMain({
                    scrollWidth: context.scrollLeft + verticalPx - verticalScrollWidth,
                    scrollHeight: context.scrollTop + horizontalPx - horizontalScrollTop,
                    offsetLeft: verticalPx - verticalScrollWidth + context.rowHeaderWidth,
                    offsetTop: horizontalPx - horizontalScrollTop + context.columnHeaderHeight,
                    clear: true,
                });
                tableCanvas.drawMain({
                    scrollWidth: context.scrollLeft + verticalPx - verticalScrollWidth,
                    scrollHeight: horizontalScrollTop,
                    drawHeight: horizontalPx,
                    offsetLeft: verticalPx - verticalScrollWidth + context.rowHeaderWidth,
                });
                tableCanvas.drawMain({
                    scrollWidth: verticalScrollWidth,
                    scrollHeight: context.scrollTop + horizontalPx - horizontalScrollTop,
                    drawWidth: verticalPx,
                    offsetTop: horizontalPx - horizontalScrollTop + context.columnHeaderHeight,
                });
                tableCanvas.drawMain({
                    scrollWidth: verticalScrollWidth,
                    scrollHeight: horizontalScrollTop,
                    drawWidth: verticalPx,
                    drawHeight: horizontalPx,
                });
                tableCanvas.drawColumnHeader(context.scrollLeft + verticalPx - verticalScrollWidth, undefined, verticalPx - verticalScrollWidth + context.rowHeaderWidth);
                tableCanvas.drawColumnHeader(verticalScrollWidth, verticalPx);
                tableCanvas.drawRowHeader(context.scrollTop + horizontalPx - horizontalScrollTop, undefined, horizontalPx - horizontalScrollTop + context.columnHeaderHeight);
                tableCanvas.drawRowHeader(horizontalScrollTop, horizontalPx);
                tableCanvas.drawFreezeLine({
                    horizontalTop: horizontalPx - horizontalScrollTop + context.columnHeaderHeight - 2,
                    verticalLeft: verticalPx - verticalScrollWidth + context.rowHeaderWidth - 2,
                });
            }
            else if (horizontalData) {
                var horizontalPx = horizontalData[0], horizontalScrollTop = horizontalData[2];
                tableCanvas.drawMain({
                    scrollWidth: context.scrollLeft,
                    scrollHeight: context.scrollTop + horizontalPx - horizontalScrollTop,
                    offsetTop: horizontalPx - horizontalScrollTop + context.columnHeaderHeight,
                    clear: true,
                });
                tableCanvas.drawMain({
                    scrollWidth: context.scrollLeft,
                    scrollHeight: horizontalScrollTop,
                    drawHeight: horizontalPx,
                });
                tableCanvas.drawColumnHeader(context.scrollLeft);
                tableCanvas.drawRowHeader(context.scrollTop + horizontalPx - horizontalScrollTop, undefined, horizontalPx - horizontalScrollTop + context.columnHeaderHeight);
                tableCanvas.drawRowHeader(horizontalScrollTop, horizontalPx);
                tableCanvas.drawFreezeLine({
                    horizontalTop: horizontalPx - horizontalScrollTop + context.columnHeaderHeight - 2,
                });
            }
            else if (verticallData) {
                var verticalPx = verticallData[0], verticalScrollWidth = verticallData[2];
                tableCanvas.drawMain({
                    scrollWidth: context.scrollLeft + verticalPx - verticalScrollWidth,
                    scrollHeight: context.scrollTop,
                    offsetLeft: verticalPx - verticalScrollWidth + context.rowHeaderWidth,
                });
                tableCanvas.drawMain({
                    scrollWidth: verticalScrollWidth,
                    scrollHeight: context.scrollTop,
                    drawWidth: verticalPx,
                });
                tableCanvas.drawRowHeader(context.scrollTop);
                tableCanvas.drawColumnHeader(context.scrollLeft + verticalPx - verticalScrollWidth, undefined, verticalPx - verticalScrollWidth + context.rowHeaderWidth);
                tableCanvas.drawColumnHeader(verticalScrollWidth, verticalPx);
                tableCanvas.drawFreezeLine({
                    verticalLeft: verticalPx - verticalScrollWidth + context.rowHeaderWidth - 2,
                });
            }
        }
        else {
            tableCanvas.drawMain({
                scrollWidth: context.scrollLeft,
                scrollHeight: context.scrollTop,
                clear: true,
            });
            tableCanvas.drawColumnHeader(context.scrollLeft);
            tableCanvas.drawRowHeader(context.scrollTop);
        }
    }, [context, refs.canvas, refs.globalCache.freezen, setContext, sheet.id]);
    var onWheel = useCallback(function (e) {
        setContext(function (draftCtx) {
            handleGlobalWheel(draftCtx, e, refs.globalCache, refs.scrollbarX.current, refs.scrollbarY.current);
        });
        e.preventDefault();
    }, [refs.globalCache, refs.scrollbarX, refs.scrollbarY, setContext]);
    useEffect(function () {
        var container = containerRef.current;
        container === null || container === void 0 ? void 0 : container.addEventListener("wheel", onWheel);
        return function () {
            container === null || container === void 0 ? void 0 : container.removeEventListener("wheel", onWheel);
        };
    }, [onWheel]);
    return (React.createElement("div", { ref: containerRef, className: "fortune-sheet-container" },
        React.createElement("div", { ref: placeholderRef, className: "fortune-sheet-canvas-placeholder" }),
        React.createElement("canvas", { className: "fortune-sheet-canvas", ref: refs.canvas, "aria-hidden": "true" }),
        React.createElement(SheetOverlay, null)));
};
export default Sheet;
