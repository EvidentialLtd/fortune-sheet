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
import { getColor, getlineStringAttr, } from "./ReadXml";
import { getcellrange, escapeCharacter, isChinese, isJapanese, isKoera, } from "../common/method";
import { ST_CellType, borderTypes, fontFamilys, } from "../common/constant";
import { FortuneSheetborderInfoCellValueStyle, FortuneSheetborderInfoCellForImp, FortuneSheetborderInfoCellValue, FortuneSheetCelldataBase, FortuneSheetCelldataValue, FortuneSheetCellFormat, } from "./FortuneBase";
var FortuneSheetCelldata = (function (_super) {
    __extends(FortuneSheetCelldata, _super);
    function FortuneSheetCelldata(cell, styles, sharedStrings, mergeCells, sheetFile, ReadXml) {
        var _this = _super.call(this) || this;
        _this.cell = cell;
        _this.sheetFile = sheetFile;
        _this.styles = styles;
        _this.sharedStrings = sharedStrings;
        _this.readXml = ReadXml;
        _this.mergeCells = mergeCells;
        var attrList = cell.attributeList;
        var r = attrList.r, s = attrList.s, t = attrList.t;
        var range = getcellrange(r);
        _this.r = range.row[0];
        _this.c = range.column[0];
        _this.v = _this.generateValue(s, t);
        return _this;
    }
    FortuneSheetCelldata.prototype.generateValue = function (s, t) {
        var _this = this;
        var v = this.cell.getInnerElements("v");
        var f = this.cell.getInnerElements("f");
        if (v == null) {
            v = this.cell.getInnerElements("t");
        }
        var cellXfs = this.styles["cellXfs"];
        var cellStyleXfs = this.styles["cellStyleXfs"];
        var cellStyles = this.styles["cellStyles"];
        var fonts = this.styles["fonts"];
        var fills = this.styles["fills"];
        var borders = this.styles["borders"];
        var numfmts = this.styles["numfmts"];
        var clrScheme = this.styles["clrScheme"];
        var sharedStrings = this.sharedStrings;
        var cellValue = new FortuneSheetCelldataValue();
        if (f != null) {
            var formula = f[0], attrList = formula.attributeList;
            var t_1 = attrList.t, ref = attrList.ref, si = attrList.si;
            var formulaValue = f[0].value;
            if (t_1 == "shared") {
                this._fomulaRef = ref;
                this._formulaType = t_1;
                this._formulaSi = si;
            }
            if (ref != null || (formulaValue != null && formulaValue.length > 0)) {
                formulaValue = escapeCharacter(formulaValue);
                cellValue.f = (formulaValue.startsWith('=') ? "" : "=") + formulaValue;
            }
        }
        var familyFont = null;
        var quotePrefix;
        if (s != null) {
            var sNum = parseInt(s);
            var cellXf = cellXfs[sNum];
            var xfId = cellXf.attributeList.xfId;
            var numFmtId = void 0, fontId = void 0, fillId = void 0, borderId = void 0;
            var horizontal = void 0, vertical = void 0, wrapText = void 0, textRotation = void 0, shrinkToFit = void 0, indent = void 0, applyProtection = void 0;
            if (xfId != null) {
                var cellStyleXf = cellStyleXfs[parseInt(xfId)];
                var attrList = cellStyleXf.attributeList;
                var applyNumberFormat_1 = attrList.applyNumberFormat;
                var applyFont_1 = attrList.applyFont;
                var applyFill_1 = attrList.applyFill;
                var applyBorder_1 = attrList.applyBorder;
                var applyAlignment_1 = attrList.applyAlignment;
                applyProtection = attrList.applyProtection;
                quotePrefix = attrList.quotePrefix;
                if (applyNumberFormat_1 != "0" && attrList.numFmtId != null) {
                    numFmtId = attrList.numFmtId;
                }
                if (applyFont_1 != "0" && attrList.fontId != null) {
                    fontId = attrList.fontId;
                }
                if (applyFill_1 != "0" && attrList.fillId != null) {
                    fillId = attrList.fillId;
                }
                if (applyBorder_1 != "0" && attrList.borderId != null) {
                    borderId = attrList.borderId;
                }
                if (applyAlignment_1 != null && applyAlignment_1 != "0") {
                    var alignment = cellStyleXf.getInnerElements("alignment");
                    if (alignment != null) {
                        var attrList_1 = alignment[0].attributeList;
                        if (attrList_1.horizontal != null) {
                            horizontal = attrList_1.horizontal;
                        }
                        if (attrList_1.vertical != null) {
                            vertical = attrList_1.vertical;
                        }
                        if (attrList_1.wrapText != null) {
                            wrapText = attrList_1.wrapText;
                        }
                        if (attrList_1.textRotation != null) {
                            textRotation = attrList_1.textRotation;
                        }
                        if (attrList_1.shrinkToFit != null) {
                            shrinkToFit = attrList_1.shrinkToFit;
                        }
                        if (attrList_1.indent != null) {
                            indent = attrList_1.indent;
                        }
                    }
                }
            }
            var applyNumberFormat = cellXf.attributeList.applyNumberFormat;
            var applyFont = cellXf.attributeList.applyFont;
            var applyFill = cellXf.attributeList.applyFill;
            var applyBorder = cellXf.attributeList.applyBorder;
            var applyAlignment = cellXf.attributeList.applyAlignment;
            if (cellXf.attributeList.applyProtection != null) {
                applyProtection = cellXf.attributeList.applyProtection;
            }
            if (cellXf.attributeList.quotePrefix != null) {
                quotePrefix = cellXf.attributeList.quotePrefix;
            }
            if (applyNumberFormat != "0" && cellXf.attributeList.numFmtId != null) {
                numFmtId = cellXf.attributeList.numFmtId;
            }
            if (applyFont != "0") {
                fontId = cellXf.attributeList.fontId;
            }
            if (applyFill != "0") {
                fillId = cellXf.attributeList.fillId;
            }
            if (applyBorder != "0") {
                borderId = cellXf.attributeList.borderId;
            }
            if (applyAlignment != "0") {
                var alignment = cellXf.getInnerElements("alignment");
                if (alignment != null && alignment.length > 0) {
                    var attrList = alignment[0].attributeList;
                    if (attrList.horizontal != null) {
                        horizontal = attrList.horizontal;
                    }
                    if (attrList.vertical != null) {
                        vertical = attrList.vertical;
                    }
                    if (attrList.wrapText != null) {
                        wrapText = attrList.wrapText;
                    }
                    if (attrList.textRotation != null) {
                        textRotation = attrList.textRotation;
                    }
                    if (attrList.shrinkToFit != null) {
                        shrinkToFit = attrList.shrinkToFit;
                    }
                    if (attrList.indent != null) {
                        indent = attrList.indent;
                    }
                }
            }
            if (numFmtId != undefined) {
                var numf = numfmts[parseInt(numFmtId)];
                var cellFormat = new FortuneSheetCellFormat();
                cellFormat.fa = escapeCharacter(numf);
                cellFormat.t = t || "n";
                cellValue.ct = cellFormat;
            }
            if (fillId != undefined) {
                var fillIdNum = parseInt(fillId);
                var fill = fills[fillIdNum];
                var bg = this.getBackgroundByFill(fill, clrScheme);
                if (bg != null) {
                    cellValue.bg = bg;
                }
            }
            if (fontId != undefined) {
                var fontIdNum = parseInt(fontId);
                var font = fonts[fontIdNum];
                if (font != null) {
                    var sz = font.getInnerElements("sz");
                    var colors = font.getInnerElements("color");
                    var family = font.getInnerElements("name");
                    var familyOverrides = font.getInnerElements("family");
                    var charset = font.getInnerElements("charset");
                    var bolds = font.getInnerElements("b");
                    var italics = font.getInnerElements("i");
                    var strikes = font.getInnerElements("strike");
                    var underlines = font.getInnerElements("u");
                    if (sz != null && sz.length > 0) {
                        var fs = sz[0].attributeList.val;
                        if (fs != null) {
                            cellValue.fs = parseInt(fs);
                        }
                    }
                    if (colors != null && colors.length > 0) {
                        var color = colors[0];
                        var fc = getColor(color, this.styles, "t");
                        if (fc != null) {
                            cellValue.fc = fc;
                        }
                    }
                    if (familyOverrides != null && familyOverrides.length > 0) {
                        var val = familyOverrides[0].attributeList.val;
                        if (val != null) {
                            familyFont = fontFamilys[val];
                        }
                    }
                    if (family != null && family.length > 0) {
                        var val = family[0].attributeList.val;
                        if (val != null) {
                            cellValue.ff = val;
                        }
                    }
                    if (bolds != null && bolds.length > 0) {
                        var bold = bolds[0].attributeList.val;
                        if (bold == "0") {
                            cellValue.bl = 0;
                        }
                        else {
                            cellValue.bl = 1;
                        }
                    }
                    if (italics != null && italics.length > 0) {
                        var italic = italics[0].attributeList.val;
                        if (italic == "0") {
                            cellValue.it = 0;
                        }
                        else {
                            cellValue.it = 1;
                        }
                    }
                    if (strikes != null && strikes.length > 0) {
                        var strike = strikes[0].attributeList.val;
                        if (strike == "0") {
                            cellValue.cl = 0;
                        }
                        else {
                            cellValue.cl = 1;
                        }
                    }
                    if (underlines != null && underlines.length > 0) {
                        var underline = underlines[0].attributeList.val;
                        if (underline == "single") {
                            cellValue.un = 1;
                        }
                        else if (underline == "double") {
                            cellValue.un = 2;
                        }
                        else if (underline == "singleAccounting") {
                            cellValue.un = 3;
                        }
                        else if (underline == "doubleAccounting") {
                            cellValue.un = 4;
                        }
                        else {
                            cellValue.un = 0;
                        }
                    }
                }
            }
            if (horizontal != undefined) {
                if (horizontal == "center") {
                    cellValue.ht = 0;
                }
                else if (horizontal == "centerContinuous") {
                    cellValue.ht = 0;
                }
                else if (horizontal == "left") {
                    cellValue.ht = 1;
                }
                else if (horizontal == "right") {
                    cellValue.ht = 2;
                }
                else if (horizontal == "distributed") {
                    cellValue.ht = 0;
                }
                else if (horizontal == "fill") {
                    cellValue.ht = 1;
                }
                else if (horizontal == "general") {
                    cellValue.ht = 1;
                }
                else if (horizontal == "justify") {
                    cellValue.ht = 0;
                }
                else {
                    cellValue.ht = 1;
                }
            }
            if (vertical != undefined) {
                if (vertical == "bottom") {
                    cellValue.vt = 2;
                }
                else if (vertical == "center") {
                    cellValue.vt = 0;
                }
                else if (vertical == "distributed") {
                    cellValue.vt = 0;
                }
                else if (vertical == "justify") {
                    cellValue.vt = 0;
                }
                else if (vertical == "top") {
                    cellValue.vt = 1;
                }
                else {
                    cellValue.vt = 1;
                }
            }
            else {
                cellValue.vt = 2;
            }
            if (wrapText != undefined) {
                if (wrapText == "1") {
                    cellValue.tb = 2;
                }
                else {
                    cellValue.tb = 1;
                }
            }
            else {
                cellValue.tb = 1;
            }
            if (textRotation != undefined) {
                if (textRotation == "255") {
                    cellValue.tr = 3;
                }
                else {
                    cellValue.tr = 0;
                    cellValue.rt = parseInt(textRotation);
                }
            }
            if (shrinkToFit != undefined) {
            }
            if (indent != undefined) {
            }
            if (borderId != undefined) {
                var borderIdNum = parseInt(borderId);
                var border = borders[borderIdNum];
                var borderObject = new FortuneSheetborderInfoCellForImp();
                borderObject.rangeType = "cell";
                var borderCellValue = new FortuneSheetborderInfoCellValue();
                borderCellValue.row_index = this.r;
                borderCellValue.col_index = this.c;
                var lefts = border.getInnerElements("left");
                var rights = border.getInnerElements("right");
                var tops = border.getInnerElements("top");
                var bottoms = border.getInnerElements("bottom");
                var diagonals = border.getInnerElements("diagonal");
                var starts = border.getInnerElements("start");
                var ends = border.getInnerElements("end");
                var left = this.getBorderInfo(lefts);
                var right = this.getBorderInfo(rights);
                var top_1 = this.getBorderInfo(tops);
                var bottom = this.getBorderInfo(bottoms);
                var diagonal = this.getBorderInfo(diagonals);
                var start = this.getBorderInfo(starts);
                var end = this.getBorderInfo(ends);
                var isAdd = false;
                if (start != null && start.color != null) {
                    borderCellValue.l = start;
                    isAdd = true;
                }
                if (end != null && end.color != null) {
                    borderCellValue.r = end;
                    isAdd = true;
                }
                if (left != null && left.color != null) {
                    borderCellValue.l = left;
                    isAdd = true;
                }
                if (right != null && right.color != null) {
                    borderCellValue.r = right;
                    isAdd = true;
                }
                if (top_1 != null && top_1.color != null) {
                    borderCellValue.t = top_1;
                    isAdd = true;
                }
                if (bottom != null && bottom.color != null) {
                    borderCellValue.b = bottom;
                    isAdd = true;
                }
                if (isAdd) {
                    borderObject.value = borderCellValue;
                    this._borderObject = borderObject;
                }
            }
        }
        else {
            cellValue.tb = 1;
        }
        if (v != null) {
            var value = v[0].value;
            if (/&#\d+;/.test(value)) {
                value = this.htmlDecode(value);
            }
            if (t == ST_CellType["SharedString"]) {
                var siIndex = parseInt(v[0].value);
                var sharedSI = sharedStrings[siIndex];
                var rFlag = sharedSI.getInnerElements("r");
                if (rFlag == null) {
                    var tFlag = sharedSI.getInnerElements("t");
                    if (tFlag != null) {
                        var text_1 = "";
                        tFlag.forEach(function (t) {
                            text_1 += t.value;
                        });
                        text_1 = escapeCharacter(text_1);
                        if (familyFont == "Roman" && text_1.length > 0) {
                            var textArray = text_1.split("");
                            var preWordType = null, wordText = "", preWholef = null;
                            var wholef = "Times New Roman";
                            if (cellValue.ff != null) {
                                wholef = cellValue.ff;
                            }
                            var cellFormat = cellValue.ct;
                            if (cellFormat == null) {
                                cellFormat = new FortuneSheetCellFormat();
                            }
                            if (cellFormat.s == null) {
                                cellFormat.s = [];
                            }
                            for (var i = 0; i < textArray.length; i++) {
                                var w = textArray[i];
                                var type = null, ff = wholef;
                                if (isChinese(w)) {
                                    type = "c";
                                    ff = "宋体";
                                }
                                else if (isJapanese(w)) {
                                    type = "j";
                                    ff = "Yu Gothic";
                                }
                                else if (isKoera(w)) {
                                    type = "k";
                                    ff = "Malgun Gothic";
                                }
                                else {
                                    type = "e";
                                }
                                if ((type != preWordType && preWordType != null) ||
                                    i == textArray.length - 1) {
                                    var InlineString = {};
                                    InlineString.ff = preWholef;
                                    if (cellValue.fc != null) {
                                        InlineString.fc = cellValue.fc;
                                    }
                                    if (cellValue.fs != null) {
                                        InlineString.fs = cellValue.fs;
                                    }
                                    if (cellValue.cl != null) {
                                        InlineString.cl = cellValue.cl;
                                    }
                                    if (cellValue.un != null) {
                                        InlineString.un = cellValue.un;
                                    }
                                    if (cellValue.bl != null) {
                                        InlineString.bl = cellValue.bl;
                                    }
                                    if (cellValue.it != null) {
                                        InlineString.it = cellValue.it;
                                    }
                                    if (i == textArray.length - 1) {
                                        if (type == preWordType) {
                                            InlineString.ff = ff;
                                            InlineString.v = wordText + w;
                                        }
                                        else {
                                            InlineString.ff = preWholef;
                                            InlineString.v = wordText;
                                            cellFormat.s.push(InlineString);
                                            var InlineStringLast = {};
                                            InlineStringLast.ff = ff;
                                            InlineStringLast.v = w;
                                            if (cellValue.fc != null) {
                                                InlineStringLast.fc = cellValue.fc;
                                            }
                                            if (cellValue.fs != null) {
                                                InlineStringLast.fs = cellValue.fs;
                                            }
                                            if (cellValue.cl != null) {
                                                InlineStringLast.cl = cellValue.cl;
                                            }
                                            if (cellValue.un != null) {
                                                InlineStringLast.un = cellValue.un;
                                            }
                                            if (cellValue.bl != null) {
                                                InlineStringLast.bl = cellValue.bl;
                                            }
                                            if (cellValue.it != null) {
                                                InlineStringLast.it = cellValue.it;
                                            }
                                            cellFormat.s.push(InlineStringLast);
                                            break;
                                        }
                                    }
                                    else {
                                        InlineString.v = wordText;
                                    }
                                    cellFormat.s.push(InlineString);
                                    wordText = w;
                                }
                                else {
                                    wordText += w;
                                }
                                preWordType = type;
                                preWholef = ff;
                            }
                            cellFormat.t = "inlineStr";
                            cellValue.ct = cellFormat;
                        }
                        else {
                            text_1 = this.replaceSpecialWrap(text_1);
                            if (text_1.indexOf("\r\n") > -1 || text_1.indexOf("\n") > -1) {
                                var InlineString = {};
                                InlineString.v = text_1;
                                var cellFormat = cellValue.ct;
                                if (cellFormat == null) {
                                    cellFormat = new FortuneSheetCellFormat();
                                }
                                if (cellValue.ff != null) {
                                    InlineString.ff = cellValue.ff;
                                }
                                if (cellValue.fc != null) {
                                    InlineString.fc = cellValue.fc;
                                }
                                if (cellValue.fs != null) {
                                    InlineString.fs = cellValue.fs;
                                }
                                if (cellValue.cl != null) {
                                    InlineString.cl = cellValue.cl;
                                }
                                if (cellValue.un != null) {
                                    InlineString.un = cellValue.un;
                                }
                                if (cellValue.bl != null) {
                                    InlineString.bl = cellValue.bl;
                                }
                                if (cellValue.it != null) {
                                    InlineString.it = cellValue.it;
                                }
                                cellFormat.t = "inlineStr";
                                cellFormat.s = [InlineString];
                                cellValue.ct = cellFormat;
                            }
                            else {
                                cellValue.v = text_1;
                                quotePrefix = "1";
                            }
                        }
                    }
                }
                else {
                    var styles_1 = [];
                    rFlag.forEach(function (r) {
                        var tFlag = r.getInnerElements("t");
                        var rPr = r.getInnerElements("rPr");
                        var InlineString = {};
                        if (tFlag != null && tFlag.length > 0) {
                            var text = tFlag[0].value;
                            text = _this.replaceSpecialWrap(text);
                            text = escapeCharacter(text);
                            InlineString.v = text;
                        }
                        if (rPr != null && rPr.length > 0) {
                            var frpr = rPr[0];
                            var sz = getlineStringAttr(frpr, "sz"), rFont = getlineStringAttr(frpr, "rFont"), family = getlineStringAttr(frpr, "family"), charset = getlineStringAttr(frpr, "charset"), scheme = getlineStringAttr(frpr, "scheme"), b = getlineStringAttr(frpr, "b"), i = getlineStringAttr(frpr, "i"), u = getlineStringAttr(frpr, "u"), strike = getlineStringAttr(frpr, "strike"), vertAlign = getlineStringAttr(frpr, "vertAlign"), color = void 0;
                            var cEle = frpr.getInnerElements("color");
                            if (cEle != null && cEle.length > 0) {
                                color = getColor(cEle[0], _this.styles, "t");
                            }
                            var ff = void 0;
                            if (rFont != null) {
                                ff = rFont;
                            }
                            if (ff != null) {
                                InlineString.ff = ff;
                            }
                            else if (cellValue.ff != null) {
                                InlineString.ff = cellValue.ff;
                            }
                            if (color != null) {
                                InlineString.fc = color;
                            }
                            else if (cellValue.fc != null) {
                                InlineString.fc = cellValue.fc;
                            }
                            if (sz != null) {
                                InlineString.fs = parseInt(sz);
                            }
                            else if (cellValue.fs != null) {
                                InlineString.fs = cellValue.fs;
                            }
                            if (strike != null) {
                                InlineString.cl = parseInt(strike);
                            }
                            else if (cellValue.cl != null) {
                                InlineString.cl = cellValue.cl;
                            }
                            if (u != null) {
                                InlineString.un = parseInt(u);
                            }
                            else if (cellValue.un != null) {
                                InlineString.un = cellValue.un;
                            }
                            if (b != null) {
                                InlineString.bl = parseInt(b);
                            }
                            else if (cellValue.bl != null) {
                                InlineString.bl = cellValue.bl;
                            }
                            if (i != null) {
                                InlineString.it = parseInt(i);
                            }
                            else if (cellValue.it != null) {
                                InlineString.it = cellValue.it;
                            }
                            if (vertAlign != null) {
                                InlineString.va = parseInt(vertAlign);
                            }
                        }
                        else {
                            if (InlineString.ff == null && cellValue.ff != null) {
                                InlineString.ff = cellValue.ff;
                            }
                            if (InlineString.fc == null && cellValue.fc != null) {
                                InlineString.fc = cellValue.fc;
                            }
                            if (InlineString.fs == null && cellValue.fs != null) {
                                InlineString.fs = cellValue.fs;
                            }
                            if (InlineString.cl == null && cellValue.cl != null) {
                                InlineString.cl = cellValue.cl;
                            }
                            if (InlineString.un == null && cellValue.un != null) {
                                InlineString.un = cellValue.un;
                            }
                            if (InlineString.bl == null && cellValue.bl != null) {
                                InlineString.bl = cellValue.bl;
                            }
                            if (InlineString.it == null && cellValue.it != null) {
                                InlineString.it = cellValue.it;
                            }
                        }
                        styles_1.push(InlineString);
                    });
                    var cellFormat = cellValue.ct;
                    if (cellFormat == null) {
                        cellFormat = new FortuneSheetCellFormat();
                    }
                    cellFormat.t = "inlineStr";
                    cellFormat.s = styles_1;
                    cellValue.ct = cellFormat;
                }
            }
            else if (t == ST_CellType["InlineString"] && v != null) {
                cellValue.v = "'" + value;
            }
            else {
                value = escapeCharacter(value);
                cellValue.v = value;
            }
        }
        if (quotePrefix != null) {
            cellValue.qp = parseInt(quotePrefix);
        }
        return cellValue;
    };
    FortuneSheetCelldata.prototype.replaceSpecialWrap = function (text) {
        text = text
            .replace(/_x000D_/g, "")
            .replace(/&#13;&#10;/g, "\r\n")
            .replace(/&#13;/g, "\r")
            .replace(/&#10;/g, "\n");
        return text;
    };
    FortuneSheetCelldata.prototype.getBackgroundByFill = function (fill, clrScheme) {
        var patternFills = fill.getInnerElements("patternFill");
        if (patternFills != null) {
            var patternFill = patternFills[0];
            var fgColors = patternFill.getInnerElements("fgColor");
            var bgColors = patternFill.getInnerElements("bgColor");
            var fg = void 0, bg = void 0;
            if (fgColors != null) {
                var fgColor = fgColors[0];
                fg = getColor(fgColor, this.styles);
            }
            if (bgColors != null) {
                var bgColor = bgColors[0];
                bg = getColor(bgColor, this.styles);
            }
            if (fg != null) {
                return fg;
            }
            else if (bg != null) {
                return bg;
            }
        }
        else {
            var gradientfills = fill.getInnerElements("gradientFill");
            if (gradientfills != null) {
                return null;
            }
        }
    };
    FortuneSheetCelldata.prototype.getBorderInfo = function (borders) {
        if (borders == null) {
            return null;
        }
        var border = borders[0], attrList = border.attributeList;
        var clrScheme = this.styles["clrScheme"];
        var style = attrList.style;
        if (style == null || style == "none") {
            return null;
        }
        var colors = border.getInnerElements("color");
        var colorRet = "#000000";
        if (colors != null) {
            var color = colors[0];
            colorRet = getColor(color, this.styles, "b");
            if (colorRet == null) {
                colorRet = "#000000";
            }
        }
        var ret = new FortuneSheetborderInfoCellValueStyle();
        ret.style = borderTypes[style];
        ret.color = colorRet;
        return ret;
    };
    FortuneSheetCelldata.prototype.htmlDecode = function (str) {
        return str.replace(/&#(x)?([^&]{1,5});/g, function ($, $1, $2) {
            return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
        });
    };
    return FortuneSheetCelldata;
}(FortuneSheetCelldataBase));
export { FortuneSheetCelldata };
