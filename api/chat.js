export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "API trả về không phải JSON",
        raw: text
      });
    }

    console.log("FULL RESPONSE:", data);

    if (!response.ok || data.error) {
      return res.status(500).json({
        error: "Google API lỗi",
        detail: data
      });
    }

    if (!data.candidates) {
      return res.status(500).json({
        error: "Không có candidates",
        detail: data
      });
    }

    const reply = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      error: "Server crash",
      detail: err.message
    });
  }
}