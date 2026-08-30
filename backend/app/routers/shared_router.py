from fastapi import APIRouter

from api.shared.auth import router as auth_router
from api.shared.users import router as user_router
from api.shared.health import router as health_Router
from api.shared.join_links import router as join_links_router
from api.shared.tts import router as tts_router
from api.shared.stt import router as stt_router


router = APIRouter()


router.include_router(auth_router)
router.include_router(tts_router)
router.include_router(stt_router)
router.include_router(join_links_router)
router.include_router(health_Router)
router.include_router(user_router)



