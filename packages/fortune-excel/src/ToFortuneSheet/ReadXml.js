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
import { indexedColors } from "../common/constant";
import { LightenDarkenColor } from "../common/method";
var xmloperation = (function () {
    function xmloperation() {
    }
    xmloperation.prototype.getElementsByOneTag = function (tag, file) {
        var readTagReg;
        if (tag.indexOf("|") > -1) {
            var tags = tag.split("|"), tagsRegTxt = "";
            for (var i = 0; i < tags.length; i++) {
                var t = tags[i];
                tagsRegTxt +=
                    "|<" +
                        t +
                        " [^>]+?[^/]>[\\s\\S]*?</" +
                        t +
                        ">|<" +
                        t +
                        " [^>]+?/>|<" +
                        t +
                        ">[\\s\\S]*?</" +
                        t +
                        ">|<" +
                        t +
                        "/>";
            }
            tagsRegTxt = tagsRegTxt.substr(1, tagsRegTxt.length);
            readTagReg = new RegExp(tagsRegTxt, "g");
        }
        else {
            readTagReg = new RegExp("<" +
                tag +
                " [^>]+?[^/]>[\\s\\S]*?</" +
                tag +
                ">|<" +
                tag +
                " [^>]+?/>|<" +
                tag +
                ">[\\s\\S]*?</" +
                tag +
                ">|<" +
                tag +
                "/>", "g");
        }
        var ret = file.match(readTagReg);
        if (ret == null) {
            return [];
        }
        else {
            return ret;
        }
    };
    return xmloperation;
}());
var ReadXml = (function (_super) {
    __extends(ReadXml, _super);
    function ReadXml(files) {
        var _this = _super.call(this) || this;
        _this.originFile = files;
        return _this;
    }
    ReadXml.prototype.getElementsByTagName = function (path, fileName) {
        var file = this.getFileByName(fileName);
        var pathArr = path.split("/"), ret;
        for (var key in pathArr) {
            var path_1 = pathArr[key];
            if (ret == undefined) {
                ret = this.getElementsByOneTag(path_1, file);
            }
            else {
                if (ret instanceof Array) {
                    var items = [];
                    for (var key_1 in ret) {
                        var item = ret[key_1];
                        items = items.concat(this.getElementsByOneTag(path_1, item));
                    }
                    ret = items;
                }
                else {
                    ret = this.getElementsByOneTag(path_1, ret);
                }
            }
        }
        var elements = [];
        for (var i = 0; i < ret.length; i++) {
            var ele = new Element(ret[i]);
            elements.push(ele);
        }
        return elements;
    };
    ReadXml.prototype.getFileByName = function (name) {
        for (var fileKey in this.originFile) {
            if (fileKey.indexOf(name) > -1) {
                return this.originFile[fileKey];
            }
        }
        return "";
    };
    return ReadXml;
}(xmloperation));
export { ReadXml };
var Element = (function (_super) {
    __extends(Element, _super);
    function Element(str) {
        var _this = _super.call(this) || this;
        _this.elementString = str;
        _this.setValue();
        var readAttrReg = new RegExp('[a-zA-Z0-9_:]*?=".*?"', "g");
        var attrList = _this.container.match(readAttrReg);
        _this.attributeList = {};
        if (attrList != null) {
            for (var key in attrList) {
                var attrFull = attrList[key];
                if (attrFull.length == 0) {
                    continue;
                }
                var attrKey = attrFull.substr(0, attrFull.indexOf("="));
                var attrValue = attrFull.substr(attrFull.indexOf("=") + 1);
                if (attrKey == null ||
                    attrValue == null ||
                    attrKey.length == 0 ||
                    attrValue.length == 0) {
                    continue;
                }
                _this.attributeList[attrKey] = attrValue.substr(1, attrValue.length - 2);
            }
        }
        return _this;
    }
    Element.prototype.get = function (name) {
        return this.attributeList[name];
    };
    Element.prototype.getInnerElements = function (tag) {
        var ret = this.getElementsByOneTag(tag, this.elementString);
        var elements = [];
        for (var i = 0; i < ret.length; i++) {
            var ele = new Element(ret[i]);
            elements.push(ele);
        }
        if (elements.length == 0) {
            return null;
        }
        return elements;
    };
    Element.prototype.setValue = function () {
        var str = this.elementString;
        if (str.substr(str.length - 2, 2) == "/>") {
            this.value = "";
            this.container = str;
        }
        else {
            var firstTag = this.getFirstTag();
            var firstTagReg = new RegExp("(<" +
                firstTag +
                " [^>]+?[^/]>)([\\s\\S]*?)</" +
                firstTag +
                ">|(<" +
                firstTag +
                ">)([\\s\\S]*?)</" +
                firstTag +
                ">", "g");
            var result = firstTagReg.exec(str);
            if (result != null) {
                if (result[1] != null) {
                    this.container = result[1];
                    this.value = result[2];
                }
                else {
                    this.container = result[3];
                    this.value = result[4];
                }
            }
        }
    };
    Element.prototype.getFirstTag = function () {
        var str = this.elementString;
        var firstTag = str.substr(0, str.indexOf(" "));
        if (firstTag == "" || firstTag.indexOf(">") > -1) {
            firstTag = str.substr(0, str.indexOf(">"));
        }
        firstTag = firstTag.substr(1, firstTag.length);
        return firstTag;
    };
    return Element;
}(xmloperation));
export { Element };
function combineIndexedColor(indexedColorsInner, indexedColors) {
    var ret = {};
    if (indexedColorsInner == null || indexedColorsInner.length == 0) {
        return indexedColors;
    }
    for (var key in indexedColors) {
        var value = indexedColors[key], kn = parseInt(key);
        var inner = indexedColorsInner[kn];
        if (inner == null) {
            ret[key] = value;
        }
        else {
            var rgb = inner.attributeList.rgb;
            ret[key] = rgb;
        }
    }
    return ret;
}
export function getColor(color, styles, type) {
    if (type === void 0) { type = "g"; }
    var attrList = color.attributeList;
    var clrScheme = styles["clrScheme"];
    var indexedColorsInner = styles["indexedColors"];
    var mruColorsInner = styles["mruColors"];
    var indexedColorsList = combineIndexedColor(indexedColorsInner, indexedColors);
    var indexed = attrList.indexed, rgb = attrList.rgb, theme = attrList.theme, tint = attrList.tint;
    var bg;
    if (indexed != null) {
        var indexedNum = parseInt(indexed);
        bg = indexedColorsList[indexedNum];
        if (bg != null) {
            bg = bg.substring(bg.length - 6, bg.length);
            bg = "#" + bg;
        }
    }
    else if (rgb != null) {
        rgb = rgb.substring(rgb.length - 6, rgb.length);
        bg = "#" + rgb;
    }
    else if (theme != null) {
        var themeNum = parseInt(theme);
        if (themeNum == 0) {
            themeNum = 1;
        }
        else if (themeNum == 1) {
            themeNum = 0;
        }
        else if (themeNum == 2) {
            themeNum = 3;
        }
        else if (themeNum == 3) {
            themeNum = 2;
        }
        var clrSchemeElement = clrScheme[themeNum];
        if (clrSchemeElement != null) {
            var clrs = clrSchemeElement.getInnerElements("a:sysClr|a:srgbClr");
            if (clrs != null) {
                var clr = clrs[0];
                var clrAttrList = clr.attributeList;
                if (clr.container.indexOf("sysClr") > -1) {
                    if (clrAttrList.lastClr != null) {
                        bg = "#" + clrAttrList.lastClr;
                    }
                    else if (clrAttrList.val != null) {
                        bg = "#" + clrAttrList.val;
                    }
                }
                else if (clr.container.indexOf("srgbClr") > -1) {
                    bg = "#" + clrAttrList.val;
                }
            }
        }
    }
    if (tint != null) {
        var tintNum = parseFloat(tint);
        if (bg != null) {
            bg = LightenDarkenColor(bg, tintNum);
        }
    }
    return bg;
}
export function getlineStringAttr(frpr, attr) {
    var attrEle = frpr.getInnerElements(attr), value;
    if (attrEle != null && attrEle.length > 0) {
        if (attr == "b" || attr == "i" || attr == "strike") {
            value = "1";
        }
        else if (attr == "u") {
            var v = attrEle[0].attributeList.val;
            if (v == "double") {
                value = "2";
            }
            else if (v == "singleAccounting") {
                value = "3";
            }
            else if (v == "doubleAccounting") {
                value = "4";
            }
            else {
                value = "1";
            }
        }
        else if (attr == "vertAlign") {
            var v = attrEle[0].attributeList.val;
            if (v == "subscript") {
                value = "1";
            }
            else if (v == "superscript") {
                value = "2";
            }
        }
        else {
            value = attrEle[0].attributeList.val;
        }
    }
    return value;
}
