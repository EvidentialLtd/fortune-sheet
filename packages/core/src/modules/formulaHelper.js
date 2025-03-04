import _ from "lodash";
import { execfunction, getcellFormula, getcellrange, iscelldata, isFunctionRange, } from "..";
export function setFormulaCellInfo(ctx, formulaCell, data) {
    var _a;
    var key = "r".concat(formulaCell.r, "c").concat(formulaCell.c, "i").concat(formulaCell.id);
    var calc_funcStr = getcellFormula(ctx, formulaCell.r, formulaCell.c, formulaCell.id, data);
    if (_.isNil(calc_funcStr)) {
        (_a = ctx.formulaCache.formulaCellInfoMap) === null || _a === void 0 ? true : delete _a[key];
        return;
    }
    var txt1 = calc_funcStr.toUpperCase();
    var isOffsetFunc = txt1.indexOf("INDIRECT(") > -1 ||
        txt1.indexOf("OFFSET(") > -1 ||
        txt1.indexOf("INDEX(") > -1;
    var formulaDependency = [];
    if (isOffsetFunc) {
        isFunctionRange(ctx, calc_funcStr, null, null, formulaCell.id, null, function (str_nb) {
            var range = getcellrange(ctx, _.trim(str_nb), formulaCell.id, data);
            if (!_.isNil(range)) {
                formulaDependency.push(range);
            }
        });
    }
    else if (!(calc_funcStr.substring(0, 2) === '="' &&
        calc_funcStr.substring(calc_funcStr.length - 1, 1) === '"')) {
        var point = 0;
        var squote = -1;
        var dquote = -1;
        var formulaTextArray = [];
        var sq_end_array = [];
        var calc_funcStr_length = calc_funcStr.length;
        for (var j = 0; j < calc_funcStr_length; j += 1) {
            var char = calc_funcStr.charAt(j);
            if (char === "'" && dquote === -1) {
                if (squote === -1) {
                    if (point !== j) {
                        formulaTextArray.push.apply(formulaTextArray, calc_funcStr
                            .substring(point, j)
                            .split(/==|!=|<>|<=|>=|[,()=+-/*%&^><]/));
                    }
                    squote = j;
                    point = j;
                }
                else {
                    if (j < calc_funcStr_length - 1 &&
                        calc_funcStr.charAt(j + 1) === "'") {
                        j += 1;
                    }
                    else {
                        point = j + 1;
                        formulaTextArray.push(calc_funcStr.substring(squote, point));
                        sq_end_array.push(formulaTextArray.length - 1);
                        squote = -1;
                    }
                }
            }
            else if (char === '"' && squote === -1) {
                if (dquote === -1) {
                    if (point !== j) {
                        formulaTextArray.push.apply(formulaTextArray, calc_funcStr
                            .substring(point, j)
                            .split(/==|!=|<>|<=|>=|[,()=+-/*%&^><]/));
                    }
                    dquote = j;
                    point = j;
                }
                else {
                    if (j < calc_funcStr_length - 1 &&
                        calc_funcStr.charAt(j + 1) === '"') {
                        j += 1;
                    }
                    else {
                        point = j + 1;
                        formulaTextArray.push(calc_funcStr.substring(dquote, point));
                        dquote = -1;
                    }
                }
            }
        }
        if (point !== calc_funcStr_length) {
            formulaTextArray.push.apply(formulaTextArray, calc_funcStr
                .substring(point, calc_funcStr_length)
                .split(/==|!=|<>|<=|>=|[,()=+-/*%&^><]/));
        }
        for (var j = sq_end_array.length - 1; j >= 0; j -= 1) {
            if (sq_end_array[j] !== formulaTextArray.length - 1) {
                formulaTextArray[sq_end_array[j]] +=
                    formulaTextArray[sq_end_array[j] + 1];
                formulaTextArray.splice(sq_end_array[j] + 1, 1);
            }
        }
        for (var j = 0; j < formulaTextArray.length; j += 1) {
            var t = formulaTextArray[j];
            if (t.length <= 1) {
                continue;
            }
            if ((t.substring(0, 1) === '"' && t.substring(t.length - 1, 1) === '"') ||
                !iscelldata(t)) {
                continue;
            }
            var range = getcellrange(ctx, _.trim(t), formulaCell.id, data);
            if (_.isNil(range)) {
                continue;
            }
            formulaDependency.push(range);
        }
    }
    var item = {
        formulaDependency: formulaDependency,
        calc_funcStr: calc_funcStr,
        key: key,
        r: formulaCell.r,
        c: formulaCell.c,
        id: formulaCell.id,
        parents: {},
        chidren: {},
        color: "w",
    };
    if (!ctx.formulaCache.formulaCellInfoMap)
        ctx.formulaCache.formulaCellInfoMap = {};
    ctx.formulaCache.formulaCellInfoMap[key] = item;
}
export function executeAffectedFormulas(ctx, formulaRunList, calcChains) {
    var calcChainSet = new Set();
    calcChains.forEach(function (item) {
        calcChainSet.add("".concat(item.r, "_").concat(item.c, "_").concat(item.id));
    });
    for (var i = 0; i < formulaRunList.length; i += 1) {
        var formulaCell = formulaRunList[i];
        if (formulaCell.level === Math.max) {
            continue;
        }
        var calc_funcStr = formulaCell.calc_funcStr;
        var v = execfunction(ctx, calc_funcStr, formulaCell.r, formulaCell.c, formulaCell.id, calcChainSet);
        ctx.groupValuesRefreshData.push({
            r: formulaCell.r,
            c: formulaCell.c,
            v: v[1],
            f: v[2],
            spe: v[3],
            id: formulaCell.id,
        });
        ctx.formulaCache.execFunctionGlobalData["".concat(formulaCell.r, "_").concat(formulaCell.c, "_").concat(formulaCell.id)] = {
            v: v[1],
            f: v[2],
        };
    }
}
export function getFormulaRunList(updateValueArray, formulaCellInfoMap) {
    var formulaRunList = [];
    var stack = updateValueArray;
    var existsFormulaRunList = {};
    var _loop_1 = function () {
        var formulaObject = stack.pop();
        if (_.isNil(formulaObject) || formulaObject.key in existsFormulaRunList) {
            return "continue";
        }
        if (formulaObject.color === "b") {
            formulaObject.color = "w";
            formulaRunList.push(formulaObject);
            existsFormulaRunList[formulaObject.key] = 1;
            return "continue";
        }
        var cacheStack = [];
        Object.keys(formulaObject.parents).forEach(function (parentKey) {
            var parentFormulaObject = formulaCellInfoMap[parentKey];
            if (!_.isNil(parentFormulaObject)) {
                cacheStack.push(parentFormulaObject);
            }
        });
        if (cacheStack.length === 0) {
            formulaRunList.push(formulaObject);
            existsFormulaRunList[formulaObject.key] = 1;
        }
        else {
            formulaObject.color = "b";
            stack.push(formulaObject);
            stack = stack.concat(cacheStack);
        }
    };
    while (stack.length > 0) {
        _loop_1();
    }
    formulaRunList.reverse();
    return formulaRunList;
}
export var arrayMatch = function (arrayMatchCache, formulaDependency, _formulaCellInfoMap, _updateValueObjects, func) {
    for (var a = 0; a < formulaDependency.length; a += 1) {
        var range = formulaDependency[a];
        var cacheKey = "r".concat(range.row[0]).concat(range.row[1], "c").concat(range.column[0]).concat(range.column[1], "id").concat(range.sheetId);
        if (cacheKey in arrayMatchCache) {
            var amc = arrayMatchCache[cacheKey];
            amc.forEach(function (item) {
                func(item.key, item.r, item.c, item.sheetId);
            });
        }
        else {
            var functionArr = [];
            for (var r = range.row[0]; r <= range.row[1]; r += 1) {
                for (var c = range.column[0]; c <= range.column[1]; c += 1) {
                    var key = "r".concat(r, "c").concat(c, "i").concat(range.sheetId);
                    func(key, r, c, range.sheetId);
                    if ((_formulaCellInfoMap && key in _formulaCellInfoMap) ||
                        (_updateValueObjects && key in _updateValueObjects)) {
                        functionArr.push({
                            key: key,
                            r: r,
                            c: c,
                            sheetId: range.sheetId,
                        });
                    }
                }
            }
            if (_formulaCellInfoMap || _updateValueObjects) {
                arrayMatchCache[cacheKey] = functionArr;
            }
        }
    }
};
