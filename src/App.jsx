import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState("")
  const [geminiResponse, setGeminiResponse] = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState("")

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory")

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveHistory = (newHistory) => {
    setHistory(newHistory)
    localStorage.setItem("chatHistory", JSON.stringify(newHistory))
  }

  const handleSend = async () => {
    if (!prompt.trim() || loading) return

    const currentPrompt = prompt.trim()

    const newHistory = [
      currentPrompt,
      ...history.filter(item => item !== currentPrompt)
    ].slice(0, 10)

    saveHistory(newHistory)

    setLoading(true)
    setGeminiResponse("")

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: currentPrompt
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gemini API error")
      }

      setGeminiResponse(
        data.answer || "No response received"
      )
    } catch (error) {
      console.error("Gemini Error:", error)
      setGeminiResponse(`Error: ${error.message}`)
    }

    setLoading(false)
  }

  const handleHistoryClick = (item) => {
    setPrompt(item)
  }

  const handleNewChat = () => {
    setPrompt("")
    setGeminiResponse("")
    setCopied("")
  }

  const copyResponse = async (response) => {
    if (!response || response.startsWith("Error:")) return

    await navigator.clipboard.writeText(response)

    setCopied("Gemini")

    setTimeout(() => {
      setCopied("")
    }, 1500)
  }

  return (
    <>
      <main className="main-container">

        <header>
          <h1>Gemini AI Chatbot</h1>
          <p>
            Ask anything . get clear and helpful AI responses
          </p>
        </header>

        <div className="chat-container">

          <div className="sidebar">

            <button onClick={handleNewChat}>
              + New chat
            </button>

            <h2>🦋 Chat History</h2>

            <div className="history-list">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          <div className="chat-area">

            <div className="prompt-section">

              <input
                type="text"
                placeholder="Ask anything"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend()
                  }
                }}
              />

              <button
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "sending..." : "send"}
              </button>

            </div>

            <div className="response-section">

              <h2>AI Response</h2>

              <div className="response-cards">

                <div className="response-card">

                  <h3>Google Gemini</h3>

                  <p>
                    {loading && !geminiResponse
                      ? "Thinking..."
                      : geminiResponse || "Ask something..."}
                  </p>

                  {geminiResponse &&
                    !geminiResponse.startsWith("Error:") && (
                      <button
                        onClick={() =>
                          copyResponse(geminiResponse)
                        }
                      >
                        {copied === "Gemini"
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    )}

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