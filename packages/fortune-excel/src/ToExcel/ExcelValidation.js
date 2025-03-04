import { DATA_VERIFICATION_REV_MAP, OPERATOR_MAP } from "../common/constant";
function rowColToCell(rowColumn) {
    var _a = rowColumn.split("_").map(Number), row = _a[0], col = _a[1];
    function columnToLetters(colIndex) {
        var letters = "";
        while (colIndex >= 0) {
            letters = String.fromCharCode((colIndex % 26) + 65) + letters;
            colIndex = Math.floor(colIndex / 26) - 1;
        }
        return letters;
    }
    var columnLetters = columnToLetters(col);
    var rowNumber = row + 1;
    return "".concat(columnLetters).concat(rowNumber);
}
function getExcelValidation(cellVerification) {
    var excelValidation = {
        type: DATA_VERIFICATION_REV_MAP[cellVerification.type],
        showInputMessage: !!cellVerification.hintShow,
        showErrorMessage: !!cellVerification.prohibitInput,
        prompt: cellVerification.hintValue,
    };
    switch (cellVerification.type) {
        case "dropdown":
            excelValidation.formulae = ['"' + cellVerification.value1 + '"'];
            break;
        case "number":
        case "number_integer":
        case "number_decimal":
            excelValidation.operator = OPERATOR_MAP[cellVerification.type2];
            excelValidation.formulae = [
                parseFloat(cellVerification.value1),
                parseFloat(cellVerification.value2),
            ];
            break;
        case "text_length":
            excelValidation.operator = OPERATOR_MAP[cellVerification.type2];
            excelValidation.formulae = [
                parseInt(cellVerification.value1),
                parseInt(cellVerification.value2),
            ];
            if (!excelValidation.formulae[1])
                excelValidation.formulae.pop();
            break;
        case "date":
            excelValidation.operator = OPERATOR_MAP[cellVerification.type2];
            excelValidation.formulae = [
                new Date(cellVerification.value1),
                new Date(cellVerification.value2),
            ];
            break;
        default:
            return {};
    }
    return excelValidation;
}
function setDataValidations(table, worksheet) {
    for (var key in table.dataVerification) {
        var cell = rowColToCell(key);
        worksheet.getCell(cell).dataValidation = getExcelValidation(table.dataVerification[key]);
    }
}
export { setDataValidations };
