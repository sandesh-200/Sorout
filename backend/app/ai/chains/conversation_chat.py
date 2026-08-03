from langchain_core.output_parsers import (
    PydanticOutputParser
)

from ai.llm import llm

from ai.schemas.conversation_schema import (
    ConversationResponse,
)

from ai.prompts.conversation_chat import (
    CONVERSATION_CHAT_PROMPT,
)

from models.conversation_message import MessageRole
from services.conversation_context import ConversationContextService

parser = PydanticOutputParser(
    pydantic_object=ConversationResponse,
)

prompt = CONVERSATION_CHAT_PROMPT.partial(
    format_instructions=parser.get_format_instructions(),
)

chain = prompt | llm | parser


class ConversationChat:

    @staticmethod
    def generate(
        interview,
        messages,
    ):

        context = ConversationContextService.build(interview=interview,messages=messages)

        return chain.invoke(
    {
        "position": interview.job_position,
        "level": interview.seniority_level,
        "conversation": context["conversation"],
        "questions_asked": context["questions_asked"],
        "candidate_answers": context["candidate_answers"],
        "interview_questions": context["interview_questions"],
    }
)
         