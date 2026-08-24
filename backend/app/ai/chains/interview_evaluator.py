from langchain_core.output_parsers import PydanticOutputParser

from ai.schemas.evaluation_schema import InterviewEvaluation
from ai.prompts.interview_evaluation import (
    INTERVIEW_EVALUATION_PROMPT,
)

from ai.llm import llm

structured_output = llm.with_structured_output(InterviewEvaluation)

prompt = INTERVIEW_EVALUATION_PROMPT

chain = prompt | structured_output



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