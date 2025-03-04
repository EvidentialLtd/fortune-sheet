import React, { useCallback, useContext } from "react";
import "./index.css";
import { locale, updateItem } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import Select, { Option } from "../Toolbar/Select";
import SVGIcon from "../SVGIcon";
import { useDialog } from "../../hooks/useDialog";
import ConditionRules from "./ConditionRules";
import { MenuDivider } from "../Toolbar/Divider";
var ConditionalFormat = function (_a) {
    var items = _a.items, setOpen = _a.setOpen;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var showDialog = useDialog().showDialog;
    var conditionformat = locale(context).conditionformat;
    var showSubMenu = useCallback(function (e) {
        var target = e.target;
        var menuItem = target.className === "fortune-toolbar-menu-line"
            ? target.parentElement
            : target;
        var menuItemRect = menuItem.getBoundingClientRect();
        var workbookContainerRect = refs.workbookContainer.current.getBoundingClientRect();
        var subMenu = menuItem.querySelector(".condition-format-sub-menu");
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
            subMenu.style.right = "".concat(-(parseFloat(subMenu.style.width.replace("px", "")) +
                menuItemPaddingRight), "px");
        }
    }, [refs.workbookContainer]);
    var hideSubMenu = useCallback(function (e) {
        var target = e.target;
        if (target.className === "condition-format-sub-menu") {
            target.style.display = "none";
            return;
        }
        var subMenu = (target.className === "condition-format-item"
            ? target.parentElement
            : target.querySelector(".condition-format-sub-menu"));
        if (_.isNil(subMenu))
            return;
        subMenu.style.display = "none";
    }, []);
    var getConditionFormatItem = useCallback(function (name) {
        if (name === "-") {
            return React.createElement(MenuDivider, { key: name });
        }
        if (name === "highlightCellRules") {
            return (React.createElement(Option, { key: name, onMouseEnter: showSubMenu, onMouseLeave: hideSubMenu },
                React.createElement("div", { className: "fortune-toolbar-menu-line", key: "div".concat(name) },
                    conditionformat[name],
                    React.createElement(SVGIcon, { name: "rightArrow", width: 18 }),
                    React.createElement("div", { className: "condition-format-sub-menu", style: {
                            display: "none",
                            width: 150,
                        } }, [
                        { text: "greaterThan", value: ">" },
                        { text: "lessThan", value: "<" },
                        { text: "between", value: "[]" },
                        { text: "equal", value: "=" },
                        { text: "textContains", value: "()" },
                        {
                            text: "occurrenceDate",
                            value: conditionformat.yesterday,
                        },
                        { text: "duplicateValue", value: "##" },
                    ].map(function (v) { return (React.createElement("div", { className: "condition-format-item", key: v.text, onClick: function () {
                            setOpen(false);
                            showDialog(React.createElement(ConditionRules, { type: v.text }));
                        }, tabIndex: 0 },
                        conditionformat[v.text],
                        React.createElement("span", null, v.value))); })))));
        }
        if (name === "itemSelectionRules") {
            return (React.createElement(Option, { key: name, onMouseEnter: showSubMenu, onMouseLeave: hideSubMenu },
                React.createElement("div", { className: "fortune-toolbar-menu-line" },
                    conditionformat[name],
                    React.createElement(SVGIcon, { name: "rightArrow", width: 18 }),
                    React.createElement("div", { className: "condition-format-sub-menu", style: {
                            display: "none",
                            width: 180,
                        } }, [
                        { text: "top10", value: conditionformat.top10 },
                        {
                            text: "top10_percent",
                            value: conditionformat.top10_percent,
                        },
                        { text: "last10", value: conditionformat.last10 },
                        {
                            text: "last10_percent",
                            value: conditionformat.last10_percent,
                        },
                        { text: "aboveAverage", value: conditionformat.above },
                        { text: "belowAverage", value: conditionformat.below },
                    ].map(function (v) { return (React.createElement("div", { className: "condition-format-item", key: v.text, onClick: function () {
                            setOpen(false);
                            showDialog(React.createElement(ConditionRules, { type: v.text }));
                        }, tabIndex: 0 },
                        conditionformat[v.text],
                        React.createElement("span", null, v.value))); })))));
        }
        if (name === "dataBar") {
            return (React.createElement("div", { className: "fortune-toolbar-menu-line", key: "div".concat(name) },
                conditionformat[name],
                React.createElement(SVGIcon, { name: "rightArrow", width: 18 })));
        }
        if (name === "colorGradation") {
            return (React.createElement("div", { className: "fortune-toolbar-menu-line", key: "div".concat(name) },
                conditionformat[name],
                React.createElement(SVGIcon, { name: "rightArrow", width: 18 })));
        }
        if (name === "icons") {
            return (React.createElement("div", { className: "fortune-toolbar-menu-line", key: "div".concat(name) }, conditionformat[name]));
        }
        if (name === "newFormatRule") {
            return (React.createElement("div", { className: "fortune-toolbar-menu-line", key: "div".concat(name) }, conditionformat[name]));
        }
        if (name === "deleteRule") {
            return (React.createElement(Option, { key: name, onMouseEnter: showSubMenu, onMouseLeave: hideSubMenu },
                React.createElement("div", { className: "fortune-toolbar-menu-line" },
                    conditionformat[name],
                    React.createElement(SVGIcon, { name: "rightArrow", width: 18 }),
                    React.createElement("div", { className: "condition-format-sub-menu", style: {
                            display: "none",
                            width: 150,
                        } }, ["deleteSheetRule"].map(function (v) { return (React.createElement("div", { className: "condition-format-item", key: v, style: { padding: "6px 10px" }, onClick: function () {
                            setContext(function (ctx) {
                                updateItem(ctx, "delSheet");
                            });
                        }, tabIndex: 0 }, conditionformat[v])); })))));
        }
        if (name === "manageRules") {
            return (React.createElement("div", { className: "fortune-toolbar-menu-line", key: "div".concat(name) }, conditionformat[name]));
        }
        return React.createElement("div", null);
    }, [conditionformat, hideSubMenu, setContext, setOpen, showDialog, showSubMenu]);
    return (React.createElement("div", { className: "condition-format" },
        React.createElement(Select, { style: { overflow: "visible" } }, items.map(function (v) { return (React.createElement("div", { key: "option".concat(v) }, getConditionFormatItem(v))); }))));
};
export default ConditionalFormat;
