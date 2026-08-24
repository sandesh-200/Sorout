from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.interview import InterviewStatus
from repositories.interview_repository import InterviewRepository
from schemas.interview import InterviewCreate,InterviewUpdate,AssignCandidatesResponse,InterviewResponse
from schemas.question import InterviewQuestionResponse
from repositories.interview_question_repository import InterviewQuestionRepository
from repositories.question_repository import QuestionRepository
from ai.chains.question_generator import QuestionGenerator
from repositories.user_repository import UserRepository
from repositories.interview_session_repository import InterviewSessionRepository
from repositories.candidate_repository import CandidateRepository

class InterviewService:
    @staticmethod
    def create_interview(
        db:Session,
        data:InterviewCreate,
        admin_id:int,
        organization_id:int,
    ):
         return InterviewRepository.create(
            db=db,
            title=data.title,
            job_position=data.job_position,
            seniority_level=data.seniority_level,
            max_questions=data.max_questions,
            status=InterviewStatus.draft,
            created_by=admin_id,
            organization_id=organization_id,
        )
    
    @staticmethod
    def get_all_interviews(db:Session, organization_id:int):
         interviews = InterviewRepository.get_all(
             db,
             organization_id=organization_id,
         )
         results = []
         for interview in interviews:
             response = InterviewResponse.model_validate(interview)
             response.has_questions = QuestionRepository.has_questions(
                 db,
                 interview.id
             )
             results.append(response)
         return results
    
    
    @staticmethod
    def get_interview(
        db:Session,
        interview_id:int,
        organization_id:int,
    ):
            interview = InterviewRepository.get_by_id(db,interview_id, organization_id=organization_id)

            if not interview:
              raise HTTPException(
                   status_code=404,
                   detail="Interview not found"
              )
            return interview
    

    @staticmethod
    def update_interview(
        db: Session,interview_id: int,data: InterviewUpdate, organization_id: int):
            interview = InterviewRepository.get_by_id(db,interview_id, organization_id=organization_id)

            if not interview:
                raise HTTPException(
                status_code=404,
                detail="Interview not found")

            if interview.status != InterviewStatus.draft:
                raise HTTPException(
            status_code=400,
            detail="Only draft interviews can be updated.")

            update_data = data.model_dump(exclude_unset=True)

            return InterviewRepository.update(db,interview,update_data)
    
    @staticmethod
    def delete_interview(
    db: Session,
    interview_id: int,
    organization_id: int):
        interview = InterviewRepository.get_by_id(
        db,
        interview_id,
        organization_id=organization_id)

        if not interview:
            raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

        if interview.status != InterviewStatus.draft:
            raise HTTPException(
            status_code=400,
            detail="Only draft interviews can be deleted.",
        )

        InterviewRepository.delete(
        db,
        interview)

    @staticmethod
    def generate_questions(
    db: Session,
    interview_id: int,
    organization_id: int,
):
        interview = InterviewRepository.get_by_id(
        db,
        interview_id,
        organization_id=organization_id
    )

        if not interview:
            raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

        if interview.status != InterviewStatus.draft:
            raise HTTPException(
            status_code=400,
            detail="Questions have already been generated for this interview.",
        )

        try:
            generated_questions = QuestionGenerator.generate(interview)

            question_payload = [
            {
        "question_text": q.question_text,
        "category": q.category,
        "is_ai_generated": True,
        "target_position": interview.job_position,
        "target_level": interview.seniority_level,
            }
    for q in generated_questions
]
            


            questions = QuestionRepository.create_many(
            db=db,
            questions=question_payload,
        )

        # 3. Link questions to interview
            InterviewQuestionRepository.create_many(
            db=db,
            interview_id=interview.id,
            questions=questions,
        )

        # 4. Update interview status
            InterviewRepository.update_status(
            db=db,
            interview=interview,
            status=InterviewStatus.ready,
        )

        # 5. Commit everything
            db.commit()

            db.refresh(interview)

            return {
            "message": "Questions generated successfully."
        }

        except Exception:
            db.rollback()
            raise   

    @staticmethod
    def get_interview_questions(
        db: Session,
        interview_id: int,
        organization_id: int,
    ):
        interview = InterviewRepository.get_by_id(
            db,
            interview_id,
            organization_id=organization_id
        )

        if not interview:
            raise HTTPException(
                status_code=404,
                detail="Interview not found",
            )

        mappings = InterviewQuestionRepository.get_by_interview(
            db=db,
            interview_id=interview_id,
        )

        return [
            InterviewQuestionResponse(
                id=m.question.id,
                question_text=m.question.question_text,
                category=m.question.category,
                order_sequence=m.order_sequence,
            )
            for m in mappings
        ]
    
    @staticmethod
    def assign_candidates(
        db: Session,
        interview_id: int,
        candidate_ids: list[int],
        organization_id: int,
    ):
        # Check interview exists
        interview = InterviewRepository.get_by_id(
            db,
            interview_id,
            organization_id=organization_id
        )

        if not interview:
            raise HTTPException(
                status_code=404,
                detail="Interview not found.",
            )

        # Questions must already be generated
        if interview.status != InterviewStatus.ready:
            raise HTTPException(
                status_code=400,
                detail="Interview must be in READY state before assigning candidates.",
            )

        # Get first interview question
        first_question = (
            InterviewQuestionRepository.get_first_question(
                db=db,
                interview_id=interview.id,
            )
        )

        if not first_question:
            raise HTTPException(
                status_code=400,
                detail="Interview has no questions.",
            )

        # Validate candidate ids
        candidates = CandidateRepository.get_candidates_by_ids(
            db=db,
            candidate_ids=candidate_ids,
            organization_id=organization_id,
        )

        if len(candidates) != len(candidate_ids):
            raise HTTPException(
                status_code=400,
                detail="One or more candidate IDs are invalid.",
            )

        # Create interview sessions
        result = InterviewSessionRepository.create_many(
            db=db,
            interview_id=interview.id,
            candidate_ids=candidate_ids,
            current_question_id=first_question.id,
        )

        db.commit()

        return AssignCandidatesResponse(
    assigned_count=result["assigned_count"],
    already_assigned=result["already_assigned"],
    assigned_candidate_ids=[
        session.candidate_id
        for session in result["sessions"]
    ],
    message=f"{result['assigned_count']} candidate(s) assigned successfully.",
)
