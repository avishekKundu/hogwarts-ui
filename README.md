# Hogwarts Leaderboard Frontend

This is the **React frontend** for the Hogwarts Leaderboard system.  
It connects to the Spring Boot backend and displays a **live updating leaderboard** using **Server-Sent Events (SSE)**.

## 🚀 Features
- 📊 Live leaderboard with **real-time updates**
- ⏸ Start/Stop live streaming of events
- ⏱ Select window filter:
    - All Time
    - Last 5 Minutes
    - Last 1 Hour
- 🎨 Clean responsive UI with charts (using `recharts`)

## 🛠️ Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (>= v20.12.1 recommended)
- [npm](https://www.npmjs.com/) (>= 10.5.0 recommended)
- [react](https://react.dev/learn/installation) (^19.1.1)

Backend service must also be running:
- Hogwarts backend (Spring Boot) at: `http://localhost:8080`

## 📂 Project Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/avishekKundu/hogwarts-ui.git
   cd hogwarts-ui

Install dependencies

npm install

Configure API Proxy:

Make sure package.json has the following:

"proxy": "http://localhost:8080" - This ensures API calls (/api/...) are forwarded to the backend.

Start the development server:

npm start

This will open the app at:

👉 http://localhost:3000

How It Works

The UI loads initial leaderboard data via REST API:

GET http://localhost:3000/api/leaderboard?window=all

Then subscribes to live updates via SSE:

GET http://localhost:8080/api/leaderboard/stream?window=all

You can:

🟢 Start updates → begins streaming new data

⏸ Stop updates → stops SSE connection

🔄 Change time window → reloads leaderboard for selected duration

Tech Stack

React 19

Recharts (for graphs)

Fetch + EventSource (for REST + SSE)

CSS (custom styling)