import { locale } from "@evidential-fortune-sheet/core";
import React, { useContext } from "react";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import "./index.css";
var Dialog = function (_a) {
    var type = _a.type, onOk = _a.onOk, onCancel = _a.onCancel, children = _a.children, containerStyle = _a.containerStyle, contentStyle = _a.contentStyle;
    var context = useContext(WorkbookContext).context;
    var button = locale(context).button;
    return (React.createElement("div", { className: "fortune-dialog", style: containerStyle },
        React.createElement("div", { className: "fortune-modal-dialog-header" },
            React.createElement("div", { className: "fortune-modal-dialog-icon-close", onClick: onCancel, tabIndex: 0 },
                React.createElement(SVGIcon, { name: "close", style: { padding: 7, cursor: "pointer" } }))),
        React.createElement("div", { className: "fortune-dialog-box-content", style: contentStyle }, children),
        type != null && (React.createElement("div", { className: "fortune-dialog-box-button-container" }, type === "ok" ? (React.createElement("div", { className: "fortune-message-box-button button-default", onClick: onOk, tabIndex: 0 }, button.confirm)) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "fortune-message-box-button button-primary", onClick: onOk, tabIndex: 0 }, button.confirm),
            React.createElement("div", { className: "fortune-message-box-button button-default", onClick: onCancel, tabIndex: 0 }, button.cancel)))))));
};
export default Dialog;
