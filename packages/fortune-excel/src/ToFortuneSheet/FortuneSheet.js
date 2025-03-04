var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { FortuneSheetCelldata } from "./FortuneCell";
import { getXmlAttibute, getColumnWidthPixel, fromulaRef, getRowHeightPixel, getcellrange, generateRandomIndex, getPxByEMUs, getMultiSequenceToNum, getTransR1C1ToSequence, getPeelOffX14, getMultiFormulaValue, } from "../common/method";
import { COMMON_TYPE2, DATA_VERIFICATION_MAP, DATA_VERIFICATION_TYPE2_MAP, worksheetFilePath, } from "../common/constant";
import { getColor } from "./ReadXml";
import { FortuneSheetBase, FortuneConfig, FortunesheetCalcChain, FortuneSheetConfigMerge, } from "./FortuneBase";
import dayjs from "dayjs";
var FortuneSheet = (function (_super) {
    __extends(FortuneSheet, _super);
    function FortuneSheet(sheetName, sheetId, sheetOrder, isInitialCell, allFileOption) {
        if (isInitialCell === void 0) { isInitialCell = false; }
        var _this = _super.call(this) || this;
        _this.isInitialCell = isInitialCell;
        _this.readXml = allFileOption.readXml;
        _this.sheetFile = allFileOption.sheetFile;
        _this.styles = allFileOption.styles;
        _this.sharedStrings = allFileOption.sharedStrings;
        _this.calcChainEles = allFileOption.calcChain;
        _this.sheetList = allFileOption.sheetList;
        _this.imageList = allFileOption.imageList;
        _this.hide = allFileOption.hide;
        _this.name = sheetName;
        _this.id = sheetId;
        _this.order = sheetOrder.toString();
        _this.config = new FortuneConfig();
        _this.celldata = [];
        _this.mergeCells = _this.readXml.getElementsByTagName("mergeCells/mergeCell", _this.sheetFile);
        var clrScheme = _this.styles["clrScheme"];
        var sheetView = _this.readXml.getElementsByTagName("sheetViews/sheetView", _this.sheetFile);
        var showGridLines = "1", tabSelected = "0", zoomScale = "100", activeCell = "A1";
        if (sheetView.length > 0) {
            var attrList = sheetView[0].attributeList;
            showGridLines = getXmlAttibute(attrList, "showGridLines", "1");
            tabSelected = getXmlAttibute(attrList, "tabSelected", "0");
            zoomScale = getXmlAttibute(attrList, "zoomScale", "100");
            var selections = sheetView[0].getInnerElements("selection");
            if (selections != null && selections.length > 0) {
                activeCell = getXmlAttibute(selections[0].attributeList, "activeCell", "A1");
                var range = getcellrange(activeCell, _this.sheetList, sheetId);
                _this.luckysheet_select_save = [];
                _this.luckysheet_select_save.push(range);
            }
        }
        _this.showGridLines = showGridLines;
        _this.status = tabSelected;
        _this.zoomRatio = parseInt(zoomScale) / 100;
        var tabColors = _this.readXml.getElementsByTagName("sheetPr/tabColor", _this.sheetFile);
        if (tabColors != null && tabColors.length > 0) {
            var tabColor = tabColors[0], attrList = tabColor.attributeList;
            var tc = getColor(tabColor, _this.styles, "b");
            _this.color = tc;
        }
        var sheetFormatPr = _this.readXml.getElementsByTagName("sheetFormatPr", _this.sheetFile);
        var defaultColWidth, defaultRowHeight;
        if (sheetFormatPr.length > 0) {
            var attrList = sheetFormatPr[0].attributeList;
            defaultColWidth = getXmlAttibute(attrList, "defaultColWidth", "9.21");
            defaultRowHeight = getXmlAttibute(attrList, "defaultRowHeight", "19");
        }
        _this.defaultColWidth = getColumnWidthPixel(parseFloat(defaultColWidth));
        _this.defaultRowHeight = getRowHeightPixel(parseFloat(defaultRowHeight));
        _this.generateConfigColumnLenAndHidden();
        var cellOtherInfo = _this.generateConfigRowLenAndHiddenAddCell();
        if (_this.calcChain == null) {
            _this.calcChain = [];
        }
        var formulaListExist = {};
        for (var c = 0; c < _this.calcChainEles.length; c++) {
            var calcChainEle = _this.calcChainEles[c], attrList = calcChainEle.attributeList;
            if (attrList.i != sheetId) {
                continue;
            }
            var r = attrList.r, i = attrList.i, l = attrList.l, s = attrList.s, a = attrList.a, t = attrList.t;
            var range = getcellrange(r);
            var chain = new FortunesheetCalcChain();
            chain.r = range.row[0];
            chain.c = range.column[0];
            chain.id = _this.id;
            _this.calcChain.push(chain);
            formulaListExist["r" + r + "c" + c] = null;
        }
        if (_this.formulaRefList != null) {
            for (var key in _this.formulaRefList) {
                var funclist = _this.formulaRefList[key];
                var mainFunc = funclist["mainRef"], mainCellValue = mainFunc.cellValue;
                var formulaTxt = mainFunc.fv;
                var mainR = mainCellValue.r, mainC = mainCellValue.c;
                for (var name_1 in funclist) {
                    if (name_1 == "mainRef") {
                        continue;
                    }
                    var funcValue = funclist[name_1], cellValue = funcValue.cellValue;
                    if (cellValue == null) {
                        continue;
                    }
                    var r = cellValue.r, c = cellValue.c;
                    var func = formulaTxt;
                    var offsetRow = r - mainR, offsetCol = c - mainC;
                    if (offsetRow > 0) {
                        func = "=" + fromulaRef.functionCopy(func, "down", offsetRow);
                    }
                    else if (offsetRow < 0) {
                        func =
                            "=" + fromulaRef.functionCopy(func, "up", Math.abs(offsetRow));
                    }
                    if (offsetCol > 0) {
                        func = "=" + fromulaRef.functionCopy(func, "right", offsetCol);
                    }
                    else if (offsetCol < 0) {
                        func =
                            "=" + fromulaRef.functionCopy(func, "left", Math.abs(offsetCol));
                    }
                    cellValue.v.f = func;
                    var chain = new FortunesheetCalcChain();
                    chain.r = cellValue.r;
                    chain.c = cellValue.c;
                    chain.id = _this.id;
                    _this.calcChain.push(chain);
                }
            }
        }
        for (var key in cellOtherInfo.formulaList) {
            if (!(key in formulaListExist)) {
                var formulaListItem = cellOtherInfo.formulaList[key];
                var chain = new FortunesheetCalcChain();
                chain.r = formulaListItem.r;
                chain.c = formulaListItem.c;
                chain.id = _this.id;
                _this.calcChain.push(chain);
            }
        }
        _this.dataVerification = _this.generateConfigDataValidations();
        _this.hyperlink = _this.generateConfigHyperlinks();
        _this.hide = _this.hide;
        if (_this.mergeCells != null) {
            for (var i = 0; i < _this.mergeCells.length; i++) {
                var merge = _this.mergeCells[i], attrList = merge.attributeList;
                var ref = attrList.ref;
                if (ref == null) {
                    continue;
                }
                var range = getcellrange(ref, _this.sheetList, sheetId);
                var mergeValue = new FortuneSheetConfigMerge();
                mergeValue.r = range.row[0];
                mergeValue.c = range.column[0];
                mergeValue.rs = range.row[1] - range.row[0] + 1;
                mergeValue.cs = range.column[1] - range.column[0] + 1;
                if (_this.config.merge == null) {
                    _this.config.merge = {};
                }
                _this.config.merge[range.row[0] + "_" + range.column[0]] = mergeValue;
            }
        }
        var drawingFile = allFileOption.drawingFile, drawingRelsFile = allFileOption.drawingRelsFile;
        if (drawingFile != null && drawingRelsFile != null) {
            var twoCellAnchors = _this.readXml.getElementsByTagName("xdr:twoCellAnchor", drawingFile);
            if (twoCellAnchors != null && twoCellAnchors.length > 0) {
                for (var i = 0; i < twoCellAnchors.length; i++) {
                    var twoCellAnchor = twoCellAnchors[i];
                    var editAs = getXmlAttibute(twoCellAnchor.attributeList, "editAs", "twoCell");
                    var xdrFroms = twoCellAnchor.getInnerElements("xdr:from"), xdrTos = twoCellAnchor.getInnerElements("xdr:to");
                    var xdr_blipfills = twoCellAnchor.getInnerElements("a:blip");
                    if (xdrFroms != null &&
                        xdr_blipfills != null &&
                        xdrFroms.length > 0 &&
                        xdr_blipfills.length > 0) {
                        var xdrFrom = xdrFroms[0], xdrTo = xdrTos[0], xdr_blipfill = xdr_blipfills[0];
                        var rembed = getXmlAttibute(xdr_blipfill.attributeList, "r:embed", null);
                        var imageObject = _this.getBase64ByRid(rembed, drawingRelsFile);
                        var x_n = 0, y_n = 0;
                        var cx_n = 0, cy_n = 0;
                        imageObject.fromCol = _this.getXdrValue(xdrFrom.getInnerElements("xdr:col"));
                        imageObject.fromColOff = getPxByEMUs(_this.getXdrValue(xdrFrom.getInnerElements("xdr:colOff")));
                        imageObject.fromRow = _this.getXdrValue(xdrFrom.getInnerElements("xdr:row"));
                        imageObject.fromRowOff = getPxByEMUs(_this.getXdrValue(xdrFrom.getInnerElements("xdr:rowOff")));
                        imageObject.toCol = _this.getXdrValue(xdrTo.getInnerElements("xdr:col"));
                        imageObject.toColOff = getPxByEMUs(_this.getXdrValue(xdrTo.getInnerElements("xdr:colOff")));
                        imageObject.toRow = _this.getXdrValue(xdrTo.getInnerElements("xdr:row"));
                        imageObject.toRowOff = getPxByEMUs(_this.getXdrValue(xdrTo.getInnerElements("xdr:rowOff")));
                        imageObject.originWidth = cx_n;
                        imageObject.originHeight = cy_n;
                        if (editAs == "absolute") {
                            imageObject.type = "3";
                        }
                        else if (editAs == "oneCell") {
                            imageObject.type = "2";
                        }
                        else {
                            imageObject.type = "1";
                        }
                        imageObject.isFixedPos = false;
                        imageObject.fixedLeft = 0;
                        imageObject.fixedTop = 0;
                        var imageBorder = {
                            color: "#000",
                            radius: 0,
                            style: "solid",
                            width: 0,
                        };
                        imageObject.border = imageBorder;
                        var imageCrop = {
                            height: cy_n,
                            offsetLeft: 0,
                            offsetTop: 0,
                            width: cx_n,
                        };
                        imageObject.crop = imageCrop;
                        var imageDefault = {
                            height: cy_n,
                            left: x_n,
                            top: y_n,
                            width: cx_n,
                        };
                        imageObject.default = imageDefault;
                        if (_this.images == null) {
                            _this.images = {};
                        }
                        _this.images[generateRandomIndex("image")] = imageObject;
                    }
                }
            }
        }
        return _this;
    }
    FortuneSheet.prototype.getXdrValue = function (ele) {
        if (ele == null || ele.length == 0) {
            return null;
        }
        return parseInt(ele[0].value);
    };
    FortuneSheet.prototype.getBase64ByRid = function (rid, drawingRelsFile) {
        var Relationships = this.readXml.getElementsByTagName("Relationships/Relationship", drawingRelsFile);
        if (Relationships != null && Relationships.length > 0) {
            for (var i = 0; i < Relationships.length; i++) {
                var Relationship = Relationships[i];
                var attrList = Relationship.attributeList;
                var Id = getXmlAttibute(attrList, "Id", null);
                var src = getXmlAttibute(attrList, "Target", null);
                if (Id == rid) {
                    src = src.replace(/\.\.\//g, "");
                    src = "xl/" + src;
                    var imgage = this.imageList.getImageByName(src);
                    return imgage;
                }
            }
        }
        return null;
    };
    FortuneSheet.prototype.generateConfigColumnLenAndHidden = function () {
        var cols = this.readXml.getElementsByTagName("cols/col", this.sheetFile);
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i], attrList = col.attributeList;
            var min = getXmlAttibute(attrList, "min", null);
            var max = getXmlAttibute(attrList, "max", null);
            var width = getXmlAttibute(attrList, "width", null);
            var hidden = getXmlAttibute(attrList, "hidden", null);
            var customWidth = getXmlAttibute(attrList, "customWidth", null);
            if (min == null || max == null) {
                continue;
            }
            var minNum = parseInt(min) - 1, maxNum = parseInt(max) - 1, widthNum = parseFloat(width);
            for (var m = minNum; m <= maxNum; m++) {
                if (width != null) {
                    if (this.config.columnlen == null) {
                        this.config.columnlen = {};
                    }
                    this.config.columnlen[m] = getColumnWidthPixel(widthNum);
                }
                if (hidden == "1") {
                    if (this.config.colhidden == null) {
                        this.config.colhidden = {};
                    }
                    this.config.colhidden[m] = 0;
                    if (this.config.columnlen) {
                        delete this.config.columnlen[m];
                    }
                }
                if (customWidth != null) {
                    if (this.config.customWidth == null) {
                        this.config.customWidth = {};
                    }
                    this.config.customWidth[m] = 1;
                }
            }
        }
    };
    FortuneSheet.prototype.generateConfigRowLenAndHiddenAddCell = function () {
        var rows = this.readXml.getElementsByTagName("sheetData/row", this.sheetFile);
        var cellOtherInfo = {};
        var formulaList = {};
        cellOtherInfo.formulaList = formulaList;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i], attrList = row.attributeList;
            var rowNo = getXmlAttibute(attrList, "r", null);
            var height = getXmlAttibute(attrList, "ht", null);
            var hidden = getXmlAttibute(attrList, "hidden", null);
            var customHeight = getXmlAttibute(attrList, "customHeight", null);
            if (rowNo == null) {
                continue;
            }
            var rowNoNum = parseInt(rowNo) - 1;
            if (height != null) {
                var heightNum = parseFloat(height);
                if (this.config.rowlen == null) {
                    this.config.rowlen = {};
                }
                this.config.rowlen[rowNoNum] = getRowHeightPixel(heightNum);
            }
            if (hidden == "1") {
                if (this.config.rowhidden == null) {
                    this.config.rowhidden = {};
                }
                this.config.rowhidden[rowNoNum] = 0;
                if (this.config.rowlen) {
                    delete this.config.rowlen[rowNoNum];
                }
            }
            if (customHeight != null) {
                if (this.config.customHeight == null) {
                    this.config.customHeight = {};
                }
                this.config.customHeight[rowNoNum] = 1;
            }
            if (this.isInitialCell) {
                var cells = row.getInnerElements("c");
                for (var key in cells) {
                    var cell = cells[key];
                    var cellValue = new FortuneSheetCelldata(cell, this.styles, this.sharedStrings, this.mergeCells, this.sheetFile, this.readXml);
                    if (cellValue._borderObject != null) {
                        if (this.config.borderInfo == null) {
                            this.config.borderInfo = [];
                        }
                        this.config.borderInfo.push(cellValue._borderObject);
                        delete cellValue._borderObject;
                    }
                    if (cellValue._formulaType == "shared") {
                        if (this.formulaRefList == null) {
                            this.formulaRefList = {};
                        }
                        if (this.formulaRefList[cellValue._formulaSi] == null) {
                            this.formulaRefList[cellValue._formulaSi] = {};
                        }
                        var fv = void 0;
                        if (cellValue.v != null) {
                            fv = cellValue.v.f;
                        }
                        var refValue = {
                            t: cellValue._formulaType,
                            ref: cellValue._fomulaRef,
                            si: cellValue._formulaSi,
                            fv: fv,
                            cellValue: cellValue,
                        };
                        if (cellValue._fomulaRef != null) {
                            this.formulaRefList[cellValue._formulaSi]["mainRef"] = refValue;
                        }
                        else {
                            this.formulaRefList[cellValue._formulaSi][cellValue.r + "_" + cellValue.c] = refValue;
                        }
                    }
                    if (cellValue.v != null &&
                        cellValue.v.f != null) {
                        var formulaCell = {
                            r: cellValue.r,
                            c: cellValue.c,
                        };
                        cellOtherInfo.formulaList["r" + cellValue.r + "c" + cellValue.c] =
                            formulaCell;
                    }
                    this.celldata.push(cellValue);
                }
            }
        }
        return cellOtherInfo;
    };
    FortuneSheet.prototype.generateConfigDataValidations = function () {
        var rows = this.readXml.getElementsByTagName("dataValidations/dataValidation", this.sheetFile);
        var extLst = this.readXml.getElementsByTagName("extLst/ext/x14:dataValidations/x14:dataValidation", this.sheetFile) || [];
        rows = rows.concat(extLst);
        var dataVerification = {};
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var attrList = row.attributeList;
            var formulaValue = row.value;
            var type = getXmlAttibute(attrList, "type", null);
            if (!type) {
                continue;
            }
            var operator = "", sqref = "", sqrefIndexArr = [], valueArr = [];
            var _prohibitInput = getXmlAttibute(attrList, "allowBlank", null) !== "1" ? false : true;
            var formulaReg = new RegExp(/<x14:formula1>|<xm:sqref>/g);
            if (formulaReg.test(formulaValue) && (extLst === null || extLst === void 0 ? void 0 : extLst.length) >= 0) {
                operator = getXmlAttibute(attrList, "operator", null);
                var peelOffData = getPeelOffX14(formulaValue);
                sqref = peelOffData === null || peelOffData === void 0 ? void 0 : peelOffData.sqref;
                sqrefIndexArr = getMultiSequenceToNum(sqref);
                valueArr = getMultiFormulaValue(peelOffData === null || peelOffData === void 0 ? void 0 : peelOffData.formula);
            }
            else {
                operator = getXmlAttibute(attrList, "operator", null);
                sqref = getXmlAttibute(attrList, "sqref", null);
                sqrefIndexArr = getMultiSequenceToNum(sqref);
                valueArr = getMultiFormulaValue(formulaValue);
            }
            var _type = DATA_VERIFICATION_MAP[type];
            var _type2 = null;
            var _value1 = (valueArr === null || valueArr === void 0 ? void 0 : valueArr.length) >= 1 ? valueArr[0] : "";
            var _value2 = (valueArr === null || valueArr === void 0 ? void 0 : valueArr.length) === 2 ? valueArr[1] : "";
            var _hint = getXmlAttibute(attrList, "prompt", null);
            var _hintShow = _hint ? true : false;
            var matchType = COMMON_TYPE2.includes(_type) ? "common" : _type;
            _type2 = operator
                ? DATA_VERIFICATION_TYPE2_MAP[matchType][operator]
                : "bw";
            if (_type === "text_content" &&
                ((_value1 === null || _value1 === void 0 ? void 0 : _value1.includes("LEN")) || (_value1 === null || _value1 === void 0 ? void 0 : _value1.includes("len"))) &&
                (_value1 === null || _value1 === void 0 ? void 0 : _value1.includes("=11"))) {
                _type = "validity";
                _type2 = "phone";
            }
            if (_type === "date") {
                var D1900 = new Date(1899, 11, 30, 0, 0, 0);
                _value1 = dayjs(D1900)
                    .clone()
                    .add(Number(_value1), "day")
                    .format("YYYY-MM-DD");
                _value2 = dayjs(D1900)
                    .clone()
                    .add(Number(_value2), "day")
                    .format("YYYY-MM-DD");
            }
            if (_type === "checkbox" || _type === "dropdown") {
                _type2 = null;
            }
            for (var _i = 0, sqrefIndexArr_1 = sqrefIndexArr; _i < sqrefIndexArr_1.length; _i++) {
                var ref = sqrefIndexArr_1[_i];
                dataVerification[ref] = {
                    type: _type,
                    type2: _type2,
                    value1: _value1,
                    value2: _value2,
                    checked: false,
                    remote: false,
                    prohibitInput: _prohibitInput,
                    hintShow: _hintShow,
                    hintText: _hint,
                };
            }
        }
        return dataVerification;
    };
    FortuneSheet.prototype.generateConfigHyperlinks = function () {
        var _a;
        var rows = this.readXml.getElementsByTagName("hyperlinks/hyperlink", this.sheetFile);
        var hyperlink = {};
        var _loop_1 = function (i) {
            var row = rows[i];
            var attrList = row.attributeList;
            var ref = getXmlAttibute(attrList, "ref", null), refArr = getMultiSequenceToNum(ref), _display = getXmlAttibute(attrList, "display", null), _address = getXmlAttibute(attrList, "location", null), _tooltip = getXmlAttibute(attrList, "tooltip", null);
            var _type = _address
                ? "internal"
                : "external";
            if (!_address) {
                var rid_1 = attrList["r:id"];
                var sheetFile = this_1.sheetFile;
                var relationshipList = this_1.readXml.getElementsByTagName("Relationships/Relationship", "xl/worksheets/_rels/".concat(sheetFile.replace(worksheetFilePath, ""), ".rels"));
                var findRid = relationshipList === null || relationshipList === void 0 ? void 0 : relationshipList.find(function (e) { return e.attributeList["Id"] === rid_1; });
                if (findRid) {
                    _address = findRid.attributeList["Target"];
                    _type = (_a = findRid.attributeList["TargetMode"]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase();
                }
            }
            var addressReg = new RegExp(/^.*!R([\d$])+C([\d$])*$/g);
            if (addressReg.test(_address)) {
                _address = getTransR1C1ToSequence(_address);
            }
            for (var _i = 0, refArr_1 = refArr; _i < refArr_1.length; _i++) {
                var ref_1 = refArr_1[_i];
                hyperlink[ref_1] = {
                    linkAddress: _address,
                    linkTooltip: _tooltip || "",
                    linkType: _type,
                    display: _display || "",
                };
            }
        };
        var this_1 = this;
        for (var i = 0; i < rows.length; i++) {
            _loop_1(i);
        }
        return hyperlink;
    };
    return FortuneSheet;
}(FortuneSheetBase));
export { FortuneSheet };
