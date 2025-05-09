import _ from "lodash";
import { cancelPaintModel, checkCF, getComputeMap, getSheetIndex } from "..";
import { copy, selectIsOverlap } from "../modules/selection";
import { hasPartMC } from "../modules/validation";
export function handleCopy(ctx) {
    if (ctx.luckysheetPaintModelOn) {
        cancelPaintModel(ctx);
    }
    var selection = ctx.luckysheet_select_save;
    if (!selection || _.isEmpty(selection)) {
        return;
    }
    if (ctx.config.merge != null) {
        var has_PartMC = false;
        for (var s = 0; s < selection.length; s += 1) {
            var r1 = selection[s].row[0];
            var r2 = selection[s].row[1];
            var c1 = selection[s].column[0];
            var c2 = selection[s].column[1];
            has_PartMC = hasPartMC(ctx, ctx.config, r1, r2, c1, c2);
            if (has_PartMC) {
                break;
            }
        }
        if (has_PartMC) {
            return;
        }
    }
    var cdformat = ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)]
        .luckysheet_conditionformat_save;
    if (!_.isNil(ctx.luckysheet_select_save) &&
        ctx.luckysheet_select_save.length > 1 &&
        !_.isNil(cdformat) &&
        cdformat.length > 0) {
        var hasCF = false;
        var cf_compute = getComputeMap(ctx);
        for (var s = 0; s < ctx.luckysheet_select_save.length; s += 1) {
            if (hasCF) {
                break;
            }
            var r1 = ctx.luckysheet_select_save[s].row[0];
            var r2 = ctx.luckysheet_select_save[s].row[1];
            var c1 = ctx.luckysheet_select_save[s].column[0];
            var c2 = ctx.luckysheet_select_save[s].column[1];
            for (var r = r1; r <= r2; r += 1) {
                if (hasCF) {
                    break;
                }
                for (var c = c1; c <= c2; c += 1) {
                    if (!_.isNil(checkCF(r, c, cf_compute))) {
                        hasCF = true;
                        break;
                    }
                }
            }
        }
        if (hasCF) {
            return;
        }
    }
    if (selection.length > 1) {
        var isSameRow = true;
        var str_r = selection[0].row[0];
        var end_r = selection[0].row[1];
        var isSameCol = true;
        var str_c = selection[0].column[0];
        var end_c = selection[0].column[1];
        for (var s = 1; s < selection.length; s += 1) {
            if (selection[s].row[0] !== str_r || selection[s].row[1] !== end_r) {
                isSameRow = false;
            }
            if (selection[s].column[0] !== str_c ||
                selection[s].column[1] !== end_c) {
                isSameCol = false;
            }
        }
        if ((!isSameRow && !isSameCol) || selectIsOverlap(ctx)) {
            return;
        }
    }
    copy(ctx);
    ctx.luckysheet_paste_iscut = false;
}
