import React, { useContext, useCallback } from "react";
import Dialog from "../components/Dialog";
import { ModalContext } from "../context/modal";
export function useDialog() {
    var _a = useContext(ModalContext), showModal = _a.showModal, hideModal = _a.hideModal;
    var showDialog = useCallback(function (content, type, onOk, onCancel) {
        if (onOk === void 0) { onOk = hideModal; }
        if (onCancel === void 0) { onCancel = hideModal; }
        showModal(React.createElement(Dialog, { type: type, onOk: onOk, onCancel: onCancel }, content));
    }, [hideModal, showModal]);
    return {
        showDialog: showDialog,
        hideDialog: hideModal,
    };
}
