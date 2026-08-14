import os
from fastapi import FastAPI,APIRouter
from core.database import engine
from models.base import Base
from core.config import settings
from utils.rate_limit import limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from api.auth import router as auth_router
from api.interview import router as interview_router
from api.interview_session import router as interview_session_router
from api.evaluation import router as evaluation_router
from api.user import router as user_router
from api.candidate import router as candidate_router
from api.conversation import router as conversation_router
from api.tts import router as tts_router
from api.health import router as health_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

origins = [
 "http://localhost:5173",
"http://localhost:3000",
os.getenv("FRONTEND_URL", "https://your-frontend-placeholder.vercel.app")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,    
    allow_methods=["*"],            
    allow_headers=["*"],           
)
app.add_exception_handler(RateLimitExceeded,_rate_limit_exceeded_handler)

api_router = APIRouter(prefix="/api")
app.include_router(api_router)

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(candidate_router)
api_router.include_router(interview_router)
api_router.include_router(interview_session_router)
api_router.include_router(evaluation_router)
api_router.include_router(conversation_router)
api_router.include_router(tts_router)



