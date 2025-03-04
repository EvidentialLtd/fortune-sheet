import _ from "lodash";
import { onImageMoveStart, onImageResizeStart } from "@evidential-fortune-sheet/core";
import React, { useContext, useMemo } from "react";
import WorkbookContext from "../../context";
var ImgBoxs = function () {
    var _a;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var activeImg = useMemo(function () {
        return _.find(context.insertedImgs, { id: context.activeImg });
    }, [context.activeImg, context.insertedImgs]);
    return (React.createElement("div", { id: "luckysheet-image-showBoxs" },
        activeImg && (React.createElement("div", { id: "luckysheet-modal-dialog-activeImage", className: "luckysheet-modal-dialog", style: {
                padding: 0,
                position: "absolute",
                zIndex: 300,
                width: activeImg.width * context.zoomRatio,
                height: activeImg.height * context.zoomRatio,
                left: activeImg.left * context.zoomRatio,
                top: activeImg.top * context.zoomRatio,
            } },
            React.createElement("div", { className: "luckysheet-modal-dialog-border", style: { position: "absolute" } }),
            React.createElement("div", { className: "luckysheet-modal-dialog-content", style: {
                    width: activeImg.width * context.zoomRatio,
                    height: activeImg.height * context.zoomRatio,
                    backgroundImage: "url(".concat(activeImg.src, ")"),
                    backgroundSize: "".concat(activeImg.width * context.zoomRatio, "px ").concat(activeImg.height * context.zoomRatio, "px"),
                    backgroundRepeat: "no-repeat",
                }, onMouseDown: function (e) {
                    var nativeEvent = e.nativeEvent;
                    onImageMoveStart(context, refs.globalCache, nativeEvent);
                    e.stopPropagation();
                } }),
            React.createElement("div", { className: "luckysheet-modal-dialog-resize" }, ["lt", "mt", "lm", "rm", "rt", "lb", "mb", "rb"].map(function (v) { return (React.createElement("div", { key: v, className: "luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-".concat(v), "data-type": v, onMouseDown: function (e) {
                    var nativeEvent = e.nativeEvent;
                    onImageResizeStart(refs.globalCache, nativeEvent, v);
                    e.stopPropagation();
                } })); })),
            React.createElement("div", { className: "luckysheet-modal-dialog-controll" },
                React.createElement("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-crop", role: "button", tabIndex: 0, "aria-label": "\u88C1\u526A", title: "\u88C1\u526A" },
                    React.createElement("i", { className: "fa fa-pencil", "aria-hidden": "true" })),
                React.createElement("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-restore", role: "button", tabIndex: 0, "aria-label": "\u6062\u590D\u539F\u56FE", title: "\u6062\u590D\u539F\u56FE" },
                    React.createElement("i", { className: "fa fa-window-maximize", "aria-hidden": "true" })),
                React.createElement("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-del", role: "button", tabIndex: 0, "aria-label": "\u5220\u9664", title: "\u5220\u9664" },
                    React.createElement("i", { className: "fa fa-trash", "aria-hidden": "true" }))))),
        React.createElement("div", { className: "img-list" }, (_a = context.insertedImgs) === null || _a === void 0 ? void 0 : _a.map(function (v) {
            var id = v.id, left = v.left, top = v.top, width = v.width, height = v.height, src = v.src;
            if (v.id === context.activeImg)
                return null;
            return (React.createElement("div", { id: id, key: id, className: "luckysheet-modal-dialog luckysheet-modal-dialog-image", style: {
                    width: width * context.zoomRatio,
                    height: height * context.zoomRatio,
                    padding: 0,
                    position: "absolute",
                    left: left * context.zoomRatio,
                    top: top * context.zoomRatio,
                    zIndex: 200,
                }, onMouseDown: function (e) { return e.stopPropagation(); }, onClick: function (e) {
                    setContext(function (ctx) {
                        ctx.activeImg = id;
                    });
                    e.stopPropagation();
                }, tabIndex: 0 },
                React.createElement("div", { className: "luckysheet-modal-dialog-content", style: {
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                    } },
                    React.createElement("img", { src: src, alt: "", style: {
                            width: width * context.zoomRatio,
                            height: height * context.zoomRatio,
                        } })),
                React.createElement("div", { className: "luckysheet-modal-dialog-border" })));
        })),
        React.createElement("div", { id: "luckysheet-modal-dialog-cropping", className: "luckysheet-modal-dialog", style: {
                display: "none",
                padding: 0,
                position: "absolute",
                zIndex: 300,
            } },
            React.createElement("div", { className: "cropping-mask" }),
            React.createElement("div", { className: "cropping-content" }),
            React.createElement("div", { className: "luckysheet-modal-dialog-border", style: { position: "absolute" } }),
            React.createElement("div", { className: "luckysheet-modal-dialog-resize" },
                React.createElement("div", { className: "resize-item lt", "data-type": "lt" }),
                React.createElement("div", { className: "resize-item mt", "data-type": "mt" }),
                React.createElement("div", { className: "resize-item lm", "data-type": "lm" }),
                React.createElement("div", { className: "resize-item rm", "data-type": "rm" }),
                React.createElement("div", { className: "resize-item rt", "data-type": "rt" }),
                React.createElement("div", { className: "resize-item lb", "data-type": "lb" }),
                React.createElement("div", { className: "resize-item mb", "data-type": "mb" }),
                React.createElement("div", { className: "resize-item rb", "data-type": "rb" })),
            React.createElement("div", { className: "luckysheet-modal-dialog-controll" },
                React.createElement("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-crop", role: "button", tabIndex: 0, "aria-label": "\u88C1\u526A", title: "\u88C1\u526A" },
                    React.createElement("i", { className: "fa fa-pencil", "aria-hidden": "true" })),
                React.createElement("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-restore", role: "button", tabIndex: 0, "aria-label": "\u6062\u590D\u539F\u56FE", title: "\u6062\u590D\u539F\u56FE" },
                    React.createElement("i", { className: "fa fa-window-maximize", "aria-hidden": "true" })),
                React.createElement("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-del", role: "button", tabIndex: 0, "aria-label": "\u5220\u9664", title: "\u5220\u9664" },
                    React.createElement("i", { className: "fa fa-trash", "aria-hidden": "true" })))),
        React.createElement("div", { className: "cell-date-picker" })));
};
export default ImgBoxs;
