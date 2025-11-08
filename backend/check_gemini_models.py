# backend/check_gemini_models.py

import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load .env to get your Gemini API key
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Missing GEMINI_API_KEY in .env file")
else:
    genai.configure(api_key=api_key)

    print("🔍 Fetching available Gemini models...\n")
    try:
        for m in genai.list_models():
            print(f"- {m.name}")
    except Exception as e:
        print("❌ Error listing models:\n", e)
