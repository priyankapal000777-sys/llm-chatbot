import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState("")
  const [geminiResponse, setGeminiResponse] = useState("")
  const [groqResponse, setGroqResponse] = useState("")
  const [openRouterResponse, setOpenRouterResponse] = useState("")
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
    setGroqResponse("")
    setOpenRouterResponse("")

    const geminiRequest = async () => {
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
    }

    const groqRequest = async () => {
      try {
        const response = await fetch("/api/groq", {
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
          throw new Error(data.error || "Groq API error")
        }

        setGroqResponse(
          data.answer || "No response received"
        )
      } catch (error) {
        console.error("Groq Error:", error)
        setGroqResponse(`Error: ${error.message}`)
      }
    }

    const openRouterRequest = async () => {
      try {
        const response = await fetch("/api/openrouter", {
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
          throw new Error(data.error || "OpenRouter API error")
        }

        setOpenRouterResponse(
          data.answer || "No response received"
        )
      } catch (error) {
        console.error("OpenRouter Error:", error)
        setOpenRouterResponse(
          `Error: ${error.message}`
        )
      }
    }

    await Promise.all([
      geminiRequest(),
      groqRequest(),
      openRouterRequest()
    ])

    setLoading(false)
  }

  const handleHistoryClick = (item) => {
    setPrompt(item)
  }

  const handleNewChat = () => {
    setPrompt("")
    setGeminiResponse("")
    setGroqResponse("")
    setOpenRouterResponse("")
    setCopied("")
  }

  const copyResponse = async (response, name) => {
    if (!response || response.startsWith("Error:")) return

    await navigator.clipboard.writeText(response)

    setCopied(name)

    setTimeout(() => {
      setCopied("")
    }, 1500)
  }

  return (
    <>
      <main className="main-container">

        <header>
          <h1>multi-LLM chatbot comparator</h1>
          <p>
            Ask once . get multiple prespective . compare Ai responses
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

              <h2>Ai Responses</h2>

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
                          copyResponse(
                            geminiResponse,
                            "Gemini"
                          )
                        }
                      >
                        {copied === "Gemini"
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    )}
                </div>

                <div className="response-card">
                  <h3>Groq / Llama</h3>

                  <p>
                    {loading && !groqResponse
                      ? "Thinking..."
                      : groqResponse || "Ask something..."}
                  </p>

                  {groqResponse &&
                    !groqResponse.startsWith("Error:") && (
                      <button
                        onClick={() =>
                          copyResponse(
                            groqResponse,
                            "Groq"
                          )
                        }
                      >
                        {copied === "Groq"
                          ? "Copied!"
                          : "Copy"}
                      </button>
                    )}
                </div>

                <div className="response-card">
                  <h3>OpenRouter</h3>

                  <p>
                    {loading && !openRouterResponse
                      ? "Thinking..."
                      : openRouterResponse || "Ask something..."}
                  </p>

                  {openRouterResponse &&
                    !openRouterResponse.startsWith("Error:") && (
                      <button
                        onClick={() =>
                          copyResponse(
                            openRouterResponse,
                            "OpenRouter"
                          )
                        }
                      >
                        {copied === "OpenRouter"
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