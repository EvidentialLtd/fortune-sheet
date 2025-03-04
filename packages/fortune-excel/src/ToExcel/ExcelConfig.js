function setHiddenRowCol(table, worksheet) {
    var _a, _b;
    for (var row in (_a = table.config) === null || _a === void 0 ? void 0 : _a.rowhidden) {
        worksheet.getRow(parseInt(row) + 1).hidden = true;
    }
    for (var col in (_b = table.config) === null || _b === void 0 ? void 0 : _b.colhidden) {
        worksheet.getColumn(parseInt(col) + 1).hidden = true;
    }
}
export { setHiddenRowCol };
