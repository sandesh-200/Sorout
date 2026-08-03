from models.conversation_message import (
    ConversationMessage,
    MessageRole,
)


class ConversationFormatter:

    @staticmethod
    def format(
        messages: list[ConversationMessage],
    ) -> str:

        transcript: list[str] = []

        for index, message in enumerate(
            messages,
            start=1,
        ):

            speaker = (
                "Interviewer"
                if message.role == MessageRole.ai
                else "Candidate"
            )

            content = " ".join(
                message.content.split()
            )

            transcript.append(
                f"Turn {index} | {speaker}: {content}"
            )

        return "\n\n".join(transcript)