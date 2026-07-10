import axios from "axios";

export async function mapCSVToCRM(records) {
  const prompt = `
You are an AI CRM extractor.

Return ONLY a JSON array.

CRM Fields:
created_at,
name,
email,
country_code,
mobile_without_country_code,
company,
city,
state,
country,
lead_owner,
crm_status,
crm_note,
data_source,
possession_time,
description

Rules:
- crm_status must be one of:
GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

- Skip records without email and mobile.

Input:
${JSON.stringify(records)}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error(
      "Gemini REST Error:",
      err.response?.data || err.message
    );
    throw err;
  }
}