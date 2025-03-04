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
import _ from "lodash";
import { mergeBorder } from "./cell";
import { getFlowdata } from "../context";
import { colLocation, rowLocation } from "./location";
import { isAllowEdit } from "../utils";
export function getArrowCanvasSize(fromX, fromY, toX, toY) {
    var left = toX - 5;
    if (fromX < toX) {
        left = fromX - 5;
    }
    var top = toY - 5;
    if (fromY < toY) {
        top = fromY - 5;
    }
    var width = Math.abs(fromX - toX) + 10;
    var height = Math.abs(fromY - toY) + 10;
    var x1 = width - 5;
    var x2 = 5;
    if (fromX < toX) {
        x1 = 5;
        x2 = width - 5;
    }
    var y1 = height - 5;
    var y2 = 5;
    if (fromY < toY) {
        y1 = 5;
        y2 = height - 5;
    }
    return { left: left, top: top, width: width, height: height, fromX: x1, fromY: y1, toX: x2, toY: y2 };
}
export function drawArrow(rc, _a, color, theta, headlen) {
    var left = _a.left, top = _a.top, width = _a.width, height = _a.height, fromX = _a.fromX, fromY = _a.fromY, toX = _a.toX, toY = _a.toY;
    var canvas = document.getElementById("arrowCanvas-".concat(rc));
    var ctx = canvas.getContext("2d");
    if (!canvas || !ctx)
        return;
    canvas.style.width = "".concat(width, "px");
    canvas.style.height = "".concat(height, "px");
    canvas.width = width;
    canvas.height = height;
    canvas.style.left = "".concat(left, "px");
    canvas.style.top = "".concat(top, "px");
    var _b = canvas.getBoundingClientRect(), canvasWidth = _b.width, canvasHeight = _b.height;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    theta = theta || 30;
    headlen = headlen || 6;
    var arrowWidth = 1;
    color = color || "#000";
    var angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI;
    var angle1 = ((angle + theta) * Math.PI) / 180;
    var angle2 = ((angle - theta) * Math.PI) / 180;
    var topX = headlen * Math.cos(angle1);
    var topY = headlen * Math.sin(angle1);
    var botX = headlen * Math.cos(angle2);
    var botY = headlen * Math.sin(angle2);
    ctx.save();
    ctx.beginPath();
    var arrowX = fromX - topX;
    var arrowY = fromY - topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineWidth = arrowWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}
export var commentBoxProps = {
    defaultWidth: 144,
    defaultHeight: 84,
    currentObj: null,
    currentWinW: null,
    currentWinH: null,
    resize: null,
    resizeXY: null,
    move: false,
    moveXY: null,
    cursorStartPosition: null,
};
export function getCellTopRightPostion(ctx, flowdata, r, c) {
    var _a;
    var row_pre = r - 1 === -1 ? 0 : ctx.visibledatarow[r - 1];
    var col = ctx.visibledatacolumn[c];
    var margeset = mergeBorder(ctx, flowdata, r, c);
    if (margeset) {
        row_pre = margeset.row[0];
        _a = margeset.column, col = _a[1];
    }
    var toX = col;
    var toY = row_pre;
    return { toX: toX, toY: toY };
}
export function getCommentBoxByRC(ctx, flowdata, r, c) {
    var _a;
    var comment = (_a = flowdata[r][c]) === null || _a === void 0 ? void 0 : _a.ps;
    var _b = getCellTopRightPostion(ctx, flowdata, r, c), toX = _b.toX, toY = _b.toY;
    var left = (comment === null || comment === void 0 ? void 0 : comment.left) == null
        ? toX + 18 * ctx.zoomRatio
        : comment.left * ctx.zoomRatio;
    var top = (comment === null || comment === void 0 ? void 0 : comment.top) == null
        ? toY - 18 * ctx.zoomRatio
        : comment.top * ctx.zoomRatio;
    var width = (comment === null || comment === void 0 ? void 0 : comment.width) == null
        ? commentBoxProps.defaultWidth * ctx.zoomRatio
        : comment.width * ctx.zoomRatio;
    var height = (comment === null || comment === void 0 ? void 0 : comment.height) == null
        ? commentBoxProps.defaultHeight * ctx.zoomRatio
        : comment.height * ctx.zoomRatio;
    var value = (comment === null || comment === void 0 ? void 0 : comment.value) == null ? "" : comment.value;
    if (top < 0) {
        top = 2;
    }
    var size = getArrowCanvasSize(left, top, toX, toY);
    var rc = "".concat(r, "_").concat(c);
    return { r: r, c: c, rc: rc, left: left, top: top, width: width, height: height, value: value, size: size, autoFocus: false };
}
export function setEditingComment(ctx, flowdata, r, c) {
    ctx.editingCommentBox = getCommentBoxByRC(ctx, flowdata, r, c);
}
export function removeEditingComment(ctx, globalCache) {
    var _a, _b;
    var editingCommentBoxEle = globalCache.editingCommentBoxEle;
    ctx.editingCommentBox = undefined;
    var r = editingCommentBoxEle === null || editingCommentBoxEle === void 0 ? void 0 : editingCommentBoxEle.dataset.r;
    var c = editingCommentBoxEle === null || editingCommentBoxEle === void 0 ? void 0 : editingCommentBoxEle.dataset.c;
    if (!r || !c || !editingCommentBoxEle)
        return;
    r = parseInt(r, 10);
    c = parseInt(c, 10);
    var value = editingCommentBoxEle.innerHTML || "";
    var flowdata = getFlowdata(ctx);
    globalCache.editingCommentBoxEle = undefined;
    if (!flowdata)
        return;
    if (((_b = (_a = ctx.hooks).beforeUpdateComment) === null || _b === void 0 ? void 0 : _b.call(_a, r, c, value)) === false) {
        return;
    }
    var cell = flowdata === null || flowdata === void 0 ? void 0 : flowdata[r][c];
    if (!(cell === null || cell === void 0 ? void 0 : cell.ps))
        return;
    var oldValue = cell.ps.value;
    cell.ps.value = value;
    if (!cell.ps.isShow) {
        ctx.commentBoxes = _.filter(ctx.commentBoxes, function (v) { return v.rc !== "".concat(r, "_").concat(c); });
    }
    if (ctx.hooks.afterUpdateComment) {
        setTimeout(function () {
            var _a, _b;
            (_b = (_a = ctx.hooks).afterUpdateComment) === null || _b === void 0 ? void 0 : _b.call(_a, r, c, oldValue, value);
        });
    }
}
export function newComment(ctx, globalCache, r, c) {
    var _a, _b;
    var allowEdit = isAllowEdit(ctx);
    if (!allowEdit)
        return;
    if (((_b = (_a = ctx.hooks).beforeInsertComment) === null || _b === void 0 ? void 0 : _b.call(_a, r, c)) === false) {
        return;
    }
    removeEditingComment(ctx, globalCache);
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    var cell = flowdata[r][c];
    if (cell == null) {
        cell = {};
        flowdata[r][c] = cell;
    }
    cell.ps = {
        left: null,
        top: null,
        width: null,
        height: null,
        value: "",
        isShow: false,
    };
    ctx.editingCommentBox = __assign(__assign({}, getCommentBoxByRC(ctx, flowdata, r, c)), { autoFocus: true });
    if (ctx.hooks.afterInsertComment) {
        setTimeout(function () {
            var _a, _b;
            (_b = (_a = ctx.hooks).afterInsertComment) === null || _b === void 0 ? void 0 : _b.call(_a, r, c);
        });
    }
}
export function editComment(ctx, globalCache, r, c) {
    var _a;
    var allowEdit = isAllowEdit(ctx);
    if (!allowEdit)
        return;
    var flowdata = getFlowdata(ctx);
    removeEditingComment(ctx, globalCache);
    var comment = (_a = flowdata === null || flowdata === void 0 ? void 0 : flowdata[r][c]) === null || _a === void 0 ? void 0 : _a.ps;
    var commentBoxes = _.concat(ctx.commentBoxes, ctx.editingCommentBox);
    if (_.findIndex(commentBoxes, function (v) { return (v === null || v === void 0 ? void 0 : v.rc) === "".concat(r, "_").concat(c); }) !== -1) {
        var editCommentBox = document.getElementById("comment-editor-".concat(r, "_").concat(c));
        editCommentBox === null || editCommentBox === void 0 ? void 0 : editCommentBox.focus();
    }
    if (comment) {
        ctx.editingCommentBox = __assign(__assign({}, getCommentBoxByRC(ctx, flowdata, r, c)), { autoFocus: true });
    }
}
export function deleteComment(ctx, globalCache, r, c) {
    var _a, _b;
    var allowEdit = isAllowEdit(ctx);
    if (!allowEdit)
        return;
    if (((_b = (_a = ctx.hooks).beforeDeleteComment) === null || _b === void 0 ? void 0 : _b.call(_a, r, c)) === false) {
        return;
    }
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    var cell = flowdata[r][c];
    if (!cell)
        return;
    cell.ps = undefined;
    if (ctx.hooks.afterDeleteComment) {
        setTimeout(function () {
            var _a, _b;
            (_b = (_a = ctx.hooks).afterDeleteComment) === null || _b === void 0 ? void 0 : _b.call(_a, r, c);
        });
    }
}
export function showComments(ctx, commentShowCells) {
    var flowdata = getFlowdata(ctx);
    if (flowdata) {
        var commentBoxes = commentShowCells.map(function (_a) {
            var r = _a.r, c = _a.c;
            return getCommentBoxByRC(ctx, flowdata, r, c);
        });
        ctx.commentBoxes = commentBoxes;
    }
}
export function showHideComment(ctx, globalCache, r, c) {
    var _a;
    var flowdata = getFlowdata(ctx);
    var comment = (_a = flowdata === null || flowdata === void 0 ? void 0 : flowdata[r][c]) === null || _a === void 0 ? void 0 : _a.ps;
    if (!comment)
        return;
    var isShow = comment.isShow;
    var rc = "".concat(r, "_").concat(c);
    if (isShow) {
        comment.isShow = false;
        ctx.commentBoxes = _.filter(ctx.commentBoxes, function (v) { return v.rc !== rc; });
    }
    else {
        comment.isShow = true;
    }
}
export function showHideAllComments(ctx) {
    var _a, _b;
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    var isAllShow = true;
    var allComments = [];
    for (var r = 0; r < flowdata.length; r += 1) {
        for (var c = 0; c < flowdata[0].length; c += 1) {
            var cell = flowdata[r][c];
            if (cell === null || cell === void 0 ? void 0 : cell.ps) {
                allComments.push({ r: r, c: c });
                if (!cell.ps.isShow) {
                    isAllShow = false;
                }
            }
        }
    }
    var rcs = [];
    if (allComments.length > 0) {
        if (isAllShow) {
            for (var i = 0; i < allComments.length; i += 1) {
                var _c = allComments[i], r = _c.r, c = _c.c;
                var comment = (_a = flowdata[r][c]) === null || _a === void 0 ? void 0 : _a.ps;
                if (comment === null || comment === void 0 ? void 0 : comment.isShow) {
                    comment.isShow = false;
                    rcs.push("".concat(r, "_").concat(c));
                }
            }
            ctx.commentBoxes = [];
        }
        else {
            for (var i = 0; i < allComments.length; i += 1) {
                var _d = allComments[i], r = _d.r, c = _d.c;
                var comment = (_b = flowdata[r][c]) === null || _b === void 0 ? void 0 : _b.ps;
                if (comment && !comment.isShow) {
                    comment.isShow = true;
                }
            }
        }
    }
}
export function overShowComment(ctx, e, scrollX, scrollY, container) {
    var _a, _b, _c;
    var _d, _e, _f, _g;
    var flowdata = getFlowdata(ctx);
    if (!flowdata)
        return;
    var scrollLeft = scrollX.scrollLeft;
    var scrollTop = scrollY.scrollTop;
    var rect = container.getBoundingClientRect();
    var x = e.pageX - rect.left - ctx.rowHeaderWidth;
    var y = e.pageY - rect.top - ctx.columnHeaderHeight;
    var offsetX = 0;
    var offsetY = 0;
    x += scrollLeft;
    y += scrollTop;
    var r = rowLocation(y, ctx.visibledatarow)[2];
    var c = colLocation(x, ctx.visibledatacolumn)[2];
    var margeset = mergeBorder(ctx, flowdata, r, c);
    if (margeset) {
        _a = margeset.row, r = _a[2];
        _b = margeset.column, c = _b[2];
    }
    var rc = "".concat(r, "_").concat(c);
    var comment = (_e = (_d = flowdata[r]) === null || _d === void 0 ? void 0 : _d[c]) === null || _e === void 0 ? void 0 : _e.ps;
    if (comment == null ||
        comment.isShow ||
        _.findIndex(ctx.commentBoxes, function (v) { return v.rc === rc; }) !== -1 ||
        ((_f = ctx.editingCommentBox) === null || _f === void 0 ? void 0 : _f.rc) === rc) {
        ctx.hoveredCommentBox = undefined;
        return;
    }
    if (((_g = ctx.hoveredCommentBox) === null || _g === void 0 ? void 0 : _g.rc) === rc)
        return;
    var row_pre = r - 1 === -1 ? 0 : ctx.visibledatarow[r - 1];
    var col = ctx.visibledatacolumn[c];
    if (margeset) {
        row_pre = margeset.row[0];
        _c = margeset.column, col = _c[1];
    }
    var toX = col + offsetX;
    var toY = row_pre + offsetY;
    var left = comment.left == null
        ? toX + 18 * ctx.zoomRatio
        : comment.left * ctx.zoomRatio;
    var top = comment.top == null
        ? toY - 18 * ctx.zoomRatio
        : comment.top * ctx.zoomRatio;
    if (top < 0) {
        top = 2;
    }
    var width = comment.width == null
        ? commentBoxProps.defaultWidth * ctx.zoomRatio
        : comment.width * ctx.zoomRatio;
    var height = comment.height == null
        ? commentBoxProps.defaultHeight * ctx.zoomRatio
        : comment.height * ctx.zoomRatio;
    var size = getArrowCanvasSize(left, top, toX, toY);
    var value = comment.value == null ? "" : comment.value;
    ctx.hoveredCommentBox = {
        r: r,
        c: c,
        rc: rc,
        left: left,
        top: top,
        width: width,
        height: height,
        size: size,
        value: value,
        autoFocus: false,
    };
}
export function getCommentBoxPosition(commentId) {
    var box = document.getElementById(commentId);
    if (!box)
        return undefined;
    var _a = box.getBoundingClientRect(), width = _a.width, height = _a.height;
    var left = box.offsetLeft;
    var top = box.offsetTop;
    return { left: left, top: top, width: width, height: height };
}
export function onCommentBoxResizeStart(ctx, globalCache, e, _a, resizingId, resizingSide) {
    var r = _a.r, c = _a.c, rc = _a.rc;
    var position = getCommentBoxPosition(resizingId);
    if (position) {
        _.set(globalCache, "commentBox", {
            cursorMoveStartPosition: {
                x: e.pageX,
                y: e.pageY,
            },
            resizingId: resizingId,
            resizingSide: resizingSide,
            commentRC: { r: r, c: c, rc: rc },
            boxInitialPosition: position,
        });
    }
}
export function onCommentBoxResize(ctx, globalCache, e) {
    if (ctx.allowEdit === false)
        return false;
    var commentBox = globalCache === null || globalCache === void 0 ? void 0 : globalCache.commentBox;
    if ((commentBox === null || commentBox === void 0 ? void 0 : commentBox.resizingId) && commentBox.resizingSide) {
        var box = document.getElementById(commentBox.resizingId);
        var _a = commentBox.cursorMoveStartPosition, startX = _a.x, startY = _a.y;
        var _b = commentBox.boxInitialPosition, top_1 = _b.top, left = _b.left, width = _b.width, height = _b.height;
        var dx = e.pageX - startX;
        var dy = e.pageY - startY;
        var minHeight = 60 * ctx.zoomRatio;
        var minWidth = 1.5 * 60 * ctx.zoomRatio;
        if (["lm", "lt", "lb"].includes(commentBox.resizingSide)) {
            if (width - dx < minWidth) {
                left += width - minWidth;
                width = minWidth;
            }
            else {
                left += dx;
                width -= dx;
            }
            if (left < 0)
                left = 0;
            box.style.left = "".concat(left, "px");
        }
        if (["rm", "rt", "rb"].includes(commentBox.resizingSide)) {
            width = width + dx < minWidth ? minWidth : width + dx;
        }
        if (["mt", "lt", "rt"].includes(commentBox.resizingSide)) {
            if (height - dy < minHeight) {
                top_1 += height - minHeight;
                height = minHeight;
            }
            else {
                top_1 += dy;
                height -= dy;
            }
            if (top_1 < 0)
                top_1 = 0;
            box.style.top = "".concat(top_1, "px");
        }
        if (["mb", "lb", "rb"].includes(commentBox.resizingSide)) {
            height = height + dy < minHeight ? minHeight : height + dy;
        }
        box.style.width = "".concat(width, "px");
        box.style.height = "".concat(height, "px");
        return true;
    }
    return false;
}
export function onCommentBoxResizeEnd(ctx, globalCache) {
    var _a;
    if ((_a = globalCache.commentBox) === null || _a === void 0 ? void 0 : _a.resizingId) {
        var _b = globalCache.commentBox, resizingId = _b.resizingId, _c = _b.commentRC, r = _c.r, c = _c.c;
        globalCache.commentBox.resizingId = undefined;
        var position = getCommentBoxPosition(resizingId);
        if (position) {
            var top_2 = position.top, left = position.left, width = position.width, height = position.height;
            var flowdata = getFlowdata(ctx);
            var cell = flowdata === null || flowdata === void 0 ? void 0 : flowdata[r][c];
            if (!flowdata || !(cell === null || cell === void 0 ? void 0 : cell.ps))
                return;
            cell.ps.left = left / ctx.zoomRatio;
            cell.ps.top = top_2 / ctx.zoomRatio;
            cell.ps.width = width / ctx.zoomRatio;
            cell.ps.height = height / ctx.zoomRatio;
            setEditingComment(ctx, flowdata, r, c);
        }
    }
}
export function onCommentBoxMoveStart(ctx, globalCache, e, _a, movingId) {
    var r = _a.r, c = _a.c, rc = _a.rc;
    var position = getCommentBoxPosition(movingId);
    if (position) {
        var top_3 = position.top, left = position.left;
        _.set(globalCache, "commentBox", {
            cursorMoveStartPosition: {
                x: e.pageX,
                y: e.pageY,
            },
            movingId: movingId,
            commentRC: { r: r, c: c, rc: rc },
            boxInitialPosition: { left: left, top: top_3 },
        });
    }
}
export function onCommentBoxMove(ctx, globalCache, e) {
    var allowEdit = isAllowEdit(ctx);
    if (!allowEdit)
        return false;
    var commentBox = globalCache === null || globalCache === void 0 ? void 0 : globalCache.commentBox;
    if (commentBox === null || commentBox === void 0 ? void 0 : commentBox.movingId) {
        var box = document.getElementById(commentBox.movingId);
        var _a = commentBox.cursorMoveStartPosition, startX = _a.x, startY = _a.y;
        var _b = commentBox.boxInitialPosition, top_4 = _b.top, left = _b.left;
        left += e.pageX - startX;
        top_4 += e.pageY - startY;
        if (top_4 < 0)
            top_4 = 0;
        box.style.left = "".concat(left, "px");
        box.style.top = "".concat(top_4, "px");
        return true;
    }
    return false;
}
export function onCommentBoxMoveEnd(ctx, globalCache) {
    var _a;
    if ((_a = globalCache.commentBox) === null || _a === void 0 ? void 0 : _a.movingId) {
        var _b = globalCache.commentBox, movingId = _b.movingId, _c = _b.commentRC, r = _c.r, c = _c.c;
        globalCache.commentBox.movingId = undefined;
        var position = getCommentBoxPosition(movingId);
        if (position) {
            var top_5 = position.top, left = position.left;
            var flowdata = getFlowdata(ctx);
            var cell = flowdata === null || flowdata === void 0 ? void 0 : flowdata[r][c];
            if (!flowdata || !(cell === null || cell === void 0 ? void 0 : cell.ps))
                return;
            cell.ps.left = left / ctx.zoomRatio;
            cell.ps.top = top_5 / ctx.zoomRatio;
            setEditingComment(ctx, flowdata, r, c);
        }
    }
}
