export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    })
  }

  try {
    const { prompt } = req.body

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: "Prompt is required"
      })
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error"
      })
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text

    return res.status(200).json({
      answer: answer || "No response received"
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    })
  }
}