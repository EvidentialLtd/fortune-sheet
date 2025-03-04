import React from "react";
import { StoryFn } from "@storybook/react";
import { Sheet } from "@evidential-fortune-sheet/core";
import { Workbook } from "@evidential-fortune-sheet/react";
declare const _default: import("@storybook/types").ComponentAnnotations<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export default _default;
export declare const Basic: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export declare const Formula: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export declare const Empty: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export declare const Tabs: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export declare const Freeze: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export declare const DataVerification: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export declare const ProtectedSheet: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, import("@evidential-fortune-sheet/core").Settings & {
    onChange?: ((data: Sheet[]) => void) | undefined;
    onOp?: ((op: import("@evidential-fortune-sheet/core").Op[]) => void) | undefined;
} & React.RefAttributes<{
    applyOp: (ops: import("@evidential-fortune-sheet/core").Op[]) => void;
    getCellValue: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => any;
    setCellValue: (row: number, column: number, value: any, options?: import("../packages/core/src/api").CommonOptions & {
        type?: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle | undefined;
    }) => void;
    clearCell: (row: number, column: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormat: (row: number, column: number, attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, options?: import("../packages/core/src/api").CommonOptions) => void;
    autoFillCell: (copyRange: import("@evidential-fortune-sheet/core").SingleRange, applyRange: import("@evidential-fortune-sheet/core").SingleRange, direction: "left" | "right" | "down" | "up") => void;
    freeze: (type: "row" | "column" | "both", range: {
        row: number;
        column: number;
    }, options?: import("../packages/core/src/api").CommonOptions) => void;
    insertRowOrColumn: (type: "row" | "column", index: number, count: number, direction?: "lefttop" | "rightbottom", options?: import("../packages/core/src/api").CommonOptions) => void;
    deleteRowOrColumn: (type: "row" | "column", start: number, end: number, options?: import("../packages/core/src/api").CommonOptions) => void;
    hideRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    showRowOrColumn: (rowOrColInfo: string[], type: "row" | "column") => void;
    setRowHeight: (rowInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    setColumnWidth: (columnInfo: Record<string, number>, options?: import("../packages/core/src/api").CommonOptions, custom?: boolean) => void;
    getRowHeight: (rows: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getColumnWidth: (columns: number[], options?: import("../packages/core/src/api").CommonOptions) => Record<number, number>;
    getSelection: () => {
        row: number[];
        column: number[];
    }[] | undefined;
    getFlattenRange: (range: import("@evidential-fortune-sheet/core").Range) => {
        r: number;
        c: number;
    }[];
    getCellsByFlattenRange: (range?: {
        r: number;
        c: number;
    }[] | undefined) => (import("@evidential-fortune-sheet/core").Cell | null)[];
    getSelectionCoordinates: () => string[];
    getCellsByRange: (range: import("@evidential-fortune-sheet/core").Selection, options?: import("../packages/core/src/api").CommonOptions) => (import("@evidential-fortune-sheet/core").Cell | null)[][];
    getHtmlByRange: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => string | null;
    setSelection: (range: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellValuesByRange: (data: any[][], range: import("@evidential-fortune-sheet/core").SingleRange, options?: import("../packages/core/src/api").CommonOptions) => void;
    setCellFormatByRange: (attr: "m" | "mc" | "v" | "f" | "ct" | "qp" | "spl" | "bg" | "lo" | "rt" | "ps" | "hl" | keyof import("@evidential-fortune-sheet/core").CellStyle, value: any, range: import("@evidential-fortune-sheet/core").SingleRange | import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    mergeCells: (ranges: import("@evidential-fortune-sheet/core").Range, type: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    cancelMerge: (ranges: import("@evidential-fortune-sheet/core").Range, options?: import("../packages/core/src/api").CommonOptions) => void;
    getAllSheets: () => Sheet[];
    setTouchMode: (mode: "select" | "pan") => void;
    getSheet: (options?: import("../packages/core/src/api").CommonOptions) => {
        celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
        name: string;
        config?: import("@evidential-fortune-sheet/core").SheetConfig | undefined;
        order?: number | undefined;
        color?: string | undefined;
        data?: import("@evidential-fortune-sheet/core").CellMatrix | undefined;
        id?: string | undefined;
        images?: import("@evidential-fortune-sheet/core").Image[] | undefined;
        zoomRatio?: number | undefined;
        column?: number | undefined;
        row?: number | undefined;
        addRows?: number | undefined;
        status?: number | undefined;
        hide?: number | undefined;
        luckysheet_select_save?: import("@evidential-fortune-sheet/core").Selection[] | undefined;
        luckysheet_selection_range?: {
            row: number[];
            column: number[];
        }[] | undefined;
        calcChain?: any[] | undefined;
        defaultRowHeight?: number | undefined;
        defaultColWidth?: number | undefined;
        showGridLines?: number | boolean | undefined;
        pivotTable?: any;
        isPivotTable?: boolean | undefined;
        filter?: Record<string, any> | undefined;
        filter_select?: {
            row: number[];
            column: number[];
        } | undefined;
        luckysheet_conditionformat_save?: any[] | undefined;
        luckysheet_alternateformat_save?: any[] | undefined;
        dataVerification?: any;
        hyperlink?: Record<string, {
            linkType: string;
            linkAddress: string;
        }> | undefined;
        dynamicArray_compute?: any;
        dynamicArray?: any[] | undefined;
        frozen?: {
            type: "row" | "column" | "both" | "rangeRow" | "rangeColumn" | "rangeBoth";
            range?: {
                row_focus: number;
                column_focus: number;
            } | undefined;
        } | undefined;
    };
    addSheet: (sheetId?: string | undefined) => void;
    deleteSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    updateSheet: (data: Sheet[]) => void;
    activateSheet: (options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetName: (name: string, options?: import("../packages/core/src/api").CommonOptions) => void;
    setSheetOrder: (orderList: Record<string, number>) => void;
    scroll: (options: {
        scrollLeft?: number | undefined;
        scrollTop?: number | undefined;
        targetRow?: number | undefined;
        targetColumn?: number | undefined;
    }) => void;
    addPresences: (newPresences: import("@evidential-fortune-sheet/core").Presence[]) => void;
    removePresences: (arr: {
        username: string;
        userId?: string | undefined;
    }[]) => void;
    setSearchReplace: (state: boolean) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    calculateFormula: (id?: string | undefined, range?: import("@evidential-fortune-sheet/core").SingleRange | undefined) => void;
    dataToCelldata: (data: import("@evidential-fortune-sheet/core").CellMatrix | undefined) => import("@evidential-fortune-sheet/core").CellWithRowAndCol[];
    celldataToData: (celldata: import("@evidential-fortune-sheet/core").CellWithRowAndCol[], rowCount?: number | undefined, colCount?: number | undefined) => import("@evidential-fortune-sheet/core").CellMatrix | null;
    batchCallApis: (apiCalls: {
        name: string;
        args: any[];
    }[]) => void;
}>>;
export declare const MultiInstance: StoryFn<typeof Workbook>;
export declare const TestingTablet: StoryFn<typeof Workbook>;
