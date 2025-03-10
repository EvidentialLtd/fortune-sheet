import _ from "lodash";
import { locale } from "../locale";
import { checkCellIsLocked } from "../modules";
export * from "./patch";
export function generateRandomSheetName(file, isPivotTable, ctx) {
    var index = file.length;
    var locale_pivotTable = locale(ctx).pivotTable;
    var title = locale_pivotTable.title;
    for (var i = 0; i < file.length; i += 1) {
        if (file[i].name.indexOf("Sheet") > -1 ||
            file[i].name.indexOf(title) > -1) {
            var suffix = parseFloat(file[i].name.replace("Sheet", "").replace(title, ""));
            if (!Number.isNaN(suffix) && Math.ceil(suffix) > index) {
                index = Math.ceil(suffix);
            }
        }
    }
    if (isPivotTable) {
        return title + (index + 1);
    }
    return "Sheet".concat(index + 1);
}
export function rgbToHex(color) {
    var rgb;
    if (color.indexOf("rgba") > -1) {
        rgb = color.replace("rgba(", "").replace(")", "").split(",");
    }
    else {
        rgb = color.replace("rgb(", "").replace(")", "").split(",");
    }
    var r = Number(rgb[0]);
    var g = Number(rgb[1]);
    var b = Number(rgb[2]);
    return "#".concat(((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
}
export function indexToColumnChar(n) {
    var orda = "a".charCodeAt(0);
    var ordz = "z".charCodeAt(0);
    var len = ordz - orda + 1;
    var s = "";
    while (n >= 0) {
        s = String.fromCharCode((n % len) + orda) + s;
        n = Math.floor(n / len) - 1;
    }
    return s.toUpperCase();
}
export function columnCharToIndex(a) {
    if (a == null || a.length === 0) {
        return NaN;
    }
    var str = a.toLowerCase().split("");
    var al = str.length;
    var getCharNumber = function (charx) {
        return charx.charCodeAt(0) - 96;
    };
    var numout = 0;
    var charnum = 0;
    for (var i = 0; i < al; i += 1) {
        charnum = getCharNumber(str[i]);
        numout += charnum * Math.pow(26, (al - i - 1));
    }
    if (numout === 0) {
        return NaN;
    }
    return numout - 1;
}
export function escapeScriptTag(str) {
    if (typeof str !== "string")
        return str;
    return str
        .replace(/<script>/g, "&lt;script&gt;")
        .replace(/<\/script>/, "&lt;/script&gt;");
}
export function escapeHTMLTag(str) {
    if (typeof str !== "string")
        return str;
    if (str.substr(0, 5) === "<span" || _.startsWith(str, "=")) {
        return str;
    }
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function getSheetIndex(ctx, id) {
    var _a;
    for (var i = 0; i < ctx.luckysheetfile.length; i += 1) {
        if (((_a = ctx.luckysheetfile[i]) === null || _a === void 0 ? void 0 : _a.id) === id) {
            return i;
        }
    }
    return null;
}
export function getSheetIdByName(ctx, name) {
    for (var i = 0; i < ctx.luckysheetfile.length; i += 1) {
        if (ctx.luckysheetfile[i].name === name) {
            return ctx.luckysheetfile[i].id;
        }
    }
    return null;
}
export function getSheetByIndex(ctx, id) {
    if (_.isNil(id)) {
        id = ctx.currentSheetId;
    }
    var i = getSheetIndex(ctx, id);
    if (_.isNil(i)) {
        return null;
    }
    return ctx.luckysheetfile[i];
}
export function getNowDateTime(format) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var date = now.getDate();
    var hour = now.getHours();
    var minu = now.getMinutes();
    var sec = now.getSeconds();
    month += 1;
    if (month < 10)
        month = "0".concat(month);
    if (date < 10)
        date = "0".concat(date);
    if (hour < 10)
        hour = "0".concat(hour);
    if (minu < 10)
        minu = "0".concat(minu);
    if (sec < 10)
        sec = "0".concat(sec);
    var time = "";
    if (format === 1) {
        time = "".concat(year, "-").concat(month, "-").concat(date);
    }
    else if (format === 2) {
        time = "".concat(year, "-").concat(month, "-").concat(date, " ").concat(hour, ":").concat(minu, ":").concat(sec);
    }
    return time;
}
export function replaceHtml(temp, dataarry) {
    return temp.replace(/\$\{([\w]+)\}/g, function (s1, s2) {
        var s = dataarry[s2];
        if (typeof s !== "undefined") {
            return s;
        }
        return s1;
    });
}
export function getRegExpStr(str) {
    return str
        .replace("~*", "\\*")
        .replace("~?", "\\?")
        .replace(".", "\\.")
        .replace("*", ".*")
        .replace("?", ".");
}
export function chatatABC(n) {
    var orda = "a".charCodeAt(0);
    var ordz = "z".charCodeAt(0);
    var len = ordz - orda + 1;
    var s = "";
    while (n >= 0) {
        s = String.fromCharCode((n % len) + orda) + s;
        n = Math.floor(n / len) - 1;
    }
    return s.toUpperCase();
}
export function isAllowEdit(ctx, range) {
    var cfg = ctx.config;
    var judgeRange = _.isUndefined(range) ? ctx.luckysheet_select_save : range;
    return (_.every(judgeRange, function (selection) {
        var _a, _b;
        for (var r = selection.row[0]; r <= selection.row[1]; r += 1) {
            if ((_a = cfg.rowReadOnly) === null || _a === void 0 ? void 0 : _a[r]) {
                return false;
            }
        }
        for (var c = selection.column[0]; c <= selection.column[1]; c += 1) {
            if ((_b = cfg.colReadOnly) === null || _b === void 0 ? void 0 : _b[c]) {
                return false;
            }
        }
        for (var r = selection.row[0]; r <= selection.row[1]; r += 1) {
            for (var c = selection.column[0]; c <= selection.column[1]; c += 1) {
                if (checkCellIsLocked(ctx, r, c, ctx.currentSheetId)) {
                    return false;
                }
            }
        }
        return true;
    }) && (_.isUndefined(ctx.allowEdit) ? true : ctx.allowEdit));
}
