import React from "react";
import Dialog from "../Dialog";
var MessageBox = function (_a) {
    var _b = _a.type, type = _b === void 0 ? "yesno" : _b, onOk = _a.onOk, onCancel = _a.onCancel, children = _a.children;
    return (React.createElement(Dialog, { type: type, onOk: onOk, onCancel: onCancel, contentStyle: {
            width: 300,
            paddingTop: 20,
            paddingBottom: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        } }, children));
};
export default MessageBox;
