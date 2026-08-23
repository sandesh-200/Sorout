from sqlalchemy.orm import Session
from repositories.candidate_repository import CandidateRepository




class CandidateService:

    @staticmethod
    def get_all_candidates(db: Session, organization_id: int):
        return CandidateRepository.get_all_candidates(db=db, organization_id=organization_id)

    @staticmethod
    def get_available_candidates(db: Session, interview_id: int, organization_id: int):
        return CandidateRepository.get_available_candidates(
            db=db, interview_id=interview_id, organization_id=organization_id
        )

    @staticmethod
    def get_candidates_by_ids(
        db: Session,
        candidate_ids: list[int],
        organization_id: int,
    ):
        return CandidateRepository.get_by_ids(
            db=db,
            candidate_ids=candidate_ids,
            organization_id=organization_id,
        )










