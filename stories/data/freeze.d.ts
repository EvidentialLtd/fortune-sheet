declare const data: {
    name: string;
    color: string;
    status: number;
    id: string;
    row: number;
    column: number;
    config: {
        merge: {};
        rowlen: {};
    };
    pivotTable: null;
    isPivotTable: boolean;
    celldata: {
        r: number;
        c: number;
        v: {
            v: number;
            ct: {
                fa: string;
                t: string;
            };
            m: string;
        };
    }[];
    frozen: {
        type: string;
        range: {
            row_focus: number;
            column_focus: number;
        };
    };
};
export default data;
