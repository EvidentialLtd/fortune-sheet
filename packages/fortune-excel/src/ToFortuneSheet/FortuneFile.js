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
import { FortuneSheet } from "./FortuneSheet";
import { workBookFile, coreFile, appFile, stylesFile, sharedStringsFile, numFmtDefault, theme1File, calcChainFile, workbookRels, numFmtDefaultMap, } from "../common/constant";
import { ReadXml } from "./ReadXml";
import { getXmlAttibute } from "../common/method";
import { FortuneFileBase, FortuneFileInfo, } from "./FortuneBase";
import { ImageList } from "./FortuneImage";
var FortuneFile = (function () {
    function FortuneFile(files, fileName) {
        this.columnWidthSet = [];
        this.rowHeightSet = [];
        this.files = files;
        this.fileName = fileName;
        this.readXml = new ReadXml(files);
        this.getSheetNameList();
        this.sharedStrings = this.readXml.getElementsByTagName("sst/si", sharedStringsFile);
        this.calcChain = this.readXml.getElementsByTagName("calcChain/c", calcChainFile);
        this.styles = {};
        this.styles["cellXfs"] = this.readXml.getElementsByTagName("cellXfs/xf", stylesFile);
        this.styles["cellStyleXfs"] = this.readXml.getElementsByTagName("cellStyleXfs/xf", stylesFile);
        this.styles["cellStyles"] = this.readXml.getElementsByTagName("cellStyles/cellStyle", stylesFile);
        this.styles["fonts"] = this.readXml.getElementsByTagName("fonts/font", stylesFile);
        this.styles["fills"] = this.readXml.getElementsByTagName("fills/fill", stylesFile);
        this.styles["borders"] = this.readXml.getElementsByTagName("borders/border", stylesFile);
        this.styles["clrScheme"] = this.readXml.getElementsByTagName("a:clrScheme/a:dk1|a:lt1|a:dk2|a:lt2|a:accent1|a:accent2|a:accent3|a:accent4|a:accent5|a:accent6|a:hlink|a:folHlink", theme1File);
        this.styles["indexedColors"] = this.readXml.getElementsByTagName("colors/indexedColors/rgbColor", stylesFile);
        this.styles["mruColors"] = this.readXml.getElementsByTagName("colors/mruColors/color", stylesFile);
        this.imageList = new ImageList(files);
        var numfmts = this.readXml.getElementsByTagName("numFmt/numFmt", stylesFile);
        var numFmtDefaultC = JSON.parse(JSON.stringify(numFmtDefault));
        for (var i = 0; i < numfmts.length; i++) {
            var attrList = numfmts[i].attributeList;
            var numfmtid = getXmlAttibute(attrList, "numFmtId", "49");
            var formatcode = getXmlAttibute(attrList, "formatCode", "@");
            if (!(numfmtid in numFmtDefault)) {
                numFmtDefaultC[numfmtid] = numFmtDefaultMap[formatcode] || formatcode;
            }
        }
        this.styles["numfmts"] = numFmtDefaultC;
    }
    FortuneFile.prototype.getSheetNameList = function () {
        var workbookRelList = this.readXml.getElementsByTagName("Relationships/Relationship", workbookRels);
        if (workbookRelList == null) {
            return;
        }
        var regex = new RegExp("worksheets/[^/]*?.xml");
        var sheetNames = {};
        for (var i = 0; i < workbookRelList.length; i++) {
            var rel = workbookRelList[i], attrList = rel.attributeList;
            var id = attrList["Id"], target = attrList["Target"];
            if (regex.test(target)) {
                if (target.indexOf("/xl") === 0) {
                    sheetNames[id] = target.substr(1);
                }
                else {
                    sheetNames[id] = "xl/" + target;
                }
            }
        }
        this.sheetNameList = sheetNames;
    };
    FortuneFile.prototype.getSheetFileBysheetId = function (sheetId) {
        return this.sheetNameList[sheetId];
    };
    FortuneFile.prototype.getWorkBookInfo = function () {
        var Company = this.readXml.getElementsByTagName("Company", appFile);
        var AppVersion = this.readXml.getElementsByTagName("AppVersion", appFile);
        var creator = this.readXml.getElementsByTagName("dc:creator", coreFile);
        var lastModifiedBy = this.readXml.getElementsByTagName("cp:lastModifiedBy", coreFile);
        var created = this.readXml.getElementsByTagName("dcterms:created", coreFile);
        var modified = this.readXml.getElementsByTagName("dcterms:modified", coreFile);
        this.info = new FortuneFileInfo();
        this.info.name = this.fileName;
        this.info.creator = creator.length > 0 ? creator[0].value : "";
        this.info.lastmodifiedby =
            lastModifiedBy.length > 0 ? lastModifiedBy[0].value : "";
        this.info.createdTime = created.length > 0 ? created[0].value : "";
        this.info.modifiedTime = modified.length > 0 ? modified[0].value : "";
        this.info.company = Company.length > 0 ? Company[0].value : "";
        this.info.appversion = AppVersion.length > 0 ? AppVersion[0].value : "";
    };
    FortuneFile.prototype.getSheetsFull = function (isInitialCell) {
        if (isInitialCell === void 0) { isInitialCell = true; }
        var sheets = this.readXml.getElementsByTagName("sheets/sheet", workBookFile);
        var sheetList = {};
        for (var key in sheets) {
            var sheet = sheets[key];
            sheetList[sheet.attributeList.name] = sheet.attributeList["sheetId"];
        }
        this.sheets = [];
        var order = 0;
        for (var key in sheets) {
            var sheet = sheets[key];
            var sheetName = sheet.attributeList.name;
            var sheetId = sheet.attributeList["sheetId"];
            var rid = sheet.attributeList["r:id"];
            var sheetFile = this.getSheetFileBysheetId(rid);
            var hide = sheet.attributeList.state === "hidden" ? 1 : 0;
            var drawing = this.readXml.getElementsByTagName("worksheet/drawing", sheetFile), drawingFile = void 0, drawingRelsFile = void 0;
            if (drawing != null && drawing.length > 0) {
                var attrList = drawing[0].attributeList;
                var rid_1 = getXmlAttibute(attrList, "r:id", null);
                if (rid_1 != null) {
                    drawingFile = this.getDrawingFile(rid_1, sheetFile);
                    drawingRelsFile = this.getDrawingRelsFile(drawingFile);
                }
            }
            if (sheetFile != null) {
                var sheet_1 = new FortuneSheet(sheetName, sheetId, order, isInitialCell, {
                    sheetFile: sheetFile,
                    readXml: this.readXml,
                    sheetList: sheetList,
                    styles: this.styles,
                    sharedStrings: this.sharedStrings,
                    calcChain: this.calcChain,
                    imageList: this.imageList,
                    drawingFile: drawingFile,
                    drawingRelsFile: drawingRelsFile,
                    hide: hide,
                });
                this.columnWidthSet = [];
                this.rowHeightSet = [];
                this.imagePositionCaculation(sheet_1);
                this.sheets.push(sheet_1);
                order++;
            }
        }
    };
    FortuneFile.prototype.extendArray = function (index, sets, def, hidden, lens) {
        if (index < sets.length) {
            return;
        }
        var startIndex = sets.length, endIndex = index;
        var allGap = 0;
        if (startIndex > 0) {
            allGap = sets[startIndex - 1];
        }
        for (var i = startIndex; i <= endIndex; i++) {
            var gap = def, istring = i.toString();
            if (istring in hidden) {
                gap = 0;
            }
            else if (istring in lens) {
                gap = lens[istring];
            }
            allGap += Math.round(gap + 1);
            sets.push(allGap);
        }
    };
    FortuneFile.prototype.imagePositionCaculation = function (sheet) {
        var images = sheet.images, defaultColWidth = sheet.defaultColWidth, defaultRowHeight = sheet.defaultRowHeight;
        var colhidden = {};
        if (sheet.config.colhidden) {
            colhidden = sheet.config.colhidden;
        }
        var columnlen = {};
        if (sheet.config.columnlen) {
            columnlen = sheet.config.columnlen;
        }
        var rowhidden = {};
        if (sheet.config.rowhidden) {
            rowhidden = sheet.config.rowhidden;
        }
        var rowlen = {};
        if (sheet.config.rowlen) {
            rowlen = sheet.config.rowlen;
        }
        for (var key in images) {
            var imageObject = images[key];
            var fromCol = imageObject.fromCol;
            var fromColOff = imageObject.fromColOff;
            var fromRow = imageObject.fromRow;
            var fromRowOff = imageObject.fromRowOff;
            var toCol = imageObject.toCol;
            var toColOff = imageObject.toColOff;
            var toRow = imageObject.toRow;
            var toRowOff = imageObject.toRowOff;
            var x_n = 0, y_n = 0;
            var cx_n = 0, cy_n = 0;
            if (fromCol >= this.columnWidthSet.length) {
                this.extendArray(fromCol, this.columnWidthSet, defaultColWidth, colhidden, columnlen);
            }
            if (fromCol == 0) {
                x_n = 0;
            }
            else {
                x_n = this.columnWidthSet[fromCol - 1];
            }
            x_n = x_n + fromColOff;
            if (fromRow >= this.rowHeightSet.length) {
                this.extendArray(fromRow, this.rowHeightSet, defaultRowHeight, rowhidden, rowlen);
            }
            if (fromRow == 0) {
                y_n = 0;
            }
            else {
                y_n = this.rowHeightSet[fromRow - 1];
            }
            y_n = y_n + fromRowOff;
            if (toCol >= this.columnWidthSet.length) {
                this.extendArray(toCol, this.columnWidthSet, defaultColWidth, colhidden, columnlen);
            }
            if (toCol == 0) {
                cx_n = 0;
            }
            else {
                cx_n = this.columnWidthSet[toCol - 1];
            }
            cx_n = cx_n + toColOff - x_n;
            if (toRow >= this.rowHeightSet.length) {
                this.extendArray(toRow, this.rowHeightSet, defaultRowHeight, rowhidden, rowlen);
            }
            if (toRow == 0) {
                cy_n = 0;
            }
            else {
                cy_n = this.rowHeightSet[toRow - 1];
            }
            cy_n = cy_n + toRowOff - y_n;
            console.log(defaultColWidth, colhidden, columnlen);
            console.log(fromCol, this.columnWidthSet[fromCol], fromColOff);
            console.log(toCol, this.columnWidthSet[toCol], toColOff, JSON.stringify(this.columnWidthSet));
            imageObject.originWidth = cx_n;
            imageObject.originHeight = cy_n;
            imageObject.crop.height = cy_n;
            imageObject.crop.width = cx_n;
            imageObject.default.height = cy_n;
            imageObject.default.left = x_n;
            imageObject.default.top = y_n;
            imageObject.default.width = cx_n;
        }
    };
    FortuneFile.prototype.getDrawingFile = function (rid, sheetFile) {
        var sheetRelsPath = "xl/worksheets/_rels/";
        var sheetFileArr = sheetFile.split("/");
        var sheetRelsName = sheetFileArr[sheetFileArr.length - 1];
        var sheetRelsFile = sheetRelsPath + sheetRelsName + ".rels";
        var drawing = this.readXml.getElementsByTagName("Relationships/Relationship", sheetRelsFile);
        if (drawing.length > 0) {
            for (var i = 0; i < drawing.length; i++) {
                var relationship = drawing[i];
                var attrList = relationship.attributeList;
                var relationshipId = getXmlAttibute(attrList, "Id", null);
                if (relationshipId == rid) {
                    var target = getXmlAttibute(attrList, "Target", null);
                    if (target != null) {
                        return target.replace(/\.\.\//g, "");
                    }
                }
            }
        }
        return null;
    };
    FortuneFile.prototype.getDrawingRelsFile = function (drawingFile) {
        var drawingRelsPath = "xl/drawings/_rels/";
        var drawingFileArr = drawingFile.split("/");
        var drawingRelsName = drawingFileArr[drawingFileArr.length - 1];
        var drawingRelsFile = drawingRelsPath + drawingRelsName + ".rels";
        return drawingRelsFile;
    };
    FortuneFile.prototype.getSheetsWithoutCell = function () {
        this.getSheetsFull(false);
    };
    FortuneFile.prototype.Parse = function () {
        this.getWorkBookInfo();
        this.getSheetsFull();
    };
    FortuneFile.prototype.serialize = function () {
        var _a;
        var FortuneOutPutFile = new FortuneFileBase();
        FortuneOutPutFile.info = this.info;
        FortuneOutPutFile.sheets = [];
        for (var _i = 0, _b = this.sheets; _i < _b.length; _i++) {
            var sheet = _b[_i];
            var sheetout = {};
            if (sheet.name != null) {
                sheetout.name = sheet.name;
            }
            if (sheet.color != null) {
                sheetout.color = sheet.color;
            }
            if (sheet.config != null) {
                sheetout.config = sheet.config;
            }
            if (sheet.id != null) {
                sheetout.id = sheet.id;
            }
            if (sheet.status != null) {
                sheetout.status = sheet.status;
            }
            if (sheet.order != null) {
                sheetout.order = sheet.order;
            }
            if (sheet.row != null) {
                sheetout.row = sheet.row;
            }
            if (sheet.column != null) {
                sheetout.column = sheet.column;
            }
            if (sheet.luckysheet_select_save != null) {
                sheetout.luckysheet_select_save = sheet.luckysheet_select_save;
            }
            if (sheet.scrollLeft != null) {
                sheetout.scrollLeft = sheet.scrollLeft;
            }
            if (sheet.scrollTop != null) {
                sheetout.scrollTop = sheet.scrollTop;
            }
            if (sheet.zoomRatio != null) {
                sheetout.zoomRatio = sheet.zoomRatio;
            }
            if (sheet.showGridLines != null) {
                sheetout.showGridLines = sheet.showGridLines;
            }
            if (sheet.defaultColWidth != null) {
                sheetout.defaultColWidth = sheet.defaultColWidth;
            }
            if (sheet.defaultRowHeight != null) {
                sheetout.defaultRowHeight = sheet.defaultRowHeight;
            }
            var merges = new Map();
            if ((_a = sheet.config) === null || _a === void 0 ? void 0 : _a.merge) {
                for (var _c = 0, _d = Object.values(sheet.config.merge); _c < _d.length; _c++) {
                    var _e = _d[_c], r = _e.r, c = _e.c, rs = _e.rs, cs = _e.cs;
                    merges.set(r + "_" + c, { r: r, c: c, rs: rs, cs: cs });
                    for (var i = r + 1; i < r + rs; i++)
                        for (var j = c + 1; j < c + cs; j++)
                            merges.set(i + "_" + j, { r: r, c: c });
                }
            }
            if (sheet.celldata != null) {
                sheetout.celldata = [];
                for (var _f = 0, _g = sheet.celldata; _f < _g.length; _f++) {
                    var _h = _g[_f], r = _h.r, c = _h.c, v = _h.v;
                    if (typeof v === "object") {
                        var xv = __rest(v, []);
                        v = xv;
                        if (v.ct) {
                            var ct = __rest(v.ct, []);
                            v.ct = ct;
                        }
                        if (merges.has(r + "_" + c)) {
                            v.mc = merges.get(r + "_" + c);
                            if (v.mc.r !== r || v.mc.c !== c)
                                v = { mc: v.mc };
                        }
                    }
                    sheetout.celldata.push({ r: r, c: c, v: v });
                }
            }
            if (sheet.chart != null) {
                sheetout.chart = sheet.chart;
            }
            if (sheet.isPivotTable != null) {
                sheetout.isPivotTable = sheet.isPivotTable;
            }
            if (sheet.pivotTable != null) {
                sheetout.pivotTable = sheet.pivotTable;
            }
            if (sheet.luckysheet_conditionformat_save != null) {
                sheetout.luckysheet_conditionformat_save =
                    sheet.luckysheet_conditionformat_save;
            }
            if (sheet.freezen != null) {
                sheetout.freezen = sheet.freezen;
            }
            if (sheet.calcChain != null) {
                sheetout.calcChain = sheet.calcChain;
            }
            if (sheet.images != null) {
                sheetout.images = sheet.images;
            }
            if (sheet.dataVerification != null) {
                sheetout.dataVerification = sheet.dataVerification;
            }
            if (sheet.hyperlink != null) {
                sheetout.hyperlink = sheet.hyperlink;
            }
            if (sheet.hide != null) {
                sheetout.hide = sheet.hide;
            }
            FortuneOutPutFile.sheets.push(sheetout);
        }
        return FortuneOutPutFile;
    };
    return FortuneFile;
}());
export { FortuneFile };
