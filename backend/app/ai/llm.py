from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from core.config import settings

llm_endpoint = HuggingFaceEndpoint(
    repo_id="meta-llama/Llama-3.1-8B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=settings.HF_TOKEN,
    temperature=0.3,
    max_new_tokens=2048,
)

llm = ChatHuggingFace(llm=llm_endpoint)

