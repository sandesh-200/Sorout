from sqlalchemy.orm import Session
from models.interview import Interview

class InterviewRepository:
    @staticmethod
    def create(db:Session,**kwargs):
        interview = Interview(**kwargs)

        db.add(interview)
        db.commit()
        db.refresh(interview)
        
        return interview
    
    @staticmethod
    def get_all(db:Session, organization_id: int):
        return (
            db.query(Interview)
            .filter(Interview.organization_id == organization_id)
            .order_by(Interview.created_at.desc())
            .all()
        )
    
    @staticmethod
    def get_by_id(
        db:Session,
        interview_id:int,
        organization_id:int
    ):
        return(
            db.query(Interview)
            .filter(
                Interview.id == interview_id,
                Interview.organization_id == organization_id
            )
            .first()
        )

    @staticmethod
    def update(db: Session, interview: Interview, data: dict):
        for key, value in data.items():
            setattr(interview, key, value)

        db.commit()
        db.refresh(interview)

        return interview
    
    @staticmethod
    def delete(db: Session, interview: Interview):
        db.delete(interview)
        db.commit()

    @staticmethod
    def update_status(db:Session,interview,status):
        interview.status = status
        db.flush()
        return interview

    
