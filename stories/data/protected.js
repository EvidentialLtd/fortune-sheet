var protectedSheet = {
    name: "protected",
    config: {
        authority: {
            sheet: 1,
        },
    },
    celldata: [
        { r: 0, c: 0, v: { v: "can edit", lo: 0 } },
        { r: 0, c: 1, v: { v: "is locked", lo: 1 } },
        { r: 0, c: 2, v: { v: "default is locked" } },
    ],
};
var partialEditableSheet = {
    name: "partial editable",
    config: {
        colReadOnly: { "1": 1 },
        rowReadOnly: { "1": 1 },
        columnlen: {
            "0": 200,
            "1": 200,
        },
    },
    celldata: [
        { r: 0, c: 1, v: { v: "protected column" } },
        { r: 1, c: 0, v: { v: "protected row" } },
    ],
};
var editableSheet = {
    name: "editable",
    celldata: [
        { r: 0, c: 0, v: { v: "can edit", lo: 0 } },
        { r: 0, c: 1, v: { v: "is locked", lo: 1 } },
        { r: 0, c: 2, v: { v: "default can edit" } },
    ],
};
var lockcellData = [protectedSheet, partialEditableSheet, editableSheet];
export default lockcellData;
