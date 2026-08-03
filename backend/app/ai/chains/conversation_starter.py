from ai.llm import llm
from ai.prompts.conversation_start import (
    CONVERSATION_START_PROMPT,
)


chain = CONVERSATION_START_PROMPT | llm


class ConversationStarter:

    @staticmethod
    def generate(interview):

        response = chain.invoke(
            {
                "position": interview.job_position,
                "level": interview.seniority_level,
            }
        )

        return response.content.strip()