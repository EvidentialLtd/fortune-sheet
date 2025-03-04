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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import _ from "lodash";
import { Parser, ERROR_REF } from "@fortune-sheet/formula-parser";
import { getFlowdata } from "../context";
import { columnCharToIndex, escapeScriptTag, getSheetIndex, indexToColumnChar, getSheetIdByName, escapeHTMLTag, } from "../utils";
import { getRangetxt, mergeMoveMain, setCellValue } from "./cell";
import { error } from "./validation";
import { moveToEnd } from "./cursor";
import { locale } from "../locale";
import { colors } from "./color";
import { colLocation, mousePosition, rowLocation } from "./location";
import { cancelFunctionrangeSelected, seletedHighlistByindex } from ".";
import { arrayMatch, executeAffectedFormulas, setFormulaCellInfo, getFormulaRunList, } from "./formulaHelper";
var functionHTMLIndex = 0;
var rangeIndexes = [];
var operatorPriority = {
    "^": 0,
    "%": 1,
    "*": 1,
    "/": 1,
    "+": 2,
    "-": 2,
};
var operatorArr = "==|!=|<>|<=|>=|=|+|-|>|<|/|*|%|&|^".split("|");
var operatorjson = {};
for (var i = 0; i < operatorArr.length; i += 1) {
    operatorjson[operatorArr[i].toString()] = 1;
}
var simpleSheetName = "[A-Za-z0-9_\u00C0-\u02AF]+";
var quotedSheetName = "'(?:(?!').|'')*'";
var sheetNameRegexp = "(".concat(simpleSheetName, "|").concat(quotedSheetName, ")!");
var rowColumnRegexp = "[$]?[A-Za-z]+[$]?[0-9]+";
var rowColumnWithSheetName = "(?:".concat(sheetNameRegexp, ")?(").concat(rowColumnRegexp, ")");
var LABEL_EXTRACT_REGEXP = new RegExp("^".concat(rowColumnWithSheetName, "(?:[:]").concat(rowColumnWithSheetName, ")?$"));
export function isFormula(value) {
    return _.isString(value) && value.slice(0, 1) === "=" && value.length > 1;
}
var FormulaCache = (function () {
    function FormulaCache() {
        var that = this;
        this.data_parm_index = 0;
        this.selectingRangeIndex = -1;
        this.functionlistMap = {};
        this.execFunctionGlobalData = {};
        this.formulaCellInfoMap = null;
        this.cellTextToIndexList = {};
        this.parser = new Parser();
        this.parser.on("callCellValue", function (cellCoord, options, done) {
            var _a, _b;
            var context = that.parser.context;
            var id = cellCoord.sheetName == null
                ? options.sheetId
                : getSheetIdByName(context, cellCoord.sheetName);
            if (id == null)
                throw Error(ERROR_REF);
            var flowdata = getFlowdata(context, id);
            var cell = ((_a = context === null || context === void 0 ? void 0 : context.formulaCache.execFunctionGlobalData) === null || _a === void 0 ? void 0 : _a["".concat(cellCoord.row.index, "_").concat(cellCoord.column.index, "_").concat(id)]) || ((_b = flowdata === null || flowdata === void 0 ? void 0 : flowdata[cellCoord.row.index]) === null || _b === void 0 ? void 0 : _b[cellCoord.column.index]);
            var v = that.tryGetCellAsNumber(cell);
            done(v);
        });
        this.parser.on("callRangeValue", function (startCellCoord, endCellCoord, options, done) {
            var _a, _b, _c, _d;
            var context = that.parser.context;
            var id = startCellCoord.sheetName == null
                ? options.sheetId
                : getSheetIdByName(context, startCellCoord.sheetName);
            if (id == null)
                throw Error(ERROR_REF);
            var flowdata = getFlowdata(context, id);
            var fragment = [];
            var startRow = startCellCoord.row.index;
            var endRow = endCellCoord.row.index;
            var startCol = startCellCoord.column.index;
            var endCol = endCellCoord.column.index;
            var emptyRow = startRow === -1 || endRow === -1;
            var emptyCol = startCol === -1 || endCol === -1;
            if (emptyRow) {
                startRow = 0;
                endRow = (_a = flowdata === null || flowdata === void 0 ? void 0 : flowdata.length) !== null && _a !== void 0 ? _a : 0;
            }
            if (emptyCol) {
                startCol = 0;
                endCol = (_b = flowdata === null || flowdata === void 0 ? void 0 : flowdata[0].length) !== null && _b !== void 0 ? _b : 0;
            }
            if (emptyRow && emptyCol)
                throw Error(ERROR_REF);
            for (var row = startRow; row <= endRow; row += 1) {
                var colFragment = [];
                for (var col = startCol; col <= endCol; col += 1) {
                    var cell = ((_c = context === null || context === void 0 ? void 0 : context.formulaCache.execFunctionGlobalData) === null || _c === void 0 ? void 0 : _c["".concat(row, "_").concat(col, "_").concat(id)]) || ((_d = flowdata === null || flowdata === void 0 ? void 0 : flowdata[row]) === null || _d === void 0 ? void 0 : _d[col]);
                    var v = that.tryGetCellAsNumber(cell);
                    colFragment.push(v);
                }
                fragment.push(colFragment);
            }
            if (fragment) {
                done(fragment);
            }
        });
    }
    FormulaCache.prototype.tryGetCellAsNumber = function (cell) {
        var _a;
        if (((_a = cell === null || cell === void 0 ? void 0 : cell.ct) === null || _a === void 0 ? void 0 : _a.t) === "n") {
            var n = Number(cell === null || cell === void 0 ? void 0 : cell.v);
            return Number.isNaN(n) ? cell.v : n;
        }
        return cell === null || cell === void 0 ? void 0 : cell.v;
    };
    FormulaCache.prototype.updateFormulaCache = function (ctx, history, type, data) {
        function requestUpdate(value) {
            var _a;
            if (value instanceof Object) {
                if (!_.isNil(value.r) && !_.isNil(value.c)) {
                    setFormulaCellInfo(ctx, {
                        r: value.r,
                        c: value.c,
                        id: value.id || ((_a = history.options) === null || _a === void 0 ? void 0 : _a.id) || ctx.currentSheetId,
                    }, data);
                }
            }
        }
        var changesHistory = type === "undo" ? history.inversePatches : history.patches;
        changesHistory.forEach(function (patch) {
            var _a;
            if (isFormula((_a = patch.value) === null || _a === void 0 ? void 0 : _a.f) ||
                patch.value === null ||
                patch.path[5] === "f") {
                requestUpdate({ r: patch.path[3], c: patch.path[4] });
            }
            else if (Array.isArray(patch.value)) {
                patch.value.forEach(function (value) {
                    requestUpdate(value);
                });
            }
            else {
                requestUpdate(patch.value);
            }
        });
    };
    return FormulaCache;
}());
export { FormulaCache };
function parseElement(eleString) {
    return new DOMParser().parseFromString(eleString, "text/html").body
        .childNodes[0];
}
export function iscelldata(txt) {
    var val = txt.split("!");
    var rangetxt;
    if (val.length > 1) {
        rangetxt = val[1];
    }
    else {
        rangetxt = val[0];
    }
    var reg_cell = /^(([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+))$/g;
    var reg_cellRange = /^(((([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+)))|((([a-zA-Z]+)|([$][a-zA-Z]+))))$/g;
    if (rangetxt.indexOf(":") === -1) {
        var row_1 = parseInt(rangetxt.replace(/[^0-9]/g, ""), 10) - 1;
        var col_1 = columnCharToIndex(rangetxt.replace(/[^A-Za-z]/g, ""));
        if (!Number.isNaN(row_1) &&
            !Number.isNaN(col_1) &&
            rangetxt.toString().match(reg_cell)) {
            return true;
        }
        if (!Number.isNaN(row_1)) {
            return false;
        }
        if (!Number.isNaN(col_1)) {
            return false;
        }
        return false;
    }
    reg_cellRange =
        /^(((([a-zA-Z]+)|([$][a-zA-Z]+))(([0-9]+)|([$][0-9]+)))|((([a-zA-Z]+)|([$][a-zA-Z]+)))|((([0-9]+)|([$][0-9]+s))))$/g;
    var rangetxtArr = rangetxt.split(":");
    var row = [];
    var col = [];
    row[0] = parseInt(rangetxtArr[0].replace(/[^0-9]/g, ""), 10) - 1;
    row[1] = parseInt(rangetxtArr[1].replace(/[^0-9]/g, ""), 10) - 1;
    if (row[0] > row[1]) {
        return false;
    }
    col[0] = columnCharToIndex(rangetxtArr[0].replace(/[^A-Za-z]/g, ""));
    col[1] = columnCharToIndex(rangetxtArr[1].replace(/[^A-Za-z]/g, ""));
    if (col[0] > col[1]) {
        return false;
    }
    if (rangetxtArr[0].toString().match(reg_cellRange) &&
        rangetxtArr[1].toString().match(reg_cellRange)) {
        return true;
    }
    return false;
}
function addToCellIndexList(ctx, txt, infoObj) {
    if (_.isNil(txt) || txt.length === 0 || _.isNil(infoObj)) {
        return;
    }
    if (_.isNil(ctx.formulaCache.cellTextToIndexList)) {
        ctx.formulaCache.cellTextToIndexList = {};
    }
    if (txt.indexOf("!") > -1) {
        txt = txt.replace(/\\'/g, "'").replace(/''/g, "'");
        ctx.formulaCache.cellTextToIndexList[txt] = infoObj;
    }
    else {
        ctx.formulaCache.cellTextToIndexList["".concat(txt, "_").concat(infoObj.sheetId)] = infoObj;
    }
}
export function getcellrange(ctx, txt, formulaId, data) {
    if (_.isNil(txt) || txt.length === 0) {
        return null;
    }
    var flowdata = data || getFlowdata(ctx, formulaId);
    var sheettxt = "";
    var rangetxt = "";
    var sheetId;
    var sheetdata = null;
    var luckysheetfile = ctx.luckysheetfile;
    if (txt.indexOf("!") > -1) {
        if (txt in ctx.formulaCache.cellTextToIndexList) {
            return ctx.formulaCache.cellTextToIndexList[txt];
        }
        var matchRes = txt.match(LABEL_EXTRACT_REGEXP);
        if (matchRes == null) {
            return null;
        }
        var sheettxt1 = matchRes[1], starttxt1 = matchRes[2], sheettxt2 = matchRes[3], starttxt2 = matchRes[4];
        if (sheettxt2 != null && sheettxt1 !== sheettxt2) {
            return null;
        }
        rangetxt = starttxt2 ? "".concat(starttxt1, ":").concat(starttxt2) : starttxt1;
        sheettxt = sheettxt1
            .replace(/^'|'$/g, "")
            .replace(/\\'/g, "'")
            .replace(/''/g, "'");
        _.forEach(luckysheetfile, function (f) {
            if (sheettxt === f.name) {
                sheetId = f.id;
                sheetdata = f.data;
                return false;
            }
            return true;
        });
    }
    else {
        var i = formulaId;
        if (_.isNil(i)) {
            i = ctx.currentSheetId;
        }
        if ("".concat(txt, "_").concat(i) in ctx.formulaCache.cellTextToIndexList) {
            return ctx.formulaCache.cellTextToIndexList["".concat(txt, "_").concat(i)];
        }
        var index = getSheetIndex(ctx, i);
        if (_.isNil(index)) {
            return null;
        }
        sheettxt = luckysheetfile[index].name;
        sheetId = luckysheetfile[index].id;
        sheetdata = flowdata;
        rangetxt = txt;
    }
    if (_.isNil(sheetdata)) {
        return null;
    }
    if (rangetxt.indexOf(":") === -1) {
        var row_2 = parseInt(rangetxt.replace(/[^0-9]/g, ""), 10) - 1;
        var col_2 = columnCharToIndex(rangetxt.replace(/[^A-Za-z]/g, ""));
        if (!Number.isNaN(row_2) && !Number.isNaN(col_2)) {
            var item_1 = {
                row: [row_2, row_2],
                column: [col_2, col_2],
                sheetId: sheetId,
            };
            addToCellIndexList(ctx, txt, item_1);
            return item_1;
        }
        return null;
    }
    var rangetxtArr = rangetxt.split(":");
    var row = [-1, -1];
    var col = [-1, -1];
    row[0] = parseInt(rangetxtArr[0].replace(/[^0-9]/g, ""), 10) - 1;
    row[1] = parseInt(rangetxtArr[1].replace(/[^0-9]/g, ""), 10) - 1;
    if (Number.isNaN(row[0])) {
        row[0] = 0;
    }
    if (Number.isNaN(row[1])) {
        row[1] = sheetdata.length - 1;
    }
    if (row[0] > row[1]) {
        return null;
    }
    col[0] = columnCharToIndex(rangetxtArr[0].replace(/[^A-Za-z]/g, ""));
    col[1] = columnCharToIndex(rangetxtArr[1].replace(/[^A-Za-z]/g, ""));
    if (Number.isNaN(col[0])) {
        col[0] = 0;
    }
    if (Number.isNaN(col[1])) {
        col[1] = sheetdata[0].length - 1;
    }
    if (col[0] > col[1]) {
        return null;
    }
    var item = {
        row: row,
        column: col,
        sheetId: sheetId,
    };
    addToCellIndexList(ctx, txt, item);
    return item;
}
function calPostfixExpression(cal) {
    if (cal.length === 0) {
        return "";
    }
    var stack = [];
    for (var i = cal.length - 1; i >= 0; i -= 1) {
        var c = cal[i];
        if (c in operatorjson) {
            var s2 = stack.pop();
            var s1 = stack.pop();
            var str = "luckysheet_compareWith(".concat(s1, ",'").concat(c, "', ").concat(s2, ")");
            stack.push(str);
        }
        else {
            stack.push(c);
        }
    }
    if (stack.length > 0) {
        return stack[0];
    }
    return "";
}
function checkSpecialFunctionRange(ctx, function_str, r, c, id, dynamicArray_compute, cellRangeFunction) {
    if (function_str.substring(0, 30) === "luckysheet_getSpecialReference" ||
        function_str.substring(0, 20) === "luckysheet_function.") {
        if (function_str.substring(0, 20) === "luckysheet_function.") {
            var funcName = function_str.split(".")[1];
            if (!_.isNil(funcName)) {
                funcName = funcName.toUpperCase();
                if (funcName !== "INDIRECT" &&
                    funcName !== "OFFSET" &&
                    funcName !== "INDEX") {
                    return;
                }
            }
        }
        try {
            ctx.calculateSheetId = id;
            var str = function_str
                .split(",")[function_str.split(",").length - 1].split("'")[1]
                .split("'")[0];
            var str_nb = _.trim(str);
            if (iscelldata(str_nb)) {
                if (typeof cellRangeFunction === "function") {
                    cellRangeFunction(str_nb);
                }
            }
        }
        catch (_a) { }
    }
}
export function isFunctionRange(ctx, txt, r, c, id, dynamicArray_compute, cellRangeFunction) {
    var _a;
    if (txt.substring(0, 1) === "=") {
        txt = txt.substring(1);
    }
    var funcstack = txt.split("");
    var i = 0;
    var str = "";
    var function_str = "";
    var matchConfig = {
        bracket: 0,
        comma: 0,
        squote: 0,
        dquote: 0,
        compare: 0,
        braces: 0,
    };
    var cal1 = [];
    var cal2 = [];
    var bracket = [];
    var firstSQ = -1;
    while (i < funcstack.length) {
        var s = funcstack[i];
        if (s === "(" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            if (str.length > 0 && bracket.length === 0) {
                str = str.toUpperCase();
                if (str.indexOf(":") > -1) {
                    var funcArray = str.split(":");
                    function_str += "luckysheet_getSpecialReference(true,'".concat(_.trim(funcArray[0]).replace(/'/g, "\\'"), "', luckysheet_function.").concat(funcArray[1], ".f(#lucky#");
                }
                else {
                    function_str += "luckysheet_function.".concat(str, ".f(");
                }
                bracket.push(1);
                str = "";
            }
            else if (bracket.length === 0) {
                function_str += "(";
                bracket.push(0);
                str = "";
            }
            else {
                bracket.push(0);
                str += s;
            }
        }
        else if (s === ")" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            bracket.pop();
            if (bracket.length === 0) {
                var functionS = isFunctionRange(ctx, str, r, c, id, dynamicArray_compute, cellRangeFunction);
                if (functionS.indexOf("#lucky#") > -1) {
                    functionS = "".concat(functionS.replace(/#lucky#/g, ""), ")");
                }
                function_str += "".concat(functionS, ")");
                str = "";
            }
            else {
                str += s;
            }
        }
        else if (s === "{" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0) {
            str += "{";
            matchConfig.braces += 1;
        }
        else if (s === "}" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0) {
            str += "}";
            matchConfig.braces -= 1;
        }
        else if (s === '"' && matchConfig.squote === 0) {
            if (matchConfig.dquote > 0) {
                if (i < funcstack.length - 1 && funcstack[i + 1] === '"') {
                    i += 1;
                    str += "\x7F";
                }
                else {
                    matchConfig.dquote -= 1;
                    str += '"';
                }
            }
            else {
                matchConfig.dquote += 1;
                str += '"';
            }
        }
        else if (s === "'" && matchConfig.dquote === 0) {
            str += "'";
            if (matchConfig.squote > 0) {
                if (i < funcstack.length - 1 && funcstack[i + 1] === "'") {
                    i += 1;
                    str += "'";
                }
                else {
                    matchConfig.squote -= 1;
                }
            }
            else {
                matchConfig.squote += 1;
                firstSQ = i;
            }
        }
        else if (s === "," &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            if (bracket.length <= 1) {
                var functionS = isFunctionRange(ctx, str, r, c, id, dynamicArray_compute, cellRangeFunction);
                if (functionS.indexOf("#lucky#") > -1) {
                    functionS = "".concat(functionS.replace(/#lucky#/g, ""), ")");
                }
                function_str += "".concat(functionS, ",");
                str = "";
            }
            else {
                str += ",";
            }
        }
        else if (s in operatorjson &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            var s_next = "";
            var op = operatorPriority;
            if (i + 1 < funcstack.length) {
                s_next = funcstack[i + 1];
            }
            if (s + s_next in operatorjson) {
                if (bracket.length === 0) {
                    if (_.trim(str).length > 0) {
                        cal2.unshift(isFunctionRange(ctx, _.trim(str), r, c, id, dynamicArray_compute, cellRangeFunction));
                    }
                    else if (_.trim(function_str).length > 0) {
                        cal2.unshift(_.trim(function_str));
                    }
                    if (cal1[0] in operatorjson) {
                        var stackCeilPri = op[cal1[0]];
                        while (cal1.length > 0 && !_.isNil(stackCeilPri)) {
                            cal2.unshift(cal1.shift());
                            stackCeilPri = op[cal1[0]];
                        }
                    }
                    cal1.unshift(s + s_next);
                    function_str = "";
                    str = "";
                }
                else {
                    str += s + s_next;
                }
                i += 1;
            }
            else {
                if (bracket.length === 0) {
                    if (_.trim(str).length > 0) {
                        cal2.unshift(isFunctionRange(ctx, _.trim(str), r, c, id, dynamicArray_compute, cellRangeFunction));
                    }
                    else if (_.trim(function_str).length > 0) {
                        cal2.unshift(_.trim(function_str));
                    }
                    if (cal1[0] in operatorjson) {
                        var stackCeilPri = op[cal1[0]];
                        stackCeilPri = _.isNil(stackCeilPri) ? 1000 : stackCeilPri;
                        var sPri = op[s];
                        sPri = _.isNil(sPri) ? 1000 : sPri;
                        while (cal1.length > 0 && sPri >= stackCeilPri) {
                            cal2.unshift(cal1.shift());
                            stackCeilPri = op[cal1[0]];
                            stackCeilPri = _.isNil(stackCeilPri) ? 1000 : stackCeilPri;
                        }
                    }
                    cal1.unshift(s);
                    function_str = "";
                    str = "";
                }
                else {
                    str += s;
                }
            }
        }
        else {
            if (matchConfig.dquote === 0 && matchConfig.squote === 0) {
                str += _.trim(s);
            }
            else {
                str += s;
            }
        }
        if (i === funcstack.length - 1) {
            var endstr = "";
            var str_nb = _.trim(str).replace(/'/g, "\\'");
            if (iscelldata(str_nb) && str_nb.substring(0, 1) !== ":") {
                endstr = "luckysheet_getcelldata('".concat(str_nb, "')");
            }
            else if (str_nb.substring(0, 1) === ":") {
                str_nb = str_nb.substring(1);
                if (iscelldata(str_nb)) {
                    endstr = "luckysheet_getSpecialReference(false,".concat(function_str, ",'").concat(str_nb, "')");
                }
            }
            else {
                str = _.trim(str);
                var regx = /{.*?}/;
                if (regx.test(str) &&
                    str.substring(0, 1) !== '"' &&
                    str.substring(str.length - 1, 1) !== '"') {
                    var arraytxt = (_a = regx.exec(str)) === null || _a === void 0 ? void 0 : _a[0];
                    var arraystart = str.search(regx);
                    if (arraystart > 0) {
                        endstr += str.substring(0, arraystart);
                    }
                    endstr += "luckysheet_getarraydata('".concat(arraytxt, "')");
                    if (arraystart + arraytxt.length < str.length) {
                        endstr += str.substring(arraystart + arraytxt.length, str.length);
                    }
                }
                else {
                    endstr = str;
                }
            }
            if (endstr.length > 0) {
                cal2.unshift(endstr);
            }
            if (cal1.length > 0) {
                if (function_str.length > 0) {
                    cal2.unshift(function_str);
                    function_str = "";
                }
                while (cal1.length > 0) {
                    cal2.unshift(cal1.shift());
                }
            }
            if (cal2.length > 0) {
                function_str = calPostfixExpression(cal2);
            }
            else {
                function_str += endstr;
            }
        }
        i += 1;
    }
    checkSpecialFunctionRange(ctx, function_str, r, c, id, dynamicArray_compute, cellRangeFunction);
    return function_str;
}
export function getAllFunctionGroup(ctx) {
    var luckysheetfile = ctx.luckysheetfile;
    var ret = [];
    for (var i = 0; i < luckysheetfile.length; i += 1) {
        var file = luckysheetfile[i];
        var calcChain = file.calcChain;
        var dynamicArray_compute = file.dynamicArray_compute;
        if (_.isNil(calcChain)) {
            calcChain = [];
        }
        if (_.isNil(dynamicArray_compute)) {
            dynamicArray_compute = [];
        }
        ret = ret.concat(calcChain);
        for (var j = 0; j < dynamicArray_compute.length; j += 1) {
            var d = dynamicArray_compute[0];
            ret.push({
                r: d.r,
                c: d.c,
                id: d.id,
            });
        }
    }
    return ret;
}
export function delFunctionGroup(ctx, r, c, id) {
    if (_.isNil(id)) {
        id = ctx.currentSheetId;
    }
    var file = ctx.luckysheetfile[getSheetIndex(ctx, id)];
    var calcChain = file.calcChain;
    if (!_.isNil(calcChain)) {
        var modified = false;
        var calcChainClone = calcChain.slice();
        for (var i = 0; i < calcChainClone.length; i += 1) {
            var calc = calcChainClone[i];
            if (calc.r === r && calc.c === c && calc.id === id) {
                calcChainClone.splice(i, 1);
                modified = true;
                break;
            }
        }
        if (modified) {
            file.calcChain = calcChainClone;
        }
    }
    var dynamicArray = file.dynamicArray;
    if (!_.isNil(dynamicArray)) {
        var modified = false;
        var dynamicArrayClone = dynamicArray.slice();
        for (var i = 0; i < dynamicArrayClone.length; i += 1) {
            var calc = dynamicArrayClone[i];
            if (calc.r === r &&
                calc.c === c &&
                (_.isNil(calc.id) || calc.id === id)) {
                dynamicArrayClone.splice(i, 1);
                modified = true;
                break;
            }
        }
        if (modified) {
            file.dynamicArray = dynamicArrayClone;
        }
    }
}
function checkBracketNum(fp) {
    var bra_l = fp.match(/\(/g);
    var bra_r = fp.match(/\)/g);
    var bra_tl_txt = fp.match(/(['"])(?:(?!\1).)*?\1/g);
    var bra_tr_txt = fp.match(/(['"])(?:(?!\1).)*?\1/g);
    var bra_l_len = 0;
    var bra_r_len = 0;
    if (!_.isNil(bra_l)) {
        bra_l_len += bra_l.length;
    }
    if (!_.isNil(bra_r)) {
        bra_r_len += bra_r.length;
    }
    var bra_tl_len = 0;
    var bra_tr_len = 0;
    if (!_.isNil(bra_tl_txt)) {
        for (var i = 0; i < bra_tl_txt.length; i += 1) {
            var bra_tl = bra_tl_txt[i].match(/\(/g);
            if (!_.isNil(bra_tl)) {
                bra_tl_len += bra_tl.length;
            }
        }
    }
    if (!_.isNil(bra_tr_txt)) {
        for (var i = 0; i < bra_tr_txt.length; i += 1) {
            var bra_tr = bra_tr_txt[i].match(/\)/g);
            if (!_.isNil(bra_tr)) {
                bra_tr_len += bra_tr.length;
            }
        }
    }
    bra_l_len -= bra_tl_len;
    bra_r_len -= bra_tr_len;
    if (bra_l_len !== bra_r_len) {
        return false;
    }
    return true;
}
export function insertUpdateFunctionGroup(ctx, r, c, id, calcChainSet) {
    if (_.isNil(id)) {
        id = ctx.currentSheetId;
    }
    var luckysheetfile = ctx.luckysheetfile;
    var idx = getSheetIndex(ctx, id);
    if (_.isNil(idx)) {
        return;
    }
    var file = luckysheetfile[idx];
    var calcChain = file.calcChain;
    if (_.isNil(calcChain)) {
        calcChain = [];
    }
    if (calcChainSet) {
        if (calcChainSet.has("".concat(r, "_").concat(c, "_").concat(id)))
            return;
    }
    else {
        for (var i = 0; i < calcChain.length; i += 1) {
            var calc = calcChain[i];
            if (calc.r === r && calc.c === c && calc.id === id) {
                return;
            }
        }
    }
    var cc = {
        r: r,
        c: c,
        id: id,
    };
    calcChain.push(cc);
    file.calcChain = calcChain;
    ctx.luckysheetfile = luckysheetfile;
}
export function execfunction(ctx, txt, r, c, id, calcChainSet, isrefresh, notInsertFunc) {
    if (txt.indexOf(error.r) > -1) {
        return [false, error.r, txt];
    }
    if (!checkBracketNum(txt)) {
        txt += ")";
    }
    if (_.isNil(id)) {
        id = ctx.currentSheetId;
    }
    ctx.calculateSheetId = id;
    ctx.formulaCache.parser.context = ctx;
    var parsedResponse = ctx.formulaCache.parser.parse(txt.substring(1), {
        sheetId: id || ctx.currentSheetId,
    });
    var formulaError = parsedResponse.error;
    var result = parsedResponse.result;
    if (Object.prototype.toString.call(result) === "[object Date]" &&
        !_.isNil(result)) {
        result = result.toString();
    }
    if (!_.isNil(r) && !_.isNil(c)) {
        if (isrefresh) {
            execFunctionGroup(ctx, r, c, _.isNil(formulaError) ? result : formulaError, id);
        }
        if (!notInsertFunc) {
            insertUpdateFunctionGroup(ctx, r, c, id, calcChainSet);
        }
    }
    return [true, _.isNil(formulaError) ? result : formulaError, txt];
}
function insertUpdateDynamicArray(ctx, dynamicArrayItem) {
    var r = dynamicArrayItem.r, c = dynamicArrayItem.c;
    var id = dynamicArrayItem.id;
    if (_.isNil(id)) {
        id = ctx.currentSheetId;
    }
    var luckysheetfile = ctx.luckysheetfile;
    var idx = getSheetIndex(ctx, id);
    if (idx == null)
        return [];
    var file = luckysheetfile[idx];
    var dynamicArray = file.dynamicArray;
    if (_.isNil(dynamicArray)) {
        dynamicArray = [];
    }
    for (var i = 0; i < dynamicArray.length; i += 1) {
        var calc = dynamicArray[i];
        if (calc.r === r && calc.c === c && calc.id === id) {
            calc.data = dynamicArrayItem.data;
            calc.f = dynamicArrayItem.f;
            return dynamicArray;
        }
    }
    dynamicArray.push(dynamicArrayItem);
    return dynamicArray;
}
export function groupValuesRefresh(ctx) {
    var luckysheetfile = ctx.luckysheetfile;
    if (ctx.groupValuesRefreshData.length > 0) {
        for (var i = 0; i < ctx.groupValuesRefreshData.length; i += 1) {
            var item = ctx.groupValuesRefreshData[i];
            var idx = getSheetIndex(ctx, item.id);
            if (idx == null)
                continue;
            var file = luckysheetfile[idx];
            var data = file.data;
            if (_.isNil(data)) {
                continue;
            }
            var updateValue = {};
            if (!_.isNil(item.spe)) {
                if (item.spe.type === "sparklines") {
                    updateValue.spl = item.spe.data;
                }
                else if (item.spe.type === "dynamicArrayItem") {
                    file.dynamicArray = insertUpdateDynamicArray(ctx, item.spe.data);
                }
            }
            updateValue.v = item.v;
            updateValue.f = item.f;
            setCellValue(ctx, item.r, item.c, data, updateValue);
        }
        ctx.groupValuesRefreshData = [];
    }
}
export function setFormulaCellInfoMap(ctx, calcChains, data) {
    if (_.isNil(calcChains))
        return;
    for (var i = 0; i < calcChains.length; i += 1) {
        var formulaCell = calcChains[i];
        setFormulaCellInfo(ctx, formulaCell, data);
    }
}
export function execFunctionGroup(ctx, origin_r, origin_c, value, id, data, isForce) {
    if (isForce === void 0) { isForce = false; }
    if (_.isNil(data)) {
        data = getFlowdata(ctx);
    }
    if (_.isNil(ctx.formulaCache.execFunctionGlobalData)) {
        ctx.formulaCache.execFunctionGlobalData = {};
    }
    if (_.isNil(id)) {
        id = ctx.currentSheetId;
    }
    if (!_.isNil(value)) {
        var cellCache = [[{ v: undefined }]];
        setCellValue(ctx, 0, 0, cellCache, value);
        ctx.formulaCache.execFunctionGlobalData["".concat(origin_r, "_").concat(origin_c, "_").concat(id)] = cellCache[0][0];
    }
    var calcChains = getAllFunctionGroup(ctx);
    var updateValueObjects = {};
    if (_.isNil(ctx.formulaCache.execFunctionExist)) {
        var key = "r".concat(origin_r, "c").concat(origin_c, "i").concat(id);
        updateValueObjects[key] = 1;
    }
    else {
        for (var x = 0; x < ctx.formulaCache.execFunctionExist.length; x += 1) {
            var cell = ctx.formulaCache.execFunctionExist[x];
            var key = "r".concat(cell.r, "c").concat(cell.c, "i").concat(cell.i);
            updateValueObjects[key] = 1;
        }
    }
    if (!ctx.formulaCache.formulaCellInfoMap ||
        _.isEmpty(ctx.formulaCache.formulaCellInfoMap)) {
        ctx.formulaCache.formulaCellInfoMap = {};
        setFormulaCellInfoMap(ctx, calcChains, data);
    }
    var formulaCellInfoMap = ctx.formulaCache.formulaCellInfoMap;
    var updateValueArray = [];
    var arrayMatchCache = {};
    Object.keys(formulaCellInfoMap).forEach(function (key) {
        var formulaObject = formulaCellInfoMap[key];
        arrayMatch(arrayMatchCache, formulaObject.formulaDependency, formulaCellInfoMap, updateValueObjects, function (childKey) {
            if (childKey in formulaCellInfoMap) {
                var childFormulaObject = formulaCellInfoMap[childKey];
                childFormulaObject.parents[key] = 1;
            }
            if (!isForce && childKey in updateValueObjects) {
                updateValueArray.push(formulaObject);
            }
        });
        if (isForce) {
            updateValueArray.push(formulaObject);
        }
    });
    var formulaRunList = getFormulaRunList(updateValueArray, formulaCellInfoMap);
    executeAffectedFormulas(ctx, formulaRunList, calcChains);
    ctx.formulaCache.execFunctionExist = undefined;
}
function findrangeindex(ctx, v, vp) {
    var re = /<span.*?>/g;
    var v_a = v.replace(re, "").split("</span>");
    var vp_a = vp.replace(re, "").split("</span>");
    v_a.pop();
    if (vp_a[vp_a.length - 1] === "")
        vp_a.pop();
    var pfri = ctx.formulaCache.functionRangeIndex;
    if (pfri == null)
        return [];
    var vplen = vp_a.length;
    var vlen = v_a.length;
    if (vplen === vlen) {
        var i = pfri[0];
        var p = vp_a[i];
        var n = v_a[i];
        if (_.isNil(p)) {
            if (vp_a.length <= i) {
                pfri = [vp_a.length - 1, vp_a.length - 1];
            }
            else if (v_a.length <= i) {
                pfri = [v_a.length - 1, v_a.length - 1];
            }
            return pfri;
        }
        if (p.length === n.length) {
            if (!_.isNil(vp_a[i + 1]) &&
                !_.isNil(v_a[i + 1]) &&
                vp_a[i + 1].length < v_a[i + 1].length) {
                pfri[0] += 1;
                pfri[1] = 1;
            }
            return pfri;
        }
        if (p.length > n.length) {
            if (!_.isNil(p) &&
                !_.isNil(v_a[i + 1]) &&
                v_a[i + 1].substring(0, 1) === '"' &&
                (p.indexOf("{") > -1 || p.indexOf("}") > -1)) {
                pfri[0] += 1;
                pfri[1] = 1;
            }
            return pfri;
        }
        if (p.length < n.length) {
            if (pfri[1] > n.length) {
                pfri[1] = n.length;
            }
            return pfri;
        }
    }
    else if (vplen > vlen) {
        var i = pfri[0];
        var p = vp_a[i];
        var n = v_a[i];
        if (_.isNil(n)) {
            if (v_a[i - 1].indexOf("{") > -1) {
                pfri[0] -= 1;
                var start = v_a[i - 1].search("{");
                pfri[1] += start;
            }
            else {
                pfri[0] = 0;
                pfri[1] = 0;
            }
        }
        else if (p.length === n.length) {
            if (!_.isNil(v_a[i + 1]) &&
                (v_a[i + 1].substring(0, 1) === '"' ||
                    v_a[i + 1].substring(0, 1) === "{" ||
                    v_a[i + 1].substring(0, 1) === "}")) {
                pfri[0] += 1;
                pfri[1] = 1;
            }
            else if (!_.isNil(p) &&
                p.length > 2 &&
                p.substring(0, 1) === '"' &&
                p.substring(p.length - 1, 1) === '"') {
            }
            else if (!_.isNil(v_a[i]) && v_a[i] === '")') {
                pfri[1] = 1;
            }
            else if (!_.isNil(v_a[i]) && v_a[i] === '"}') {
                pfri[1] = 1;
            }
            else if (!_.isNil(v_a[i]) && v_a[i] === "{)") {
                pfri[1] = 1;
            }
            else {
                pfri[1] = n.length;
            }
            return pfri;
        }
        else if (p.length > n.length) {
            if (!_.isNil(v_a[i + 1]) &&
                (v_a[i + 1].substring(0, 1) === '"' ||
                    v_a[i + 1].substring(0, 1) === "{" ||
                    v_a[i + 1].substring(0, 1) === "}")) {
                pfri[0] += 1;
                pfri[1] = 1;
            }
            return pfri;
        }
        else if (p.length < n.length) {
            return pfri;
        }
        return pfri;
    }
    else if (vplen < vlen) {
        var i = pfri[0];
        var p = vp_a[i];
        var n = v_a[i];
        if (_.isNil(p)) {
            pfri[0] = v_a.length - 1;
            if (!_.isNil(n)) {
                pfri[1] = n.length;
            }
            else {
                pfri[1] = 1;
            }
        }
        else if (p.length === n.length) {
            if (vp_a[i + 1] != null &&
                (vp_a[i + 1].substring(0, 1) === '"' ||
                    vp_a[i + 1].substring(0, 1) === "{" ||
                    vp_a[i + 1].substring(0, 1) === "}")) {
                pfri[1] = n.length;
            }
            else if (!_.isNil(v_a[i + 1]) &&
                v_a[i + 1].substring(0, 1) === '"' &&
                (v_a[i + 1].substring(0, 1) === "{" ||
                    v_a[i + 1].substring(0, 1) === "}")) {
                pfri[0] += 1;
                pfri[1] = 1;
            }
            else if (!_.isNil(n) &&
                n.substring(0, 1) === '"' &&
                n.substring(n.length - 1, 1) === '"' &&
                p.substring(0, 1) === '"' &&
                p.substring(p.length - 1, 1) === ")") {
                pfri[1] = n.length;
            }
            else if (!_.isNil(n) &&
                n.substring(0, 1) === "{" &&
                n.substring(n.length - 1, 1) === "}" &&
                p.substring(0, 1) === "{" &&
                p.substring(p.length - 1, 1) === ")") {
                pfri[1] = n.length;
            }
            else {
                pfri[0] = pfri[0] + vlen - vplen;
                if (v_a.length > vp_a.length) {
                    pfri[1] = v_a[i + 1].length;
                }
                else {
                    pfri[1] = 1;
                }
            }
            return pfri;
        }
        else if (p.length > n.length) {
            if (!_.isNil(p) && p.substring(0, 1) === '"') {
                pfri[1] = n.length;
            }
            else if (_.isNil(v_a[i + 1]) && /{.*?}/.test(v_a[i + 1])) {
                pfri[0] += 1;
                pfri[1] = v_a[i + 1].length;
            }
            else if (!_.isNil(p) &&
                v_a[i + 1].substring(0, 1) === '"' &&
                (p.indexOf("{") > -1 || p.indexOf("}") > -1)) {
                pfri[0] += 1;
                pfri[1] = 1;
            }
            else if (!_.isNil(p) && (p.indexOf("{") > -1 || p.indexOf("}") > -1)) {
            }
            else if (!_.isNil(p) &&
                !_.startsWith(p[0], "=") &&
                _.startsWith(n, "=")) {
                return [vlen - 1, v_a[vlen - 1].length];
            }
            else {
                pfri[0] = pfri[0] + vlen - vplen - 1;
                pfri[1] = v_a[(i || 1) - 1].length;
            }
            return pfri;
        }
        else if (p.length < n.length) {
            return pfri;
        }
        return pfri;
    }
    return null;
}
export function createFormulaRangeSelect(ctx, select) {
    ctx.formulaRangeSelect = select;
}
export function createRangeHightlight(ctx, inputInnerHtmlStr, ignoreRangeIndex) {
    if (ignoreRangeIndex === void 0) { ignoreRangeIndex = -1; }
    var $span = parseElement("<div>".concat(inputInnerHtmlStr, "</div>"));
    var formulaRanges = [];
    $span
        .querySelectorAll("span.fortune-formula-functionrange-cell")
        .forEach(function (ele) {
        var rangeIndex = parseInt(ele.getAttribute("rangeindex") || "0", 10);
        if (rangeIndex === ignoreRangeIndex)
            return;
        var cellrange = getcellrange(ctx, ele.textContent || "");
        if (rangeIndex === ctx.formulaCache.selectingRangeIndex ||
            cellrange == null)
            return;
        if (cellrange.sheetId === ctx.currentSheetId ||
            (!cellrange.sheetId &&
                ctx.formulaCache.rangetosheet === ctx.currentSheetId)) {
            var rect = seletedHighlistByindex(ctx, cellrange.row[0], cellrange.row[1], cellrange.column[0], cellrange.column[1]);
            if (rect) {
                formulaRanges.push(__assign(__assign({ rangeIndex: rangeIndex }, rect), { backgroundColor: colors[rangeIndex] }));
            }
        }
    });
    ctx.formulaRangeHighlight = formulaRanges;
}
export function setCaretPosition(ctx, textDom, children, pos) {
    try {
        var el = textDom;
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el.childNodes[children], pos);
        range.collapse(true);
        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
        el.focus();
    }
    catch (err) {
        console.error(err);
        moveToEnd(ctx.formulaCache.rangeResizeTo[0]);
    }
}
function functionRange(ctx, obj, v, vp) {
    if (window.getSelection) {
        var currSelection = window.getSelection();
        if (!currSelection)
            return;
        var fri = findrangeindex(ctx, v, vp);
        if (_.isNil(fri)) {
            currSelection.selectAllChildren(obj);
            currSelection.collapseToEnd();
        }
        else {
            setCaretPosition(ctx, obj.querySelectorAll("span")[fri[0]], 0, fri[1]);
        }
    }
    else if (document.selection) {
        ctx.formulaCache.functionRangeIndex.moveToElementText(obj);
        ctx.formulaCache.functionRangeIndex.collapse(false);
        ctx.formulaCache.functionRangeIndex.select();
    }
}
function searchFunction(ctx, searchtxt) {
    var functionlist = locale(ctx).functionlist;
    var f = [];
    var s = [];
    var t = [];
    var result_i = 0;
    for (var i = 0; i < functionlist.length; i += 1) {
        var item = functionlist[i];
        var n = item.n;
        if (n === searchtxt) {
            f.unshift(item);
            result_i += 1;
        }
        else if (_.startsWith(n, searchtxt)) {
            s.unshift(item);
            result_i += 1;
        }
        else if (n.indexOf(searchtxt) > -1) {
            t.unshift(item);
            result_i += 1;
        }
        if (result_i >= 10) {
            break;
        }
    }
    var list = __spreadArray(__spreadArray(__spreadArray([], f, true), s, true), t, true);
    if (list.length <= 0) {
        return;
    }
    ctx.functionCandidates = list;
}
export function getrangeseleciton() {
    var _a, _b, _c, _d, _e;
    var currSelection = window.getSelection();
    if (!currSelection)
        return null;
    var anchorNode = currSelection.anchorNode, anchorOffset = currSelection.anchorOffset;
    if (!anchorNode)
        return null;
    if (((_b = (_a = anchorNode.parentNode) === null || _a === void 0 ? void 0 : _a.nodeName) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "span" &&
        anchorOffset !== 0) {
        var txt = _.trim(anchorNode.textContent || "");
        if (txt.length === 0 && anchorNode.parentNode.previousSibling) {
            var ahr = anchorNode.parentNode.previousSibling;
            txt = _.trim(ahr.textContent || "");
            return ahr;
        }
        return anchorNode.parentNode;
    }
    var anchorElement = anchorNode;
    if (anchorElement.id === "luckysheet-rich-text-editor" ||
        anchorElement.id === "luckysheet-functionbox-cell") {
        var txt = _.trim((_c = _.last(anchorElement.querySelectorAll("span"))) === null || _c === void 0 ? void 0 : _c.innerText);
        if (txt.length === 0 && anchorElement.querySelectorAll("span").length > 1) {
            var ahr = anchorElement.querySelectorAll("span");
            txt = _.trim(ahr[ahr.length - 2].innerText);
            return ahr === null || ahr === void 0 ? void 0 : ahr[0];
        }
        return _.last(anchorElement.querySelectorAll("span"));
    }
    if (((_d = anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentElement) === null || _d === void 0 ? void 0 : _d.id) === "luckysheet-rich-text-editor" ||
        ((_e = anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentElement) === null || _e === void 0 ? void 0 : _e.id) === "luckysheet-functionbox-cell" ||
        anchorOffset === 0) {
        var newAnchorNode = anchorOffset === 0 ? anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentNode : anchorNode;
        if (newAnchorNode === null || newAnchorNode === void 0 ? void 0 : newAnchorNode.previousSibling) {
            return newAnchorNode === null || newAnchorNode === void 0 ? void 0 : newAnchorNode.previousSibling;
        }
    }
    return null;
}
function helpFunctionExe($editer, currSelection, ctx) {
    var _a;
    var functionlist = locale(ctx).functionlist;
    if (_.isEmpty(ctx.formulaCache.functionlistMap)) {
        for (var i_1 = 0; i_1 < functionlist.length; i_1 += 1) {
            ctx.formulaCache.functionlistMap[functionlist[i_1].n] = functionlist[i_1];
        }
    }
    if (!currSelection) {
        return null;
    }
    var $prev = currSelection;
    var $span = $editer.querySelectorAll("span");
    var currentIndex = _.indexOf((_a = currSelection.parentNode) === null || _a === void 0 ? void 0 : _a.childNodes, currSelection);
    var i = currentIndex;
    if ($prev == null) {
        return null;
    }
    var funcName = null;
    var paramindex = null;
    if ($span[i].classList.contains("luckysheet-formula-text-func")) {
        funcName = $span[i].textContent;
    }
    else {
        var $cur = null;
        var exceptIndex = [-1, -1];
        while (--i > 0) {
            $cur = $span[i];
            if ($cur.classList.contains("luckysheet-formula-text-func") ||
                _.trim($cur.textContent || "").toUpperCase() in
                    ctx.formulaCache.functionlistMap) {
                funcName = $cur.textContent;
                paramindex = null;
                var endstate = true;
                for (var a = i; a <= currentIndex; a += 1) {
                    if (!paramindex) {
                        paramindex = 0;
                    }
                    if (a >= exceptIndex[0] && a <= exceptIndex[1]) {
                        continue;
                    }
                    $cur = $span[a];
                    if ($cur.classList.contains("luckysheet-formula-text-rpar")) {
                        exceptIndex = [i, a];
                        funcName = null;
                        endstate = false;
                        break;
                    }
                    if ($cur.classList.contains("luckysheet-formula-text-comma")) {
                        paramindex += 1;
                    }
                }
                if (endstate) {
                    break;
                }
            }
        }
    }
    return funcName;
}
export function rangeHightlightselected(ctx, $editor) {
    var currSelection = getrangeseleciton();
    if (!currSelection)
        return;
    var currText = _.trim(currSelection.textContent || "");
    if (currText === null || currText === void 0 ? void 0 : currText.match(/^[a-zA-Z_]+$/)) {
        searchFunction(ctx, currText.toUpperCase());
        ctx.functionHint = null;
    }
    else {
        var funcName = helpFunctionExe($editor, currSelection, ctx);
        ctx.functionHint = funcName === null || funcName === void 0 ? void 0 : funcName.toUpperCase();
        ctx.functionCandidates = [];
    }
}
function functionHTML(txt) {
    if (txt.substr(0, 1) === "=") {
        txt = txt.substr(1);
    }
    var funcstack = txt.split("");
    var i = 0;
    var str = "";
    var function_str = "";
    var matchConfig = {
        bracket: 0,
        comma: 0,
        squote: 0,
        dquote: 0,
        braces: 0,
    };
    while (i < funcstack.length) {
        var s = funcstack[i];
        if (s === "(" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            matchConfig.bracket += 1;
            if (str.length > 0) {
                function_str += "<span dir=\"auto\" class=\"luckysheet-formula-text-func\">".concat(str, "</span><span dir=\"auto\" class=\"luckysheet-formula-text-lpar\">(</span>");
            }
            else {
                function_str +=
                    '<span dir="auto" class="luckysheet-formula-text-lpar">(</span>';
            }
            str = "";
        }
        else if (s === ")" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            matchConfig.bracket -= 1;
            function_str += "".concat(functionHTML(str), "<span dir=\"auto\" class=\"luckysheet-formula-text-rpar\">)</span>");
            str = "";
        }
        else if (s === "{" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0) {
            str += "{";
            matchConfig.braces += 1;
        }
        else if (s === "}" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0) {
            str += "}";
            matchConfig.braces -= 1;
        }
        else if (s === '"' && matchConfig.squote === 0) {
            if (matchConfig.dquote > 0) {
                if (str.length > 0) {
                    function_str += "".concat(str, "\"</span>");
                }
                else {
                    function_str += '"</span>';
                }
                matchConfig.dquote -= 1;
                str = "";
            }
            else {
                matchConfig.dquote += 1;
                if (str.length > 0) {
                    function_str += "".concat(functionHTML(str), "<span dir=\"auto\" class=\"luckysheet-formula-text-string\">\"");
                }
                else {
                    function_str +=
                        '<span dir="auto" class="luckysheet-formula-text-string">"';
                }
                str = "";
            }
        }
        else if (s === "'" && matchConfig.dquote === 0) {
            str += "'";
            matchConfig.squote = matchConfig.squote === 0 ? 1 : 0;
        }
        else if (s === "," &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            function_str += "".concat(functionHTML(str), "<span dir=\"auto\" class=\"luckysheet-formula-text-comma\">,</span>");
            str = "";
        }
        else if (s === "&" &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            if (str.length > 0) {
                function_str +=
                    "".concat(functionHTML(str), "<span dir=\"auto\" class=\"luckysheet-formula-text-calc\">") +
                        "&" +
                        "</span>";
                str = "";
            }
            else {
                function_str +=
                    '<span dir="auto" class="luckysheet-formula-text-calc">' +
                        "&" +
                        "</span>";
            }
        }
        else if (s in operatorjson &&
            matchConfig.squote === 0 &&
            matchConfig.dquote === 0 &&
            matchConfig.braces === 0) {
            var s_next = "";
            if (i + 1 < funcstack.length) {
                s_next = funcstack[i + 1];
            }
            var p = i - 1;
            var s_pre = null;
            if (p >= 0) {
                do {
                    s_pre = funcstack[p];
                    p -= 1;
                } while (p >= 0 && s_pre === " ");
            }
            if (s + s_next in operatorjson) {
                if (str.length > 0) {
                    function_str += "".concat(functionHTML(str), "<span dir=\"auto\" class=\"luckysheet-formula-text-calc\">").concat(s).concat(s_next, "</span>");
                    str = "";
                }
                else {
                    function_str += "<span dir=\"auto\" class=\"luckysheet-formula-text-calc\">".concat(s).concat(s_next, "</span>");
                }
                i += 1;
            }
            else if (!/[^0-9]/.test(s_next) &&
                s === "-" &&
                (s_pre === "(" ||
                    _.isNil(s_pre) ||
                    s_pre === "," ||
                    s_pre === " " ||
                    s_pre in operatorjson)) {
                str += s;
            }
            else {
                if (str.length > 0) {
                    function_str += "".concat(functionHTML(str), "<span dir=\"auto\" class=\"luckysheet-formula-text-calc\">").concat(s, "</span>");
                    str = "";
                }
                else {
                    function_str += "<span dir=\"auto\" class=\"luckysheet-formula-text-calc\">".concat(s, "</span>");
                }
            }
        }
        else {
            str += s;
        }
        if (i === funcstack.length - 1) {
            if (iscelldata(_.trim(str))) {
                var rangeIndex = rangeIndexes.length > functionHTMLIndex
                    ? rangeIndexes[functionHTMLIndex]
                    : functionHTMLIndex;
                function_str += "<span class=\"fortune-formula-functionrange-cell\" rangeindex=\"".concat(rangeIndex, "\" dir=\"auto\" style=\"color:").concat(colors[rangeIndex], ";\">").concat(str, "</span>");
                functionHTMLIndex += 1;
            }
            else if (matchConfig.dquote > 0) {
                function_str += "".concat(str, "</span>");
            }
            else if (str.indexOf("</span>") === -1 && str.length > 0) {
                var regx = /{.*?}/;
                if (regx.test(_.trim(str))) {
                    var arraytxt = regx.exec(str)[0];
                    var arraystart = str.search(regx);
                    var alltxt = "";
                    if (arraystart > 0) {
                        alltxt += "<span dir=\"auto\" class=\"luckysheet-formula-text-color\">".concat(str.substr(0, arraystart), "</span>");
                    }
                    alltxt += "<span dir=\"auto\" style=\"color:#959a05\" class=\"luckysheet-formula-text-array\">".concat(arraytxt, "</span>");
                    if (arraystart + arraytxt.length < str.length) {
                        alltxt += "<span dir=\"auto\" class=\"luckysheet-formula-text-color\">".concat(str.substr(arraystart + arraytxt.length, str.length), "</span>");
                    }
                    function_str += alltxt;
                }
                else {
                    function_str += "<span dir=\"auto\" class=\"luckysheet-formula-text-color\">".concat(str, "</span>");
                }
            }
        }
        i += 1;
    }
    return function_str;
}
export function functionHTMLGenerate(txt) {
    if (txt.length === 0 || txt.substring(0, 1) !== "=") {
        return txt;
    }
    functionHTMLIndex = 0;
    return "<span dir=\"auto\" class=\"luckysheet-formula-text-color\">=</span>".concat(functionHTML(txt));
}
function getRangeIndexes($editor) {
    var res = [];
    $editor
        .querySelectorAll("span.fortune-formula-functionrange-cell")
        .forEach(function (ele) {
        var indexStr = ele.getAttribute("rangeindex");
        if (indexStr) {
            var rangeIndex = parseInt(indexStr, 10);
            res.push(rangeIndex);
        }
    });
    return res;
}
export function handleFormulaInput(ctx, $copyTo, $editor, kcode, preText, refreshRangeSelect) {
    var _a, _b, _c, _d, _e, _f;
    if (refreshRangeSelect === void 0) { refreshRangeSelect = true; }
    var value1;
    var value1txt = preText !== null && preText !== void 0 ? preText : $editor.innerText;
    var value = $editor.innerText;
    value = escapeScriptTag(value);
    if (value.length > 0 &&
        value.substring(0, 1) === "=" &&
        (kcode !== 229 || value.length === 1)) {
        if (!refreshRangeSelect)
            rangeIndexes = getRangeIndexes($editor);
        value = functionHTMLGenerate(value);
        if (!refreshRangeSelect && functionHTMLIndex < rangeIndexes.length)
            refreshRangeSelect = true;
        value1 = functionHTMLGenerate(value1txt);
        rangeIndexes = [];
        if (window.getSelection) {
            var currSelection = window.getSelection();
            if (!currSelection)
                return;
            if (((_a = currSelection.anchorNode) === null || _a === void 0 ? void 0 : _a.nodeName.toLowerCase()) === "div") {
                var editorlen = $editor.querySelectorAll("span").length;
                if (editorlen > 0)
                    ctx.formulaCache.functionRangeIndex = [
                        editorlen - 1,
                        (_b = $editor.querySelectorAll("span").item(editorlen - 1).textContent) === null || _b === void 0 ? void 0 : _b.length,
                    ];
            }
            else {
                ctx.formulaCache.functionRangeIndex = [
                    _.indexOf((_e = (_d = (_c = currSelection.anchorNode) === null || _c === void 0 ? void 0 : _c.parentNode) === null || _d === void 0 ? void 0 : _d.parentNode) === null || _e === void 0 ? void 0 : _e.childNodes, (_f = currSelection.anchorNode) === null || _f === void 0 ? void 0 : _f.parentNode),
                    currSelection.anchorOffset,
                ];
            }
        }
        else {
            var textRange = document.selection.createRange();
            ctx.formulaCache.functionRangeIndex = textRange;
        }
        $editor.innerHTML = value;
        if ($copyTo)
            $copyTo.innerHTML = value;
        functionRange(ctx, $editor, value, value1);
        if (refreshRangeSelect) {
            cancelFunctionrangeSelected(ctx);
            if (kcode !== 46) {
                createRangeHightlight(ctx, value);
            }
            ctx.formulaCache.rangestart = false;
            ctx.formulaCache.rangedrag_column_start = false;
            ctx.formulaCache.rangedrag_row_start = false;
            rangeHightlightselected(ctx, $editor);
        }
    }
    else if (_.startsWith(value1txt, "=") && !_.startsWith(value, "=")) {
        if ($copyTo)
            $copyTo.innerHTML = value;
        $editor.innerHTML = escapeHTMLTag(value);
    }
    else if (!_.startsWith(value1txt, "=")) {
        if (!$copyTo)
            return;
        if ($copyTo.id === "luckysheet-rich-text-editor") {
            if (!_.startsWith($copyTo.innerHTML, "<span")) {
                $copyTo.innerHTML = escapeHTMLTag(value);
            }
        }
        else {
            $copyTo.innerHTML = escapeHTMLTag(value);
        }
    }
}
function isfreezonFuc(txt) {
    var row = txt.replace(/[^0-9]/g, "");
    var col = txt.replace(/[^A-Za-z]/g, "");
    var row$ = txt.substr(txt.indexOf(row) - 1, 1);
    var col$ = txt.substr(txt.indexOf(col) - 1, 1);
    var ret = [false, false];
    if (row$ === "$") {
        ret[0] = true;
    }
    if (col$ === "$") {
        ret[1] = true;
    }
    return ret;
}
function functionStrChange_range(txt, type, rc, orient, stindex, step) {
    var val = txt.split("!");
    var rangetxt;
    var prefix = "";
    if (val.length > 1) {
        rangetxt = val[1];
        prefix = "".concat(val[0], "!");
    }
    else {
        rangetxt = val[0];
    }
    var r1;
    var r2;
    var c1;
    var c2;
    var $row0;
    var $row1;
    var $col0;
    var $col1;
    if (rangetxt.indexOf(":") === -1) {
        r1 = parseInt(rangetxt.replace(/[^0-9]/g, ""), 10) - 1;
        r2 = r1;
        c1 = columnCharToIndex(rangetxt.replace(/[^A-Za-z]/g, ""));
        c2 = c1;
        var freezonFuc = isfreezonFuc(rangetxt);
        $row0 = freezonFuc[0] ? "$" : "";
        $row1 = $row0;
        $col0 = freezonFuc[1] ? "$" : "";
        $col1 = $col0;
    }
    else {
        rangetxt = rangetxt.split(":");
        r1 = parseInt(rangetxt[0].replace(/[^0-9]/g, ""), 10) - 1;
        r2 = parseInt(rangetxt[1].replace(/[^0-9]/g, ""), 10) - 1;
        if (r1 > r2) {
            return txt;
        }
        c1 = columnCharToIndex(rangetxt[0].replace(/[^A-Za-z]/g, ""));
        c2 = columnCharToIndex(rangetxt[1].replace(/[^A-Za-z]/g, ""));
        if (c1 > c2) {
            return txt;
        }
        var freezonFuc0 = isfreezonFuc(rangetxt[0]);
        $row0 = freezonFuc0[0] ? "$" : "";
        $col0 = freezonFuc0[1] ? "$" : "";
        var freezonFuc1 = isfreezonFuc(rangetxt[1]);
        $row1 = freezonFuc1[0] ? "$" : "";
        $col1 = freezonFuc1[1] ? "$" : "";
    }
    if (type === "del") {
        if (rc === "row") {
            if (r1 >= stindex && r2 <= stindex + step - 1) {
                return error.r;
            }
            if (r1 > stindex + step - 1) {
                r1 -= step;
            }
            else if (r1 >= stindex) {
                r1 = stindex;
            }
            if (r2 > stindex + step - 1) {
                r2 -= step;
            }
            else if (r2 >= stindex) {
                r2 = stindex - 1;
            }
            if (r1 < 0) {
                r1 = 0;
            }
            if (r2 < r1) {
                r2 = r1;
            }
        }
        else if (rc === "col") {
            if (c1 >= stindex && c2 <= stindex + step - 1) {
                return error.r;
            }
            if (c1 > stindex + step - 1) {
                c1 -= step;
            }
            else if (c1 >= stindex) {
                c1 = stindex;
            }
            if (c2 > stindex + step - 1) {
                c2 -= step;
            }
            else if (c2 >= stindex) {
                c2 = stindex - 1;
            }
            if (c1 < 0) {
                c1 = 0;
            }
            if (c2 < c1) {
                c2 = c1;
            }
        }
        if (r1 === r2 && c1 === c2) {
            if (!Number.isNaN(r1) && !Number.isNaN(c1)) {
                return prefix + $col0 + indexToColumnChar(c1) + $row0 + (r1 + 1);
            }
            if (!Number.isNaN(r1)) {
                return prefix + $row0 + (r1 + 1);
            }
            if (!Number.isNaN(c1)) {
                return prefix + $col0 + indexToColumnChar(c1);
            }
            return txt;
        }
        if (Number.isNaN(c1) && Number.isNaN(c2)) {
            return "".concat(prefix + $row0 + (r1 + 1), ":").concat($row1).concat(r2 + 1);
        }
        if (Number.isNaN(r1) && Number.isNaN(r2)) {
            return "".concat(prefix + $col0 + indexToColumnChar(c1), ":").concat($col1).concat(indexToColumnChar(c2));
        }
        return "".concat(prefix + $col0 + indexToColumnChar(c1) + $row0 + (r1 + 1), ":").concat($col1).concat(indexToColumnChar(c2)).concat($row1).concat(r2 + 1);
    }
    if (type === "add") {
        if (rc === "row") {
            if (orient === "lefttop") {
                if (r1 >= stindex) {
                    r1 += step;
                }
                if (r2 >= stindex) {
                    r2 += step;
                }
            }
            else if (orient === "rightbottom") {
                if (r1 > stindex) {
                    r1 += step;
                }
                if (r2 > stindex) {
                    r2 += step;
                }
            }
        }
        else if (rc === "col") {
            if (orient === "lefttop") {
                if (c1 >= stindex) {
                    c1 += step;
                }
                if (c2 >= stindex) {
                    c2 += step;
                }
            }
            else if (orient === "rightbottom") {
                if (c1 > stindex) {
                    c1 += step;
                }
                if (c2 > stindex) {
                    c2 += step;
                }
            }
        }
        if (r1 === r2 && c1 === c2) {
            if (!Number.isNaN(r1) && !Number.isNaN(c1)) {
                return prefix + $col0 + indexToColumnChar(c1) + $row0 + (r1 + 1);
            }
            if (!Number.isNaN(r1)) {
                return prefix + $row0 + (r1 + 1);
            }
            if (!Number.isNaN(c1)) {
                return prefix + $col0 + indexToColumnChar(c1);
            }
            return txt;
        }
        if (Number.isNaN(c1) && Number.isNaN(c2)) {
            return "".concat(prefix + $row0 + (r1 + 1), ":").concat($row1).concat(r2 + 1);
        }
        if (Number.isNaN(r1) && Number.isNaN(r2)) {
            return "".concat(prefix + $col0 + indexToColumnChar(c1), ":").concat($col1).concat(indexToColumnChar(c2));
        }
        return "".concat(prefix + $col0 + indexToColumnChar(c1) + $row0 + (r1 + 1), ":").concat($col1).concat(indexToColumnChar(c2)).concat($row1).concat(r2 + 1);
    }
    return "";
}
export function israngeseleciton(ctx, istooltip) {
    var _a, _b, _c;
    if (istooltip == null) {
        istooltip = false;
    }
    var currSelection = window.getSelection();
    if (currSelection == null)
        return false;
    var anchor = currSelection.anchorNode;
    if (!(anchor === null || anchor === void 0 ? void 0 : anchor.textContent))
        return false;
    var anchorOffset = currSelection.anchorOffset;
    var anchorElement = anchor;
    var parentElement = anchor.parentNode;
    if (((_a = anchor === null || anchor === void 0 ? void 0 : anchor.parentNode) === null || _a === void 0 ? void 0 : _a.nodeName.toLowerCase()) === "span" &&
        anchorOffset !== 0) {
        var txt = _.trim(anchor.textContent);
        var lasttxt = "";
        if (txt.length === 0 && anchor.parentNode.previousSibling) {
            var ahr = anchor.parentNode.previousSibling;
            txt = _.trim(ahr.textContent || "");
            lasttxt = txt.substring(txt.length - 1, 1);
            ctx.formulaCache.rangeSetValueTo = anchor.parentNode;
        }
        else {
            lasttxt = txt.substring(anchorOffset - 1, 1);
            ctx.formulaCache.rangeSetValueTo = anchor.parentNode;
        }
        if ((istooltip && (lasttxt === "(" || lasttxt === ",")) ||
            (!istooltip &&
                (lasttxt === "(" ||
                    lasttxt === "," ||
                    lasttxt === "=" ||
                    lasttxt in operatorjson ||
                    lasttxt === "&"))) {
            return true;
        }
    }
    else if (anchorElement.id === "luckysheet-rich-text-editor" ||
        anchorElement.id === "luckysheet-functionbox-cell") {
        var txt = _.trim((_b = _.last(anchorElement.querySelectorAll("span"))) === null || _b === void 0 ? void 0 : _b.innerText);
        ctx.formulaCache.rangeSetValueTo = _.last(anchorElement.querySelectorAll("span"));
        if (txt.length === 0 && anchorElement.querySelectorAll("span").length > 1) {
            var ahr = anchorElement.querySelectorAll("span");
            txt = _.trim(ahr[ahr.length - 2].innerText);
            txt = _.trim(ahr[ahr.length - 2].innerText);
            ctx.formulaCache.rangeSetValueTo = ahr;
        }
        var lasttxt = txt.substring(txt.length - 1, 1);
        if ((istooltip && (lasttxt === "(" || lasttxt === ",")) ||
            (!istooltip &&
                (lasttxt === "(" ||
                    lasttxt === "," ||
                    lasttxt === "=" ||
                    lasttxt in operatorjson ||
                    lasttxt === "&"))) {
            return true;
        }
    }
    else if (parentElement.id === "luckysheet-rich-text-editor" ||
        parentElement.id === "luckysheet-functionbox-cell" ||
        anchorOffset === 0) {
        if (anchorOffset === 0) {
            anchor = anchor.parentNode;
        }
        if (!anchor)
            return false;
        if (((_c = anchor.previousSibling) === null || _c === void 0 ? void 0 : _c.textContent) == null)
            return false;
        if (anchor.previousSibling) {
            var txt = _.trim(anchor.previousSibling.textContent);
            var lasttxt = txt.substring(txt.length - 1, 1);
            ctx.formulaCache.rangeSetValueTo = anchor.previousSibling;
            if ((istooltip && (lasttxt === "(" || lasttxt === ",")) ||
                (!istooltip &&
                    (lasttxt === "(" ||
                        lasttxt === "," ||
                        lasttxt === "=" ||
                        lasttxt in operatorjson ||
                        lasttxt === "&"))) {
                return true;
            }
        }
    }
    return false;
}
export function functionStrChange(txt, type, rc, orient, stindex, step) {
    if (!txt) {
        return "";
    }
    if (txt.substring(0, 1) === "=") {
        txt = txt.substring(1);
    }
    var funcstack = txt.split("");
    var i = 0;
    var str = "";
    var function_str = "";
    var matchConfig = {
        bracket: 0,
        comma: 0,
        squote: 0,
        dquote: 0,
    };
    while (i < funcstack.length) {
        var s = funcstack[i];
        if (s === "(" && matchConfig.dquote === 0) {
            matchConfig.bracket += 1;
            if (str.length > 0) {
                function_str += "".concat(str, "(");
            }
            else {
                function_str += "(";
            }
            str = "";
        }
        else if (s === ")" && matchConfig.dquote === 0) {
            matchConfig.bracket -= 1;
            function_str += "".concat(functionStrChange(str, type, rc, orient, stindex, step), ")");
            str = "";
        }
        else if (s === '"' && matchConfig.squote === 0) {
            if (matchConfig.dquote > 0) {
                function_str += "".concat(str, "\"");
                matchConfig.dquote -= 1;
                str = "";
            }
            else {
                matchConfig.dquote += 1;
                str += '"';
            }
        }
        else if (s === "," && matchConfig.dquote === 0) {
            function_str += "".concat(functionStrChange(str, type, rc, orient, stindex, step), ",");
            str = "";
        }
        else if (s === "&" && matchConfig.dquote === 0) {
            if (str.length > 0) {
                function_str += "".concat(functionStrChange(str, type, rc, orient, stindex, step), "&");
                str = "";
            }
            else {
                function_str += "&";
            }
        }
        else if (s in operatorjson && matchConfig.dquote === 0) {
            var s_next = "";
            if (i + 1 < funcstack.length) {
                s_next = funcstack[i + 1];
            }
            var p = i - 1;
            var s_pre = null;
            if (p >= 0) {
                do {
                    s_pre = funcstack[(p -= 1)];
                } while (p >= 0 && s_pre === " ");
            }
            if (s + s_next in operatorjson) {
                if (str.length > 0) {
                    function_str +=
                        functionStrChange(str, type, rc, orient, stindex, step) +
                            s +
                            s_next;
                    str = "";
                }
                else {
                    function_str += s + s_next;
                }
                i += 1;
            }
            else if (!/[^0-9]/.test(s_next) &&
                s === "-" &&
                (s_pre === "(" ||
                    s_pre == null ||
                    s_pre === "," ||
                    s_pre === " " ||
                    s_pre in operatorjson)) {
                str += s;
            }
            else {
                if (str.length > 0) {
                    function_str +=
                        functionStrChange(str, type, rc, orient, stindex, step) + s;
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
        if (i === funcstack.length - 1) {
            if (iscelldata(_.trim(str))) {
                function_str += functionStrChange_range(_.trim(str), type, rc, orient, stindex, step);
            }
            else {
                function_str += _.trim(str);
            }
        }
        i += 1;
    }
    return function_str;
}
export function rangeSetValue(ctx, cellInput, selected, fxInput) {
    var _a, _b, _c, _d, _e;
    var $editor = cellInput;
    var $copyTo = fxInput;
    if (((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.id) === "luckysheet-functionbox-cell") {
        $editor = fxInput;
        $copyTo = cellInput;
    }
    var range = "";
    var rf = selected.row[0];
    var cf = selected.column[0];
    if (ctx.config.merge != null && "".concat(rf, "_").concat(cf) in ctx.config.merge) {
        range = getRangetxt(ctx, ctx.currentSheetId, {
            column: [cf, cf],
            row: [rf, rf],
        }, ctx.formulaCache.rangetosheet);
    }
    else {
        range = getRangetxt(ctx, ctx.currentSheetId, selected, ctx.formulaCache.rangetosheet);
    }
    if (!israngeseleciton(ctx) &&
        (ctx.formulaCache.rangestart ||
            ctx.formulaCache.rangedrag_column_start ||
            ctx.formulaCache.rangedrag_row_start)) {
        var span = $editor.querySelector("span[rangeindex='".concat(ctx.formulaCache.rangechangeindex, "']"));
        if (span) {
            span.innerHTML = range;
            setCaretPosition(ctx, span, 0, range.length);
        }
    }
    else {
        var function_str = "<span class=\"fortune-formula-functionrange-cell\" rangeindex=\"".concat(functionHTMLIndex, "\" dir=\"auto\" style=\"color:").concat(colors[functionHTMLIndex], ";\">").concat(range, "</span>");
        var newEle = parseElement(function_str);
        var refEle = ctx.formulaCache.rangeSetValueTo;
        if (refEle && refEle.parentNode) {
            var leftPar = (_b = document.getElementsByClassName("luckysheet-formula-text-lpar")) === null || _b === void 0 ? void 0 : _b[0];
            if ((_c = leftPar === null || leftPar === void 0 ? void 0 : leftPar.parentElement) === null || _c === void 0 ? void 0 : _c.classList.contains("luckysheet-formula-text-color")) {
                (_e = (_d = document
                    .getElementsByClassName("luckysheet-formula-text-lpar")) === null || _d === void 0 ? void 0 : _d[0].parentNode) === null || _e === void 0 ? void 0 : _e.appendChild(newEle);
            }
            else {
                refEle.parentNode.insertBefore(newEle, refEle.nextSibling);
            }
        }
        else {
            $editor.appendChild(newEle);
        }
        ctx.formulaCache.rangechangeindex = functionHTMLIndex;
        var span = $editor.querySelector("span[rangeindex='".concat(ctx.formulaCache.rangechangeindex, "']"));
        setCaretPosition(ctx, span, 0, range.length);
        functionHTMLIndex += 1;
    }
    if ($copyTo)
        $copyTo.innerHTML = $editor.innerHTML;
}
export function onFormulaRangeDragEnd(ctx) {
    if (ctx.formulaCache.func_selectedrange) {
        var _a = ctx.formulaCache.func_selectedrange, left = _a.left_move, top_1 = _a.top_move, width = _a.width_move, height = _a.height_move;
        if (left != null &&
            top_1 != null &&
            width != null &&
            height != null &&
            (ctx.formulaCache.rangestart ||
                ctx.formulaCache.rangedrag_column_start ||
                ctx.formulaCache.rangedrag_row_start))
            ctx.formulaRangeSelect = {
                rangeIndex: ctx.formulaCache.rangeIndex || 0,
                left: left,
                top: top_1,
                width: width,
                height: height,
            };
    }
    ctx.formulaCache.selectingRangeIndex = -1;
}
function setRangeSelect(container, left, top, height, width) {
    var rangeElement = container.querySelector(".fortune-formula-functionrange-select");
    if (rangeElement == null)
        return;
    rangeElement.style.left = "".concat(left, "px");
    rangeElement.style.top = "".concat(top, "px");
    rangeElement.style.height = "".concat(height, "px");
    rangeElement.style.width = "".concat(width, "px");
}
export function rangeDrag(ctx, e, cellInput, scrollLeft, scrollTop, container, fxInput) {
    var func_selectedrange = ctx.formulaCache.func_selectedrange;
    if (!func_selectedrange ||
        func_selectedrange.left == null ||
        func_selectedrange.height == null ||
        func_selectedrange.top == null ||
        func_selectedrange.width == null)
        return;
    var rect = container.getBoundingClientRect();
    var x = e.pageX - rect.left - ctx.rowHeaderWidth + scrollLeft;
    var y = e.pageY - rect.top - ctx.columnHeaderHeight + scrollTop;
    var _a = rowLocation(y, ctx.visibledatarow), row_pre = _a[0], row = _a[1], row_index = _a[2];
    var _b = colLocation(x, ctx.visibledatacolumn), col_pre = _b[0], col = _b[1], col_index = _b[2];
    var top = 0;
    var height = 0;
    var rowseleted = [];
    if (func_selectedrange.top > row_pre) {
        top = row_pre;
        height = func_selectedrange.top + func_selectedrange.height - row_pre;
        rowseleted = [row_index, func_selectedrange.row[1]];
    }
    else if (func_selectedrange.top === row_pre) {
        top = row_pre;
        height = func_selectedrange.top + func_selectedrange.height - row_pre;
        rowseleted = [row_index, func_selectedrange.row[0]];
    }
    else {
        top = func_selectedrange.top;
        height = row - func_selectedrange.top - 1;
        rowseleted = [func_selectedrange.row[0], row_index];
    }
    var left = 0;
    var width = 0;
    var columnseleted = [];
    if (func_selectedrange.left > col_pre) {
        left = col_pre;
        width = func_selectedrange.left + func_selectedrange.width - col_pre;
        columnseleted = [col_index, func_selectedrange.column[1]];
    }
    else if (func_selectedrange.left === col_pre) {
        left = col_pre;
        width = func_selectedrange.left + func_selectedrange.width - col_pre;
        columnseleted = [col_index, func_selectedrange.column[0]];
    }
    else {
        left = func_selectedrange.left;
        width = col - func_selectedrange.left - 1;
        columnseleted = [func_selectedrange.column[0], col_index];
    }
    var changeparam = mergeMoveMain(ctx, columnseleted, rowseleted, func_selectedrange, top, height, left, width);
    if (changeparam != null) {
        columnseleted = changeparam[0], rowseleted = changeparam[1], top = changeparam[2], height = changeparam[3], left = changeparam[4], width = changeparam[5];
    }
    func_selectedrange.row = rowseleted;
    func_selectedrange.column = columnseleted;
    func_selectedrange.left_move = left;
    func_selectedrange.width_move = width;
    func_selectedrange.top_move = top;
    func_selectedrange.height_move = height;
    rangeSetValue(ctx, cellInput, {
        row: rowseleted,
        column: columnseleted,
    }, fxInput);
    setRangeSelect(container, left, top, height, width);
    e.preventDefault();
}
export function rangeDragColumn(ctx, e, cellInput, scrollLeft, scrollTop, container, fxInput) {
    var func_selectedrange = ctx.formulaCache.func_selectedrange;
    if (!func_selectedrange ||
        func_selectedrange.left == null ||
        func_selectedrange.height == null ||
        func_selectedrange.top == null ||
        func_selectedrange.width == null)
        return;
    var mouse = mousePosition(e.pageX, e.pageY, ctx);
    var x = mouse[0] + scrollLeft;
    var visibledatarow = ctx.visibledatarow;
    var row_index = visibledatarow.length - 1;
    var row = visibledatarow[row_index];
    var row_pre = 0;
    var _a = colLocation(x, ctx.visibledatacolumn), col_pre = _a[0], col = _a[1], col_index = _a[2];
    var left = 0;
    var width = 0;
    var columnseleted = [];
    if (func_selectedrange.left > col_pre) {
        left = col_pre;
        width = func_selectedrange.left + func_selectedrange.width - col_pre;
        columnseleted = [col_index, func_selectedrange.column[1]];
    }
    else if (func_selectedrange.left === col_pre) {
        left = col_pre;
        width = func_selectedrange.left + func_selectedrange.width - col_pre;
        columnseleted = [col_index, func_selectedrange.column[0]];
    }
    else {
        left = func_selectedrange.left;
        width = col - func_selectedrange.left - 1;
        columnseleted = [func_selectedrange.column[0], col_index];
    }
    var changeparam = mergeMoveMain(ctx, columnseleted, [0, row_index], func_selectedrange, row_pre, row - row_pre - 1, left, width);
    if (changeparam != null) {
        columnseleted = changeparam[0], left = changeparam[4], width = changeparam[5];
    }
    func_selectedrange.column = columnseleted;
    func_selectedrange.left_move = left;
    func_selectedrange.width_move = width;
    rangeSetValue(ctx, cellInput, {
        row: [null, null],
        column: columnseleted,
    }, fxInput);
    setRangeSelect(container, left, row_pre, row - row_pre - 1, width);
}
export function rangeDragRow(ctx, e, cellInput, scrollLeft, scrollTop, container, fxInput) {
    var func_selectedrange = ctx.formulaCache.func_selectedrange;
    if (!func_selectedrange ||
        func_selectedrange.left == null ||
        func_selectedrange.height == null ||
        func_selectedrange.top == null ||
        func_selectedrange.width == null)
        return;
    var mouse = mousePosition(e.pageX, e.pageY, ctx);
    var y = mouse[1] + scrollTop;
    var _a = rowLocation(y, ctx.visibledatarow), row_pre = _a[0], row = _a[1], row_index = _a[2];
    var visibledatacolumn = ctx.visibledatacolumn;
    var col_index = visibledatacolumn.length - 1;
    var col = visibledatacolumn[col_index];
    var col_pre = 0;
    var top = 0;
    var height = 0;
    var rowseleted = [];
    if (func_selectedrange.top > row_pre) {
        top = row_pre;
        height = func_selectedrange.top + func_selectedrange.height - row_pre;
        rowseleted = [row_index, func_selectedrange.row[1]];
    }
    else if (func_selectedrange.top === row_pre) {
        top = row_pre;
        height = func_selectedrange.top + func_selectedrange.height - row_pre;
        rowseleted = [row_index, func_selectedrange.row[0]];
    }
    else {
        top = func_selectedrange.top;
        height = row - func_selectedrange.top - 1;
        rowseleted = [func_selectedrange.row[0], row_index];
    }
    var changeparam = mergeMoveMain(ctx, [0, col_index], rowseleted, func_selectedrange, top, height, col_pre, col - col_pre - 1);
    if (changeparam != null) {
        rowseleted = changeparam[1], top = changeparam[2], height = changeparam[3];
    }
    func_selectedrange.row = rowseleted;
    func_selectedrange.top_move = top;
    func_selectedrange.height_move = height;
    rangeSetValue(ctx, cellInput, {
        row: rowseleted,
        column: [null, null],
    }, fxInput);
    setRangeSelect(container, col_pre, top, height, col - col_pre - 1);
}
function updateparam(orient, txt, step) {
    var val = txt.split("!");
    var rangetxt;
    var prefix = "";
    if (val.length > 1) {
        rangetxt = val[1];
        prefix = "".concat(val[0], "!");
    }
    else {
        rangetxt = val[0];
    }
    if (rangetxt.indexOf(":") === -1) {
        var row_3 = parseInt(rangetxt.replace(/[^0-9]/g, ""), 10);
        var col_3 = columnCharToIndex(rangetxt.replace(/[^A-Za-z]/g, ""));
        var freezonFuc = isfreezonFuc(rangetxt);
        var $row = freezonFuc[0] ? "$" : "";
        var $col = freezonFuc[1] ? "$" : "";
        if (orient === "u" && !freezonFuc[0]) {
            row_3 -= step;
        }
        else if (orient === "r" && !freezonFuc[1]) {
            col_3 += step;
        }
        else if (orient === "l" && !freezonFuc[1]) {
            col_3 -= step;
        }
        else if (orient === "d" && !freezonFuc[0]) {
            row_3 += step;
        }
        if (!Number.isNaN(row_3) && !Number.isNaN(col_3)) {
            return prefix + $col + indexToColumnChar(col_3) + $row + row_3;
        }
        if (!Number.isNaN(row_3)) {
            return prefix + $row + row_3;
        }
        if (!Number.isNaN(col_3)) {
            return prefix + $col + indexToColumnChar(col_3);
        }
        return txt;
    }
    rangetxt = rangetxt.split(":");
    var row = [];
    var col = [];
    row[0] = parseInt(rangetxt[0].replace(/[^0-9]/g, ""), 10);
    row[1] = parseInt(rangetxt[1].replace(/[^0-9]/g, ""), 10);
    if (row[0] > row[1]) {
        return txt;
    }
    col[0] = columnCharToIndex(rangetxt[0].replace(/[^A-Za-z]/g, ""));
    col[1] = columnCharToIndex(rangetxt[1].replace(/[^A-Za-z]/g, ""));
    if (col[0] > col[1]) {
        return txt;
    }
    var freezonFuc0 = isfreezonFuc(rangetxt[0]);
    var freezonFuc1 = isfreezonFuc(rangetxt[1]);
    var $row0 = freezonFuc0[0] ? "$" : "";
    var $col0 = freezonFuc0[1] ? "$" : "";
    var $row1 = freezonFuc1[0] ? "$" : "";
    var $col1 = freezonFuc1[1] ? "$" : "";
    if (orient === "u") {
        if (!freezonFuc0[0]) {
            row[0] -= step;
        }
        if (!freezonFuc1[0]) {
            row[1] -= step;
        }
    }
    else if (orient === "r") {
        if (!freezonFuc0[1]) {
            col[0] += step;
        }
        if (!freezonFuc1[1]) {
            col[1] += step;
        }
    }
    else if (orient === "l") {
        if (!freezonFuc0[1]) {
            col[0] -= step;
        }
        if (!freezonFuc1[1]) {
            col[1] -= step;
        }
    }
    else if (orient === "d") {
        if (!freezonFuc0[0]) {
            row[0] += step;
        }
        if (!freezonFuc1[0]) {
            row[1] += step;
        }
    }
    if (row[0] < 0 || col[0] < 0) {
        return error.r;
    }
    if (Number.isNaN(col[0]) && Number.isNaN(col[1])) {
        return "".concat(prefix + $row0 + row[0], ":").concat($row1).concat(row[1]);
    }
    if (Number.isNaN(row[0]) && Number.isNaN(row[1])) {
        return "".concat(prefix + $col0 + indexToColumnChar(col[0]), ":").concat($col1).concat(indexToColumnChar(col[1]));
    }
    return "".concat(prefix + $col0 + indexToColumnChar(col[0]) + $row0 + row[0], ":").concat($col1).concat(indexToColumnChar(col[1])).concat($row1).concat(row[1]);
}
function downparam(txt, step) {
    return updateparam("d", txt, step);
}
function upparam(txt, step) {
    return updateparam("u", txt, step);
}
function leftparam(txt, step) {
    return updateparam("l", txt, step);
}
function rightparam(txt, step) {
    return updateparam("r", txt, step);
}
export function functionCopy(ctx, txt, mode, step) {
    if (mode == null) {
        mode = "down";
    }
    if (step == null) {
        step = 1;
    }
    if (txt.substring(0, 1) === "=") {
        txt = txt.substring(1);
    }
    var funcstack = txt.split("");
    var i = 0;
    var str = "";
    var function_str = "";
    var matchConfig = {
        bracket: 0,
        comma: 0,
        squote: 0,
        dquote: 0,
    };
    while (i < funcstack.length) {
        var s = funcstack[i];
        if (s === "(" && matchConfig.dquote === 0) {
            matchConfig.bracket += 1;
            if (str.length > 0) {
                function_str += "".concat(str, "(");
            }
            else {
                function_str += "(";
            }
            str = "";
        }
        else if (s === ")" && matchConfig.dquote === 0) {
            matchConfig.bracket -= 1;
            function_str += "".concat(functionCopy(ctx, str, mode, step), ")");
            str = "";
        }
        else if (s === '"' && matchConfig.squote === 0) {
            if (matchConfig.dquote > 0) {
                function_str += "".concat(str, "\"");
                matchConfig.dquote -= 1;
                str = "";
            }
            else {
                matchConfig.dquote += 1;
                str += '"';
            }
        }
        else if (s === "," && matchConfig.dquote === 0) {
            function_str += "".concat(functionCopy(ctx, str, mode, step), ",");
            str = "";
        }
        else if (s === "&" && matchConfig.dquote === 0) {
            if (str.length > 0) {
                function_str += "".concat(functionCopy(ctx, str, mode, step), "&");
                str = "";
            }
            else {
                function_str += "&";
            }
        }
        else if (s in operatorjson && matchConfig.dquote === 0) {
            var s_next = "";
            if (i + 1 < funcstack.length) {
                s_next = funcstack[i + 1];
            }
            var p = i - 1;
            var s_pre = null;
            if (p >= 0) {
                do {
                    s_pre = funcstack[p];
                    p -= 1;
                } while (p >= 0 && s_pre === " ");
            }
            if (s + s_next in operatorjson) {
                if (str.length > 0) {
                    function_str += functionCopy(ctx, str, mode, step) + s + s_next;
                    str = "";
                }
                else {
                    function_str += s + s_next;
                }
                i += 1;
            }
            else if (!/[^0-9]/.test(s_next) &&
                s === "-" &&
                (s_pre === "(" ||
                    s_pre == null ||
                    s_pre === "," ||
                    s_pre === " " ||
                    s_pre in operatorjson)) {
                str += s;
            }
            else {
                if (str.length > 0) {
                    function_str += functionCopy(ctx, str, mode, step) + s;
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
        if (i === funcstack.length - 1) {
            if (iscelldata(_.trim(str))) {
                if (mode === "down") {
                    function_str += downparam(_.trim(str), step);
                }
                else if (mode === "up") {
                    function_str += upparam(_.trim(str), step);
                }
                else if (mode === "left") {
                    function_str += leftparam(_.trim(str), step);
                }
                else if (mode === "right") {
                    function_str += rightparam(_.trim(str), step);
                }
            }
            else {
                function_str += _.trim(str);
            }
        }
        i += 1;
    }
    return function_str;
}
