"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa, { ParseResult } from "papaparse";

type CsvRow = Record<string, string>;

type UploadBoxProps = {
  onDataParsed: (data: CsvRow[]) => void;
  onFileSelected: (file: File) => void;
};

export default function UploadBox({
  onDataParsed,
  onFileSelected,
}: UploadBoxProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      // Save original file
      onFileSelected(file);

      // Parse CSV for preview
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<CsvRow>) => {
          onDataParsed(results.data);
        },
        error: (error) => {
          console.error("CSV Parse Error:", error);
          alert("Failed to parse CSV.");
        },
      });
    },
    [onDataParsed, onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      }`}
    >
      <input {...getInputProps()} hidden />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {isDragActive
            ? "Drop your CSV file here"
            : "Drag & Drop your CSV file here"}
        </h3>

        <p className="text-gray-500">OR</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
        >
          Choose CSV File
        </button>

        <p className="text-sm text-gray-500">
          Supported file type: <strong>.csv</strong>
        </p>
      </div>
    </div>
  );
}