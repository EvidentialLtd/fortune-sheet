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
import React, { useContext, useState, useMemo, useCallback, useRef, useLayoutEffect, } from "react";
import { locale, saveHyperlink, removeHyperlink, replaceHtml, getRangetxt, goToLink, isLinkValid, normalizeSelection, onRangeSelectionModalMoveStart, } from "@evidential-fortune-sheet/core";
import "./index.css";
import _ from "lodash";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
export var LinkEditCard = function (_a) {
    var r = _a.r, c = _a.c, rc = _a.rc, originText = _a.originText, originType = _a.originType, originAddress = _a.originAddress, isEditing = _a.isEditing, position = _a.position, selectingCellRange = _a.selectingCellRange;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var _c = useState(originText), linkText = _c[0], setLinkText = _c[1];
    var _d = useState(originAddress), linkAddress = _d[0], setLinkAddress = _d[1];
    var _e = useState(originType), linkType = _e[0], setLinkType = _e[1];
    var _f = locale(context), insertLink = _f.insertLink, linkTypeList = _f.linkTypeList, button = _f.button;
    var lastCell = useRef(normalizeSelection(context, [{ row: [r, r], column: [c, c] }]));
    var skipCellRangeSet = useRef(true);
    var isLinkAddressValid = isLinkValid(context, linkType, linkAddress);
    var tooltip = (React.createElement("div", { className: "validation-input-tip" }, isLinkAddressValid.tooltip));
    var hideLinkCard = useCallback(function () {
        _.set(refs.globalCache, "linkCard.mouseEnter", false);
        setContext(function (draftCtx) {
            draftCtx.linkCard = undefined;
        });
    }, [refs.globalCache, setContext]);
    var setRangeModalVisible = useCallback(function (visible) {
        return setContext(function (draftCtx) {
            draftCtx.luckysheet_select_save = lastCell.current;
            if (draftCtx.linkCard != null)
                draftCtx.linkCard.selectingCellRange = visible;
        });
    }, [setContext]);
    var containerEvent = useMemo(function () { return ({
        onMouseEnter: function () { return _.set(refs.globalCache, "linkCard.mouseEnter", true); },
        onMouseLeave: function () { return _.set(refs.globalCache, "linkCard.mouseEnter", false); },
        onMouseDown: function (e) {
            return e.stopPropagation();
        },
        onMouseMove: function (e) {
            return e.stopPropagation();
        },
        onMouseUp: function (e) {
            return e.stopPropagation();
        },
        onKeyDown: function (e) {
            return e.stopPropagation();
        },
        onDoubleClick: function (e) {
            return e.stopPropagation();
        },
    }); }, [refs.globalCache]);
    var renderBottomButton = useCallback(function (onOk, onCancel) { return (React.createElement("div", { className: "button-group" },
        React.createElement("div", { className: "button-basic button-default", onClick: onCancel, tabIndex: 0 }, button.cancel),
        React.createElement("div", { className: "button-basic button-primary", onClick: onOk, tabIndex: 0 }, button.confirm))); }, [button]);
    var renderToolbarButton = useCallback(function (iconId, onClick) { return (React.createElement("div", { className: "fortune-toolbar-button", onClick: onClick, tabIndex: 0 },
        React.createElement(SVGIcon, { name: iconId, style: { width: 18, height: 18 } }))); }, []);
    useLayoutEffect(function () {
        setLinkAddress(originAddress);
        setLinkText(originText);
        setLinkType(originType);
    }, [rc, originAddress, originText, originType]);
    useLayoutEffect(function () {
        if (selectingCellRange) {
            skipCellRangeSet.current = true;
        }
    }, [selectingCellRange]);
    useLayoutEffect(function () {
        if (skipCellRangeSet.current) {
            skipCellRangeSet.current = false;
            return;
        }
        if (selectingCellRange) {
            var len = _.size(context.luckysheet_select_save);
            if (len > 0) {
                setLinkAddress(getRangetxt(context, context.currentSheetId, context.luckysheet_select_save[len - 1], ""));
            }
        }
    }, [context, selectingCellRange]);
    if (!isEditing) {
        return (React.createElement("div", __assign({}, containerEvent, { onKeyDown: function (e) {
                e.stopPropagation();
            }, className: "fortune-link-modify-modal link-toolbar", style: { left: position.cellLeft + 20, top: position.cellBottom } }),
            React.createElement("div", { className: "link-content", onClick: function () {
                    if (linkType === "webpage") {
                        window.dispatchEvent(new CustomEvent("linkClicked", { detail: { linkAddress: linkAddress } }));
                        return;
                    }
                    setContext(function (draftCtx) {
                        return goToLink(draftCtx, r, c, linkType, linkAddress, refs.scrollbarX.current, refs.scrollbarY.current);
                    });
                }, tabIndex: 0 }, linkType === "webpage"
                ? insertLink.openLink
                : replaceHtml(insertLink.goTo, { linkAddress: linkAddress })),
            context.allowEdit === true && React.createElement("div", { className: "divider" }),
            context.allowEdit === true &&
                linkType === "webpage" &&
                renderToolbarButton("copy", function () {
                    navigator.clipboard.writeText(originAddress);
                    hideLinkCard();
                }),
            context.allowEdit === true &&
                renderToolbarButton("pencil", function () {
                    return setContext(function (draftCtx) {
                        if (draftCtx.linkCard != null && draftCtx.allowEdit) {
                            draftCtx.linkCard.isEditing = true;
                        }
                    });
                }),
            context.allowEdit === true && React.createElement("div", { className: "divider" }),
            context.allowEdit === true &&
                renderToolbarButton("unlink", function () {
                    return setContext(function (draftCtx) {
                        _.set(refs.globalCache, "linkCard.mouseEnter", false);
                        removeHyperlink(draftCtx, r, c);
                    });
                })));
    }
    return selectingCellRange ? (React.createElement("div", __assign({ className: "fortune-link-modify-modal range-selection-modal", style: { left: position.cellLeft, top: position.cellBottom + 5 } }, _.omit(containerEvent, ["onMouseDown", "onMouseMove", "onMouseUp"]), { onMouseDown: function (e) {
            var nativeEvent = e.nativeEvent;
            onRangeSelectionModalMoveStart(context, refs.globalCache, nativeEvent);
            e.stopPropagation();
        } }),
        React.createElement("div", { className: "modal-icon-close", onClick: function () { return setRangeModalVisible(false); }, tabIndex: 0 },
            React.createElement(SVGIcon, { name: "close" })),
        React.createElement("div", { className: "modal-title" }, insertLink.selectCellRange),
        React.createElement("input", __assign({}, containerEvent, { className: "range-selection-input ".concat(!linkAddress || isLinkAddressValid.isValid ? "" : "error-input"), placeholder: insertLink.cellRangePlaceholder, onChange: function (e) { return setLinkAddress(e.target.value); }, value: linkAddress })),
        tooltip,
        React.createElement("div", { className: "modal-footer" }, renderBottomButton(function () {
            if (isLinkAddressValid.isValid)
                setRangeModalVisible(false);
        }, function () {
            setLinkAddress(originAddress);
            setRangeModalVisible(false);
        })))) : (React.createElement("div", __assign({ className: "fortune-link-modify-modal", style: {
            left: position.cellLeft + 20,
            top: position.cellBottom,
        } }, containerEvent),
        React.createElement("div", { className: "fortune-link-modify-line" },
            React.createElement("div", { className: "fortune-link-modify-title" }, insertLink.linkText),
            React.createElement("input", { className: "fortune-link-modify-input", spellCheck: "false", autoFocus: true, value: linkText, onChange: function (e) { return setLinkText(e.target.value); } })),
        React.createElement("div", { className: "fortune-link-modify-line" },
            React.createElement("div", { className: "fortune-link-modify-title" }, insertLink.linkType),
            React.createElement("select", { className: "fortune-link-modify-select", value: linkType, onChange: function (e) {
                    if (e.target.value === "sheet") {
                        if (!linkText) {
                            setLinkText(context.luckysheetfile[0].name);
                        }
                        setLinkAddress(context.luckysheetfile[0].name);
                    }
                    else {
                        setLinkAddress("");
                    }
                    if (e.target.value === "cellrange")
                        setRangeModalVisible(true);
                    setLinkType(e.target.value);
                } }, linkTypeList.map(function (type) { return (React.createElement("option", { key: type.value, value: type.value }, type.text)); }))),
        React.createElement("div", { className: "fortune-link-modify-line" },
            linkType === "webpage" && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "fortune-link-modify-title" }, insertLink.linkAddress),
                React.createElement("input", { className: "fortune-link-modify-input ".concat(!linkAddress || isLinkAddressValid.isValid ? "" : "error-input"), spellCheck: "false", value: linkAddress, onChange: function (e) { return setLinkAddress(e.target.value); } }),
                tooltip)),
            linkType === "cellrange" && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "fortune-link-modify-title" }, insertLink.linkCell),
                React.createElement("input", { className: "fortune-link-modify-input ".concat(!linkAddress || isLinkAddressValid.isValid ? "" : "error-input"), spellCheck: "false", value: linkAddress, onChange: function (e) { return setLinkAddress(e.target.value); } }),
                React.createElement("div", { className: "fortune-link-modify-cell-selector", onClick: function () { return setRangeModalVisible(true); }, tabIndex: 0 },
                    React.createElement(SVGIcon, { name: "border-all" })),
                tooltip)),
            linkType === "sheet" && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "fortune-link-modify-title" }, insertLink.linkSheet),
                React.createElement("select", { className: "fortune-link-modify-select", onChange: function (e) {
                        if (!linkText)
                            setLinkText(e.target.value);
                        setLinkAddress(e.target.value);
                    }, value: linkAddress }, context.luckysheetfile.map(function (sheet) { return (React.createElement("option", { key: sheet.id, value: sheet.name }, sheet.name)); })),
                tooltip))),
        React.createElement("div", { className: "modal-footer" }, renderBottomButton(function () {
            if (!isLinkAddressValid.isValid)
                return;
            _.set(refs.globalCache, "linkCard.mouseEnter", false);
            setContext(function (draftCtx) {
                return saveHyperlink(draftCtx, r, c, linkText, linkType, linkAddress);
            });
        }, hideLinkCard))));
};
export default LinkEditCard;
