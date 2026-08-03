from langchain_core.output_parsers import PydanticOutputParser

from ai.schemas.evaluation_schema import InterviewEvaluation
from ai.prompts.interview_evaluation import (
    INTERVIEW_EVALUATION_PROMPT,
)

from ai.llm import llm

parser = PydanticOutputParser(
    pydantic_object=InterviewEvaluation
)

prompt = INTERVIEW_EVALUATION_PROMPT.partial(
    format_instructions=parser.get_format_instructions()
)

chain = prompt | llm | parser



class InterviewEvaluator:

    @staticmethod
    def evaluate(
        position,
        level,
        interview_questions,
        conversation,
    ):
        result = chain.invoke(
            {
                "position": position,
                "level": level,
                "interview_questions": interview_questions,
                "conversation": conversation,
            }
        )
        return result