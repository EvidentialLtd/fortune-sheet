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
import React, { useCallback, useEffect, useRef } from "react";
import _ from "lodash";
var ContentEditable = function (_a) {
    var props = __rest(_a, []);
    var lastHtml = useRef("");
    var root = useRef(null);
    var autoFocus = props.autoFocus, initialContent = props.initialContent, onChange = props.onChange;
    useEffect(function () {
        var _a;
        if (autoFocus) {
            (_a = root.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [autoFocus]);
    useEffect(function () {
        if (initialContent && root.current != null) {
            root.current.innerHTML = initialContent;
        }
    }, [initialContent]);
    var fnEmitChange = useCallback(function (__, isBlur) {
        var html;
        if (root.current != null) {
            html = root.current.innerHTML;
        }
        if (onChange && html !== lastHtml.current) {
            onChange(html || "", isBlur);
        }
        lastHtml.current = html || "";
    }, [root, onChange]);
    var innerRef = props.innerRef, onBlur = props.onBlur;
    var allowEdit = props.allowEdit;
    if (_.isNil(allowEdit))
        allowEdit = true;
    return (React.createElement("div", __assign({ onDoubleClick: function (e) { return e.stopPropagation(); }, onClick: function (e) { return e.stopPropagation(); } }, _.omit(props, "innerRef", "onChange", "html", "onBlur", "autoFocus", "allowEdit", "initialContent"), { ref: function (e) {
            root.current = e;
            innerRef === null || innerRef === void 0 ? void 0 : innerRef(e);
        }, tabIndex: 0, onInput: fnEmitChange, onBlur: function (e) {
            fnEmitChange(null, true);
            onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
        }, contentEditable: allowEdit })));
};
export default ContentEditable;
