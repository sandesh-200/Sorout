from ai.llm import llm
import re
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
        content = response.content.strip()

        content = re.sub(r"<\|.*?\|>", "", content).strip()

        return content