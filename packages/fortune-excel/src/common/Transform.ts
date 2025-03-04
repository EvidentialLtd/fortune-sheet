
import { FortuneFile } from "../ToFortuneSheet/FortuneFile";
import { HandleZip } from "../ToFortuneSheet/HandleZip";
import { exportSheetExcel } from "../ToExcel/ExcelFile";

export const transformExcelToFortune = async (
    e: any,
    setSheets: any,
    setKey: any,
    sheetRef: any
) => {
    const excelFile = await e.target.files[0].arrayBuffer();
    const files = await new HandleZip(excelFile).unzipFile();
    const fortuneFile = new FortuneFile(files, excelFile.name);
    fortuneFile.Parse();

    const lsh = fortuneFile.serialize();

    let config = lsh.sheets[0].config;
    for (let sheet of lsh.sheets) {
        delete sheet.config;
    }
    setSheets(lsh.sheets);
    setKey((k: number) => k + 1);

    setTimeout(() => {
        sheetRef.current?.setColumnWidth(config?.columnlen || {});
        sheetRef.current?.setRowHeight(config?.rowlen || {});
    }, 1);
};

export const transformFortuneToExcel = async (
    luckysheetRef: any
) => {
    await exportSheetExcel(luckysheetRef);
};
