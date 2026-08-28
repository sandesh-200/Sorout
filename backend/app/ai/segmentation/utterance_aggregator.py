from dataclasses import dataclass

from models.conversation_message import (
    ConversationMessage,
    MessageRole,
)


@dataclass
class AggregatedUtterance:
    """
    A single conversational utterance created by merging
    consecutive messages from the same speaker.
    """

    speaker: MessageRole
    text: str
    message_ids: list[int]


class UtteranceAggregator:
    """
    Merges consecutive conversation messages belonging to
    the same speaker into a single utterance.
    """

    @staticmethod
    def aggregate(
        messages: list[ConversationMessage],
    ) -> list[AggregatedUtterance]:

        if not messages:
            return []

        aggregated: list[AggregatedUtterance] = []

        current_speaker = messages[0].role
        current_text: list[str] = [messages[0].content]
        current_message_ids: list[int] = [messages[0].id]

        for message in messages[1:]:

            if message.role == current_speaker:
                current_text.append(message.content)
                current_message_ids.append(message.id)
                continue

            aggregated.append(
                AggregatedUtterance(
                    speaker=current_speaker,
                    text=" ".join(current_text).strip(),
                    message_ids=current_message_ids,
                )
            )

            current_speaker = message.role
            current_text = [message.content]
            current_message_ids = [message.id]

        # Flush the final utterance.
        aggregated.append(
            AggregatedUtterance(
                speaker=current_speaker,
                text=" ".join(current_text).strip(),
                message_ids=current_message_ids,
            )
        )

        return aggregated


