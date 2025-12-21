# Intentra

**Instructional Adaptation Copilot for Teachers**

Create student-ready instructional materials in seconds. You choose the skills. You review everything.

---

## Quick Start (Local Dev)

```bash
cd /Users/juansanchez/VerityCompany

# Install dependencies
npm install

# Set environment (if not using .env file)
export OPENAI_API_KEY=sk-...
export PORT=3000

# Run the app
npm start
```

Visit `http://localhost:3000` in your browser.

---

## Deployment

### Frontend → Vercel
- Push `public/` folder to GitHub (or entire repo)
- Connect Vercel to the GitHub repo
- Set root directory to `public/`
- Add environment variable: `REACT_APP_BACKEND_URL=<your-render-backend-url>`
- Deploy

### Backend → Render
- Push entire repo to GitHub
- Create new Web Service on Render
- Set root directory to `/`
- Add environment variable: `OPENAI_API_KEY=sk-...`
- Deploy

---

## Files

- `public/index.html` – Frontend UI
- `public/app.js` – Frontend logic (calls backend)
- `server.js` – Express backend (OpenAI integration)
- `server/openaiClient.js` – OpenAI client
- `server/prompt.js` – System prompt
- `server/.env` – Environment variables (local)

---

## Environment Variables

**Local dev** (create `server/.env`):
```env
OPENAI_API_KEY=sk-proj-...
PORT=3000
```

**Render backend**:
- `OPENAI_API_KEY` – Your OpenAI API key

**Vercel frontend**:
- `REACT_APP_BACKEND_URL` – e.g., `https://readbridge-backend.onrender.com`

---

## Features

- ✅ Select reading focus (Phonics, Comprehension, etc.)
- ✅ Specify reading level & student interest
- ✅ AI generates reading passage, vocab, questions, notes
- ✅ Teacher review & approve before assigning
- ✅ No student names (privacy first)

---

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel (frontend), Render (backend)

---

## Next Steps

1. Create a GitHub repo and push this code
2. Deploy frontend to Vercel
3. Deploy backend to Render
4. Share the Vercel link with teachers
5. Collect feedback and iterate

