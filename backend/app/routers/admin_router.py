import os
from fastapi import APIRouter

from api.admin.candidates import router as admin_candidates_router
from api.admin.interviews import router as admin_interviews_router
from api.admin.questions import router as admin_questions_router
from api.admin.join_links import router as admin_join_links_router


router = APIRouter(prefix="/admin")


router.include_router(admin_candidates_router)
router.include_router(admin_interviews_router)
router.include_router(admin_questions_router)
router.include_router(admin_join_links_router)



