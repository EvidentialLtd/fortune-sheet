import { getObjType, rgb2hex } from "../common/method";
var setBorder = function (lucksheetfile, worksheet) {
    if (!lucksheetfile)
        return;
    var luckyToExcel = {
        style: {
            0: "none",
            1: "thin",
            2: "hair",
            3: "dotted",
            4: "dashDot",
            5: "dashDot",
            6: "dashDotDot",
            7: "double",
            8: "medium",
            9: "mediumDashed",
            10: "mediumDashDot",
            11: "mediumDashDotDot",
            12: "slantDashDot",
            13: "thick",
        },
    };
    var borderInfoCompute = getBorderInfo(lucksheetfile);
    for (var x in borderInfoCompute) {
        var border = {};
        var info = borderInfoCompute[x];
        var row = parseInt(x.substr(0, x.indexOf("_")));
        var column = parseInt(x.substr(x.indexOf("_") + 1));
        if (info.t != undefined) {
            var tcolor = info.t.color.indexOf("rgb") > -1 ? rgb2hex(info.t.color) : info.t.color;
            border["top"] = {
                style: luckyToExcel.style[info.t.style],
                color: { argb: tcolor.replace("#", "") },
            };
        }
        if (info.r != undefined) {
            var rcolor = info.r.color.indexOf("rgb") > -1 ? rgb2hex(info.r.color) : info.r.color;
            border["right"] = {
                style: luckyToExcel.style[info.r.style],
                color: { argb: rcolor.replace("#", "") },
            };
        }
        if (info.b != undefined) {
            var bcolor = info.b.color.indexOf("rgb") > -1 ? rgb2hex(info.b.color) : info.b.color;
            border["bottom"] = {
                style: luckyToExcel.style[info.b.style],
                color: { argb: bcolor.replace("#", "") },
            };
        }
        if (info.l != undefined) {
            var lcolor = info.l.color.indexOf("rgb") > -1 ? rgb2hex(info.l.color) : info.l.color;
            border["left"] = {
                style: luckyToExcel.style[info.l.style],
                color: { argb: lcolor.replace("#", "") },
            };
        }
        worksheet.getCell(row + 1, column + 1).border = border;
    }
};
var getBorderInfo = function (luckysheetfile) {
    var _a, _b, _c, _d;
    var borderInfoCompute = {};
    var cfg = luckysheetfile.config;
    var data = luckysheetfile.data;
    if (!cfg || !data)
        return {};
    var borderInfo = cfg["borderInfo"];
    var dataset_row_st = 0, dataset_row_ed = data.length, dataset_col_st = 0, dataset_col_ed = data[0].length;
    if (borderInfo != null && borderInfo.length > 0) {
        for (var i = 0; i < borderInfo.length; i++) {
            var rangeType = borderInfo[i].rangeType;
            if (rangeType == "range") {
                var borderType = borderInfo[i].borderType;
                var borderColor = borderInfo[i].color;
                var borderStyle = borderInfo[i].style;
                var borderRange = borderInfo[i].range;
                for (var j = 0; j < borderRange.length; j++) {
                    var bd_r1 = borderRange[j].row[0], bd_r2 = borderRange[j].row[1];
                    var bd_c1 = borderRange[j].column[0], bd_c2 = borderRange[j].column[1];
                    if (bd_r1 < dataset_row_st) {
                        bd_r1 = dataset_row_st;
                    }
                    if (bd_r2 > dataset_row_ed) {
                        bd_r2 = dataset_row_ed;
                    }
                    if (bd_c1 < dataset_col_st) {
                        bd_c1 = dataset_col_st;
                    }
                    if (bd_c2 > dataset_col_ed) {
                        bd_c2 = dataset_col_ed;
                    }
                    if (borderType == "border-left") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            if (borderInfoCompute[bd_r + "_" + bd_c1] == null) {
                                borderInfoCompute[bd_r + "_" + bd_c1] = {};
                            }
                            borderInfoCompute[bd_r + "_" + bd_c1].l = {
                                color: borderColor,
                                style: borderStyle,
                            };
                            var bd_c_left = bd_c1 - 1;
                            if (bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]) {
                                if (data[bd_r] != null &&
                                    getObjType(data[bd_r][bd_c_left]) == "object" &&
                                    data[bd_r][bd_c_left].mc != null) {
                                    var cell_left = data[bd_r][bd_c_left];
                                    var mc_1 = cfg["merge"][((_a = cell_left === null || cell_left === void 0 ? void 0 : cell_left.mc) === null || _a === void 0 ? void 0 : _a.r) + "_" + ((_b = cell_left === null || cell_left === void 0 ? void 0 : cell_left.mc) === null || _b === void 0 ? void 0 : _b.c)];
                                    if (mc_1.c + mc_1.cs - 1 == bd_c_left) {
                                        borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                }
                            }
                            var mc = cfg["merge"] || {};
                            for (var key in mc) {
                                var _e = mc[key], c = _e.c, r = _e.r, cs = _e.cs, rs = _e.rs;
                                if (bd_c1 <= c + cs - 1 &&
                                    bd_c1 > c &&
                                    bd_r >= r &&
                                    bd_r <= r + rs - 1) {
                                    borderInfoCompute[bd_r + "_" + bd_c1].l = null;
                                }
                            }
                        }
                    }
                    else if (borderType == "border-right") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            if (borderInfoCompute[bd_r + "_" + bd_c2] == null) {
                                borderInfoCompute[bd_r + "_" + bd_c2] = {};
                            }
                            borderInfoCompute[bd_r + "_" + bd_c2].r = {
                                color: borderColor,
                                style: borderStyle,
                            };
                            var bd_c_right = bd_c2 + 1;
                            if (bd_c_right < data[0].length &&
                                borderInfoCompute[bd_r + "_" + bd_c_right]) {
                                if (data[bd_r] != null &&
                                    getObjType(data[bd_r][bd_c_right]) == "object" &&
                                    data[bd_r][bd_c_right].mc != null) {
                                    var cell_right = data[bd_r][bd_c_right];
                                    var mc_2 = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];
                                    if (mc_2.c == bd_c_right) {
                                        borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                }
                            }
                            var mc = cfg["merge"] || {};
                            for (var key in mc) {
                                var _f = mc[key], c = _f.c, r = _f.r, cs = _f.cs, rs = _f.rs;
                                if (bd_c2 < c + cs - 1 &&
                                    bd_c2 >= c &&
                                    bd_r >= r &&
                                    bd_r <= r + rs - 1) {
                                    borderInfoCompute[bd_r + "_" + bd_c2].r = null;
                                }
                            }
                        }
                    }
                    else if (borderType == "border-top") {
                        if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r1] != null) {
                            continue;
                        }
                        for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                            if (borderInfoCompute[bd_r1 + "_" + bd_c] == null) {
                                borderInfoCompute[bd_r1 + "_" + bd_c] = {};
                            }
                            borderInfoCompute[bd_r1 + "_" + bd_c].t = {
                                color: borderColor,
                                style: borderStyle,
                            };
                            var bd_r_top = bd_r1 - 1;
                            if (bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]) {
                                if (data[bd_r_top] != null &&
                                    getObjType(data[bd_r_top][bd_c]) == "object" &&
                                    data[bd_r_top][bd_c].mc != null) {
                                    var cell_top = data[bd_r_top][bd_c];
                                    var mc_3 = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];
                                    if (mc_3.r + mc_3.rs - 1 == bd_r_top) {
                                        borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                }
                            }
                            var mc = cfg["merge"] || {};
                            for (var key in mc) {
                                var _g = mc[key], c = _g.c, r = _g.r, cs = _g.cs, rs = _g.rs;
                                if (bd_r1 <= r + rs - 1 &&
                                    bd_r1 > r &&
                                    bd_c >= c &&
                                    bd_c <= c + cs - 1) {
                                    borderInfoCompute[bd_r1 + "_" + bd_c].t = null;
                                }
                            }
                        }
                    }
                    else if (borderType == "border-bottom") {
                        if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r2] != null) {
                            continue;
                        }
                        for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                            if (borderInfoCompute[bd_r2 + "_" + bd_c] == null) {
                                borderInfoCompute[bd_r2 + "_" + bd_c] = {};
                            }
                            borderInfoCompute[bd_r2 + "_" + bd_c].b = {
                                color: borderColor,
                                style: borderStyle,
                            };
                            var bd_r_bottom = bd_r2 + 1;
                            if (bd_r_bottom < data.length &&
                                borderInfoCompute[bd_r_bottom + "_" + bd_c]) {
                                if (data[bd_r_bottom] != null &&
                                    getObjType(data[bd_r_bottom][bd_c]) == "object" &&
                                    data[bd_r_bottom][bd_c].mc != null) {
                                    var cell_bottom = data[bd_r_bottom][bd_c];
                                    var mc_4 = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];
                                    if (mc_4.r == bd_r_bottom) {
                                        borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                }
                            }
                            var mc = cfg["merge"] || {};
                            for (var key in mc) {
                                var _h = mc[key], c = _h.c, r = _h.r, cs = _h.cs, rs = _h.rs;
                                if (bd_r2 < r + rs - 1 &&
                                    bd_r2 >= r &&
                                    bd_c >= c &&
                                    bd_c <= c + cs - 1) {
                                    borderInfoCompute[bd_r2 + "_" + bd_c].b = null;
                                }
                            }
                        }
                    }
                    else if (borderType == "border-all") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                                if (data[bd_r] != null &&
                                    getObjType(data[bd_r][bd_c]) == "object" &&
                                    data[bd_r][bd_c].mc != null) {
                                    var cell = data[bd_r][bd_c];
                                    var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                                    if (mc == undefined || mc == null) {
                                        continue;
                                    }
                                    if (mc.r == bd_r) {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                    if (mc.r + mc.rs - 1 == bd_r) {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                    if (mc.c == bd_c) {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                    if (mc.c + mc.cs - 1 == bd_c) {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                                    }
                                    borderInfoCompute[bd_r + "_" + bd_c].l = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                    borderInfoCompute[bd_r + "_" + bd_c].r = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                    borderInfoCompute[bd_r + "_" + bd_c].t = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                    borderInfoCompute[bd_r + "_" + bd_c].b = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                }
                                if (bd_r == bd_r1) {
                                    var bd_r_top = bd_r1 - 1;
                                    if (bd_r_top >= 0 &&
                                        borderInfoCompute[bd_r_top + "_" + bd_c]) {
                                        if (data[bd_r_top] != null &&
                                            getObjType(data[bd_r_top][bd_c]) == "object" &&
                                            data[bd_r_top][bd_c].mc != null) {
                                            var cell_top = data[bd_r_top][bd_c];
                                            var mc = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];
                                            if (mc.r + mc.rs - 1 == bd_r_top) {
                                                borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                                if (bd_r == bd_r2) {
                                    var bd_r_bottom = bd_r2 + 1;
                                    if (bd_r_bottom < data.length &&
                                        borderInfoCompute[bd_r_bottom + "_" + bd_c]) {
                                        if (data[bd_r_bottom] != null &&
                                            getObjType(data[bd_r_bottom][bd_c]) == "object" &&
                                            data[bd_r_bottom][bd_c].mc != null) {
                                            var cell_bottom = data[bd_r_bottom][bd_c];
                                            var mc = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];
                                            if (mc.r == bd_r_bottom) {
                                                borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                                if (bd_c == bd_c1) {
                                    var bd_c_left = bd_c1 - 1;
                                    if (bd_c_left >= 0 &&
                                        borderInfoCompute[bd_r + "_" + bd_c_left]) {
                                        if (data[bd_r] != null &&
                                            getObjType(data[bd_r][bd_c_left]) == "object" &&
                                            data[bd_r][bd_c_left].mc != null) {
                                            var cell_left = data[bd_r][bd_c_left];
                                            var mc = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];
                                            if (mc.c + mc.cs - 1 == bd_c_left) {
                                                borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                                if (bd_c == bd_c2) {
                                    var bd_c_right = bd_c2 + 1;
                                    if (bd_c_right < data[0].length &&
                                        borderInfoCompute[bd_r + "_" + bd_c_right]) {
                                        if (data[bd_r] != null &&
                                            getObjType(data[bd_r][bd_c_right]) == "object" &&
                                            data[bd_r][bd_c_right].mc != null) {
                                            var cell_right = data[bd_r][bd_c_right];
                                            var mc = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];
                                            if (mc.c == bd_c_right) {
                                                borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (borderType == "border-outside") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                                if (!(bd_r == bd_r1 ||
                                    bd_r == bd_r2 ||
                                    bd_c == bd_c1 ||
                                    bd_c == bd_c2)) {
                                    continue;
                                }
                                if (bd_r == bd_r1) {
                                    if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                                    }
                                    borderInfoCompute[bd_r + "_" + bd_c].t = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                    var bd_r_top = bd_r1 - 1;
                                    if (bd_r_top >= 0 &&
                                        borderInfoCompute[bd_r_top + "_" + bd_c]) {
                                        if (data[bd_r_top] != null &&
                                            getObjType(data[bd_r_top][bd_c]) == "object" &&
                                            data[bd_r_top][bd_c].mc != null) {
                                            var cell_top = data[bd_r_top][bd_c];
                                            var mc = cfg["merge"][((_c = cell_top === null || cell_top === void 0 ? void 0 : cell_top.mc) === null || _c === void 0 ? void 0 : _c.r) + "_" + ((_d = cell_top === null || cell_top === void 0 ? void 0 : cell_top.mc) === null || _d === void 0 ? void 0 : _d.c)];
                                            if (mc.r + mc.rs - 1 == bd_r_top) {
                                                borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                                if (bd_r == bd_r2) {
                                    if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                                    }
                                    borderInfoCompute[bd_r + "_" + bd_c].b = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                    var bd_r_bottom = bd_r2 + 1;
                                    if (bd_r_bottom < data.length &&
                                        borderInfoCompute[bd_r_bottom + "_" + bd_c]) {
                                        if (data[bd_r_bottom] != null &&
                                            getObjType(data[bd_r_bottom][bd_c]) == "object" &&
                                            data[bd_r_bottom][bd_c].mc != null) {
                                            var cell_bottom = data[bd_r_bottom][bd_c];
                                            var mc = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];
                                            if (mc.r == bd_r_bottom) {
                                                borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                                if (bd_c == bd_c1) {
                                    if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                                    }
                                    borderInfoCompute[bd_r + "_" + bd_c].l = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                    var bd_c_left = bd_c1 - 1;
                                    if (bd_c_left >= 0 &&
                                        borderInfoCompute[bd_r + "_" + bd_c_left]) {
                                        if (data[bd_r] != null &&
                                            getObjType(data[bd_r][bd_c_left]) == "object" &&
                                            data[bd_r][bd_c_left].mc != null) {
                                            var cell_left = data[bd_r][bd_c_left];
                                            var mc = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];
                                            if (mc.c + mc.cs - 1 == bd_c_left) {
                                                borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                                if (bd_c == bd_c2) {
                                    if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                                    }
                                    borderInfoCompute[bd_r + "_" + bd_c].r = {
                                        color: borderColor,
                                        style: borderStyle,
                                    };
                                    var bd_c_right = bd_c2 + 1;
                                    if (bd_c_right < data[0].length &&
                                        borderInfoCompute[bd_r + "_" + bd_c_right]) {
                                        if (data[bd_r] != null &&
                                            getObjType(data[bd_r][bd_c_right]) == "object" &&
                                            data[bd_r][bd_c_right].mc != null) {
                                            var cell_right = data[bd_r][bd_c_right];
                                            var mc = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];
                                            if (mc.c == bd_c_right) {
                                                borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                                    color: borderColor,
                                                    style: borderStyle,
                                                };
                                            }
                                        }
                                        else {
                                            borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (borderType == "border-inside") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                                if (bd_r == bd_r1 && bd_c == bd_c1) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_r == bd_r2 && bd_c == bd_c1) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_r == bd_r1 && bd_c == bd_c2) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_r == bd_r2 && bd_c == bd_c2) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_r == bd_r1) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                        var cell = data[bd_r][bd_c];
                                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                                        if (mc.c == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].l = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.c + mc.cs - 1 == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].r = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_r == bd_r2) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                        var cell = data[bd_r][bd_c];
                                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                                        if (mc.c == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].l = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.c + mc.cs - 1 == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].r = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_c == bd_c1) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                        var cell = data[bd_r][bd_c];
                                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                                        if (mc.r == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].t = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.r + mc.rs - 1 == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].b = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_c == bd_c2) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                        var cell = data[bd_r][bd_c];
                                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                                        if (mc.r == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].t = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.r + mc.rs - 1 == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].b = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                        var cell = data[bd_r][bd_c];
                                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                                        if (mc.r == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].t = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.r + mc.rs - 1 == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].b = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        if (mc.c == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].l = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.c + mc.cs - 1 == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].r = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                            }
                        }
                    }
                    else if (borderType == "border-horizontal") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                                if (bd_r == bd_r1) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_r == bd_r2) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                        var cell = data[bd_r][bd_c];
                                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                                        if (mc.r == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].t = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.r + mc.rs - 1 == bd_r) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].b = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].t = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].b = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                            }
                        }
                    }
                    else if (borderType == "border-vertical") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                                if (bd_c == bd_c1) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else if (bd_c == bd_c2) {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                                else {
                                    if (data[bd_r] != null &&
                                        getObjType(data[bd_r][bd_c]) == "object" &&
                                        data[bd_r][bd_c].mc != null) {
                                        var cell = data[bd_r][bd_c];
                                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c] ||
                                            {};
                                        if (mc.c == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].l = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                        else if (mc.c + mc.cs - 1 == bd_c) {
                                            if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                                borderInfoCompute[bd_r + "_" + bd_c] =
                                                    {};
                                            }
                                            borderInfoCompute[bd_r + "_" + bd_c].r = {
                                                color: borderColor,
                                                style: borderStyle,
                                            };
                                        }
                                    }
                                    else {
                                        if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                                            borderInfoCompute[bd_r + "_" + bd_c] = {};
                                        }
                                        borderInfoCompute[bd_r + "_" + bd_c].l = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                        borderInfoCompute[bd_r + "_" + bd_c].r = {
                                            color: borderColor,
                                            style: borderStyle,
                                        };
                                    }
                                }
                            }
                        }
                    }
                    else if (borderType == "border-none") {
                        for (var bd_r = bd_r1; bd_r <= bd_r2; bd_r++) {
                            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                                continue;
                            }
                            for (var bd_c = bd_c1; bd_c <= bd_c2; bd_c++) {
                                if (borderInfoCompute[bd_r + "_" + bd_c] != null) {
                                    delete borderInfoCompute[bd_r + "_" + bd_c];
                                }
                                if (bd_r == bd_r1) {
                                    var bd_r_top = bd_r1 - 1;
                                    if (bd_r_top >= 0 &&
                                        borderInfoCompute[bd_r_top + "_" + bd_c]) {
                                        delete borderInfoCompute[bd_r_top + "_" + bd_c].b;
                                    }
                                }
                                if (bd_r == bd_r2) {
                                    var bd_r_bottom = bd_r2 + 1;
                                    if (bd_r_bottom < data.length &&
                                        borderInfoCompute[bd_r_bottom + "_" + bd_c]) {
                                        delete borderInfoCompute[bd_r_bottom + "_" + bd_c].t;
                                    }
                                }
                                if (bd_c == bd_c1) {
                                    var bd_c_left = bd_c1 - 1;
                                    if (bd_c_left >= 0 &&
                                        borderInfoCompute[bd_r + "_" + bd_c_left]) {
                                        delete borderInfoCompute[bd_r + "_" + bd_c_left].r;
                                    }
                                }
                                if (bd_c == bd_c2) {
                                    var bd_c_right = bd_c2 + 1;
                                    if (bd_c_right < data[0].length &&
                                        borderInfoCompute[bd_r + "_" + bd_c_right]) {
                                        delete borderInfoCompute[bd_r + "_" + bd_c_right].l;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (rangeType == "cell") {
                var value = borderInfo[i].value;
                var bd_r = value.row_index, bd_c = value.col_index;
                if (bd_r < dataset_row_st ||
                    bd_r > dataset_row_ed ||
                    bd_c < dataset_col_st ||
                    bd_c > dataset_col_ed) {
                    continue;
                }
                if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                    continue;
                }
                if (value.l != null ||
                    value.r != null ||
                    value.t != null ||
                    value.b != null) {
                    if (borderInfoCompute[bd_r + "_" + bd_c] == null) {
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }
                    if (data[bd_r] != null &&
                        getObjType(data[bd_r][bd_c]) == "object" &&
                        data[bd_r][bd_c].mc != null) {
                        var cell = data[bd_r][bd_c];
                        var mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c] ||
                            {};
                        if (value.l != null && bd_c == mc.c) {
                            borderInfoCompute[bd_r + "_" + bd_c].l = {
                                color: value.l.color,
                                style: value.l.style,
                            };
                            var bd_c_left = bd_c - 1;
                            if (bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]) {
                                if (data[bd_r] != null &&
                                    getObjType(data[bd_r][bd_c_left]) == "object" &&
                                    data[bd_r][bd_c_left].mc != null) {
                                    var cell_left = data[bd_r][bd_c_left];
                                    var mc_l = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];
                                    if (mc_l.c + mc_l.cs - 1 == bd_c_left) {
                                        borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                            color: value.l.color,
                                            style: value.l.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                        color: value.l.color,
                                        style: value.l.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].l = null;
                        }
                        if (value.r != null && bd_c == mc.c + mc.cs - 1) {
                            borderInfoCompute[bd_r + "_" + bd_c].r = {
                                color: value.r.color,
                                style: value.r.style,
                            };
                            var bd_c_right = bd_c + 1;
                            if (bd_c_right < data[0].length &&
                                borderInfoCompute[bd_r + "_" + bd_c_right]) {
                                if (data[bd_r] != null &&
                                    getObjType(data[bd_r][bd_c_right]) == "object" &&
                                    data[bd_r][bd_c_right].mc != null) {
                                    var cell_right = data[bd_r][bd_c_right];
                                    var mc_r = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];
                                    if (mc_r.c == bd_c_right) {
                                        borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                            color: value.r.color,
                                            style: value.r.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                        color: value.r.color,
                                        style: value.r.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].r = null;
                        }
                        if (value.t != null && bd_r == mc.r) {
                            borderInfoCompute[bd_r + "_" + bd_c].t = {
                                color: value.t.color,
                                style: value.t.style,
                            };
                            var bd_r_top = bd_r - 1;
                            if (bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]) {
                                if (data[bd_r_top] != null &&
                                    getObjType(data[bd_r_top][bd_c]) == "object" &&
                                    data[bd_r_top][bd_c].mc != null) {
                                    var cell_top = data[bd_r_top][bd_c];
                                    var mc_t = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];
                                    if (mc_t.r + mc_t.rs - 1 == bd_r_top) {
                                        borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                            color: value.t.color,
                                            style: value.t.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                        color: value.t.color,
                                        style: value.t.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].t = null;
                        }
                        if (value.b != null && bd_r == mc.r + mc.rs - 1) {
                            borderInfoCompute[bd_r + "_" + bd_c].b = {
                                color: value.b.color,
                                style: value.b.style,
                            };
                            var bd_r_bottom = bd_r + 1;
                            if (bd_r_bottom < data.length &&
                                borderInfoCompute[bd_r_bottom + "_" + bd_c]) {
                                if (data[bd_r_bottom] != null &&
                                    getObjType(data[bd_r_bottom][bd_c]) == "object" &&
                                    data[bd_r_bottom][bd_c].mc != null) {
                                    var cell_bottom = data[bd_r_bottom][bd_c];
                                    var mc_b = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];
                                    if (mc_b.r == bd_r_bottom) {
                                        borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                            color: value.b.color,
                                            style: value.b.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                        color: value.b.color,
                                        style: value.b.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].b = null;
                        }
                    }
                    else {
                        if (value.l != null) {
                            borderInfoCompute[bd_r + "_" + bd_c].l = {
                                color: value.l.color,
                                style: value.l.style,
                            };
                            var bd_c_left = bd_c - 1;
                            if (bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]) {
                                if (data[bd_r] != null &&
                                    getObjType(data[bd_r][bd_c_left]) == "object" &&
                                    data[bd_r][bd_c_left].mc != null) {
                                    var cell_left = data[bd_r][bd_c_left];
                                    var mc_l = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];
                                    if (mc_l.c + mc_l.cs - 1 == bd_c_left) {
                                        borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                            color: value.l.color,
                                            style: value.l.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r + "_" + bd_c_left].r = {
                                        color: value.l.color,
                                        style: value.l.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].l = null;
                        }
                        if (value.r != null) {
                            borderInfoCompute[bd_r + "_" + bd_c].r = {
                                color: value.r.color,
                                style: value.r.style,
                            };
                            var bd_c_right = bd_c + 1;
                            if (bd_c_right < data[0].length &&
                                borderInfoCompute[bd_r + "_" + bd_c_right]) {
                                if (data[bd_r] != null &&
                                    getObjType(data[bd_r][bd_c_right]) == "object" &&
                                    data[bd_r][bd_c_right].mc != null) {
                                    var cell_right = data[bd_r][bd_c_right];
                                    var mc_r = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];
                                    if (mc_r.c == bd_c_right) {
                                        borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                            color: value.r.color,
                                            style: value.r.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r + "_" + bd_c_right].l = {
                                        color: value.r.color,
                                        style: value.r.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].r = null;
                        }
                        if (value.t != null) {
                            borderInfoCompute[bd_r + "_" + bd_c].t = {
                                color: value.t.color,
                                style: value.t.style,
                            };
                            var bd_r_top = bd_r - 1;
                            if (bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]) {
                                if (data[bd_r_top] != null &&
                                    getObjType(data[bd_r_top][bd_c]) == "object" &&
                                    data[bd_r_top][bd_c].mc != null) {
                                    var cell_top = data[bd_r_top][bd_c];
                                    var mc_t = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];
                                    if (mc_t.r + mc_t.rs - 1 == bd_r_top) {
                                        borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                            color: value.t.color,
                                            style: value.t.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r_top + "_" + bd_c].b = {
                                        color: value.t.color,
                                        style: value.t.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].t = null;
                        }
                        if (value.b != null) {
                            borderInfoCompute[bd_r + "_" + bd_c].b = {
                                color: value.b.color,
                                style: value.b.style,
                            };
                            var bd_r_bottom = bd_r + 1;
                            if (bd_r_bottom < data.length &&
                                borderInfoCompute[bd_r_bottom + "_" + bd_c]) {
                                if (data[bd_r_bottom] != null &&
                                    getObjType(data[bd_r_bottom][bd_c]) == "object" &&
                                    data[bd_r_bottom][bd_c].mc != null) {
                                    var cell_bottom = data[bd_r_bottom][bd_c];
                                    var mc_b = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];
                                    if (mc_b.r == bd_r_bottom) {
                                        borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                            color: value.b.color,
                                            style: value.b.style,
                                        };
                                    }
                                }
                                else {
                                    borderInfoCompute[bd_r_bottom + "_" + bd_c].t = {
                                        color: value.b.color,
                                        style: value.b.style,
                                    };
                                }
                            }
                        }
                        else {
                            borderInfoCompute[bd_r + "_" + bd_c].b = null;
                        }
                    }
                }
                else {
                    delete borderInfoCompute[bd_r + "_" + bd_c];
                }
            }
        }
    }
    return borderInfoCompute;
};
export { setBorder };
