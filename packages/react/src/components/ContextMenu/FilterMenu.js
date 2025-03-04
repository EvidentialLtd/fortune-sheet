var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import { clearFilter, locale, getFilterColumnValues, getFilterColumnColors, orderbydatafiler, saveFilter, } from "@evidential-fortune-sheet/core";
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react";
import _ from "lodash";
import produce from "immer";
import WorkbookContext from "../../context";
import Divider from "./Divider";
import Menu from "./Menu";
import SVGIcon from "../SVGIcon";
import { useAlert } from "../../hooks/useAlert";
import { useOutsideClick } from "../../hooks/useOutsideClick";
var SelectItem = function (_a) {
    var item = _a.item, isChecked = _a.isChecked, onChange = _a.onChange, isItemVisible = _a.isItemVisible;
    var checked = useMemo(function () { return isChecked(item.key); }, [isChecked, item.key]);
    return isItemVisible(item) ? (React.createElement("div", { className: "select-item" },
        React.createElement("input", { className: "filter-checkbox", type: "checkbox", checked: checked, onChange: function () {
                onChange(item, !checked);
            } }),
        React.createElement("div", null, item.text),
        React.createElement("span", { className: "count" }, "( ".concat(item.rows.length, " )")))) : null;
};
var DateSelectTreeItem = function (_a) {
    var item = _a.item, _b = _a.depth, depth = _b === void 0 ? 0 : _b, initialExpand = _a.initialExpand, onExpand = _a.onExpand, isChecked = _a.isChecked, onChange = _a.onChange, isItemVisible = _a.isItemVisible;
    var _c = useState(initialExpand(item.key)), expand = _c[0], setExpand = _c[1];
    var checked = useMemo(function () { return isChecked(item.key); }, [isChecked, item.key]);
    return isItemVisible(item) ? (React.createElement("div", null,
        React.createElement("div", { className: "select-item", style: { marginLeft: -2 + depth * 20 }, onClick: function () {
                onExpand === null || onExpand === void 0 ? void 0 : onExpand(item.key, !expand);
                setExpand(!expand);
            }, tabIndex: 0 },
            _.isEmpty(item.children) ? (React.createElement("div", { style: { width: 10 } })) : (React.createElement("div", { className: "filter-caret ".concat(expand ? "down" : "right"), style: { cursor: "pointer" } })),
            React.createElement("input", { className: "filter-checkbox", type: "checkbox", checked: checked, onChange: function () {
                    onChange(item, !checked);
                }, onClick: function (e) { return e.stopPropagation(); }, tabIndex: 0 }),
            React.createElement("div", null, item.text),
            React.createElement("span", { className: "count" }, "( ".concat(item.rows.length, " )"))),
        expand &&
            item.children.map(function (v) { return (React.createElement(DateSelectTreeItem, __assign({ key: v.key, item: v, depth: depth + 1 }, { initialExpand: initialExpand, onExpand: onExpand, isChecked: isChecked, onChange: onChange, isItemVisible: isItemVisible }))); }))) : null;
};
var DateSelectTree = function (_a) {
    var dates = _a.dates, initialExpand = _a.initialExpand, onExpand = _a.onExpand, isChecked = _a.isChecked, onChange = _a.onChange, isItemVisible = _a.isItemVisible;
    return (React.createElement(React.Fragment, null, dates.map(function (v) { return (React.createElement(DateSelectTreeItem, __assign({ key: v.key, item: v }, { initialExpand: initialExpand, onExpand: onExpand, isChecked: isChecked, onChange: onChange, isItemVisible: isItemVisible }))); })));
};
var FilterMenu = function () {
    var _a;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, settings = _b.settings, refs = _b.refs;
    var containerRef = useRef(null);
    var contextRef = useRef(context);
    var byColorMenuRef = useRef(null);
    var subMenuRef = useRef(null);
    var filterContextMenu = context.filterContextMenu;
    var _c = filterContextMenu || {
        startRow: null,
        startCol: null,
        endRow: null,
        endCol: null,
        col: null,
        listBoxMaxHeight: 400,
    }, startRow = _c.startRow, startCol = _c.startCol, endRow = _c.endRow, endCol = _c.endCol, col = _c.col, listBoxMaxHeight = _c.listBoxMaxHeight;
    var filter = locale(context).filter;
    var _d = useState({
        dates: [],
        dateRowMap: {},
        values: [],
        valueRowMap: {},
        visibleRows: [],
        flattenValues: [],
    }), data = _d[0], setData = _d[1];
    var _e = useState([]), datesUncheck = _e[0], setDatesUncheck = _e[1];
    var _f = useState([]), valuesUncheck = _f[0], setValuesUncheck = _f[1];
    var dateTreeExpandState = useRef({});
    var hiddenRows = useRef([]);
    var _g = useState([]), showValues = _g[0], setShowValues = _g[1];
    var _h = useState(""), searchText = _h[0], setSearchText = _h[1];
    var _j = useState(), subMenuPos = _j[0], setSubMenuPos = _j[1];
    var _k = useState({ bgColors: [], fcColors: [] }), filterColors = _k[0], setFilterColors = _k[1];
    var _l = useState(false), showSubMenu = _l[0], setShowSubMenu = _l[1];
    var showAlert = useAlert().showAlert;
    var mouseHoverSubMenu = useRef(false);
    contextRef.current = context;
    var close = useCallback(function () {
        setContext(function (ctx) {
            ctx.filterContextMenu = undefined;
        });
    }, [setContext]);
    useOutsideClick(containerRef, close, [close]);
    var initialExpand = useCallback(function (key) {
        var expand = dateTreeExpandState.current[key];
        if (expand == null) {
            dateTreeExpandState.current[key] = true;
            return true;
        }
        return expand;
    }, []);
    var onExpand = useCallback(function (key, expand) {
        dateTreeExpandState.current[key] = expand;
    }, []);
    var searchValues = useMemo(function () {
        return _.debounce(function (text) {
            setShowValues(_.filter(data.flattenValues, function (v) { return v.toLowerCase().indexOf(text.toLowerCase()) > -1; }));
        }, 300);
    }, [data.flattenValues]);
    var selectAll = useCallback(function () {
        setDatesUncheck([]);
        setValuesUncheck([]);
        hiddenRows.current = [];
    }, []);
    var clearAll = useCallback(function () {
        setDatesUncheck(_.keys(data.dateRowMap));
        setValuesUncheck(_.keys(data.valueRowMap));
        hiddenRows.current = data.visibleRows;
    }, [data.dateRowMap, data.valueRowMap, data.visibleRows]);
    var inverseSelect = useCallback(function () {
        setDatesUncheck(produce(function (draft) { return _.xor(draft, _.keys(data.dateRowMap)); }));
        setValuesUncheck(produce(function (draft) { return _.xor(draft, _.keys(data.valueRowMap)); }));
        hiddenRows.current = _.xor(hiddenRows.current, data.visibleRows);
    }, [data.dateRowMap, data.valueRowMap, data.visibleRows]);
    var onColorSelectChange = useCallback(function (key, color, checked) {
        setFilterColors(produce(function (draft) {
            var colorData = _.find(_.get(draft, key), function (v) { return v.color === color; });
            colorData.checked = checked;
        }));
    }, []);
    var delayHideSubMenu = useMemo(function () {
        return _.debounce(function () {
            if (mouseHoverSubMenu.current)
                return;
            setShowSubMenu(false);
        }, 200);
    }, []);
    var sortData = useCallback(function (asc) {
        if (col == null)
            return;
        setContext(function (draftCtx) {
            var errMsg = orderbydatafiler(draftCtx, startRow, startCol, endRow, endCol, col, asc);
            if (errMsg != null)
                showAlert(errMsg);
        });
    }, [col, setContext, startRow, startCol, endRow, endCol, showAlert]);
    var renderColorList = useCallback(function (key, title, colors, onSelectChange) {
        return colors.length > 1 ? (React.createElement("div", { key: key },
            React.createElement("div", { className: "title" }, title),
            React.createElement("div", { className: "color-list" }, colors.map(function (v) { return (React.createElement("div", { key: v.color, className: "item", onClick: function () { return onSelectChange(key, v.color, !v.checked); }, tabIndex: 0 },
                React.createElement("div", { className: "color-label", style: { backgroundColor: v.color } }),
                React.createElement("input", { className: "luckysheet-mousedown-cancel", type: "checkbox", checked: v.checked, onChange: function () { } }))); })))) : null;
    }, []);
    useLayoutEffect(function () {
        var _a;
        if (!containerRef.current || !filterContextMenu) {
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
        var menuH = 350;
        var top = filterContextMenu.y;
        var left = filterContextMenu.x;
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
        var containerH = winH - rect.top - 350;
        if (containerH < 0) {
            containerH = 100;
        }
        if (filterContextMenu.x === left &&
            filterContextMenu.y === top &&
            filterContextMenu.listBoxMaxHeight === containerH) {
            return;
        }
        setContext(function (draftCtx) {
            if (hasOverflow) {
                _.set(draftCtx, "filterContextMenu.x", left);
                _.set(draftCtx, "filterContextMenu.y", top);
            }
            _.set(draftCtx, "filterContextMenu.listBoxMaxHeight", containerH);
        });
    }, [filterContextMenu, refs.workbookContainer, setContext]);
    useLayoutEffect(function () {
        var _a, _b;
        if (!subMenuPos)
            return;
        var rect = (_a = byColorMenuRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        var subMenuRect = (_b = subMenuRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
        if (rect == null || subMenuRect == null)
            return;
        var winW = window.innerWidth;
        var pos = _.cloneDeep(subMenuPos);
        if (subMenuRect.left + subMenuRect.width > winW) {
            pos.left -= subMenuRect.width;
            setSubMenuPos(pos);
        }
    }, [subMenuPos]);
    useEffect(function () {
        if (col == null)
            return;
        setSearchText("");
        setShowSubMenu(false);
        dateTreeExpandState.current = {};
        hiddenRows.current = (filterContextMenu === null || filterContextMenu === void 0 ? void 0 : filterContextMenu.hiddenRows) || [];
        var res = getFilterColumnValues(contextRef.current, col, startRow, endRow, startCol);
        setData(_.omit(res, ["datesUncheck", "valuesUncheck"]));
        setDatesUncheck(res.datesUncheck);
        setValuesUncheck(res.valuesUncheck);
        setShowValues(res.flattenValues);
    }, [
        col,
        endRow,
        startRow,
        startCol,
        hiddenRows,
        filterContextMenu === null || filterContextMenu === void 0 ? void 0 : filterContextMenu.hiddenRows,
    ]);
    useEffect(function () {
        if (col == null)
            return;
        setFilterColors(getFilterColumnColors(contextRef.current, col, startRow, endRow));
    }, [col, endRow, startRow]);
    if (filterContextMenu == null)
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "fortune-context-menu luckysheet-cols-menu fortune-filter-menu", id: "luckysheet-\\${menuid}-menu", ref: containerRef, style: { left: filterContextMenu.x, top: filterContextMenu.y } }, (_a = settings.filterContextMenu) === null || _a === void 0 ? void 0 :
            _a.map(function (name, i) {
                if (name === "|") {
                    return React.createElement(Divider, { key: "divider-".concat(i) });
                }
                if (name === "sort-by-asc") {
                    return (React.createElement(Menu, { key: name, onClick: function () { return sortData(true); } }, filter.sortByAsc));
                }
                if (name === "sort-by-desc") {
                    return (React.createElement(Menu, { key: name, onClick: function () { return sortData(false); } }, filter.sortByDesc));
                }
                if (name === "filter-by-color") {
                    return (React.createElement("div", { key: name, ref: byColorMenuRef, onMouseEnter: function () {
                            var _a;
                            if (!containerRef.current || !filterContextMenu) {
                                return;
                            }
                            setShowSubMenu(true);
                            var rect = (_a = byColorMenuRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
                            if (rect == null)
                                return;
                            setSubMenuPos({ top: rect.top - 5, left: rect.right });
                        }, onMouseLeave: delayHideSubMenu },
                        React.createElement(Menu, { onClick: function () { } },
                            React.createElement("div", { className: "filter-bycolor-container" },
                                filter.filterByColor,
                                React.createElement("div", { className: "filter-caret right" })))));
                }
                if (name === "filter-by-condition") {
                    return (React.createElement("div", { key: "name" },
                        React.createElement(Menu, { onClick: function () { } },
                            React.createElement("div", { className: "filter-caret right" }),
                            filter.filterByCondition),
                        React.createElement("div", { className: "luckysheet-\\${menuid}-bycondition", style: { display: "none" } },
                            React.createElement("div", { className: "luckysheet-flat-menu-button luckysheet-mousedown-cancel", id: "luckysheet-\\${menuid}-selected" },
                                React.createElement("span", { className: "luckysheet-mousedown-cancel", "data-value": "null", "data-type": "0" }, filter.filiterInputNone),
                                React.createElement("div", { className: "luckysheet-mousedown-cancel" },
                                    React.createElement("i", { className: "fa fa-sort", "aria-hidden": "true" }))))));
                }
                if (name === "filter-by-value") {
                    return (React.createElement("div", { key: name },
                        React.createElement(Menu, { onClick: function () { } },
                            React.createElement("div", { className: "filter-caret right" }),
                            filter.filterByValues),
                        React.createElement("div", { className: "luckysheet-filter-byvalue" },
                            React.createElement("div", { className: "fortune-menuitem-row byvalue-btn-row" },
                                React.createElement("div", null,
                                    React.createElement("span", { className: "fortune-byvalue-btn", onClick: selectAll, tabIndex: 0 }, filter.filterValueByAllBtn),
                                    " - ",
                                    React.createElement("span", { className: "fortune-byvalue-btn", onClick: clearAll, tabIndex: 0 }, filter.filterValueByClearBtn),
                                    " - ",
                                    React.createElement("span", { className: "fortune-byvalue-btn", onClick: inverseSelect, tabIndex: 0 }, filter.filterValueByInverseBtn)),
                                React.createElement("div", { className: "byvalue-filter-icon" },
                                    React.createElement(SVGIcon, { name: "filter-fill", style: { width: 20, height: 20 } }))),
                            React.createElement("div", { className: "filtermenu-input-container" },
                                React.createElement("input", { type: "text", onKeyDown: function (e) { return e.stopPropagation(); }, placeholder: filter.filterValueByTip, className: "luckysheet-mousedown-cancel", id: "luckysheet-\\${menuid}-byvalue-input", value: searchText, onChange: function (e) {
                                        setSearchText(e.target.value);
                                        searchValues(e.target.value);
                                    } })),
                            React.createElement("div", { id: "luckysheet-filter-byvalue-select", style: { maxHeight: listBoxMaxHeight } },
                                React.createElement(DateSelectTree, { dates: data.dates, onExpand: onExpand, initialExpand: initialExpand, isChecked: function (key) {
                                        return _.find(datesUncheck, function (v) { return v.match(key) != null; }) == null;
                                    }, onChange: function (item, checked) {
                                        var rows = hiddenRows.current;
                                        hiddenRows.current = checked
                                            ? _.without.apply(_, __spreadArray([rows], item.rows, false)) : _.union(rows, item.rows);
                                        setDatesUncheck(produce(function (draft) {
                                            return checked
                                                ? _.without.apply(_, __spreadArray([draft], item.dateValues, false)) : _.union(draft, item.dateValues);
                                        }));
                                    }, isItemVisible: function (item) {
                                        return showValues.length === data.flattenValues.length
                                            ? true
                                            : _.findIndex(showValues, function (v) { return v.match(item.key) != null; }) > -1;
                                    } }),
                                data.values.map(function (v) { return (React.createElement(SelectItem, { key: v.key, item: v, isChecked: function (key) {
                                        return !_.includes(valuesUncheck, key);
                                    }, onChange: function (item, checked) {
                                        var rows = hiddenRows.current;
                                        hiddenRows.current = checked
                                            ? _.without.apply(_, __spreadArray([rows], item.rows, false)) : _.concat(rows, item.rows);
                                        setValuesUncheck(produce(function (draft) {
                                            if (checked) {
                                                _.pull(draft, item.key);
                                            }
                                            else {
                                                draft.push(item.key);
                                            }
                                        }));
                                    }, isItemVisible: function (item) {
                                        return showValues.length === data.flattenValues.length
                                            ? true
                                            : _.includes(showValues, item.text);
                                    } })); })))));
                }
                return null;
            }),
            React.createElement(Divider, null),
            React.createElement("div", { className: "fortune-menuitem-row" },
                React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                        if (col == null)
                            return;
                        setContext(function (draftCtx) {
                            var rowHidden = _.reduce(hiddenRows.current, function (pre, curr) {
                                pre[curr] = 0;
                                return pre;
                            }, {});
                            saveFilter(draftCtx, hiddenRows.current.length > 0, rowHidden, {}, startRow, endRow, col, startCol, endCol);
                            hiddenRows.current = [];
                            draftCtx.filterContextMenu = undefined;
                        });
                    }, tabIndex: 0 }, filter.filterConform),
                React.createElement("div", { className: "button-basic button-default", onClick: function () {
                        setContext(function (draftCtx) {
                            draftCtx.filterContextMenu = undefined;
                        });
                    }, tabIndex: 0 }, filter.filterCancel),
                React.createElement("div", { className: "button-basic button-danger", onClick: function () {
                        setContext(function (draftCtx) {
                            clearFilter(draftCtx);
                        });
                    }, tabIndex: 0 }, filter.clearFilter))),
        showSubMenu && (React.createElement("div", { ref: subMenuRef, className: "luckysheet-filter-bycolor-submenu", style: subMenuPos, onMouseEnter: function () {
                mouseHoverSubMenu.current = true;
            }, onMouseLeave: function () {
                mouseHoverSubMenu.current = false;
                setShowSubMenu(false);
            } }, filterColors.bgColors.length < 2 &&
            filterColors.fcColors.length < 2 ? (React.createElement("div", { className: "one-color-tip" }, filter.filterContainerOneColorTip)) : (React.createElement(React.Fragment, null,
            [
                {
                    key: "bgColors",
                    title: filter.filiterByColorTip,
                    colors: filterColors.bgColors,
                },
                {
                    key: "fcColors",
                    title: filter.filiterByTextColorTip,
                    colors: filterColors.fcColors,
                },
            ].map(function (v) {
                return renderColorList(v.key, v.title, v.colors, onColorSelectChange);
            }),
            React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                    if (col == null)
                        return;
                    setContext(function (draftCtx) {
                        var rowHidden = _.reduce(_(filterColors)
                            .values()
                            .flatten()
                            .map(function (v) { return (v.checked ? [] : v.rows); })
                            .flatten()
                            .valueOf(), function (pre, curr) {
                            pre[curr] = 0;
                            return pre;
                        }, {});
                        saveFilter(draftCtx, !_.isEmpty(rowHidden), rowHidden, {}, startRow, endRow, col, startCol, endCol);
                        hiddenRows.current = [];
                        draftCtx.filterContextMenu = undefined;
                    });
                }, tabIndex: 0 }, filter.filterConform)))))));
};
export default FilterMenu;
