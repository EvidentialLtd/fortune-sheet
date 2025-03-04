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
import _ from "lodash";
import { getDropdownList, getFlowdata, getRangeByTxt, getRangetxt, getSheetIndex, locale, setCellValue, confirmMessage, } from "@evidential-fortune-sheet/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
import SVGIcon from "../SVGIcon";
import "./index.css";
var DataVerification = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    var _1 = useContext(WorkbookContext), context = _1.context, setContext = _1.setContext;
    var _2 = useDialog(), showDialog = _2.showDialog, hideDialog = _2.hideDialog;
    var _3 = locale(context), dataVerification = _3.dataVerification, toolbar = _3.toolbar, button = _3.button, generalDialog = _3.generalDialog;
    var numberCondition = useState([
        "between",
        "notBetween",
        "equal",
        "notEqualTo",
        "moreThanThe",
        "lessThan",
        "greaterOrEqualTo",
        "lessThanOrEqualTo",
    ])[0];
    var dateCondition = useState([
        "between",
        "notBetween",
        "equal",
        "notEqualTo",
        "earlierThan",
        "noEarlierThan",
        "laterThan",
        "noLaterThan",
    ])[0];
    var dataSelectRange = useCallback(function (type, value) {
        hideDialog();
        setContext(function (ctx) {
            ctx.rangeDialog.show = true;
            ctx.rangeDialog.type = type;
            ctx.rangeDialog.rangeTxt = value;
        });
    }, [hideDialog, setContext]);
    var btn = useCallback(function (type) {
        if (type === "confirm") {
            setContext(function (ctx) {
                var _a, _b, _c, _d, _e, _f, _g;
                var isPass = confirmMessage(ctx, generalDialog, dataVerification);
                if (isPass) {
                    var range = getRangeByTxt(ctx, (_b = (_a = ctx.dataVerification) === null || _a === void 0 ? void 0 : _a.dataRegulation) === null || _b === void 0 ? void 0 : _b.rangeTxt);
                    if (range.length === 0) {
                        return;
                    }
                    var regulation = ctx.dataVerification.dataRegulation;
                    var verifacationT = regulation === null || regulation === void 0 ? void 0 : regulation.type;
                    var value1 = regulation.value1;
                    var item = __assign(__assign({}, regulation), { checked: false });
                    if (verifacationT === "dropdown") {
                        var list = getDropdownList(ctx, value1);
                        item.value1 = list.join(",");
                    }
                    var currentDataVerification = (_c = ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)].dataVerification) !== null && _c !== void 0 ? _c : {};
                    var str = (_d = range[range.length - 1]) === null || _d === void 0 ? void 0 : _d.row[0];
                    var edr = (_e = range[range.length - 1]) === null || _e === void 0 ? void 0 : _e.row[1];
                    var stc = (_f = range[range.length - 1]) === null || _f === void 0 ? void 0 : _f.column[0];
                    var edc = (_g = range[range.length - 1]) === null || _g === void 0 ? void 0 : _g.column[1];
                    var d = getFlowdata(ctx);
                    if (!d ||
                        _.isNil(str) ||
                        _.isNil(stc) ||
                        _.isNil(edr) ||
                        _.isNil(edc))
                        return;
                    for (var r = str; r <= edr; r += 1) {
                        for (var c = stc; c <= edc; c += 1) {
                            var key = "".concat(r, "_").concat(c);
                            currentDataVerification[key] = item;
                            if (regulation.type === "checkbox") {
                                setCellValue(ctx, r, c, d, item.value2);
                            }
                        }
                    }
                    ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)].dataVerification = currentDataVerification;
                }
            });
        }
        else if (type === "delete") {
            setContext(function (ctx) {
                var _a, _b, _c, _d, _e, _f, _g;
                var range = getRangeByTxt(ctx, (_b = (_a = ctx.dataVerification) === null || _a === void 0 ? void 0 : _a.dataRegulation) === null || _b === void 0 ? void 0 : _b.rangeTxt);
                if (range.length === 0) {
                    showDialog(generalDialog.noSeletionError, "ok");
                    return;
                }
                var currentDataVerification = (_c = ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)]
                    .dataVerification) !== null && _c !== void 0 ? _c : {};
                var str = (_d = range[range.length - 1]) === null || _d === void 0 ? void 0 : _d.row[0];
                var edr = (_e = range[range.length - 1]) === null || _e === void 0 ? void 0 : _e.row[1];
                var stc = (_f = range[range.length - 1]) === null || _f === void 0 ? void 0 : _f.column[0];
                var edc = (_g = range[range.length - 1]) === null || _g === void 0 ? void 0 : _g.column[1];
                if (_.isNil(str) || _.isNil(stc) || _.isNil(edr) || _.isNil(edc))
                    return;
                for (var r = str; r <= edr; r += 1) {
                    for (var c = stc; c <= edc; c += 1) {
                        delete currentDataVerification["".concat(r, "_").concat(c)];
                    }
                }
            });
        }
        hideDialog();
    }, [dataVerification, generalDialog, hideDialog, setContext, showDialog]);
    useEffect(function () {
        setContext(function (ctx) {
            var _a, _b, _c;
            var rangeT = "";
            if (ctx.luckysheet_select_save) {
                var range = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
                rangeT = getRangetxt(context, context.currentSheetId, range, context.currentSheetId);
            }
            var index = getSheetIndex(ctx, ctx.currentSheetId);
            var ctxDataVerification = ctx.luckysheetfile[index].dataVerification || {};
            if (!ctx.luckysheet_select_save)
                return;
            var last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
            var rowIndex = last.row_focus;
            var colIndex = last.column_focus;
            if (rowIndex == null || colIndex == null)
                return;
            var item = ctxDataVerification["".concat(rowIndex, "_").concat(colIndex)];
            var defaultItem = item !== null && item !== void 0 ? item : {};
            var rangValue = (_a = defaultItem.value1) !== null && _a !== void 0 ? _a : "";
            if (((_b = ctx.rangeDialog) === null || _b === void 0 ? void 0 : _b.type) === "dropDown" &&
                ctx.dataVerification &&
                ctx.dataVerification.dataRegulation &&
                ctx.dataVerification.dataRegulation.rangeTxt) {
                rangeT = ctx.dataVerification.dataRegulation.rangeTxt;
                rangValue = ctx.rangeDialog.rangeTxt;
            }
            else if (((_c = ctx.rangeDialog) === null || _c === void 0 ? void 0 : _c.type) === "rangeTxt" &&
                ctx.dataVerification &&
                ctx.dataVerification.dataRegulation &&
                ctx.dataVerification.dataRegulation.value1) {
                rangValue = ctx.dataVerification.dataRegulation.value1;
                rangeT = ctx.rangeDialog.rangeTxt;
            }
            ctx.rangeDialog.type = "";
            if (item) {
                ctx.dataVerification.dataRegulation = __assign(__assign({}, item), { value1: rangValue, rangeTxt: rangeT });
            }
            else {
                ctx.dataVerification.dataRegulation = {
                    type: "dropdown",
                    type2: "",
                    rangeTxt: rangeT,
                    value1: rangValue,
                    value2: "",
                    validity: "",
                    remote: false,
                    prohibitInput: false,
                    hintShow: false,
                    hintValue: "",
                };
            }
        });
    }, []);
    return (React.createElement("div", { id: "fortune-data-verification" },
        React.createElement("div", { className: "title" }, toolbar.dataVerification),
        React.createElement("div", { className: "box" },
            React.createElement("div", { className: "box-item", style: { borderTop: "1px solid #E1E4E8" } },
                React.createElement("div", { className: "box-item-title" }, dataVerification.cellRange),
                React.createElement("div", { className: "data-verification-range" },
                    React.createElement("input", { className: "formulaInputFocus", spellCheck: "false", value: (_a = context.dataVerification.dataRegulation) === null || _a === void 0 ? void 0 : _a.rangeTxt, onChange: function (e) {
                            var value = e.target.value;
                            setContext(function (ctx) {
                                ctx.dataVerification.dataRegulation.rangeTxt = value;
                            });
                        } }),
                    React.createElement("i", { className: "icon", "aria-hidden": "true", onClick: function () {
                            hideDialog();
                            dataSelectRange("rangeTxt", context.dataVerification.dataRegulation.value1);
                        }, tabIndex: 0 },
                        React.createElement(SVGIcon, { name: "tab", width: 18 })))),
            React.createElement("div", { className: "box-item" },
                React.createElement("div", { className: "box-item-title" }, dataVerification.verificationCondition),
                React.createElement("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type, onChange: function (e) {
                        var value = e.target.value;
                        setContext(function (ctx) {
                            ctx.dataVerification.dataRegulation.type = value;
                            if (value === "dropdown" || value === "checkbox") {
                                ctx.dataVerification.dataRegulation.type2 = "";
                            }
                            else if (value === "number" ||
                                value === "number_integer" ||
                                value === "number_decimal" ||
                                value === "text_length" ||
                                value === "date") {
                                ctx.dataVerification.dataRegulation.type2 = "between";
                            }
                            else if (value === "text_content") {
                                ctx.dataVerification.dataRegulation.type2 = "include";
                            }
                            else if (value === "validity") {
                                ctx.dataVerification.dataRegulation.type2 =
                                    "identificationNumber";
                            }
                            ctx.dataVerification.dataRegulation.value1 = "";
                            ctx.dataVerification.dataRegulation.value2 = "";
                        });
                    } }, [
                    "dropdown",
                    "checkbox",
                    "number",
                    "number_integer",
                    "number_decimal",
                    "text_content",
                    "text_length",
                    "date",
                    "validity",
                ].map(function (v) { return (React.createElement("option", { value: v, key: v }, dataVerification[v])); })),
                ((_c = (_b = context.dataVerification) === null || _b === void 0 ? void 0 : _b.dataRegulation) === null || _c === void 0 ? void 0 : _c.type) === "dropdown" && (React.createElement("div", { className: "show-box-item" },
                    React.createElement("div", { className: "data-verification-range" },
                        React.createElement("input", { className: "formulaInputFocus", spellCheck: "false", value: context.dataVerification.dataRegulation.value1, placeholder: dataVerification.placeholder1, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value1 = value;
                                });
                            } }),
                        React.createElement("i", { className: "icon", "aria-hidden": "true", onClick: function () {
                                return dataSelectRange("dropDown", context.dataVerification.dataRegulation.value1);
                            }, tabIndex: 0 },
                            React.createElement(SVGIcon, { name: "tab", width: 18 }))),
                    React.createElement("div", { className: "check" },
                        React.createElement("input", { type: "checkbox", checked: context.dataVerification.dataRegulation.type2 === "true", id: "mul", onChange: function (e) {
                                var checked = e.target.checked;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.type2 = "".concat(checked);
                                });
                            } }),
                        React.createElement("label", { htmlFor: "mul" }, dataVerification.allowMultiSelect)))),
                ((_e = (_d = context.dataVerification) === null || _d === void 0 ? void 0 : _d.dataRegulation) === null || _e === void 0 ? void 0 : _e.type) === "checkbox" && (React.createElement("div", { className: "show-box-item" },
                    React.createElement("div", { className: "check-box" },
                        React.createElement("span", null,
                            dataVerification.selected,
                            " \u2014\u2014 "),
                        React.createElement("input", { type: "text", className: "data-verification-value1", placeholder: dataVerification.placeholder2, value: (_g = (_f = context.dataVerification) === null || _f === void 0 ? void 0 : _f.dataRegulation) === null || _g === void 0 ? void 0 : _g.value1, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value1 = value;
                                });
                            } })),
                    React.createElement("div", { className: "check-box" },
                        React.createElement("span", null,
                            dataVerification.notSelected,
                            " \u2014\u2014 "),
                        React.createElement("input", { type: "text", className: "data-verification-value2", placeholder: dataVerification.placeholder2, value: (_j = (_h = context.dataVerification) === null || _h === void 0 ? void 0 : _h.dataRegulation) === null || _j === void 0 ? void 0 : _j.value2, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value2 = value;
                                });
                            } })))),
                (((_l = (_k = context.dataVerification) === null || _k === void 0 ? void 0 : _k.dataRegulation) === null || _l === void 0 ? void 0 : _l.type) === "number" ||
                    ((_o = (_m = context.dataVerification) === null || _m === void 0 ? void 0 : _m.dataRegulation) === null || _o === void 0 ? void 0 : _o.type) ===
                        "number_integer" ||
                    ((_q = (_p = context.dataVerification) === null || _p === void 0 ? void 0 : _p.dataRegulation) === null || _q === void 0 ? void 0 : _q.type) ===
                        "number_decimal" ||
                    ((_s = (_r = context.dataVerification) === null || _r === void 0 ? void 0 : _r.dataRegulation) === null || _s === void 0 ? void 0 : _s.type) ===
                        "text_length") && (React.createElement("div", { className: "show-box-item" },
                    React.createElement("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: function (e) {
                            var value = e.target.value;
                            setContext(function (ctx) {
                                ctx.dataVerification.dataRegulation.type2 = value;
                                ctx.dataVerification.dataRegulation.value1 = "";
                                ctx.dataVerification.dataRegulation.value2 = "";
                            });
                        } }, numberCondition.map(function (v) { return (React.createElement("option", { value: v, key: v }, dataVerification[v])); })),
                    context.dataVerification.dataRegulation.type2 === "between" ||
                        context.dataVerification.dataRegulation.type2 === "notBetween" ? (React.createElement("div", { className: "input-box" },
                        React.createElement("input", { type: "number", placeholder: "1", value: context.dataVerification.dataRegulation.value1, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value1 = value;
                                });
                            } }),
                        React.createElement("span", null, "-"),
                        React.createElement("input", { type: "number", placeholder: "100", value: context.dataVerification.dataRegulation.value2, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value2 = value;
                                });
                            } }))) : (React.createElement("div", { className: "input-box" },
                        React.createElement("input", { type: "number", style: { width: "100%" }, placeholder: dataVerification.placeholder3, value: context.dataVerification.dataRegulation.value1, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value1 = value;
                                });
                            } }))))),
                ((_u = (_t = context.dataVerification) === null || _t === void 0 ? void 0 : _t.dataRegulation) === null || _u === void 0 ? void 0 : _u.type) ===
                    "text_content" && (React.createElement("div", { className: "show-box-item" },
                    React.createElement("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: function (e) {
                            var value = e.target.value;
                            setContext(function (ctx) {
                                ctx.dataVerification.dataRegulation.type2 = value;
                                ctx.dataVerification.dataRegulation.value1 = "";
                                ctx.dataVerification.dataRegulation.value2 = "";
                            });
                        } }, ["include", "exclude", "equal"].map(function (v) { return (React.createElement("option", { value: v, key: v }, dataVerification[v])); })),
                    React.createElement("div", { className: "input-box" },
                        React.createElement("input", { type: "text", style: { width: "100%" }, placeholder: dataVerification.placeholder4, value: context.dataVerification.dataRegulation.value1, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value1 = value;
                                });
                            } })))),
                ((_w = (_v = context.dataVerification) === null || _v === void 0 ? void 0 : _v.dataRegulation) === null || _w === void 0 ? void 0 : _w.type) === "date" && (React.createElement("div", { className: "show-box-item" },
                    React.createElement("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: function (e) {
                            var value = e.target.value;
                            setContext(function (ctx) {
                                ctx.dataVerification.dataRegulation.type2 = value;
                                ctx.dataVerification.dataRegulation.value1 = "";
                                ctx.dataVerification.dataRegulation.value2 = "";
                            });
                        } }, dateCondition.map(function (v) { return (React.createElement("option", { value: v, key: v }, dataVerification[v])); })),
                    context.dataVerification.dataRegulation.type2 === "between" ||
                        context.dataVerification.dataRegulation.type2 === "notBetween" ? (React.createElement("div", { className: "input-box" },
                        React.createElement("input", { type: "date", placeholder: "1", value: context.dataVerification.dataRegulation.value1, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value1 = value;
                                });
                            } }),
                        React.createElement("span", null, "-"),
                        React.createElement("input", { type: "date", placeholder: "100", value: context.dataVerification.dataRegulation.value2, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value2 = value;
                                });
                            } }))) : (React.createElement("div", { className: "input-box" },
                        React.createElement("input", { type: "date", style: { width: "100%" }, placeholder: dataVerification.placeholder3, value: context.dataVerification.dataRegulation.value1, onChange: function (e) {
                                var value = e.target.value;
                                setContext(function (ctx) {
                                    ctx.dataVerification.dataRegulation.value1 = value;
                                });
                            } }))))),
                ((_y = (_x = context.dataVerification) === null || _x === void 0 ? void 0 : _x.dataRegulation) === null || _y === void 0 ? void 0 : _y.type) === "validity" && (React.createElement("div", { className: "show-box-item" },
                    React.createElement("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: function (e) {
                            var value = e.target.value;
                            setContext(function (ctx) {
                                ctx.dataVerification.dataRegulation.type2 = value;
                                ctx.dataVerification.dataRegulation.value1 = "";
                                ctx.dataVerification.dataRegulation.value2 = "";
                            });
                        } }, ["identificationNumber", "phoneNumber"].map(function (v) { return (React.createElement("option", { value: v, key: v }, dataVerification[v])); }))))),
            React.createElement("div", { className: "box-item" },
                ["prohibitInput", "hintShow"].map(function (v) { return (React.createElement("div", { className: "check", key: "div".concat(v) },
                    React.createElement("input", { type: "checkbox", id: v, key: "input".concat(v), checked: context.dataVerification.dataRegulation[v], onChange: function () {
                            setContext(function (ctx) {
                                var _a;
                                var dataRegulation = (_a = ctx.dataVerification) === null || _a === void 0 ? void 0 : _a.dataRegulation;
                                if (v === "prohibitInput") {
                                    dataRegulation.prohibitInput =
                                        !dataRegulation.prohibitInput;
                                }
                                else if (v === "hintShow") {
                                    dataRegulation.hintShow = !dataRegulation.hintShow;
                                }
                            });
                        } }),
                    React.createElement("label", { htmlFor: v, key: "label".concat(v) }, dataVerification[v]))); }),
                ((_0 = (_z = context.dataVerification) === null || _z === void 0 ? void 0 : _z.dataRegulation) === null || _0 === void 0 ? void 0 : _0.hintShow) && (React.createElement("div", { className: "input-box" },
                    React.createElement("input", { type: "text", style: { width: "100%" }, placeholder: dataVerification.placeholder5, value: context.dataVerification.dataRegulation.hintValue, onChange: function (e) {
                            var value = e.target.value;
                            setContext(function (ctx) {
                                ctx.dataVerification.dataRegulation.hintValue = value;
                            });
                        } }))))),
        React.createElement("div", { className: "button-basic button-primary", onClick: function () {
                btn("confirm");
            }, tabIndex: 0 }, button.confirm),
        React.createElement("div", { className: "button-basic button-close", onClick: function () {
                btn("delete");
            }, tabIndex: 0 }, dataVerification.deleteVerification),
        React.createElement("div", { className: "button-basic button-close", onClick: function () {
                btn("close");
            }, tabIndex: 0 }, button.cancel)));
};
export default DataVerification;
