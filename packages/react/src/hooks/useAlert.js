import React, { useContext, useCallback } from "react";
import MessageBox from "../components/MessageBox";
import { ModalContext } from "../context/modal";
export function useAlert() {
    var _a = useContext(ModalContext), showModal = _a.showModal, hideModal = _a.hideModal;
    var showAlert = useCallback(function (message, type, onOk, onCancel) {
        if (type === void 0) { type = "ok"; }
        if (onOk === void 0) { onOk = hideModal; }
        if (onCancel === void 0) { onCancel = hideModal; }
        showModal(React.createElement(MessageBox, { type: type, onOk: onOk, onCancel: onCancel }, message));
    }, [hideModal, showModal]);
    return {
        showAlert: showAlert,
        hideAlert: hideModal,
    };
}
