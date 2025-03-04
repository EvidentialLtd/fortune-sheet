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
var getImagePosition = function (num, arr) {
    var index = 0;
    var minIndex;
    var maxIndex;
    for (var i = 0; i < arr.length; i++) {
        if (num < arr[i]) {
            index = i;
            break;
        }
    }
    if (index == 0) {
        minIndex = 0;
        maxIndex = 1;
        return Math.abs((num - 0) / (arr[maxIndex] - arr[minIndex])) + index;
    }
    else if (index == arr.length - 1) {
        minIndex = arr.length - 2;
        maxIndex = arr.length - 1;
    }
    else {
        minIndex = index - 1;
        maxIndex = index;
    }
    var min = arr[minIndex];
    var max = arr[maxIndex];
    var radio = Math.abs((num - min) / (max - min)) + index;
    return radio;
};
var setImages = function (table, worksheet, workbook) {
    var _a, _b, _c, _d;
    var localTable = __assign({}, table);
    var images = localTable.images, visibledatacolumn = localTable.visibledatacolumn, visibledatarow = localTable.visibledatarow;
    if (typeof images != "object")
        return;
    for (var key in images) {
        var myBase64Image = images[key].src;
        var item = images[key];
        var imageId = workbook.addImage({
            base64: myBase64Image,
            extension: "png",
        });
        if (!visibledatacolumn || !visibledatarow) {
            var defaultColWidth = localTable.defaultColWidth || 73;
            var defaultRowHeight = localTable.defaultRowHeight || 19;
            var rowCount = localTable.data.length;
            var colCount = localTable.data[0].length;
            visibledatacolumn = [];
            visibledatarow = [];
            var lastVal = 0;
            for (var i = 0; i < rowCount; i++) {
                var rowHeight = (((_b = (_a = localTable.config) === null || _a === void 0 ? void 0 : _a.rowlen) === null || _b === void 0 ? void 0 : _b[i]) || defaultRowHeight);
                var rowPosition = lastVal + rowHeight;
                visibledatarow.push(rowPosition);
                lastVal = rowPosition;
            }
            lastVal = 0;
            for (var i = 0; i < colCount; i++) {
                var colWidth = (((_d = (_c = localTable.config) === null || _c === void 0 ? void 0 : _c.columnlen) === null || _d === void 0 ? void 0 : _d[i]) || defaultColWidth);
                var colPosition = lastVal + colWidth;
                visibledatacolumn.push(colPosition);
                lastVal = colPosition;
            }
        }
        var col_st = getImagePosition(item.left, visibledatacolumn);
        var row_st = getImagePosition(item.top, visibledatarow);
        worksheet.addImage(imageId, {
            tl: { col: col_st, row: row_st },
            ext: { width: item.width, height: item.height },
        });
    }
};
export { setImages };
