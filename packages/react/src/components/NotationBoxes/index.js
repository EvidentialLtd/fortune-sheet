import React, { useContext, useEffect } from "react";
import { getFlowdata, onCommentBoxMoveStart, onCommentBoxResizeStart, setEditingComment, showComments, } from "@evidential-fortune-sheet/core";
import _ from "lodash";
import ContentEditable from "../SheetOverlay/ContentEditable";
import WorkbookContext from "../../context";
var NotationBoxes = function () {
    var _a;
    var _b = useContext(WorkbookContext), context = _b.context, setContext = _b.setContext, refs = _b.refs;
    var flowdata = getFlowdata(context);
    useEffect(function () {
        var _a;
        if (flowdata) {
            var psShownCells_1 = [];
            for (var i = 0; i < flowdata.length; i += 1) {
                for (var j = 0; j < flowdata[i].length; j += 1) {
                    var cell = flowdata[i][j];
                    if (!cell)
                        continue;
                    if ((_a = cell.ps) === null || _a === void 0 ? void 0 : _a.isShow) {
                        psShownCells_1.push({ r: i, c: j });
                    }
                }
            }
            setContext(function (ctx) { return showComments(ctx, psShownCells_1); });
        }
    }, [flowdata, setContext]);
    return (React.createElement("div", { id: "luckysheet-postil-showBoxs" }, _.concat((_a = context.commentBoxes) === null || _a === void 0 ? void 0 : _a.filter(function (v) { var _a; return (v === null || v === void 0 ? void 0 : v.rc) !== ((_a = context.editingCommentBox) === null || _a === void 0 ? void 0 : _a.rc); }), [context.editingCommentBox, context.hoveredCommentBox]).map(function (commentBox) {
        var _a;
        if (!commentBox)
            return null;
        var r = commentBox.r, c = commentBox.c, rc = commentBox.rc, left = commentBox.left, top = commentBox.top, width = commentBox.width, height = commentBox.height, value = commentBox.value, autoFocus = commentBox.autoFocus, size = commentBox.size;
        var isEditing = ((_a = context.editingCommentBox) === null || _a === void 0 ? void 0 : _a.rc) === rc;
        var commentId = "comment-box-".concat(rc);
        return (React.createElement("div", { key: rc },
            React.createElement("canvas", { id: "arrowCanvas-".concat(rc), className: "arrowCanvas", width: size.width, height: size.height, style: {
                    position: "absolute",
                    left: size.left,
                    top: size.top,
                    zIndex: 100,
                    pointerEvents: "none",
                } }),
            React.createElement("div", { id: commentId, className: "luckysheet-postil-show-main", style: {
                    width: width,
                    height: height,
                    color: "#000",
                    padding: 5,
                    border: "1px solid #000",
                    backgroundColor: "rgb(255,255,225)",
                    position: "absolute",
                    left: left,
                    top: top,
                    boxSizing: "border-box",
                    zIndex: isEditing ? 200 : 100,
                }, onMouseDown: function (e) {
                    var nativeEvent = e.nativeEvent;
                    setContext(function (draftContext) {
                        if (flowdata) {
                            setEditingComment(draftContext, flowdata, r, c);
                        }
                    });
                    onCommentBoxMoveStart(context, refs.globalCache, nativeEvent, { r: r, c: c, rc: rc }, commentId);
                    e.stopPropagation();
                } },
                React.createElement("div", { className: "luckysheet-postil-dialog-move" }, ["t", "r", "b", "l"].map(function (v) { return (React.createElement("div", { key: v, className: "luckysheet-postil-dialog-move-item luckysheet-postil-dialog-move-item-".concat(v), "data-type": v })); })),
                isEditing && (React.createElement("div", { className: "luckysheet-postil-dialog-resize" }, ["lt", "mt", "lm", "rm", "rt", "lb", "mb", "rb"].map(function (v) { return (React.createElement("div", { key: v, className: "luckysheet-postil-dialog-resize-item luckysheet-postil-dialog-resize-item-".concat(v), "data-type": v, onMouseDown: function (e) {
                        var nativeEvent = e.nativeEvent;
                        onCommentBoxResizeStart(context, refs.globalCache, nativeEvent, { r: r, c: c, rc: rc }, commentId, v);
                        e.stopPropagation();
                    } })); }))),
                React.createElement("div", { style: {
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                    } },
                    React.createElement(ContentEditable, { id: "comment-editor-".concat(rc), autoFocus: autoFocus, style: {
                            width: "100%",
                            height: "100%",
                            lineHeight: "20px",
                            boxSizing: "border-box",
                            textAlign: "center",
                            wordBreak: "break-all",
                            outline: "none",
                        }, allowEdit: context.allowEdit, spellCheck: false, "data-r": r, "data-c": c, onKeyDown: function (e) { return e.stopPropagation(); }, onFocus: function (e) {
                            if (context.allowEdit === false)
                                return;
                            refs.globalCache.editingCommentBoxEle =
                                e.target;
                        }, onMouseDown: function (e) {
                            setContext(function (draftContext) {
                                if (flowdata) {
                                    setEditingComment(draftContext, flowdata, r, c);
                                }
                            });
                            e.stopPropagation();
                        }, onDoubleClick: function (e) {
                            e.stopPropagation();
                        }, initialContent: value })))));
    })));
};
export default NotationBoxes;
