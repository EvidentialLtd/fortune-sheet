import dayjs from "dayjs";
import _ from "lodash";
import { hasChinaword } from "./text";
export var error = {
    v: "#VALUE!",
    n: "#NAME?",
    na: "#N/A",
    r: "#REF!",
    d: "#DIV/0!",
    nm: "#NUM!",
    nl: "#NULL!",
    sp: "#SPILL!",
};
var errorValues = Object.values(error);
export function valueIsError(value) {
    return errorValues.includes(value);
}
export function isRealNull(val) {
    return _.isNil(val) || val.toString().replace(/\s/g, "") === "";
}
export function isRealNum(val) {
    if (_.isNil(val) || val.toString().replace(/\s/g, "") === "") {
        return false;
    }
    if (typeof val === "boolean") {
        return false;
    }
    return !Number.isNaN(Number(val));
}
function checkDateTime(str, format) {
    var reg1 = format === "24"
        ? /^(\d{4})-(\d{1,2})-(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/
        : /^(\d{4})-(\d{1,2})-(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?\s?(AM|PM)?$/;
    var reg2 = format === "24"
        ? /^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/
        : /^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?\s?(AM|PM)?$/;
    if (!reg1.test(str) && !reg2.test(str)) {
        return false;
    }
    var year = Number(RegExp.$1);
    var month = Number(RegExp.$2);
    var day = Number(RegExp.$3);
    if (year < 1900) {
        return false;
    }
    if (month > 12) {
        return false;
    }
    if (day > 31) {
        return false;
    }
    if (month === 2) {
        if (new Date(year, 1, 29).getDate() === 29 && day > 29) {
            return false;
        }
        if (new Date(year, 1, 29).getDate() !== 29 && day > 28) {
            return false;
        }
    }
    return true;
}
export function isdatetime(s, format) {
    if (format === void 0) { format = "24"; }
    if (s === null || s.toString().length < 5) {
        return false;
    }
    if (checkDateTime(s, format)) {
        return true;
    }
    return false;
}
export function diff(now, then) {
    return dayjs(now).diff(dayjs(then));
}
export function isdatatypemulti(s) {
    var type = {};
    if (isdatetime(s)) {
        type.date = true;
    }
    if (!Number.isNaN(parseFloat(s)) && !hasChinaword(s)) {
        type.num = true;
    }
    return type;
}
export function isdatatype(s) {
    var type = "string";
    if (isdatetime(s)) {
        type = "date";
    }
    else if (!Number.isNaN(parseFloat(s)) && !hasChinaword(s)) {
        type = "num";
    }
    return type;
}
export function hasPartMC(ctx, cfg, r1, r2, c1, c2) {
    var ret = false;
    _.forEach(ctx.config.merge, function (mc) {
        if (r1 < mc.r) {
            if (r2 >= mc.r && r2 < mc.r + mc.rs - 1) {
                if (c1 >= mc.c && c1 <= mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c2 >= mc.c && c2 <= mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 < mc.c && c2 > mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
            }
            else if (r2 >= mc.r && r2 === mc.r + mc.rs - 1) {
                if (c1 > mc.c && c1 < mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c2 > mc.c && c2 < mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 === mc.c && c2 < mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 > mc.c && c2 === mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
            }
            else if (r2 > mc.r + mc.rs - 1) {
                if (c1 > mc.c && c1 <= mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c2 >= mc.c && c2 < mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 === mc.c && c2 < mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 > mc.c && c2 === mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
            }
        }
        else if (r1 === mc.r) {
            if (r2 < mc.r + mc.rs - 1) {
                if (c1 >= mc.c && c1 <= mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c2 >= mc.c && c2 <= mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 < mc.c && c2 > mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
            }
            else if (r2 >= mc.r + mc.rs - 1) {
                if (c1 > mc.c && c1 <= mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c2 >= mc.c && c2 < mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 === mc.c && c2 < mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
                if (c1 > mc.c && c2 === mc.c + mc.cs - 1) {
                    ret = true;
                    return false;
                }
            }
        }
        else if (r1 <= mc.r + mc.rs - 1) {
            if (c1 >= mc.c && c1 <= mc.c + mc.cs - 1) {
                ret = true;
                return false;
            }
            if (c2 >= mc.c && c2 <= mc.c + mc.cs - 1) {
                ret = true;
                return false;
            }
            if (c1 < mc.c && c2 > mc.c + mc.cs - 1) {
                ret = true;
                return false;
            }
        }
        return true;
    });
    return ret;
}
