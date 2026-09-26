import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <main className="main-container">

        <header>
            <h1>multi-LLM chatbot comparator</h1>
            <p>Ask once . get multiple prespective . compare Ai responses</p>
        </header>

        <div className="chat-container">

            <div className="sidebar">
                <button>+ New chat</button>
                <h2>🦋 Chat History</h2>
            </div>

            <div className="chat-area">

                <div className="prompt-section">
                    <input type="text" placeholder="Ask anything"/>
                    <button>send</button>
                </div>

                <div className="response-section">
                    <h2>Ai Responses</h2>

                    <div className="response-cards">

                        <div className="response-card">
                            <h3>Google Gemini</h3>
                        </div>

                        <div className="response-card">
                            <h3>Groq / Llama</h3>
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
  );
}

export default App;
