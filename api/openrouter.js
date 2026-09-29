export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { prompt } = req.body

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt is required" })
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Multi-LLM Chatbot Comparator"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter API error"
      })
    }

    const answer = data.choices?.[0]?.message?.content

    return res.status(200).json({
      answer: answer || "No response received"
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    })
  }
}