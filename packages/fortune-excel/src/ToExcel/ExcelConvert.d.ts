declare var fillConvert: (bg: string) => ExcelJS.Fill;
declare var fontConvert: (ff?: string, fc?: string, bl?: number, it?: number, fs?: number, cl?: number, ul?: number) => {
    name: string;
    family: number;
    size: number;
    color: {
        argb: string;
    };
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strike: boolean;
};
declare var alignmentConvert: (vt?: number, ht?: number, tb?: number, tr?: number) => ExcelJS.Alignment;
export { fillConvert, fontConvert, alignmentConvert };
