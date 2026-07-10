const API_URL = "http://127.0.0.1:5000/api";

export async function uploadCSV(file: File) {
  console.log("Uploading file:", file);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    console.log("Status:", response.status);

    const data = await response.json();
    console.log("Response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  } catch (err) {
    console.error("Fetch Error:", err);
    throw err;
  }
}