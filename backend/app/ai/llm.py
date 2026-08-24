import os
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import settings

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.3,
    max_tokens=1024,
    groq_api_key=settings.GROQ_API_KEY,
)

# Fallback: Gemini Flash (for when Groq rate-limits)
llm_fallback = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    max_output_tokens=1024,
    google_api_key=settings.GEMINI_API_KEY,
)
