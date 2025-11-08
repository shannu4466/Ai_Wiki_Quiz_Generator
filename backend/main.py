from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, Quiz, init_db
from scrapper import scrape_wikipedia
from llm_quiz_generator import generate_quiz_from_text
import json

# Initialize FastAPI app
app = FastAPI(title="AI Wiki Quiz Generator")

# Initialize database (auto-creates tables)
init_db()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency - get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Generate Quiz Endpoint
@app.post("/generate_quiz")
def generate_quiz(payload: dict):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    if not url.startswith("https://en.wikipedia.org/wiki/"):
        raise HTTPException(status_code=400, detail="Only Wikipedia URLs are allowed")
    
    db = next(get_db())
    
    existing_quiz = db.query(Quiz).filter(Quiz.url == url).first()
    if existing_quiz:
        raise HTTPException(
            status_code=409, 
            detail=f"Quiz already generated for this URL: {url}. Please check your history."
        )

    # Scrape content
    title, content = scrape_wikipedia(url)

    # Generate quiz via LLM
    quiz_data = generate_quiz_from_text(content, title)

    # Extract fields safely
    summary = quiz_data.get("summary", "")
    key_entities = quiz_data.get("key_entities", {})
    sections = quiz_data.get("sections", [])

    new_quiz = Quiz(
        url=url,
        title=title,
        summary=summary,
        key_entities=json.dumps(key_entities),
        sections=json.dumps(sections),
        scraped_content=content,
        full_quiz_data=json.dumps(quiz_data)
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    # Return structured JSON
    return {
        "id": new_quiz.id,
        "url": new_quiz.url,
        "title": new_quiz.title,
        "summary": summary,
        "key_entities": key_entities,
        "sections": sections,
        "quiz": quiz_data.get("quiz", []),
        "related_topics": quiz_data.get("related_topics", []),
        "date_generated": new_quiz.date_generated
    }

# History Endpoint
@app.get("/history")
def get_history():
    """
    Returns a list of all past generated quizzes with basic info.
    """
    db = next(get_db())
    quizzes = db.query(Quiz).all()

    return [
        {
            "serial_no": idx + 1,  # sequential number for frontend
            "id": q.id,
            "url": q.url,
            "title": q.title,
            "summary": q.summary,
            "date_generated": q.date_generated
        }
        for idx, q in enumerate(quizzes)
    ]


# Get Single Quiz Endpoint
@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int):
    """
    Returns the full quiz JSON for a specific quiz ID.
    """
    db = next(get_db())
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    try:
        quiz_data = json.loads(quiz.full_quiz_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Corrupted quiz data")

    return {
        "id": quiz.id,
        "url": quiz.url,
        "title": quiz.title,
        "summary": quiz.summary,
        "key_entities": json.loads(quiz.key_entities) if quiz.key_entities else {},
        "sections": json.loads(quiz.sections) if quiz.sections else [],
        "quiz": quiz_data.get("quiz", []),
        "related_topics": quiz_data.get("related_topics", []),
        "date_generated": quiz.date_generated
    }
