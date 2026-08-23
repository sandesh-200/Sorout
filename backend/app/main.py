import os
from fastapi import FastAPI,APIRouter
from core.config import settings
from utils.rate_limit import limiter
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from routers.admin_router import router as admin_router
from routers.candidate_router import router as candidate_router
from routers.shared_router import router as shared_router


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
api_router.include_router(admin_router)
api_router.include_router(candidate_router)
api_router.include_router(shared_router)

app.include_router(api_router)

