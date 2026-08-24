from langchain_core.output_parsers import PydanticOutputParser

from ai.llm import llm
from ai.prompts.question_generation import (
    QUESTION_GENERATION_PROMPT,
)
from ai.schemas.question_schema import (
    GeneratedQuestionsList,
)

structured_data = llm.with_structured_output(GeneratedQuestionsList)

prompt = QUESTION_GENERATION_PROMPT

chain = prompt | structured_data


class QuestionGenerator:

    @staticmethod
    def generate(interview):

        result = chain.invoke(
            {
                "count": interview.max_questions,
                "position": interview.job_position,
                "level": interview.seniority_level,
            }
        )

        return result.questions