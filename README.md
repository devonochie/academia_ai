# 🎓 Academia AI

Academia AI is an all-in-one academic assistance platform featuring:

- ✅ **Plagiarism Checker** — Detects duplicate or copied content across the web
- 🤖 **AI Tutor** — Personalized learning assistant for any subject
- 📊 **Dashboard** — User-friendly dashboard for managing reports, sessions, and insights

---

## 🚀 Features

### 🔍 Plagiarism Checker
- Uses web search APIs to detect duplicate content
- Highlights plagiarized sentences
- Returns URLs of matching sources
- Upload or paste content for scanning

### 🧠 AI Tutor
- Ask any question across subjects
- Offers explanations, examples, and quizzes
- Learns and adapts to user queries
- Ideal for self-paced learning

### 📈 Dashboard
- Tracks plagiarism reports and tutoring sessions
- Clean UI with charts and summaries
- Admin and user views

---

## 🛠️ Tech Stack

- **Frontend:** React.js + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **AI:** OpenAI API (for tutor)
- **Plagiarism Detection:** Bing Web Search API
- **Authentication:** JWT
- **Hosting:** Vercel (frontend), Render (backend)
---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/academia_ai.git
cd academia_ai# For backend
cd backend
npm install
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_key
BING_API_KEY=your_bing_search_key
JWT_SECRET=your_jwt_secret


🤝 Contribution
Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.


cd ../frontend
npm install
