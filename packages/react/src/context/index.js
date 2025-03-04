import React from "react";
import { defaultContext, defaultSettings, } from "@evidential-fortune-sheet/core";
var defaultRefs = {
    globalCache: { undoList: [], redoList: [] },
    cellInput: React.createRef(),
    fxInput: React.createRef(),
    canvas: React.createRef(),
    cellArea: React.createRef(),
    workbookContainer: React.createRef(),
};
var WorkbookContext = React.createContext({
    context: defaultContext(defaultRefs),
    setContext: function () { },
    settings: defaultSettings,
    handleUndo: function () { },
    handleRedo: function () { },
    refs: {
        globalCache: { undoList: [], redoList: [] },
        cellInput: React.createRef(),
        fxInput: React.createRef(),
        canvas: React.createRef(),
        scrollbarX: React.createRef(),
        scrollbarY: React.createRef(),
        cellArea: React.createRef(),
        workbookContainer: React.createRef(),
    },
});
export default WorkbookContext;
