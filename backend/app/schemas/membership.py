from pydantic import BaseModel
from models.organization_membership import MembershipRole
from datetime import datetime

class MembershipResponse(BaseModel):
    id: int
    organization_id: int
    organization_name: str
    role: MembershipRole
    joined_at: datetime

    model_config = {"from_attributes": True}