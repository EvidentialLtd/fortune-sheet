import _ from "lodash";
import { colLocationByIndex, diff, getcellrange, getCellValue, getFlowdata, getRangeByTxt, getSheetIndex, isAllowEdit, iscelldata, isdatetime, isRealNull, isRealNum, jfrefreshgrid, mergeBorder, rowLocationByIndex, setCellValue, } from "..";
export function dataRangeSelection(ctx, cache, rangT, type, value) {
    var _a, _b, _c, _d;
    ctx.rangeDialog.show = true;
    ctx.rangeDialog.type = type;
    ctx.rangeDialog.rangeTxt = value;
    if (ctx.luckysheet_select_save && !!rangT) {
        var last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
        var row_index = last.row_focus;
        var col_index = last.column_focus;
        ctx.luckysheetCellUpdate = [row_index, col_index];
        var range = getRangeByTxt(ctx, rangT);
        var r = (_a = range[0]) === null || _a === void 0 ? void 0 : _a.row;
        var c = (_b = range[0]) === null || _b === void 0 ? void 0 : _b.column;
        if (_.isNil(r) || _.isNil(c))
            return;
        var row_pre = rowLocationByIndex(r[0], ctx.visibledatarow)[0];
        var row = rowLocationByIndex(r[1], ctx.visibledatarow)[1];
        var col_pre = colLocationByIndex(c[0], ctx.visibledatacolumn)[0];
        var col = colLocationByIndex(c[1], ctx.visibledatacolumn)[1];
        ctx.formulaRangeSelect = {
            height: row - row_pre - 1,
            left: col_pre,
            rangeIndex: (_d = (_c = ctx.formulaRangeSelect) === null || _c === void 0 ? void 0 : _c.rangeIndex) !== null && _d !== void 0 ? _d : 0,
            top: row_pre,
            width: col - col_pre - 1,
        };
    }
    else {
        ctx.luckysheetCellUpdate = [0, 0];
    }
}
export function getDropdownList(ctx, txt) {
    var list = [];
    if (iscelldata(txt)) {
        var range = getcellrange(ctx, txt);
        var index = getSheetIndex(ctx, (range === null || range === void 0 ? void 0 : range.sheetId) || ctx.currentSheetId);
        var d = ctx.luckysheetfile[index].data;
        if (!d || !range)
            return [];
        for (var r = range.row[0]; r <= range.row[1]; r += 1) {
            for (var c = range.column[0]; c <= range.column[1]; c += 1) {
                if (!d[r]) {
                    continue;
                }
                var cell = d[r][c];
                if (!cell || !cell.v) {
                    continue;
                }
                var v = cell.m || cell.v;
                if (!list.includes(v)) {
                    list.push(v);
                }
            }
        }
    }
    else {
        var arr = txt.split(",");
        for (var i = 0; i < arr.length; i += 1) {
            var v = arr[i];
            if (v.length === 0) {
                continue;
            }
            if (!list.includes(v)) {
                list.push(v);
            }
        }
    }
    return list;
}
export function validateIdCard(ctx, idCard) {
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (regIdCard.test(idCard)) {
        if (idCard.length === 18) {
            var idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            var idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
            var idCardWiSum = 0;
            for (var i = 0; i < 17; i += 1) {
                idCardWiSum += Number(idCard.substring(i, i + 1)) * idCardWi[i];
            }
            var idCardMod = idCardWiSum % 11;
            var idCardLast = idCard.substring(17);
            if (idCardMod === 2) {
                if (idCardLast === "X" || idCardLast === "x") {
                    return true;
                }
                return false;
            }
            if (idCardLast === idCardY[idCardMod].toString()) {
                return true;
            }
            return false;
        }
    }
    else {
        return false;
    }
    return false;
}
export function validateCellData(ctx, item, cellValue) {
    var value1 = item.value1, value2 = item.value2;
    var type = item.type, type2 = item.type2;
    if (type === "dropdown") {
        var list_1 = getDropdownList(ctx, value1);
        if (type2 && cellValue) {
            return cellValue
                .toString()
                .split(",")
                .every(function (i) {
                return list_1.indexOf(i) !== -1;
            });
        }
        var result = false;
        for (var i = 0; i < list_1.length; i += 1) {
            if (list_1[i] === cellValue) {
                result = true;
                break;
            }
        }
        return result;
    }
    if (type === "checkbox") {
    }
    else if (type === "number" ||
        type === "number_integer" ||
        type === "number_decimal") {
        if (!isRealNum(cellValue)) {
            return false;
        }
        cellValue = Number(cellValue);
        if (type === "number_integer" && cellValue % 1 !== 0) {
            return false;
        }
        if (type === "number_decimal" && cellValue % 1 === 0) {
            return false;
        }
        value1 = Number(value1);
        value2 = Number(value2);
        if (type2 === "between" && (cellValue < value1 || cellValue > value2)) {
            return false;
        }
        if (type2 === "notBetween" && cellValue >= value1 && cellValue <= value2) {
            return false;
        }
        if (type2 === "equal" && cellValue !== value1) {
            return false;
        }
        if (type2 === "notEqualTo" && cellValue === value1) {
            return false;
        }
        if (type2 === "moreThanThe" && cellValue <= value1) {
            return false;
        }
        if (type2 === "lessThan" && cellValue >= value1) {
            return false;
        }
        if (type2 === "greaterOrEqualTo" && cellValue < value1) {
            return false;
        }
        if (type2 === "lessThanOrEqualTo" && cellValue > value1) {
            return false;
        }
    }
    else if (type === "text_content") {
        cellValue = cellValue.toString();
        value1 = value1.toString();
        if (type2 === "include" && cellValue.indexOf(value1) === -1) {
            return false;
        }
        if (type2 === "exclude" && cellValue.indexOf(value1) > -1) {
            return false;
        }
        if (type2 === "equal" && cellValue !== value1) {
            return false;
        }
    }
    else if (type === "text_length") {
        cellValue = cellValue.toString().length;
        value1 = Number(value1);
        value2 = Number(value2);
        if (type2 === "between" && (cellValue < value1 || cellValue > value2)) {
            return false;
        }
        if (type2 === "notBetween" && cellValue >= value1 && cellValue <= value2) {
            return false;
        }
        if (type2 === "equal" && cellValue !== value1) {
            return false;
        }
        if (type2 === "notEqualTo" && cellValue === value1) {
            return false;
        }
        if (type2 === "moreThanThe" && cellValue <= value1) {
            return false;
        }
        if (type2 === "lessThan" && cellValue >= value1) {
            return false;
        }
        if (type2 === "greaterOrEqualTo" && cellValue < value1) {
            return false;
        }
        if (type2 === "lessThanOrEqualTo" && cellValue > value1) {
            return false;
        }
    }
    else if (type === "date") {
        if (!isdatetime(cellValue)) {
            return false;
        }
        if (type2 === "between" &&
            (diff(cellValue, value1) < 0 || diff(cellValue, value2) > 0)) {
            return false;
        }
        if (type2 === "notBetween" &&
            diff(cellValue, value1) >= 0 &&
            diff(cellValue, value2) <= 0) {
            return false;
        }
        if (type2 === "equal" && diff(cellValue, value1) !== 0) {
            return false;
        }
        if (type2 === "notEqualTo" && diff(cellValue, value1) === 0) {
            return false;
        }
        if (type2 === "earlierThan" && diff(cellValue, value1) >= 0) {
            return false;
        }
        if (type2 === "noEarlierThan" && diff(cellValue, value1) < 0) {
            return false;
        }
        if (type2 === "laterThan" && diff(cellValue, value1) <= 0) {
            return false;
        }
        if (type2 === "noLaterThan" && diff(cellValue, value1) > 0) {
            return false;
        }
    }
    else if (type === "validity") {
        if (type2 === "identificationNumber" && !validateIdCard(ctx, cellValue)) {
            return false;
        }
        if (type2 === "phoneNumber" && !/^1[3456789]\d{9}$/.test(cellValue)) {
            return false;
        }
    }
    return true;
}
export function checkboxChange(ctx, r, c) {
    var _a;
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    var currentDataVerification = (_a = ctx.luckysheetfile[index].dataVerification) !== null && _a !== void 0 ? _a : {};
    var item = currentDataVerification["".concat(r, "_").concat(c)];
    item.checked = !item.checked;
    var value = item.value2;
    if (item.checked) {
        value = item.value1;
    }
    var d = getFlowdata(ctx);
    setCellValue(ctx, r, c, d, value);
}
export function getFailureText(ctx, item) {
    var _a, _b, _c, _d, _e;
    var failureText = "";
    var lang = ctx.lang;
    var type = item.type, type2 = item.type2, value1 = item.value1, value2 = item.value2;
    if (lang === "zh" || lang === "zh-CN") {
        var optionLabel_zh = (_a = ctx.dataVerification) === null || _a === void 0 ? void 0 : _a.optionLabel_zh;
        if (type === "dropdown") {
            failureText += "你选择的不是下拉列表中的选项";
        }
        else if (type === "checkbox") {
        }
        else if (type === "number" ||
            type === "number_integer" ||
            type === "number_decimal") {
            failureText += "\u4F60\u8F93\u5165\u7684\u4E0D\u662F".concat(optionLabel_zh[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "\u548C".concat(value2, "\u4E4B\u95F4");
            }
            failureText += "\u7684".concat(optionLabel_zh[type]);
        }
        else if (type === "text_content") {
            failureText += "\u4F60\u8F93\u5165\u7684\u4E0D\u662F\u5185\u5BB9".concat(optionLabel_zh[type2]).concat(value1, "\u7684\u6587\u672C");
        }
        else if (type === "text_length") {
            failureText += "\u4F60\u8F93\u5165\u7684\u4E0D\u662F\u957F\u5EA6".concat(optionLabel_zh[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "\u548C".concat(value2, "\u4E4B\u95F4");
            }
            failureText += "的文本";
        }
        else if (type === "date") {
            failureText += "\u4F60\u8F93\u5165\u7684\u4E0D\u662F".concat(optionLabel_zh[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "\u548C".concat(value2, "\u4E4B\u95F4");
            }
            failureText += "的日期";
        }
        else if (type === "validity") {
            failureText += "\u4F60\u8F93\u5165\u7684\u4E0D\u662F\u4E00\u4E2A\u6B63\u786E\u7684".concat(optionLabel_zh[type2]);
        }
    }
    else if (lang === "zh-TW") {
        var optionLabel_zh_tw = (_b = ctx.dataVerification) === null || _b === void 0 ? void 0 : _b.optionLabel_zh_tw;
        if (type === "dropdown") {
            failureText += "你選擇的不是下拉清單中的選項";
        }
        else if (type === "checkbox") {
        }
        else if (type === "number" ||
            type === "number_integer" ||
            type === "number_decimal") {
            failureText += "\u4F60\u8F38\u5165\u7684\u4E0D\u662F".concat(optionLabel_zh_tw[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "\u548C".concat(value2, "\u4E4B\u9593");
            }
            failureText += "\u7684".concat(optionLabel_zh_tw[type]);
        }
        else if (type === "text_content") {
            failureText += "\u4F60\u8F38\u5165\u7684\u4E0D\u662F\u5167\u5BB9".concat(optionLabel_zh_tw[type2]).concat(value1, "\u7684\u6587\u672C");
        }
        else if (type === "text_length") {
            failureText += "\u4F60\u8F38\u5165\u7684\u4E0D\u662F\u9577\u5EA6".concat(optionLabel_zh_tw[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "\u548C".concat(value2, "\u4E4B\u95F4");
            }
            failureText += "的文本";
        }
        else if (type === "date") {
            failureText += "\u4F60\u8F38\u5165\u7684\u4E0D\u662F".concat(optionLabel_zh_tw[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "\u548C".concat(value2, "\u4E4B\u95F4");
            }
            failureText += "的日期";
        }
        else if (type === "validity") {
            failureText += "\u4F60\u8F38\u5165\u7684\u4E0D\u662F\u4E00\u500B\u6B63\u78BA\u7684".concat(optionLabel_zh_tw[type2]);
        }
    }
    else if (lang === "es") {
        var optionLabel_es = (_c = ctx.dataVerification) === null || _c === void 0 ? void 0 : _c.optionLabel_es;
        if (type === "dropdown") {
            failureText += "No elegiste una opción en la lista desplegable";
        }
        else if (type === "checkbox") {
        }
        else if (type === "number" ||
            type === "number_integer" ||
            type === "number_decimal") {
            failureText += "Lo que introduciste no es".concat(optionLabel_es[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "Y".concat(value2, "Entre");
            }
            failureText += "De".concat(optionLabel_es[type]);
        }
        else if (type === "text_content") {
            failureText += "Lo que introduciste no fue contenido".concat(optionLabel_es[type2]).concat(value1, "Texto");
        }
        else if (type === "text_length") {
            failureText += "No introduciste la longitud".concat(optionLabel_es[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "Y".concat(value2, "Entre");
            }
            failureText += "Texto";
        }
        else if (type === "date") {
            failureText += "Lo que introduciste no es".concat(optionLabel_es[type2]).concat(value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += "Y".concat(value2, "Entre");
            }
            failureText += "Fecha";
        }
        else if (type === "validity") {
            failureText += "Lo que ingresas no es correcto".concat(optionLabel_es[type2]);
        }
    }
    else if (lang === "hi") {
        var optionLabel_hi = (_d = ctx.dataVerification) === null || _d === void 0 ? void 0 : _d.optionLabel_hi;
        if (type === "dropdown") {
            failureText +=
                "आपने जो चयन किया है वह ड्रॉप-डाउन सूची में एक विकल्प नहीं है";
        }
        else if (type === "checkbox") {
        }
        else if (type === "number" ||
            type === "number_integer" ||
            type === "number_decimal") {
            failureText += "\u0906\u092A\u0928\u0947 \u091C\u094B \u0926\u0930\u094D\u091C \u0915\u093F\u092F\u093E \u0939\u0948 \u0935\u0939 ".concat(optionLabel_hi[item.type], " ").concat(optionLabel_hi[item.type2], " ").concat(item.value1, " \u0928\u0939\u0940\u0902 \u0939\u0948");
            if (item.type2 === "between" || item.type2 === "notBetween") {
                failureText += " and ".concat(item.value2);
            }
        }
        else if (type === "text_content") {
            failureText += "\u0906\u092A\u0928\u0947 \u091C\u094B \u0926\u0930\u094D\u091C \u0915\u093F\u092F\u093E \u0939\u0948 \u0935\u0939 \u092A\u093E\u0920 \u0928\u0939\u0940\u0902 \u0939\u0948 \u091C\u094B ".concat(optionLabel_hi[item.type2], " ").concat(item.value1, " \u0939\u0948");
        }
        else if (type === "text_length") {
            failureText += "\u0906\u092A\u0915\u0947 \u0926\u094D\u0935\u093E\u0930\u093E \u0926\u0930\u094D\u091C \u0915\u093F\u092F\u093E \u0917\u092F\u093E \u092A\u093E\u0920 \u0915\u0940 \u0932\u0902\u092C\u093E\u0908 ".concat(optionLabel_hi[item.type2], " ").concat(item.value1, " \u0928\u0939\u0940\u0902 \u0939\u0948");
            if (item.type2 === "between" || item.type2 === "notBetween") {
                failureText += " \u0914\u0930 ".concat(item.value2);
            }
        }
        else if (type === "date") {
            failureText += "\u0906\u092A\u0915\u0947 \u0926\u094D\u0935\u093E\u0930\u093E \u0926\u0930\u094D\u091C \u0915\u0940 \u0917\u0908 \u0924\u093F\u0925\u093F ".concat(optionLabel_hi[item.type2], " ").concat(item.value1, " \u0928\u0939\u0940\u0902 \u0939\u0948\u0964");
            if (type2 === "between" || type2 === "notBetween") {
                failureText += " \u0914\u0930 ".concat(item.value2);
            }
        }
        else if (type === "validity") {
            failureText += "\u0906\u092A\u0928\u0947 \u091C\u094B \u0926\u0930\u094D\u091C \u0915\u093F\u092F\u093E \u0939\u0948 \u0935\u0939 \u0938\u0939\u0940 ".concat(optionLabel_hi[item.type2], " \u0928\u0939\u0940\u0902 \u0939\u0948\u0964");
        }
    }
    else {
        var optionLabel_en = (_e = ctx.dataVerification) === null || _e === void 0 ? void 0 : _e.optionLabel_en;
        if (type === "dropdown") {
            failureText += "what you selected is not an option in the drop-down list";
        }
        else if (type === "checkbox") {
        }
        else if (type === "number" ||
            type === "number_integer" ||
            type === "number_decimal") {
            failureText += "what you entered is not a ".concat(optionLabel_en[item.type], " ").concat(optionLabel_en[item.type2], " ").concat(item.value1);
            if (item.type2 === "between" || item.type2 === "notBetween") {
                failureText += " and ".concat(item.value2);
            }
        }
        else if (type === "text_content") {
            failureText += "what you entered is not text that ".concat(optionLabel_en[item.type2], " ").concat(item.value1);
        }
        else if (type === "text_length") {
            failureText += "the text you entered is not length ".concat(optionLabel_en[item.type2], " ").concat(item.value1);
            if (item.type2 === "between" || item.type2 === "notBetween") {
                failureText += " and ".concat(item.value2);
            }
        }
        else if (type === "date") {
            failureText += "the date you entered is not ".concat(optionLabel_en[item.type2], " ").concat(item.value1);
            if (type2 === "between" || type2 === "notBetween") {
                failureText += " and ".concat(item.value2);
            }
        }
        else if (type === "validity") {
            failureText += "what you entered is not a correct ".concat(optionLabel_en[item.type2]);
        }
    }
    return failureText;
}
export function getHintText(ctx, item) {
    var _a, _b, _c, _d;
    var hintValue = item.hintValue || "";
    var type = item.type, type2 = item.type2, value1 = item.value1, value2 = item.value2;
    var lang = ctx.lang;
    if (!hintValue) {
        if (lang === "en") {
            var optionLabel_en = (_a = ctx.dataVerification) === null || _a === void 0 ? void 0 : _a.optionLabel_en;
            if (type === "dropdown") {
                hintValue += "please select an option in the drop-down list";
            }
            else if (type === "checkbox") {
            }
            else if (type === "number" ||
                type === "number_integer" ||
                type === "number_decimal") {
                hintValue += "please enter a ".concat(optionLabel_en[type], " ").concat(optionLabel_en[type2], " ").concat(item.value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += " and ".concat(value2);
                }
            }
            else if (type === "text_content") {
                hintValue += "please enter text ".concat(optionLabel_en[type2], " ").concat(value1);
            }
            else if (type === "date") {
                hintValue += "please enter a date ".concat(optionLabel_en[type2], " ").concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += " and ".concat(value2);
                }
            }
            else if (type === "validity") {
                hintValue += "please enter the correct ".concat(optionLabel_en[type2]);
            }
        }
        else if (lang === "zh" || lang === "zh-CN") {
            var optionLabel_zh = (_b = ctx.dataVerification) === null || _b === void 0 ? void 0 : _b.optionLabel_zh;
            if (type === "dropdown") {
                hintValue += "请选择下拉列表中的选项";
            }
            else if (type === "checkbox") {
            }
            else if (type === "number" ||
                type === "number_integer" ||
                type === "number_decimal") {
                hintValue += "\u8BF7\u8F93\u5165".concat(optionLabel_zh[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "\u548C".concat(value2, "\u4E4B\u95F4");
                }
                hintValue += "\u7684".concat(optionLabel_zh[type]);
            }
            else if (type === "text_content") {
                hintValue += "\u8BF7\u8F93\u5165\u5185\u5BB9".concat(optionLabel_zh[type2]).concat(value1, "\u7684\u6587\u672C");
            }
            else if (type === "text_length") {
                hintValue += "\u8BF7\u8F93\u5165\u957F\u5EA6".concat(optionLabel_zh[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "\u548C".concat(value2, "\u4E4B\u95F4");
                }
                hintValue += "的文本";
            }
            else if (type === "date") {
                hintValue += "\u8BF7\u8F93\u5165".concat(optionLabel_zh[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "\u548C".concat(value2, "\u4E4B\u95F4");
                }
                hintValue += "的日期";
            }
            else if (type === "validity") {
                hintValue += "\u8BF7\u8F93\u5165\u6B63\u786E\u7684".concat(optionLabel_zh[type2]);
            }
        }
        else if (lang === "zh-TW") {
            var optionLabel_zh_tw = (_c = ctx.dataVerification) === null || _c === void 0 ? void 0 : _c.optionLabel_zh_tw;
            if (type === "dropdown") {
                hintValue += "請選擇下拉清單中的選項";
            }
            else if (type === "checkbox") {
            }
            else if (type === "number" ||
                type === "number_integer" ||
                type === "number_decimal") {
                hintValue += "\u8ACB\u8F38\u5165".concat(optionLabel_zh_tw[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "\u548C".concat(value2, "\u4E4B\u9593");
                }
                hintValue += "\u7684".concat(optionLabel_zh_tw[type]);
            }
            else if (type === "text_content") {
                hintValue += "\u8ACB\u8F38\u5165\u5167\u5BB9".concat(optionLabel_zh_tw[type2]).concat(value1, "\u7684\u6587\u672C");
            }
            else if (type === "text_length") {
                hintValue += "\u8ACB\u8F38\u5165\u9577\u5EA6".concat(optionLabel_zh_tw[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "\u548C".concat(value2, "\u4E4B\u9593");
                }
                hintValue += "的文本";
            }
            else if (type === "date") {
                hintValue += "\u8ACB\u8F38\u5165".concat(optionLabel_zh_tw[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "\u548C".concat(value2, "\u4E4B\u9593");
                }
                hintValue += "的日期";
            }
            else if (type === "validity") {
                hintValue += "\u8ACB\u8F38\u5165\u6B63\u78BA\u7684".concat(optionLabel_zh_tw[type2]);
            }
        }
        else if (lang === "es") {
            var optionLabel_es = (_d = ctx.dataVerification) === null || _d === void 0 ? void 0 : _d.optionLabel_es;
            if (type === "dropdown") {
                hintValue += "Por favor, elija una opción en la lista desplegable";
            }
            else if (type === "checkbox") {
            }
            else if (type === "number" ||
                type === "number_integer" ||
                type === "number_decimal") {
                hintValue += "Por favor, introduzca".concat(optionLabel_es[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "Y".concat(value2, "Entre");
                }
                hintValue += "De".concat(optionLabel_es[type]);
            }
            else if (type === "text_content") {
                hintValue += "Por favor, introduzca el contenido".concat(optionLabel_es[type2]).concat(value1, "Texto");
            }
            else if (type === "text_length") {
                hintValue += "Por favor, introduzca la longitud".concat(optionLabel_es[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "Y".concat(value2, "Entre");
                }
                hintValue += "Texto";
            }
            else if (type === "date") {
                hintValue += "Por favor, introduzca".concat(optionLabel_es[type2]).concat(value1);
                if (type2 === "between" || type2 === "notBetween") {
                    hintValue += "Y".concat(value2, "Entre");
                }
                hintValue += "Fecha";
            }
            else if (type === "validity") {
                hintValue += "Por favor, introduzca lo correcto.".concat(optionLabel_es[type2]);
            }
        }
    }
    return hintValue;
}
export function cellFocus(ctx, r, c, clickMode) {
    var _a, _b;
    var allowEdit = isAllowEdit(ctx);
    if (!allowEdit)
        return;
    var showHintBox = document.getElementById("luckysheet-dataVerification-showHintBox");
    var dropDownBtn = document.getElementById("luckysheet-dataVerification-dropdown-btn");
    ctx.dataVerificationDropDownList = false;
    if (!showHintBox || !dropDownBtn)
        return;
    showHintBox.style.display = "none";
    dropDownBtn.style.display = "none";
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    var dataVerification = ctx.luckysheetfile[index].dataVerification;
    ctx.dataVerificationDropDownList = false;
    if (!dataVerification)
        return;
    var row = ctx.visibledatarow[r];
    var row_pre = r === 0 ? 0 : ctx.visibledatarow[r - 1];
    var col = ctx.visibledatacolumn[c];
    var col_pre = c === 0 ? 0 : ctx.visibledatacolumn[c - 1];
    var d = getFlowdata(ctx);
    if (!d)
        return;
    var margeSet = mergeBorder(ctx, d, r, c);
    if (margeSet) {
        _a = margeSet.row, row_pre = _a[0], row = _a[1];
        _b = margeSet.column, col_pre = _b[0], col = _b[1];
    }
    var item = dataVerification["".concat(r, "_").concat(c)];
    if (!item)
        return;
    if (clickMode && item.type === "checkbox") {
        checkboxChange(ctx, r, c);
    }
    if (item.type === "dropdown") {
        dropDownBtn.style.display = "block";
        dropDownBtn.style.maxWidth = "".concat(col - col_pre, "px");
        dropDownBtn.style.maxHeight = "".concat(row - row_pre, "px");
        dropDownBtn.style.left = "".concat(col - 20, "px");
        dropDownBtn.style.top = "".concat(row_pre + (row - row_pre - 20) / 2 - 2, "px");
    }
    if (item.hintShow) {
        var hintText = "";
        var lang = ctx.lang;
        if (lang === "en") {
            hintText = '<span style="color:#f5a623;">Hint: </span>';
        }
        else if (lang === "zh" || lang === "zh-CN") {
            hintText = '<span style="color:#f5a623;">提示：</span>';
        }
        else if (lang === "zh-TW") {
            hintText = '<span style="color:#f5a623;">提示：</span>';
        }
        else if (lang === "es") {
            hintText = '<span style="color:#f5a623;">Consejos：</span>';
        }
        else if (lang === "hi") {
            hintText = '<span style="color:#f5a623;">सुझाव: </span>';
        }
        hintText += getHintText(ctx, item);
        showHintBox.innerHTML = hintText;
        showHintBox.style.display = "block";
        showHintBox.style.left = "".concat(col_pre, "px");
        showHintBox.style.top = "".concat(row, "px");
    }
    var cellValue = getCellValue(r, c, d);
    if (isRealNull(cellValue)) {
        return;
    }
    var validate = validateCellData(ctx, item, cellValue);
    if (!validate) {
        var failureText = "";
        var lang = ctx.lang;
        if (lang === "en") {
            failureText = '<span style="color:#f72626;">Failure: </span>';
        }
        else if (lang === "zh" || lang === "zh-CN") {
            failureText = '<span style="color:#f72626;">失效：</span>';
        }
        else if (lang === "zh-TW") {
            failureText = '<span style="color:#f72626;">失效：</span>';
        }
        else if (lang === "es") {
            failureText = '<span style="color:#f72626;">Caducidad: </span>';
        }
        else if (lang === "hi") {
            failureText = '<span style="color:#f72626;">असफलता: </span>';
        }
        failureText += getFailureText(ctx, item);
        showHintBox.innerHTML = failureText;
        showHintBox.style.display = "block";
        showHintBox.style.left = "".concat(col_pre, "px");
        showHintBox.style.top = "".concat(row, "px");
    }
}
export function setDropcownValue(ctx, value, arr) {
    if (!ctx.luckysheet_select_save)
        return;
    var d = getFlowdata(ctx);
    if (!d)
        return;
    var last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
    var rowIndex = last.row_focus;
    var colIndex = last.column_focus;
    if (rowIndex == null || colIndex == null)
        return;
    var index = getSheetIndex(ctx, ctx.currentSheetId);
    var item = ctx.luckysheetfile[index].dataVerification["".concat(rowIndex, "_").concat(colIndex)];
    if (item.type2 === "true") {
        value = item.value1
            .split(",")
            .filter(function (v) { return arr.indexOf(v) >= 0; })
            .join(",");
    }
    else {
        ctx.dataVerificationDropDownList = false;
    }
    setCellValue(ctx, rowIndex, colIndex, d, value);
    jfrefreshgrid(ctx, null, undefined);
}
export function confirmMessage(ctx, generalDialog, dataVerification) {
    var _a, _b, _c, _d, _e, _f;
    var range = getRangeByTxt(ctx, (_b = (_a = ctx.dataVerification) === null || _a === void 0 ? void 0 : _a.dataRegulation) === null || _b === void 0 ? void 0 : _b.rangeTxt);
    if (range.length === 0) {
        ctx.warnDialog = generalDialog.noSeletionError;
        return false;
    }
    var str = (_c = range[range.length - 1]) === null || _c === void 0 ? void 0 : _c.row[0];
    var edr = (_d = range[range.length - 1]) === null || _d === void 0 ? void 0 : _d.row[1];
    var stc = (_e = range[range.length - 1]) === null || _e === void 0 ? void 0 : _e.column[0];
    var edc = (_f = range[range.length - 1]) === null || _f === void 0 ? void 0 : _f.column[1];
    var d = getFlowdata(ctx);
    if (!d || _.isNil(str) || _.isNil(edr) || _.isNil(stc) || _.isNil(edc))
        return false;
    if (str < 0) {
        str = 0;
    }
    if (edr > d.length - 1) {
        edr = d.length - 1;
    }
    if (stc < 0) {
        stc = 0;
    }
    if (edc > d[0].length - 1) {
        edc = d[0].length - 1;
    }
    var regulation = ctx.dataVerification.dataRegulation;
    var verifacationT = regulation === null || regulation === void 0 ? void 0 : regulation.type;
    var value1 = regulation.value1, value2 = regulation.value2, type2 = regulation.type2;
    var v1 = parseFloat(value1).toString() !== "NaN";
    var v2 = parseFloat(value2).toString() !== "NaN";
    if (verifacationT === "dropdown") {
        if (!value1) {
            ctx.warnDialog = dataVerification.tooltipInfo1;
        }
    }
    else if (verifacationT === "checkbox") {
        if (!value1 || !value2) {
            ctx.warnDialog = dataVerification.tooltipInfo2;
        }
    }
    else if (verifacationT === "number" ||
        verifacationT === "number_integer" ||
        verifacationT === "number_decimal") {
        if (!v1) {
            ctx.warnDialog = dataVerification.tooltipInfo3;
            return false;
        }
        if (type2 === "between" || type2 === "notBetween") {
            if (!v2) {
                ctx.warnDialog = dataVerification.tooltipInfo3;
                return false;
            }
            if (Number(value2) < Number(value1)) {
                ctx.warnDialog = dataVerification.tooltipInfo4;
                return false;
            }
        }
    }
    else if (verifacationT === "text_content") {
        if (!value1) {
            ctx.warnDialog = dataVerification.tooltipInfo5;
            return false;
        }
    }
    else if (verifacationT === "text_length") {
        if (!v1) {
            ctx.warnDialog = dataVerification.tooltipInfo3;
            return false;
        }
        if (!Number.isInteger(Number(value1)) || Number(value1) < 0) {
            ctx.warnDialog = dataVerification.textlengthInteger;
            return false;
        }
        if (type2 === "between" || type2 === "notBetween") {
            if (!v2) {
                ctx.warnDialog = dataVerification.tooltipInfo3;
                return false;
            }
            if (!Number.isInteger(Number(value2)) || Number(value2) < 0) {
                ctx.warnDialog = dataVerification.textlengthInteger;
                return false;
            }
            if (Number(value2) < Number(value1)) {
                ctx.warnDialog = dataVerification.tooltipInfo4;
                return false;
            }
        }
    }
    else if (verifacationT === "date") {
        if (!isdatetime(value1)) {
            ctx.warnDialog = dataVerification.tooltipInfo6;
            return false;
        }
        if (type2 === "between" || type2 === "notBetween") {
            if (!isdatetime(value2)) {
                ctx.warnDialog = dataVerification.tooltipInfo6;
                return false;
            }
            if (diff(value1, value2) > 0) {
                ctx.warnDialog = dataVerification.tooltipInfo7;
                return false;
            }
        }
    }
    return true;
}
