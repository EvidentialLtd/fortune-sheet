import { getFlowdata } from "../context";
import { execFunctionGroup } from "./formula";
import { setFormulaCellInfo } from "./formulaHelper";
function runExecFunction(ctx, range, index, data) {
    ctx.formulaCache.execFunctionExist = [];
    for (var s = 0; s < range.length; s += 1) {
        for (var r = range[s].row[0]; r <= range[s].row[1]; r += 1) {
            for (var c = range[s].column[0]; c <= range[s].column[1]; c += 1) {
                setFormulaCellInfo(ctx, { r: r, c: c, id: index }, data);
                ctx.formulaCache.execFunctionExist.push({ r: r, c: c, i: index });
            }
        }
    }
    ctx.formulaCache.execFunctionExist.reverse();
    execFunctionGroup(ctx, null, null, null, null, data);
    ctx.formulaCache.execFunctionGlobalData = null;
}
export function jfrefreshgrid(ctx, data, range, isRunExecFunction) {
    if (isRunExecFunction === void 0) { isRunExecFunction = true; }
    if (data == null) {
        data = getFlowdata(ctx);
    }
    if (range == null) {
        range = ctx.luckysheet_select_save;
        if (range == null)
            return;
    }
    if (isRunExecFunction) {
        runExecFunction(ctx, range, ctx.currentSheetId, data);
    }
}
