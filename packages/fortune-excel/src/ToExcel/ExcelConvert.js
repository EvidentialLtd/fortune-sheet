import { ALIGNMENT_DEFAULT } from "../common/constant";
import { rgb2hex } from "../common/method";
var fillConvert = function (bg) {
    if (!bg) {
        return null;
    }
    bg = bg.indexOf("rgb") > -1 ? rgb2hex(bg) : bg;
    var fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bg.replace("#", "") },
    };
    return fill;
};
var fontConvert = function (ff, fc, bl, it, fs, cl, ul) {
    if (ff === void 0) { ff = ""; }
    if (fc === void 0) { fc = "#000000"; }
    if (bl === void 0) { bl = 0; }
    if (it === void 0) { it = 0; }
    if (fs === void 0) { fs = 10; }
    if (cl === void 0) { cl = 0; }
    if (ul === void 0) { ul = 0; }
    var luckyToExcel = {
        0: "微软雅黑",
        1: "宋体（Song）",
        2: "黑体（ST Heiti）",
        3: "楷体（ST Kaiti）",
        4: "仿宋（ST FangSong）",
        5: "新宋体（ST Song）",
        6: "华文新魏",
        7: "华文行楷",
        8: "华文隶书",
        9: "Arial",
        10: "Times New Roman ",
        11: "Tahoma ",
        12: "Verdana",
        num2bl: function (num) {
            return num === 0 ? false : true;
        },
    };
    var color = (fc + "").indexOf("rgb") > -1 ? rgb2hex(fc) : fc;
    var font = {
        name: ff,
        family: 1,
        size: fs,
        color: { argb: color.replace("#", "") },
        bold: luckyToExcel.num2bl(bl),
        italic: luckyToExcel.num2bl(it),
        underline: luckyToExcel.num2bl(ul),
        strike: luckyToExcel.num2bl(cl),
    };
    return font;
};
var alignmentConvert = function (vt, ht, tb, tr) {
    if (vt === void 0) { vt = ALIGNMENT_DEFAULT; }
    if (ht === void 0) { ht = ALIGNMENT_DEFAULT; }
    if (tb === void 0) { tb = ALIGNMENT_DEFAULT; }
    if (tr === void 0) { tr = ALIGNMENT_DEFAULT; }
    var luckyToExcel = {
        vertical: {
            0: "middle",
            1: "top",
            2: "bottom",
            ALIGNMENT_DEFAULT: "top",
        },
        horizontal: {
            0: "center",
            1: "left",
            2: "right",
            ALIGNMENT_DEFAULT: "left",
        },
        wrapText: {
            0: false,
            1: false,
            2: true,
            ALIGNMENT_DEFAULT: false,
        },
        textRotation: {
            0: 0,
            1: 45,
            2: -45,
            3: "vertical",
            4: 90,
            5: -90,
            ALIGNMENT_DEFAULT: 0,
        },
    };
    var alignment = {
        vertical: luckyToExcel.vertical[vt],
        horizontal: luckyToExcel.horizontal[ht],
        wrapText: luckyToExcel.wrapText[tb],
        textRotation: luckyToExcel.textRotation[tr],
    };
    return alignment;
};
export { fillConvert, fontConvert, alignmentConvert };
