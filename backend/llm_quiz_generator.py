import os
import json
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage

# Load environment variables (for GEMINI_API_KEY)
load_dotenv()

def generate_quiz_from_text(article_text: str, title: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("Missing GEMINI_API_KEY in .env file")

    # Initialize Gemini model
    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.7  # controls creativity
    )

    # Define the quiz generation prompt
    prompt = PromptTemplate(
        input_variables=["title", "article_text"],
        template=(
            """
            You are an AI assistant that generates educational quizzes from Wikipedia articles.
            Article Title: "{title}"
            Article Content:
            {article_text}
            Your goal is to analyze this article and return a **strict JSON object** with the following fields:
            {{
            "title": "{title}",
            "summary": "<3–5 line summary of the article>",
            "key_entities": {{
                "people": [list of important people],
                "organizations": [list of organizations],
                "locations": [list of key places]
            }},
            "sections": [list of main section titles],
            "quiz": [
                {{
                "question": "<question text>",
                "options": ["A)", "B)", "C)", "D)"],
                "answer": "<correct answer>",
                "difficulty": "<easy|medium|hard>",
                "explanation": "<short 1-line explanation>",
                "related_topics": [list of 2-3 related Wikipedia topics]
                }}
            ]
            }}

            🔒 Rules:
            - Output **only** valid JSON — no markdown, no code fences, no text outside JSON.
            - ALWAYS generate at least 5 questions.
            - If the article has limited content, infer reasonable quiz questions.
            - Do not include extra commentary or explanations.
            """
        )
    )


    # Trim article text to avoid token limits
    full_prompt = prompt.format(title=title, article_text=article_text[:6000])

    print("\n Sending request to Gemini LLM...\n")

    # Send to Gemini
    response = llm.invoke([HumanMessage(content=full_prompt)])

    raw_output = response.content.strip()
    print("Raw output from LLM received.\n")

    clean_output = re.sub(r"```json|```", "", raw_output).strip()

    # parse JSON
    try:
        quiz_json = json.loads(clean_output)
    except json.JSONDecodeError:
        print("⚠️ Could not parse JSON, showing raw output.\n")
        print(clean_output)
        return {
            "title": title,
            "summary": "",
            "key_entities": {"people": [], "organizations": [], "locations": []},
            "sections": [],
            "quiz": [],
            "raw_output": clean_output
        }

    quiz_json.setdefault("summary", "")
    quiz_json.setdefault("key_entities", {"people": [], "organizations": [], "locations": []})
    quiz_json.setdefault("sections", [])
    quiz_json.setdefault("quiz", [])

    return quiz_json
