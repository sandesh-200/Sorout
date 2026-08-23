from fastapi import APIRouter
from api.candidate.interviews import router as candidate_interviews_router
from api.candidate.conversations import router as candidate_conversations_router
from api.candidate.evaluations import router as candidate_evaluations_router


router = APIRouter(prefix="/candidate")


router.include_router(candidate_interviews_router)
router.include_router(candidate_conversations_router)
router.include_router(candidate_evaluations_router)




