from langchain_groq import ChatGroq
from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings,
)
from core.config import settings


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.3,
    max_tokens=1024,
    groq_api_key=settings.GROQ_API_KEY,
)


# Fallback: Gemini Flash (for when Groq rate-limits)
segmentation_llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    max_output_tokens=8192,
    google_api_key=settings.GEMINI_API_KEY,
)


embedding_model = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=settings.GEMINI_API_KEY,
    task_type="SEMANTIC_SIMILARITY",
    output_dimensionality=768,
)