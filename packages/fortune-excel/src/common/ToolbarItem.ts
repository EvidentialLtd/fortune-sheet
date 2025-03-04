import ExportIcon from "../icons/ExportIcon";
import ImportIcon from "../icons/ImportIcon";
import { transformFortuneToExcel } from "./Transform";

export const exportToolBarItem = (sheetRef:any) => {
  return {
    key: "export",
    tooltip: "Export .xlsx",
    icon: ExportIcon(),
    onClick: async (e:any) => {
      await transformFortuneToExcel(sheetRef.current);
    },
  };
};

export const importToolBarItem = () => {
  return {
    key: "import",
    tooltip: "Import .xlsx",
    icon: ImportIcon(),
    onClick: (e:any) => {
      document.getElementById("ImportHelper")?.click();
    },
  };
};