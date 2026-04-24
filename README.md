# 📊 Auto-EDA Data Analysis Platform

> A production-grade, ultra-fast Exploratory Data Analysis (EDA) platform powered by AI. Designed with an elegant, mobile-responsive UI and engineered with high-performance Web Workers to handle massive datasets (250,000+ rows) seamlessly in the browser.

![Auto-EDA Banner](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Powered_by-Gemini_2.5_Flash-8E75B2?style=for-the-badge)

## 🎥 Demo

![Auto-EDA Demo](./autoEDA-demo.mp4)

## ✨ Key Features

- **🚀 High-Performance Data Processing:** Utilises dedicated Web Workers to parse up to 100MB of CSV data (250,000+ rows) without freezing the UI.
- **🧠 "Elite Data Scientist" AI Engine:** Powered by Google's `gemini-2.5-flash`, the AI computes advanced statistical context (Skewness, IQR, Cardinality Ratio, Variance) to provide expert-level, actionable business insights.
- **🎨 Custom Design System:** A meticulously crafted, dependency-free CSS token system featuring seamless Light/Dark mode transitions, fluid Framer Motion animations, and an ambient 3D particle background.
- **📈 Automated Visualisations:** Intelligently categorises data to automatically generate responsive histograms, bar charts, and time-series line graphs using `chart.js`.
- **🛡️ Bulletproof Reliability:** Implements strict React Error Boundaries, safe typed-array aggregators (avoiding JavaScript call-stack overflows), and graceful AI rate-limit handling.

---

## 🏗️ Architecture & Monorepo Structure

This project is structured as a **Monorepo** containing both the client application and the AI microservice.

```text
Auto-EDA-Data-Analysis-Platform/
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components (Upload, AI Drawer, etc.)
│   │   ├── features/         # Domain logic (AI streams, Chart renderers, CSV parsing)
│   │   ├── pages/            # Route views (Home, Dashboard)
│   │   ├── store/            # Zustand global state & Theme Context
│   │   └── index.css         # Core Design System Tokens
│   └── package.json
│
└── backend/                  # Node.js + Express API
    ├── src/
    │   ├── controllers/      # Route handlers & HTTP streaming logic
    │   ├── services/         # Google GenAI integration (Gemini 2.5 Flash)
    │   └── server.ts         # Express setup & CORS
    └── package.json
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Vanilla CSS (CSS Variables) + Framer Motion
- **Visualisations:** Chart.js, React-Three-Fiber (3D Canvas)
- **Parsing:** PapaParse (Web Worker Mode)

### Backend
- **Runtime:** Node.js (Express.js)
- **Language:** TypeScript
- **AI Integration:** `@google/genai` (Official Google AI SDK)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/VivekJariwala50/Auto-EDA-Data-Analysis-Platform.git
cd Auto-EDA-Data-Analysis-Platform
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🌐 Deployment Strategy

This monorepo is heavily optimised for independent cloud deployments.

1. **Frontend (Vercel / Netlify):**
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Env Vars:** Ensure `VITE_BACKEND_URL` is set to your deployed backend URL.

2. **Backend (Render / Railway):**
   - **Root Directory:** `backend/`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Env Vars:** `VITE_GEMINI_API_KEY`

---

## 👨‍💻 Engineering Highlights (FAANG Standards)

- **Memory Safety:** Replaced traditional `Math.max(...array)` spreads with loop-based reducers to strictly prevent `Maximum call stack size exceeded` errors on massive datasets.
- **TypedArrays for Sorting:** Median calculations utilise `Float64Array` instead of standard JS arrays to bypass garbage collection freezes.
- **Streaming LLM Responses:** AI insights are piped directly to the client via HTTP Chunked Transfer Encoding (`Transfer-Encoding: chunked`), providing real-time token rendering without waiting for full generation.
