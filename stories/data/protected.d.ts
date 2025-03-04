declare const lockcellData: ({
    name: string;
    config: {
        colReadOnly: {
            "1": number;
        };
        rowReadOnly: {
            "1": number;
        };
        columnlen: {
            "0": number;
            "1": number;
        };
    };
    celldata: {
        r: number;
        c: number;
        v: {
            v: string;
        };
    }[];
} | {
    name: string;
    celldata: ({
        r: number;
        c: number;
        v: {
            v: string;
            lo: number;
        };
    } | {
        r: number;
        c: number;
        v: {
            v: string;
            lo?: undefined;
        };
    })[];
})[];
export default lockcellData;
