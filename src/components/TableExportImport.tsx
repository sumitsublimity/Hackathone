"use client";

import React, { useRef } from "react";
import { Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "./ui/button";
import { showToast } from "@/utils/alert";
import { ALERT_TYPES, MESSAGES } from "@/utils/constants";

interface TableExportImportProps {
  exportData: () => any[];
  exportFilename?: string;
  onImport: (data: any[]) => void;
  showExport?: boolean;
  showImport?: boolean;
}

const TableExportImport: React.FC<TableExportImportProps> = ({
  exportData,
  exportFilename = "table_data",
  onImport,
  showExport = true,
  showImport = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportExcel = () => {
    try {
      const data = exportData();
      if (!data.length) {
        showToast(MESSAGES.NO_DATA_AVAILABLE_TO_EXPORT, ALERT_TYPES.WARNING);
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, `${exportFilename}.xlsx`);
      showToast(MESSAGES.EXPORTED_SUCCESSFULLY, ALERT_TYPES.SUCCESS);
    } catch (err) {
      showToast(MESSAGES.FAILED_TO_EXPORT_FILE, ALERT_TYPES.ERROR);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData.length) {
          showToast(MESSAGES.IMPORTED_FILE_HAS_NO_DATA, ALERT_TYPES.WARNING);
          return;
        }

        onImport(jsonData);
        showToast(MESSAGES.IMPORTED_SUCCESSFULLY, ALERT_TYPES.SUCCESS);
      } catch (err) {
        showToast(MESSAGES.FAILED_TO_IMPORT_FILE, ALERT_TYPES.ERROR);
      }
    };

    reader.onerror = () => {
      showToast(MESSAGES.ERROR_READING_FILE, ALERT_TYPES.ERROR);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center w-full sm:justify-start justify-between">
      {showExport && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          className="bg-coffee text-white font-medium h-10.5 border-0 flex items-center gap-2 px-4 w-full sm:w-auto"
        >
          <Upload className="w-4 h-4 text-white" />
          <span className="whitespace-nowrap">Export</span>
        </Button>
      )}

      {showImport && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-darkGreen text-white font-medium h-10.5 border-0 flex items-center gap-2 px-4 w-full sm:w-auto"
          >
            <Download className="w-4 h-4 text-white" />
            <span className="whitespace-nowrap">Import Data</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImport}
          />
        </>
      )}
    </div>
  );
};

export default TableExportImport;
