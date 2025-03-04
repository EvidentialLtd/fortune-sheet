import { columeHeader_word, columeHeader_word_index } from "./constant";
export function getRangetxt(range, sheettxt) {
    var row0 = range["row"][0], row1 = range["row"][1];
    var column0 = range["column"][0], column1 = range["column"][1];
    if (row0 == null && row1 == null) {
        return sheettxt + chatatABC(column0) + ":" + chatatABC(column1);
    }
    else if (column0 == null && column1 == null) {
        return sheettxt + (row0 + 1) + ":" + (row1 + 1);
    }
    else {
        if (column0 == column1 && row0 == row1) {
            return sheettxt + chatatABC(column0) + (row0 + 1);
        }
        else {
            return (sheettxt +
                chatatABC(column0) +
                (row0 + 1) +
                ":" +
                chatatABC(column1) +
                (row1 + 1));
        }
    }
}
export function getcellrange(txt, sheets, sheetId) {
    if (sheets === void 0) { sheets = {}; }
    if (sheetId === void 0) { sheetId = "1"; }
    var val = txt.split("!");
    var sheettxt = "", rangetxt = "", sheetIndex = -1;
    if (val.length > 1) {
        sheettxt = val[0];
        rangetxt = val[1];
        var si = sheets[sheettxt];
        if (si == null) {
            sheetIndex = parseInt(sheetId);
        }
        else {
            sheetIndex = parseInt(si);
        }
    }
    else {
        sheetIndex = parseInt(sheetId);
        rangetxt = val[0];
    }
    if (rangetxt.indexOf(":") == -1) {
        var row = parseInt(rangetxt.replace(/[^0-9]/g, "")) - 1;
        var col = ABCatNum(rangetxt.replace(/[^A-Za-z]/g, ""));
        if (!isNaN(row) && !isNaN(col)) {
            return {
                row: [row, row],
                column: [col, col],
                sheetIndex: sheetIndex,
            };
        }
        else {
            return null;
        }
    }
    else {
        var rangetxtArray = rangetxt.split(":");
        var row = [], col = [];
        row[0] = parseInt(rangetxtArray[0].replace(/[^0-9]/g, "")) - 1;
        row[1] = parseInt(rangetxtArray[1].replace(/[^0-9]/g, "")) - 1;
        if (row[0] > row[1]) {
            return null;
        }
        col[0] = ABCatNum(rangetxtArray[0].replace(/[^A-Za-z]/g, ""));
        col[1] = ABCatNum(rangetxtArray[1].replace(/[^A-Za-z]/g, ""));
        if (col[0] > col[1]) {
            return null;
        }
        return {
            row: row,
            column: col,
            sheetIndex: sheetIndex,
        };
    }
}
function ABCatNum(abc) {
    abc = abc.toUpperCase();
    var abc_len = abc.length;
    if (abc_len == 0) {
        return NaN;
    }
    var abc_array = abc.split("");
    var wordlen = columeHeader_word.length;
    var ret = 0;
    for (var i = abc_len - 1; i >= 0; i--) {
        if (i == abc_len - 1) {
            ret += columeHeader_word_index[abc_array[i]];
        }
        else {
            ret +=
                Math.pow(wordlen, abc_len - i - 1) *
                    (columeHeader_word_index[abc_array[i]] + 1);
        }
    }
    return ret;
}
function chatatABC(index) {
    var wordlen = columeHeader_word.length;
    if (index < wordlen) {
        return columeHeader_word[index];
    }
    else {
        var last = 0, pre = 0, ret = "";
        var i = 1, n = 0;
        while (index >= (wordlen / (wordlen - 1)) * (Math.pow(wordlen, i++) - 1)) {
            n = i;
        }
        var index_ab = index - (wordlen / (wordlen - 1)) * (Math.pow(wordlen, n - 1) - 1);
        last = index_ab + 1;
        for (var x = n; x > 0; x--) {
            var last1 = last, x1 = x;
            if (x == 1) {
                last1 = last1 % wordlen;
                if (last1 == 0) {
                    last1 = 26;
                }
                return ret + columeHeader_word[last1 - 1];
            }
            last1 = Math.ceil(last1 / Math.pow(wordlen, x - 1));
            ret += columeHeader_word[last1 - 1];
            if (x > 1) {
                last = last - (last1 - 1) * wordlen;
            }
        }
    }
}
export function getptToPxRatioByDPI() {
    return 72 / 96;
}
export function getPxByEMUs(emus) {
    if (emus == null) {
        return 0;
    }
    var inch = emus / 914400;
    var pt = inch * 72;
    var px = pt / getptToPxRatioByDPI();
    return px;
}
export function getXmlAttibute(dom, attr, d) {
    var value = dom[attr];
    value = value == null ? d : value;
    return value;
}
export function getColumnWidthPixel(columnWidth) {
    var pix = Math.round((columnWidth - 0.83) * 8 + 5);
    return pix;
}
export function getRowHeightPixel(rowHeight) {
    var pix = Math.round(rowHeight / getptToPxRatioByDPI());
    return pix;
}
export function LightenDarkenColor(sixColor, tint) {
    var hex = sixColor.substring(sixColor.length - 6, sixColor.length);
    var rgbArray = hexToRgbArray("#" + hex);
    var hslArray = rgbToHsl(rgbArray[0], rgbArray[1], rgbArray[2]);
    if (tint > 0) {
        hslArray[2] = hslArray[2] * (1.0 - tint) + tint;
    }
    else if (tint < 0) {
        hslArray[2] = hslArray[2] * (1.0 + tint);
    }
    else {
        return "#" + hex;
    }
    var newRgbArray = hslToRgb(hslArray[0], hslArray[1], hslArray[2]);
    return rgbToHex("RGB(" + newRgbArray.join(",") + ")");
}
function rgbToHex(rgb) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(rgb)) {
        var aColor = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = rgb;
        }
        return strHex;
    }
    else if (reg.test(rgb)) {
        var aNum = rgb.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return rgb;
        }
        else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += aNum[i] + aNum[i];
            }
            return numHex;
        }
    }
    return rgb;
}
function hexToRgb(hex) {
    var sColor = hex.toLowerCase();
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }
    return sColor;
}
function hexToRgbArray(hex) {
    var sColor = hex.toLowerCase();
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return sColorChange;
    }
    return null;
}
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l;
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function rgbToHsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
export function generateRandomIndex(prefix) {
    if (prefix == null) {
        prefix = "Sheet";
    }
    var userAgent = window.navigator.userAgent
        .replace(/[^a-zA-Z0-9]/g, "")
        .split("");
    var mid = "";
    for (var i = 0; i < 5; i++) {
        mid += userAgent[Math.round(Math.random() * (userAgent.length - 1))];
    }
    var time = new Date().getTime();
    return prefix + "_" + mid + "_" + time;
}
export function escapeCharacter(str) {
    if (str == null || str.length == 0) {
        return str;
    }
    return str
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/&apos;/g, "'")
        .replace(/&iexcl;/g, "¡")
        .replace(/&cent;/g, "¢")
        .replace(/&pound;/g, "£")
        .replace(/&curren;/g, "¤")
        .replace(/&yen;/g, "¥")
        .replace(/&brvbar;/g, "¦")
        .replace(/&sect;/g, "§")
        .replace(/&uml;/g, "¨")
        .replace(/&copy;/g, "©")
        .replace(/&ordf;/g, "ª")
        .replace(/&laquo;/g, "«")
        .replace(/&not;/g, "¬")
        .replace(/&shy;/g, "­")
        .replace(/&reg;/g, "®")
        .replace(/&macr;/g, "¯")
        .replace(/&deg;/g, "°")
        .replace(/&plusmn;/g, "±")
        .replace(/&sup2;/g, "²")
        .replace(/&sup3;/g, "³")
        .replace(/&acute;/g, "´")
        .replace(/&micro;/g, "µ")
        .replace(/&para;/g, "¶")
        .replace(/&middot;/g, "·")
        .replace(/&cedil;/g, "¸")
        .replace(/&sup1;/g, "¹")
        .replace(/&ordm;/g, "º")
        .replace(/&raquo;/g, "»")
        .replace(/&frac14;/g, "¼")
        .replace(/&frac12;/g, "½")
        .replace(/&frac34;/g, "¾")
        .replace(/&iquest;/g, "¿")
        .replace(/&times;/g, "×")
        .replace(/&divide;/g, "÷")
        .replace(/&Agrave;/g, "À")
        .replace(/&Aacute;/g, "Á")
        .replace(/&Acirc;/g, "Â")
        .replace(/&Atilde;/g, "Ã")
        .replace(/&Auml;/g, "Ä")
        .replace(/&Aring;/g, "Å")
        .replace(/&AElig;/g, "Æ")
        .replace(/&Ccedil;/g, "Ç")
        .replace(/&Egrave;/g, "È")
        .replace(/&Eacute;/g, "É")
        .replace(/&Ecirc;/g, "Ê")
        .replace(/&Euml;/g, "Ë")
        .replace(/&Igrave;/g, "Ì")
        .replace(/&Iacute;/g, "Í")
        .replace(/&Icirc;/g, "Î")
        .replace(/&Iuml;/g, "Ï")
        .replace(/&ETH;/g, "Ð")
        .replace(/&Ntilde;/g, "Ñ")
        .replace(/&Ograve;/g, "Ò")
        .replace(/&Oacute;/g, "Ó")
        .replace(/&Ocirc;/g, "Ô")
        .replace(/&Otilde;/g, "Õ")
        .replace(/&Ouml;/g, "Ö")
        .replace(/&Oslash;/g, "Ø")
        .replace(/&Ugrave;/g, "Ù")
        .replace(/&Uacute;/g, "Ú")
        .replace(/&Ucirc;/g, "Û")
        .replace(/&Uuml;/g, "Ü")
        .replace(/&Yacute;/g, "Ý")
        .replace(/&THORN;/g, "Þ")
        .replace(/&szlig;/g, "ß")
        .replace(/&agrave;/g, "à")
        .replace(/&aacute;/g, "á")
        .replace(/&acirc;/g, "â")
        .replace(/&atilde;/g, "ã")
        .replace(/&auml;/g, "ä")
        .replace(/&aring;/g, "å")
        .replace(/&aelig;/g, "æ")
        .replace(/&ccedil;/g, "ç")
        .replace(/&egrave;/g, "è")
        .replace(/&eacute;/g, "é")
        .replace(/&ecirc;/g, "ê")
        .replace(/&euml;/g, "ë")
        .replace(/&igrave;/g, "ì")
        .replace(/&iacute;/g, "í")
        .replace(/&icirc;/g, "î")
        .replace(/&iuml;/g, "ï")
        .replace(/&eth;/g, "ð")
        .replace(/&ntilde;/g, "ñ")
        .replace(/&ograve;/g, "ò")
        .replace(/&oacute;/g, "ó")
        .replace(/&ocirc;/g, "ô")
        .replace(/&otilde;/g, "õ")
        .replace(/&ouml;/g, "ö")
        .replace(/&oslash;/g, "ø")
        .replace(/&ugrave;/g, "ù")
        .replace(/&uacute;/g, "ú")
        .replace(/&ucirc;/g, "û")
        .replace(/&uuml;/g, "ü")
        .replace(/&yacute;/g, "ý")
        .replace(/&thorn;/g, "þ")
        .replace(/&yuml;/g, "ÿ");
}
var fromulaRef = (function () {
    function fromulaRef() {
    }
    fromulaRef.trim = function (str) {
        if (str == null) {
            str = "";
        }
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };
    fromulaRef.functionCopy = function (txt, mode, step) {
        var _this = this;
        if (_this.operatorjson == null) {
            var arr = _this.operator.split("|"), op = {};
            for (var i_1 = 0; i_1 < arr.length; i_1++) {
                op[arr[i_1].toString()] = 1;
            }
            _this.operatorjson = op;
        }
        if (mode == null) {
            mode = "down";
        }
        if (step == null) {
            step = 1;
        }
        if (txt.substr(0, 1) == "=") {
            txt = txt.substr(1);
        }
        var funcstack = txt.split("");
        var i = 0, str = "", function_str = "", ispassby = true;
        var matchConfig = {
            bracket: 0,
            comma: 0,
            squote: 0,
            dquote: 0,
        };
        while (i < funcstack.length) {
            var s = funcstack[i];
            if (s == "(" && matchConfig.dquote == 0) {
                matchConfig.bracket += 1;
                if (str.length > 0) {
                    function_str += str + "(";
                }
                else {
                    function_str += "(";
                }
                str = "";
            }
            else if (s == ")" && matchConfig.dquote == 0) {
                matchConfig.bracket -= 1;
                function_str += _this.functionCopy(str, mode, step) + ")";
                str = "";
            }
            else if (s == '"' && matchConfig.squote == 0) {
                if (matchConfig.dquote > 0) {
                    function_str += str + '"';
                    matchConfig.dquote -= 1;
                    str = "";
                }
                else {
                    matchConfig.dquote += 1;
                    str += '"';
                }
            }
            else if (s == "," && matchConfig.dquote == 0) {
                function_str += _this.functionCopy(str, mode, step) + ",";
                str = "";
            }
            else if (s == "&" && matchConfig.dquote == 0) {
                if (str.length > 0) {
                    function_str += _this.functionCopy(str, mode, step) + "&";
                    str = "";
                }
                else {
                    function_str += "&";
                }
            }
            else if (s in _this.operatorjson && matchConfig.dquote == 0) {
                var s_next = "";
                if (i + 1 < funcstack.length) {
                    s_next = funcstack[i + 1];
                }
                var p = i - 1, s_pre = null;
                if (p >= 0) {
                    do {
                        s_pre = funcstack[p--];
                    } while (p >= 0 && s_pre == " ");
                }
                if (s + s_next in _this.operatorjson) {
                    if (str.length > 0) {
                        function_str += _this.functionCopy(str, mode, step) + s + s_next;
                        str = "";
                    }
                    else {
                        function_str += s + s_next;
                    }
                    i++;
                }
                else if (!/[^0-9]/.test(s_next) &&
                    s == "-" &&
                    (s_pre == "(" ||
                        s_pre == null ||
                        s_pre == "," ||
                        s_pre == " " ||
                        s_pre in _this.operatorjson)) {
                    str += s;
                }
                else {
                    if (str.length > 0) {
                        function_str += _this.functionCopy(str, mode, step) + s;
                        str = "";
                    }
                    else {
                        function_str += s;
                    }
                }
            }
            else {
                str += s;
            }
            if (i == funcstack.length - 1) {
                if (_this.iscelldata(_this.trim(str))) {
                    if (mode == "down") {
                        function_str += _this.downparam(_this.trim(str), step);
                    }
                    else if (mode == "up") {
                        function_str += _this.upparam(_this.trim(str), step);
                    }
                    else if (mode == "left") {
                        function_str += _this.leftparam(_this.trim(str), step);
                    }
                    else if (mode == "right") {
                        function_str += _this.rightparam(_this.trim(str), step);
                    }
                }
                else {
                    function_str += _this.trim(str);
                }
            }
            i++;
        }
        return function_str;
    };
    fromulaRef.downparam = function (txt, step) {
        return this.updateparam("d", txt, step);
    };
    fromulaRef.upparam = function (txt, step) {
        return this.updateparam("u", txt, step);
    };
    fromulaRef.leftparam = function (txt, step) {
        return this.updateparam("l", txt, step);
    };
    fromulaRef.rightparam = function (txt, step) {
        return this.updateparam("r", txt, step);
    };
    fromulaRef.updateparam = function (orient, txt, step) {
        var _this = this;
        var val = txt.split("!"), rangetxt, prefix = "";
        if (val.length > 1) {
            rangetxt = val[1];
            prefix = val[0] + "!";
        }
        else {
            rangetxt = val[0];
        }
        if (rangetxt.indexOf(":") == -1) {
            var row = parseInt(rangetxt.replace(/[^0-9]/g, ""));
            var col = ABCatNum(rangetxt.replace(/[^A-Za-z]/g, ""));
            var freezonFuc = _this.isfreezonFuc(rangetxt);
            var $row = freezonFuc[0] ? "$" : "", $col = freezonFuc[1] ? "$" : "";
            if (orient == "u" && !freezonFuc[0]) {
                row -= step;
            }
            else if (orient == "r" && !freezonFuc[1]) {
                col += step;
            }
            else if (orient == "l" && !freezonFuc[1]) {
                col -= step;
            }
            else if (!freezonFuc[0]) {
                row += step;
            }
            if (row < 0 || col < 0) {
                return _this.error.r;
            }
            if (!isNaN(row) && !isNaN(col)) {
                return prefix + $col + chatatABC(col) + $row + row;
            }
            else if (!isNaN(row)) {
                return prefix + $row + row;
            }
            else if (!isNaN(col)) {
                return prefix + $col + chatatABC(col);
            }
            else {
                return txt;
            }
        }
        else {
            rangetxt = rangetxt.split(":");
            var row = [], col = [];
            row[0] = parseInt(rangetxt[0].replace(/[^0-9]/g, ""));
            row[1] = parseInt(rangetxt[1].replace(/[^0-9]/g, ""));
            if (row[0] > row[1]) {
                return txt;
            }
            col[0] = ABCatNum(rangetxt[0].replace(/[^A-Za-z]/g, ""));
            col[1] = ABCatNum(rangetxt[1].replace(/[^A-Za-z]/g, ""));
            if (col[0] > col[1]) {
                return txt;
            }
            var freezonFuc0 = _this.isfreezonFuc(rangetxt[0]);
            var freezonFuc1 = _this.isfreezonFuc(rangetxt[1]);
            var $row0 = freezonFuc0[0] ? "$" : "", $col0 = freezonFuc0[1] ? "$" : "";
            var $row1 = freezonFuc1[0] ? "$" : "", $col1 = freezonFuc1[1] ? "$" : "";
            if (orient == "u") {
                if (!freezonFuc0[0]) {
                    row[0] -= step;
                }
                if (!freezonFuc1[0]) {
                    row[1] -= step;
                }
            }
            else if (orient == "r") {
                if (!freezonFuc0[1]) {
                    col[0] += step;
                }
                if (!freezonFuc1[1]) {
                    col[1] += step;
                }
            }
            else if (orient == "l") {
                if (!freezonFuc0[1]) {
                    col[0] -= step;
                }
                if (!freezonFuc1[1]) {
                    col[1] -= step;
                }
            }
            else {
                if (!freezonFuc0[0]) {
                    row[0] += step;
                }
                if (!freezonFuc1[0]) {
                    row[1] += step;
                }
            }
            if (row[0] < 0 || col[0] < 0) {
                return _this.error.r;
            }
            if (isNaN(col[0]) && isNaN(col[1])) {
                return prefix + $row0 + row[0] + ":" + $row1 + row[1];
            }
            else if (isNaN(row[0]) && isNaN(row[1])) {
                return (prefix + $col0 + chatatABC(col[0]) + ":" + $col1 + chatatABC(col[1]));
            }
            else {
                return (prefix +
                    $col0 +
                    chatatABC(col[0]) +
                    $row0 +
                    row[0] +
                    ":" +
                    $col1 +
                    chatatABC(col[1]) +
                    $row1 +
                    row[1]);
            }
        }
    };
    fromulaRef.iscelldata = function (txt) {
        var val = txt.split("!"), rangetxt;
        if (val.length > 1) {
            rangetxt = val[1];
        }
        else {
            rangetxt = val[0];
        }
        var reg_cell = /^(([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+))$/g;
        var reg_cellRange = /^(((([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+)))|((([a-zA-Z]+)|([$][a-zA-Z]+))))$/g;
        if (rangetxt.indexOf(":") == -1) {
            var row = parseInt(rangetxt.replace(/[^0-9]/g, "")) - 1;
            var col = ABCatNum(rangetxt.replace(/[^A-Za-z]/g, ""));
            if (!isNaN(row) && !isNaN(col) && rangetxt.toString().match(reg_cell)) {
                return true;
            }
            else if (!isNaN(row)) {
                return false;
            }
            else if (!isNaN(col)) {
                return false;
            }
            else {
                return false;
            }
        }
        else {
            reg_cellRange =
                /^(((([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+)))|((([a-zA-Z]+)|([$][a-zA-Z]+)))|((([0-9]+)|([$][0-9]+s))))$/g;
            rangetxt = rangetxt.split(":");
            var row = [], col = [];
            row[0] = parseInt(rangetxt[0].replace(/[^0-9]/g, "")) - 1;
            row[1] = parseInt(rangetxt[1].replace(/[^0-9]/g, "")) - 1;
            if (row[0] > row[1]) {
                return false;
            }
            col[0] = ABCatNum(rangetxt[0].replace(/[^A-Za-z]/g, ""));
            col[1] = ABCatNum(rangetxt[1].replace(/[^A-Za-z]/g, ""));
            if (col[0] > col[1]) {
                return false;
            }
            if (rangetxt[0].toString().match(reg_cellRange) &&
                rangetxt[1].toString().match(reg_cellRange)) {
                return true;
            }
            else {
                return false;
            }
        }
    };
    fromulaRef.isfreezonFuc = function (txt) {
        var row = txt.replace(/[^0-9]/g, "");
        var col = txt.replace(/[^A-Za-z]/g, "");
        var row$ = txt.substr(txt.indexOf(row) - 1, 1);
        var col$ = txt.substr(txt.indexOf(col) - 1, 1);
        var ret = [false, false];
        if (row$ == "$") {
            ret[0] = true;
        }
        if (col$ == "$") {
            ret[1] = true;
        }
        return ret;
    };
    fromulaRef.operator = "==|!=|<>|<=|>=|=|+|-|>|<|/|*|%|&|^";
    fromulaRef.error = {
        v: "#VALUE!",
        n: "#NAME?",
        na: "#N/A",
        r: "#REF!",
        d: "#DIV/0!",
        nm: "#NUM!",
        nl: "#NULL!",
        sp: "#SPILL!",
    };
    fromulaRef.operatorjson = null;
    return fromulaRef;
}());
export { fromulaRef };
export function isChinese(temp) {
    var re = /[^\u4e00-\u9fa5]/;
    var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
    if (reg.test(temp))
        return true;
    if (re.test(temp))
        return false;
    return true;
}
export function isJapanese(temp) {
    var re = /[^\u0800-\u4e00]/;
    if (re.test(temp))
        return false;
    return true;
}
export function isKoera(chr) {
    if ((chr > 0x3130 && chr < 0x318f) || (chr >= 0xac00 && chr <= 0xd7a3)) {
        return true;
    }
    return false;
}
export function isContainMultiType(str) {
    var isUnicode = false;
    if (escape(str).indexOf("%u") > -1) {
        isUnicode = true;
    }
    var isNot = false;
    var reg = /[0-9a-z]/gi;
    if (reg.test(str)) {
        isNot = true;
    }
    var reEnSign = /[\x00-\xff]+/g;
    if (reEnSign.test(str)) {
        isNot = true;
    }
    if (isUnicode && isNot) {
        return true;
    }
    return false;
}
export function getMultiSequenceToNum(sqref) {
    if (!sqref || (sqref === null || sqref === void 0 ? void 0 : sqref.length) <= 0)
        return [];
    sqref = sqref.toUpperCase();
    var sqrefRawArr = sqref.split(" ");
    var sqrefArr = sqrefRawArr.filter(function (e) { return e && e.trim(); });
    var sqrefLastArr = getSqrefRawArrFormat(sqrefArr);
    var resArr = [];
    for (var i = 0; i < sqrefLastArr.length; i++) {
        var _res = getSingleSequenceToNum(sqrefLastArr[i]);
        if (_res)
            resArr.push(_res);
    }
    return resArr;
}
export function getRegionSequence(arr) {
    var _a, _b;
    var formatArr = [];
    var regEn = new RegExp(/[A-Z]+|[0-9]+/g);
    var startArr = (_a = arr[0]) === null || _a === void 0 ? void 0 : _a.match(regEn);
    var lastArr = (_b = arr[1]) === null || _b === void 0 ? void 0 : _b.match(regEn);
    var columnMax = Math.max.apply(Math, [ABCatNum(startArr[0]), ABCatNum(lastArr[0])]);
    var columnMin = Math.min.apply(Math, [ABCatNum(startArr[0]), ABCatNum(lastArr[0])]);
    var rowMax = Math.max.apply(Math, [parseInt(startArr[1]), parseInt(lastArr[1])]);
    var rowMin = Math.min.apply(Math, [parseInt(startArr[1]), parseInt(lastArr[1])]);
    for (var i = columnMin; i <= columnMax; i++) {
        for (var j = rowMin; j <= rowMax; j++) {
            formatArr.push("".concat(chatatABC(i)).concat(j));
        }
    }
    return formatArr;
}
export function getSqrefRawArrFormat(arr) {
    arr === null || arr === void 0 ? void 0 : arr.map(function (el) {
        if (el.includes(":")) {
            var tempArr = el.split(":");
            if ((tempArr === null || tempArr === void 0 ? void 0 : tempArr.length) === 2) {
                arr = arr.concat(getRegionSequence(tempArr));
                arr.splice(arr.indexOf(el), 1);
            }
        }
    });
    var resultArr = arr.filter(function (value, index, array) { return array.indexOf(value) === index; });
    return resultArr;
}
export function getSingleSequenceToNum(sqref) {
    var sqrefArray = sqref.match(/[A-Z]+|[0-9]+/g);
    var sqrefLen = sqrefArray.length;
    var regEn = new RegExp("^[A-Z]+$");
    var ret = "";
    for (var i = sqrefLen - 1; i >= 0; i--) {
        var cur = sqrefArray[i];
        if (regEn.test(cur)) {
            ret += ABCatNum(cur) + "_";
        }
        else {
            ret += parseInt(cur) - 1 + "_";
        }
    }
    return ret.substring(0, ret.length - 1);
}
export function getTransR1C1ToSequence(value) {
    if (!value && (value === null || value === void 0 ? void 0 : value.length) <= 0)
        return "";
    var len = value.length;
    var index = value.lastIndexOf("!");
    var valueArr = [value.slice(0, index), value.slice(index + 1, len)];
    var repStr = valueArr[1] || "";
    var indexR = repStr.indexOf("R");
    var indexC = repStr.indexOf("C");
    var row = Number(repStr.slice(indexR + 1, indexC));
    var column = chatatABC(Number(repStr.slice(indexC + 1, repStr === null || repStr === void 0 ? void 0 : repStr.length)) - 1);
    return "".concat(valueArr[0], "!").concat(column).concat(row);
}
export function getPeelOffX14(value) {
    var _a;
    if (!value || (value === null || value === void 0 ? void 0 : value.length) <= 0)
        return {};
    var formulaReg = new RegExp("</x14:formula[^]>", "g");
    var lastIndex = (_a = value.match(formulaReg)) === null || _a === void 0 ? void 0 : _a.length;
    var lastValue = "</x14:formula".concat(lastIndex, ">");
    var lastValueEnd = value.indexOf(lastValue);
    var formulaValue = value.substring(0, lastValueEnd + lastValue.length);
    formulaValue = formulaValue
        .replace(/<xm:f>/g, "")
        .replace(/<\/xm:f>/g, "")
        .replace(/x14:/g, "")
        .replace(/\/x14:/g, "");
    var formula = formulaValue;
    var xmSqrefLen = "<xm:sqref>".length;
    var sqrefStart = value.indexOf("<xm:sqref>");
    var sqrefEnd = value.indexOf("</xm:sqref>");
    var sqref = value.substring(sqrefStart + xmSqrefLen, sqrefEnd);
    return {
        formula: formula,
        sqref: sqref,
    };
}
export function getMultiFormulaValue(value) {
    var _a, _b;
    if (!value || (value === null || value === void 0 ? void 0 : value.length) <= 0)
        return [];
    var lenReg = new RegExp("formula", "g");
    var len = (((_a = value.match(lenReg)) === null || _a === void 0 ? void 0 : _a.length) || 0) / 2;
    if (len === 0)
        return [];
    var retArr = [];
    for (var i = 1; i <= len; i++) {
        var startLen = (_b = "<formula".concat(i, ">")) === null || _b === void 0 ? void 0 : _b.length;
        var start = value.indexOf("<formula".concat(i, ">"));
        var end = value.indexOf("</formula".concat(i, ">"));
        var _value = value.substring(start + startLen, end);
        retArr.push(escapeCharacter(_value.replace(/&quot;|^\"|\"$/g, "")));
    }
    return retArr;
}
export var setMerge = function (luckyMerge, worksheet) {
    if (luckyMerge === void 0) { luckyMerge = {}; }
    var mergearr = Object.values(luckyMerge);
    mergearr.forEach(function (elem) {
        worksheet.mergeCells(elem.r + 1, elem.c + 1, elem.r + elem.rs, elem.c + elem.cs);
    });
};
export var getObjType = function (obj) {
    var toString = Object.prototype.toString;
    var map = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object",
    };
    return map[toString.call(obj)];
};
export var rgb2hex = function (rgb) {
    if (rgb.charAt(0) == "#") {
        return rgb;
    }
    var ds = rgb.split(/\D+/);
    var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
    return "#" + zero_fill_hex(decimal, 6);
    function zero_fill_hex(num, digits) {
        var s = num.toString(16);
        while (s.length < digits)
            s = "0" + s;
        return s;
    }
};
