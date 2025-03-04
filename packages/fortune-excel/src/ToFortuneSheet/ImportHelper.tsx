import React from "react";
import { transformExcelToFortune } from "../common/Transform";

export const ImportHelper = (props: any) => {
  const { setSheets, setKey, sheetRef } = props;
  return (
    <input
      type="file"
      id="ImportHelper"
      accept=".xlsx"
      onChange={async (e) => {
        await transformExcelToFortune(e, setSheets, setKey, sheetRef);
      }}
      hidden
    />
  );
};
