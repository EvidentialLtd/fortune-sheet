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
import React, { useState, useCallback, useEffect, useRef, useMemo, } from "react";
import { colors } from "@evidential-fortune-sheet/core";
import { Workbook } from "@evidential-fortune-sheet/react";
import { v4 as uuidv4 } from "uuid";
import { hashCode } from "./utils";
export default {
    component: Workbook,
};
var Template = function (_a) {
    var args = __rest(_a, []);
    var _b = useState(), data = _b[0], setData = _b[1];
    var _c = useState(false), error = _c[0], setError = _c[1];
    var wsRef = useRef();
    var workbookRef = useRef(null);
    var lastSelection = useRef();
    var _d = useMemo(function () {
        var _userId = uuidv4();
        return { username: "User-".concat(_userId.slice(0, 3)), userId: _userId };
    }, []), username = _d.username, userId = _d.userId;
    useEffect(function () {
        var socket = new WebSocket("ws://localhost:8081/ws");
        wsRef.current = socket;
        socket.onopen = function () {
            socket.send(JSON.stringify({ req: "getData" }));
        };
        socket.onmessage = function (e) {
            var _a, _b, _c;
            var msg = JSON.parse(e.data);
            if (msg.req === "getData") {
                setData(msg.data.map(function (d) { return (__assign({ id: d._id }, d)); }));
            }
            else if (msg.req === "op") {
                (_a = workbookRef.current) === null || _a === void 0 ? void 0 : _a.applyOp(msg.data);
            }
            else if (msg.req === "addPresences") {
                (_b = workbookRef.current) === null || _b === void 0 ? void 0 : _b.addPresences(msg.data);
            }
            else if (msg.req === "removePresences") {
                (_c = workbookRef.current) === null || _c === void 0 ? void 0 : _c.removePresences(msg.data);
            }
        };
        socket.onerror = function () {
            setError(true);
        };
    }, []);
    var onOp = useCallback(function (op) {
        var socket = wsRef.current;
        if (!socket)
            return;
        socket.send(JSON.stringify({ req: "op", data: op }));
    }, []);
    var onChange = useCallback(function (d) {
        setData(d);
    }, []);
    var afterSelectionChange = useCallback(function (sheetId, selection) {
        var _a, _b;
        var socket = wsRef.current;
        if (!socket)
            return;
        var s = {
            r: selection.row[0],
            c: selection.column[0],
        };
        if (((_a = lastSelection.current) === null || _a === void 0 ? void 0 : _a.r) === s.r &&
            ((_b = lastSelection.current) === null || _b === void 0 ? void 0 : _b.c) === s.c) {
            return;
        }
        lastSelection.current = s;
        socket.send(JSON.stringify({
            req: "addPresences",
            data: [
                {
                    sheetId: sheetId,
                    username: username,
                    userId: userId,
                    color: colors[Math.abs(hashCode(userId)) % colors.length],
                    selection: s,
                },
            ],
        }));
    }, [userId, username]);
    if (error)
        return (React.createElement("div", { style: { padding: 16 } },
            React.createElement("p", null, "Failed to connect to websocket server."),
            React.createElement("p", null, "Please note that this collabration demo connects to a local websocket server (ws://localhost:8081/ws)."),
            React.createElement("p", null,
                "To make this work:",
                React.createElement("ol", null,
                    React.createElement("li", null, "Clone the project"),
                    React.createElement("li", null, "Run server in backend-demo/: node index.js"),
                    React.createElement("li", null, "Make sure you also have mongodb running locally"),
                    React.createElement("li", null, "Try again")))));
    if (!data)
        return React.createElement("div", null);
    return (React.createElement("div", { style: { width: "100%", height: "100vh" } },
        React.createElement(Workbook, __assign({ ref: workbookRef }, args, { data: data, onChange: onChange, onOp: onOp, hooks: {
                afterSelectionChange: afterSelectionChange,
            } }))));
};
export var Example = Template.bind({});
