"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import { uploadCSV } from "@/services/api";

type CsvRow = Record<string, string>;

export default function Home() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleConfirmImport = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first.");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadCSV(selectedFile);

      console.log(response);

      setResult(response);

      alert("CSV uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center">
          AI CSV Importer
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Upload any CSV file to preview your data before AI processing.
        </p>

        <div className="mt-8">
          <UploadBox
            onDataParsed={setCsvData}
            onFileSelected={setSelectedFile}
          />
        </div>

        {csvData.length > 0 && (
          <>
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">
                CSV Preview
              </h2>

              <div className="max-h-[500px] overflow-auto rounded-lg border">
                <table className="min-w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-200">
                    <tr>
                      {Object.keys(csvData[0]).map((key) => (
                        <th
                          key={key}
                          className="border px-4 py-2 text-left"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {csvData.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td
                            key={i}
                            className="border px-4 py-2"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Showing first {Math.min(csvData.length, 10)} of{" "}
                {csvData.length} rows
              </p>

              <button
                onClick={handleConfirmImport}
                disabled={loading}
                className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Importing..." : "Confirm Import"}
              </button>
            </div>
          </>
        )}

        {result && (
  <div className="mt-10">

    {/* Summary Cards */}
    <div className="grid grid-cols-2 gap-4 mb-8">

      <div className="rounded-xl bg-green-100 p-6 text-center shadow">
        <h3 className="text-lg font-semibold">
          Imported
        </h3>

        <p className="mt-2 text-3xl font-bold text-green-700">
          {result.totalImported}
        </p>
      </div>

      <div className="rounded-xl bg-red-100 p-6 text-center shadow">
        <h3 className="text-lg font-semibold">
          Skipped
        </h3>

        <p className="mt-2 text-3xl font-bold text-red-700">
          {result.totalSkipped}
        </p>
      </div>

    </div>

    {/* CRM Table */}

    <h2 className="mb-4 text-2xl font-bold">
      AI Mapped CRM Records
    </h2>

    <button
  onClick={() => {
    const blob = new Blob(
      [JSON.stringify(result.records, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "crm-data.json";
    a.click();

    URL.revokeObjectURL(url);
  }}
  className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
>
  Export JSON
</button>

    <div className="overflow-auto rounded-lg border">

      <table className="min-w-full border-collapse">

        <thead className="bg-gray-200">

          <tr>

            <th className="border px-4 py-2">Name</th>

            <th className="border px-4 py-2">Email</th>

            <th className="border px-4 py-2">Mobile</th>

            <th className="border px-4 py-2">Status</th>

          </tr>

        </thead>

        <tbody>

          {result.records.map((record: any, index: number) => (

            <tr key={index}>

              <td className="border px-4 py-2">
                {record.name || "-"}
              </td>

              <td className="border px-4 py-2">
                {record.email || "-"}
              </td>

              <td className="border px-4 py-2">
                {record.mobile_without_country_code || "-"}
              </td>

              <td className="border px-4 py-2">
  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
    {record.crm_status}
  </span>
</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>
)}

      </div>
    </main>
  );
}