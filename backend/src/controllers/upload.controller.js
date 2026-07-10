import { parseCSV } from "../services/csv.service.js";
import { mapCSVToCRM } from "../services/gemini.service.js";

export const uploadCSV = async (req, res) => {
  try {
    console.log("===== Upload API Called =====");
    console.log("Uploaded File:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    // Parse CSV
    const rows = await parseCSV(req.file.path);
    console.log("Parsed Rows:", rows);

    // Send parsed rows to Gemini
    const aiResponse = await mapCSVToCRM(rows);
    console.log("========== GEMINI RESPONSE ==========");
console.log(aiResponse);
console.log("=====================================");
    console.log("AI Response:", aiResponse);

    let crmRecords = [];

    try {
      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      crmRecords = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error:", err);

      return res.status(500).json({
        success: false,
        message: "Invalid JSON returned by AI",
        raw: aiResponse,
      });
    }

    return res.status(200).json({
      success: true,
      totalImported: crmRecords.length,
      totalSkipped: Math.max(0, rows.length - crmRecords.length),
      records: crmRecords,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};