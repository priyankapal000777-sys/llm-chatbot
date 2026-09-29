import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState("")
  const [geminiResponse, setGeminiResponse] = useState("")
  const [groqResponse, setGroqResponse] = useState("")

  const handleSend = async () => {
    if (!prompt.trim()) return

    setGeminiResponse("Thinking...")
    setGroqResponse("Thinking...")

    const geminiRequest = async () => {
      const maxRetries = 3

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY
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

          if (response.ok) {
            const answer =
              data.candidates?.[0]?.content?.parts?.[0]?.text

            setGeminiResponse(answer || "No response received")
            return
          }

          if (response.status === 503 && attempt < maxRetries) {
            setGeminiResponse(
              `Gemini busy hai... retrying (${attempt}/${maxRetries})`
            )

            await new Promise(resolve => setTimeout(resolve, 3000))
            continue
          }

          throw new Error(
            data.error?.message || `API Error: ${response.status}`
          )

        } catch (error) {
          if (attempt === maxRetries) {
            console.error("Gemini Error:", error)
            setGeminiResponse(`Error: ${error.message}`)
          }
        }
      }
    }

    const groqRequest = async () => {
      try {
        const response = await fetch("/api/groq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: prompt
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Groq API error")
        }

        setGroqResponse(data.answer || "No response received")
      } catch (error) {
        console.error("Groq Error:", error)
        setGroqResponse(`Error: ${error.message}`)
      }
    }

    await Promise.all([
      geminiRequest(),
      groqRequest()
    ])
  }

  return (
    <>
      <main className="main-container">

        <header>
          <h1>Multi-LLM chatbot comparator</h1>
          <p>Ask once . get multiple prespective . compare Ai responses</p>
        </header>

        <div className="chat-container">

          <div className="sidebar">
            <button>+ New chat</button>
            <h2>🦋 Chat History</h2>
          </div>

          <div className="chat-area">

            <div className="prompt-section">
              <input
                type="text"
                placeholder="Ask anything"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <button onClick={handleSend}>send</button>
            </div>

            <div className="response-section">
              <h2>Ai Responses</h2>

              <div className="response-cards">

                <div className="response-card">
                  <h3>Google Gemini</h3>
                  <p>{geminiResponse || "Ask something..."}</p>
                </div>

                <div className="response-card">
                  <h3>Groq / Llama</h3>
                  <p>{groqResponse || "Ask something..."}</p>
                </div>

                <div className="response-card">
                  <h3>OpenRouter</h3>
                </div>

              </div>
            </div>

          </div>

        </div>

      </main>
    </>
  )
}

export default App