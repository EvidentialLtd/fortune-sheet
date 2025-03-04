import { locale, deleteSheet, api } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import React, { useContext, useRef, useState, useLayoutEffect, useCallback, } from "react";
import WorkbookContext from "../../context";
import { useAlert } from "../../hooks/useAlert";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ChangeColor } from "../ChangeColor";
import SVGIcon from "../SVGIcon";
import Divider from "./Divider";
import "./index.css";
import Menu from "./Menu";
var SheetTabContextMenu = function () {
    var _a;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, settings = _b.settings;
    var _c = context.sheetTabContextMenu, x = _c.x, y = _c.y, sheet = _c.sheet, onRename = _c.onRename;
    var sheetconfig = locale(context).sheetconfig;
    var _d = useState({ x: -1, y: -1 }), position = _d[0], setPosition = _d[1];
    var _e = useState(false), isShowChangeColor = _e[0], setIsShowChangeColor = _e[1];
    var _f = useState(false), isShowInputColor = _f[0], setIsShowInputColor = _f[1];
    var _g = useAlert(), showAlert = _g.showAlert, hideAlert = _g.hideAlert;
    var containerRef = useRef(null);
    var close = useCallback(function () {
        setContext(function (ctx) {
            ctx.sheetTabContextMenu = {};
        });
    }, [setContext]);
    useLayoutEffect(function () {
        var _a;
        var rect = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (rect && x != null && y != null) {
            setPosition({ x: x, y: y - rect.height });
        }
    }, [x, y]);
    useOutsideClick(containerRef, close, [close]);
    var moveSheet = useCallback(function (delta) {
        if (context.allowEdit === false)
            return;
        if (!sheet)
            return;
        setContext(function (ctx) {
            var _a;
            var currentOrder = -1;
            _.sortBy(ctx.luckysheetfile, ["order"]).forEach(function (_sheet, i) {
                _sheet.order = i;
                if (_sheet.id === sheet.id) {
                    currentOrder = i;
                }
            });
            api.setSheetOrder(ctx, (_a = {}, _a[sheet.id] = currentOrder + delta, _a));
        });
    }, [context.allowEdit, setContext, sheet]);
    var hideSheet = useCallback(function () {
        if (context.allowEdit === false)
            return;
        if (!sheet)
            return;
        setContext(function (ctx) {
            var shownSheets = ctx.luckysheetfile.filter(function (oneSheet) { return _.isUndefined(oneSheet.hide) || (oneSheet === null || oneSheet === void 0 ? void 0 : oneSheet.hide) !== 1; });
            if (shownSheets.length > 1) {
                api.hideSheet(ctx, sheet.id);
            }
            else {
                showAlert(sheetconfig.noMoreSheet, "ok");
            }
        });
    }, [context.allowEdit, setContext, sheet, showAlert, sheetconfig]);
    var copySheet = useCallback(function () {
        if (context.allowEdit === false)
            return;
        if (!(sheet === null || sheet === void 0 ? void 0 : sheet.id))
            return;
        setContext(function (ctx) {
            api.copySheet(ctx, sheet.id);
        }, { addSheetOp: true });
    }, [context.allowEdit, setContext, sheet === null || sheet === void 0 ? void 0 : sheet.id]);
    var updateShowInputColor = useCallback(function (state) {
        setIsShowInputColor(state);
    }, []);
    var focusSheet = useCallback(function () {
        if (context.allowEdit === false)
            return;
        if (!(sheet === null || sheet === void 0 ? void 0 : sheet.id))
            return;
        setContext(function (ctx) {
            _.forEach(ctx.luckysheetfile, function (sheetfile) {
                sheetfile.status = sheet.id === sheetfile.id ? 1 : 0;
            });
        });
    }, [context.allowEdit, setContext, sheet === null || sheet === void 0 ? void 0 : sheet.id]);
    if (!sheet || x == null || y == null)
        return null;
    return (React.createElement("div", { className: "fortune-context-menu luckysheet-cols-menu", onContextMenu: function (e) { return e.stopPropagation(); }, style: { left: position.x, top: position.y, overflow: "visible" }, ref: containerRef }, (_a = settings.sheetTabContextMenu) === null || _a === void 0 ? void 0 : _a.map(function (name, i) {
        if (name === "delete") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    var shownSheets = context.luckysheetfile.filter(function (singleSheet) {
                        return _.isUndefined(singleSheet.hide) || singleSheet.hide !== 1;
                    });
                    if (context.luckysheetfile.length > 1 &&
                        shownSheets.length > 1) {
                        showAlert(sheetconfig.confirmDelete, "yesno", function () {
                            setContext(function (ctx) {
                                deleteSheet(ctx, sheet.id);
                            }, {
                                deleteSheetOp: {
                                    id: sheet.id,
                                },
                            });
                            hideAlert();
                        });
                    }
                    else {
                        showAlert(sheetconfig.noMoreSheet, "ok");
                    }
                    close();
                } }, sheetconfig.delete));
        }
        if (name === "rename") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    onRename === null || onRename === void 0 ? void 0 : onRename();
                    close();
                } }, sheetconfig.rename));
        }
        if (name === "move") {
            return (React.createElement(React.Fragment, { key: name },
                React.createElement(Menu, { onClick: function () {
                        moveSheet(-1.5);
                        close();
                    } }, sheetconfig.moveLeft),
                React.createElement(Menu, { onClick: function () {
                        moveSheet(1.5);
                        close();
                    } }, sheetconfig.moveRight)));
        }
        if (name === "hide") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    hideSheet();
                    close();
                } }, sheetconfig.hide));
        }
        if (name === "copy") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    copySheet();
                    close();
                } }, sheetconfig.copy));
        }
        if (name === "color") {
            return (React.createElement(Menu, { key: name, onMouseEnter: function () {
                    setIsShowChangeColor(true);
                }, onMouseLeave: function () {
                    if (!isShowInputColor) {
                        setIsShowChangeColor(false);
                    }
                } },
                sheetconfig.changeColor,
                React.createElement("span", { className: "change-color-triangle" },
                    React.createElement(SVGIcon, { name: "rightArrow", width: 18 })),
                isShowChangeColor && context.allowEdit && (React.createElement(ChangeColor, { triggerParentUpdate: updateShowInputColor }))));
        }
        if (name === "focus") {
            return (React.createElement(Menu, { key: name, onClick: function () {
                    focusSheet();
                    close();
                } }, sheetconfig.focus));
        }
        if (name === "|") {
            return React.createElement(Divider, { key: "divide-".concat(i) });
        }
        return null;
    })));
};
export default SheetTabContextMenu;
