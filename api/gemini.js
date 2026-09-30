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

    let response
    let data

    for (let attempt = 0; attempt < 4; attempt++) {

      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
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

      data = await response.json()

      if (response.ok) {
        break
      }

      if (
        (response.status === 503 || response.status === 429) &&
        attempt < 3
      ) {
        const delay = Math.pow(2, attempt) * 1000

        await new Promise(resolve =>
          setTimeout(resolve, delay)
        )

      } else {
        return res.status(response.status).json({
          error: data.error?.message || "Gemini API error"
        })
      }
    }

    let answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    answer = answer
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .trim()

    return res.status(200).json({
      answer: answer || "No response received"
    })

  } catch (error) {

    return res.status(500).json({
      error: error.message || "Server error"
    })
  }
}