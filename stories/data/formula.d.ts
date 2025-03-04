declare const data: {
    name: string;
    color: string;
    config: {
        merge: {
            "12_2": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "19_2": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "20_6": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "22_6": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "23_6": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "28_2": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "31_6": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "33_6": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "35_6": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "37_6": {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            "29_6": {
                r: number;
                c: number;
                rs: number;
                cs: number;
            };
        };
        rowlen: {};
        columnlen: {
            "0": number;
            "2": number;
            "3": number;
            "4": number;
            "5": number;
            "6": number;
            "7": number;
            "8": number;
            "9": number;
            "10": number;
        };
    };
    id: string;
    chart: never[];
    order: string;
    column: number;
    row: number;
    celldata: ({
        r: number;
        c: number;
        v: {
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            v?: undefined;
            ct?: undefined;
            m?: undefined;
            f?: undefined;
            mc?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            v: string;
            ct: {
                fa: string;
                t: string;
            };
            m: string;
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            f?: undefined;
            mc?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            v: number;
            ct: {
                fa: string;
                t: string;
            };
            m: string;
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            f?: undefined;
            mc?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            v: string;
            ct: {
                fa: string;
                t: string;
            };
            m: string;
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            f: string;
            mc?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            v: number;
            ct: {
                fa: string;
                t: string;
            };
            m: string;
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            f: string;
            mc?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            v: string;
            ct: {
                fa: string;
                t: string;
            };
            m: string;
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            mc: {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            f?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            mc: {
                r: number;
                c: number;
                rs?: undefined;
                cs?: undefined;
            };
            bg?: undefined;
            bl?: undefined;
            it?: undefined;
            ff?: undefined;
            fs?: undefined;
            fc?: undefined;
            ht?: undefined;
            vt?: undefined;
            v?: undefined;
            ct?: undefined;
            m?: undefined;
            f?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            ct: {
                fa: string;
                t: string;
            };
            v?: undefined;
            m?: undefined;
            f?: undefined;
            mc?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            ct: {
                fa: string;
                t: string;
            };
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            mc: {
                rs: number;
                cs: number;
                r: number;
                c: number;
            };
            v?: undefined;
            m?: undefined;
            f?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            ct: {
                fa: string;
                t: string;
            };
            bg: null;
            bl: number;
            it: number;
            ff: number;
            fs: number;
            fc: string;
            ht: number;
            vt: number;
            m: string;
            v: boolean;
            f: string;
            mc?: undefined;
        };
    } | {
        r: number;
        c: number;
        v: {
            bg?: undefined;
            bl?: undefined;
            it?: undefined;
            ff?: undefined;
            fs?: undefined;
            fc?: undefined;
            ht?: undefined;
            vt?: undefined;
            v?: undefined;
            ct?: undefined;
            m?: undefined;
            f?: undefined;
            mc?: undefined;
        };
    })[];
    calcChain: {
        r: number;
        c: number;
        id: string;
        color: string;
        parent: null;
        chidren: {};
        times: number;
    }[];
    ch_width: number;
    rh_height: number;
    luckysheet_select_save: {
        left: number;
        width: number;
        top: number;
        height: number;
        left_move: number;
        width_move: number;
        top_move: number;
        height_move: number;
        row: number[];
        column: number[];
        row_focus: number;
        column_focus: number;
    }[];
    luckysheet_selection_range: never[];
    scrollLeft: number;
    scrollTop: number;
    frozen: {
        type: string;
    };
};
export default data;
