import { getCellValue, getDropdownList, getFlowdata, getSheetIndex, mergeBorder, setDropcownValue, } from "@evidential-fortune-sheet/core";
import React, { useCallback, useContext, useEffect, useRef, useState, } from "react";
import WorkbookContext from "../../context";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import SVGIcon from "../SVGIcon";
import "./index.css";
var DropDownList = function () {
    var _a = useContext(WorkbookContext), context = _a.context, setContext = _a.setContext;
    var containerRef = useRef(null);
    var _b = useState([]), list = _b[0], setList = _b[1];
    var _c = useState(false), isMul = _c[0], setIsMul = _c[1];
    var _d = useState(), position = _d[0], setPosition = _d[1];
    var _e = useState([]), selected = _e[0], setSelected = _e[1];
    var close = useCallback(function () {
        setContext(function (ctx) {
            ctx.dataVerificationDropDownList = false;
        });
    }, [setContext]);
    useOutsideClick(containerRef, close, [close]);
    useEffect(function () {
        var _a, _b;
        if (!context.luckysheet_select_save)
            return;
        var last = context.luckysheet_select_save[context.luckysheet_select_save.length - 1];
        var rowIndex = last.row_focus;
        var colIndex = last.column_focus;
        if (rowIndex == null || colIndex == null)
            return;
        var row = context.visibledatarow[rowIndex];
        var col_pre = colIndex === 0 ? 0 : context.visibledatacolumn[colIndex - 1];
        var d = getFlowdata(context);
        if (!d)
            return;
        var margeSet = mergeBorder(context, d, rowIndex, colIndex);
        if (margeSet) {
            _a = margeSet.row, row = _a[1];
            _b = margeSet.column, col_pre = _b[0];
        }
        var index = getSheetIndex(context, context.currentSheetId);
        var dataVerification = context.luckysheetfile[index].dataVerification;
        var item = dataVerification["".concat(rowIndex, "_").concat(colIndex)];
        var dropdownList = getDropdownList(context, item.value1);
        var cellValue = getCellValue(rowIndex, colIndex, d);
        if (cellValue) {
            setSelected(cellValue.toString().split(","));
        }
        setList(dropdownList);
        setPosition({
            left: col_pre,
            top: row,
        });
        setIsMul(item.type2 === "true");
    }, []);
    useEffect(function () {
        if (!context.luckysheet_select_save)
            return;
        var last = context.luckysheet_select_save[context.luckysheet_select_save.length - 1];
        var rowIndex = last.row_focus;
        var colIndex = last.column_focus;
        if (rowIndex == null || colIndex == null)
            return;
        var index = getSheetIndex(context, context.currentSheetId);
        var dataVerification = context.luckysheetfile[index].dataVerification;
        var item = dataVerification["".concat(rowIndex, "_").concat(colIndex)];
        if (item.type2 !== "true")
            return;
        var d = getFlowdata(context);
        if (!d)
            return;
        var cellValue = getCellValue(rowIndex, colIndex, d);
        if (cellValue) {
            setSelected(cellValue.toString().split(","));
        }
    }, [context.luckysheetfile]);
    return (React.createElement("div", { id: "luckysheet-dataVerification-dropdown-List", style: position, ref: containerRef, onClick: function (e) { return e.stopPropagation(); }, onChange: function (e) { return e.stopPropagation(); }, onKeyDown: function (e) { return e.stopPropagation(); }, onMouseDown: function (e) { return e.stopPropagation(); }, onMouseUp: function (e) { return e.stopPropagation(); }, tabIndex: 0 }, list.map(function (v, i) { return (React.createElement("div", { className: "dropdown-List-item", key: i, onClick: function () {
            setContext(function (ctx) {
                var arr = selected;
                var index = arr.indexOf(v);
                if (index < 0) {
                    arr.push(v);
                }
                else {
                    arr.splice(index, 1);
                }
                setSelected(arr);
                setDropcownValue(ctx, v, arr);
            });
        }, tabIndex: 0 },
        React.createElement(SVGIcon, { name: "check", width: 12, style: {
                verticalAlign: "middle",
                display: isMul && selected.indexOf(v) >= 0 ? "inline" : "none",
            } }),
        v)); })));
};
export default DropDownList;
