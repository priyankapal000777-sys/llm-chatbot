# Gemini AI Chatbot

A simple and responsive AI chatbot built using React, Vite, and Google Gemini API.

## Features

- Google Gemini AI integration
- Ask questions and get AI responses
- Enter key support
- Loading state
- Error handling
- Chat history
- New Chat option
- Copy response button
- Responsive design
- Pink butterfly themed interface

## Technologies

- React
- Vite
- JavaScript
- CSS
- Google Gemini API
- Fetch API
- LocalStorage

## API Key Setup

Create a `.env` file in the project folder and add:

GEMINI_API_KEY=your_gemini_api_key

Keep your API key private and do not upload the `.env` file to GitHub.

## Run the Project

Install dependencies:

npm install

Start the project:

npm run dev

## How It Works

The user enters a question and sends it to the Gemini API. The generated response is displayed in the chatbot interface. Recent prompts are saved in the browser using LocalStorage.

## Project Structure

- api/gemini.js
- src/App.jsx
- src/App.css
- src/main.jsx
- public
- .env
- .gitignore
- package.json
- README.md

## Security

The Gemini API key is stored in an environment variable and is not directly written in the frontend code.

## Future Improvements

- Dark mode
- Delete chat history
- Response time display
- Multiple AI providers