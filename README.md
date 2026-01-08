# 🧠 AI Wiki Quiz Generator

A full-stack, AI-powered application that instantly transforms any **Wikipedia article URL** into a structured, interactive quiz.

Built using **FastAPI** for a robust Python backend and **React** with **Tailwind CSS** for a modern, responsive frontend, the core of the application leverages **Google Gemini via LangChain** to intelligently process text and generate rich quiz content.

---

## ✨ Core Features

* **URL-to-Quiz Generation:** Submit a Wikipedia URL and receive a complete, detailed quiz.
* **Intelligent Content Extraction:** Automatically generates an **article summary** and extracts **key entities** (people, organizations, locations).
* **Structured Quiz Output:** Produces **5–10 multi-choice questions**, complete with options, the correct answer, difficulty level, and a detailed **explanation**.
* **Quiz History:** All generated quizzes are stored persistently in a database (**SQLite/MySQL**) and accessible via a history tab.
* **Robust Error Handling:** Includes checks for invalid URLs, duplicate submissions, and missing API keys.

---

## ✨ GEMEINI AI Prompt

You are an AI assistant that generates educational quizzes from Wikipedia articles.

Article Title: "{title}"
Article Content: {article_text}

Your goal is to analyze this article and return a strict JSON object with the following structure:

{
  "title": "{title}",
  "summary": "<3–5 line summary of the article>",
  "key_entities": {
    "people": ["<important people>"],
    "organizations": ["<important organizations>"],
    "locations": ["<key locations>"]
  },
  "sections": ["<main section titles>"],
  "quiz": [
    {
      "question": "<question text>",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "<correct option letter>",
      "difficulty": "<easy | medium | hard>",
      "explanation": "<short 1-line explanation>",
      "related_topics": ["<topic 1>", "<topic 2>", "<topic 3>"]
    }
  ]
}

Rules:
- Output ONLY valid JSON
- Do NOT include markdown, code fences, or any text outside the JSON
- ALWAYS generate at least 5 quiz questions
- If the article content is limited, infer reasonable quiz questions
- Keep explanations short and factual
  
---

## 🚀 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **FastAPI** (Python) | High-performance API framework. |
| **AI/LLM** | **LangChain + Gemini API** | Handles content processing and structured JSON quiz generation. |
| **Frontend** | **React (Vite) + Tailwind CSS** | Fast, modern UI with utility-first styling. |
| **Data Scraping** | **BeautifulSoup4** | Efficiently extracts content from Wikipedia articles. |
| **Database/ORM** | **SQLite/MySQL + SQLAlchemy** | Persistent storage for quiz history and data management. |

---

## 📂 Project Structure

The project is logically divided into the `backend` (FastAPI/Python) and `frontend` (React/Vite) directories.
<img width="304" height="901" alt="image" src="https://github.com/user-attachments/assets/9ff2e57c-92f8-4cc5-8b3a-811ceeb90ce7" />

---

## ⚙️ Setup and Installation

### 1. Backend Setup (FastAPI)

1.  **Navigate and Create Environment:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Mac/Linux
    # venv\Scripts\activate   # Windows
    ```

2.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

    *Dependencies:* `fastapi`, `uvicorn`, `sqlalchemy`, `beautifulsoup4`, `requests`, `python-dotenv`, `langchain`, `langchain-google-genai`, `pydantic`.

3.  **Configure Environment Variables:**
    Create a file named **`.env`** in the `backend/` directory and add your Google Gemini API key:
    ```
    GEMINI_API_KEY=your_google_gemini_api_key_here
    ```
    ⚠️ **Security Note:** Do not upload this file to GitHub.

4.  **Run the Backend Server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend API runs at: 👉 **`http://127.0.0.1:8000`**

### 2. Frontend Setup (React/Vite)

1.  **Navigate and Install Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

2.  **Connect to Backend:**
    Verify the `API_BASE_URL` in `frontend/src/services/api.js` points to your backend (e.g., `http://127.0.0.1:8000`).

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The frontend application runs at: 👉 **`http://localhost:5173`**

---

## 🔗 API Endpoints

The FastAPI backend exposes the following primary endpoints for interacting with the quiz generator:

| Method | Endpoint | Description | Example Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/generate_quiz` | Generates a quiz from a given Wikipedia URL, processes it, and saves it to the database. | `{"url": "https://en.wikipedia.org/wiki/Alan_Turing"}` |
| `GET` | `/history` | Returns a list of all stored quizzes (Title, URL, ID, Date). | N/A |
| `GET` | `/quiz/{quiz_id}` | Returns the full, detailed quiz data for a specific ID. | N/A |

---

## 🧮 How It Works (Detailed Flow)

1.  **User Submission:** User enters a Wikipedia URL in the **Generate Quiz Tab**.
2.  **Scraping:** The FastAPI endpoint calls `scrapper.py` to fetch and clean the article content using **BeautifulSoup**.
3.  **AI Generation:** The content is passed to `llm_quiz_generator.py`, which uses **LangChain** and the **Gemini LLM** to process the text and generate a structured JSON output (summary, entities, quiz questions).
4.  **Data Persistence:** The generated data, including the raw content and the full quiz JSON, is saved to the **`quizzes`** table using **SQLAlchemy** (connected to SQLite/MySQL).
5.  **Output Display:** The full quiz data is returned to the frontend and displayed immediately in the `QuizDisplay` component, and the entry is updated in the **History Tab**.

---

## 🧮 Sample output screenshots

Home Page
<img width="1904" height="973" alt="image" src="https://github.com/user-attachments/assets/62ad24e3-992e-488d-8d11-e5f2ae8c71ee" />
History
<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/e89c4fd5-5f22-4a3f-9dd5-1271c88dde11" />
<img width="1919" height="945" alt="image" src="https://github.com/user-attachments/assets/0624e667-5c29-4e03-874b-3fd88ad5fb60" />


