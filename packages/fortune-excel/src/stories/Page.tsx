import React from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { exportToolBarItem, importToolBarItem } from "@corbe30/fortune-excel";
import { ImportHelper } from "@corbe30/fortune-excel";

export const Page = () => {
  const [key, setKey] = React.useState(0);
  const [sheets, setSheets] = React.useState([{ name: "Sheet1" }]);
  const sheetRef = React.useRef(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      <ImportHelper setKey={setKey} setSheets={setSheets} sheetRef={sheetRef} />
      <Workbook
        key={key}
        data={sheets}
        ref={sheetRef}
        customToolbarItems={[importToolBarItem(), exportToolBarItem(sheetRef)]}
      />
    </div>
  );
};
