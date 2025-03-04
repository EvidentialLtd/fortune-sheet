import React, { useCallback, useState, useMemo } from "react";
var ModalContext = React.createContext({
    component: null,
    showModal: function () { },
    hideModal: function () { },
});
var ModalProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), component = _b[0], setComponent = _b[1];
    var showModal = useCallback(function (c) {
        setComponent(c);
    }, []);
    var hideModal = useCallback(function () {
        setComponent(null);
    }, []);
    var providerValue = useMemo(function () { return ({
        component: null,
        showModal: showModal,
        hideModal: hideModal,
    }); }, [hideModal, showModal]);
    return (React.createElement(ModalContext.Provider, { value: providerValue },
        children,
        component && (React.createElement("div", { onMouseDown: function (e) { return e.stopPropagation(); }, onMouseMove: function (e) { return e.stopPropagation(); }, onMouseUp: function (e) { return e.stopPropagation(); }, onContextMenu: function (e) { return e.stopPropagation(); }, className: "fortune-popover-backdrop fortune-modal-container" }, component))));
};
export { ModalContext, ModalProvider };
