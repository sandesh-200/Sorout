from dataclasses import dataclass
from models.conversation_message import MessageRole

from ai.segmentation.utterance_aggregator import (
    AggregatedUtterance,
)
from ai.segmentation.depth_scoring import (
    BreakpointCandidate,
)


@dataclass
class ConversationSegment:
    """
    A contiguous group of aggregated utterances.
    """

    segment_index: int
    utterances: list[AggregatedUtterance]
    start_index: int
    end_index: int

    @property
    def discussion(self) -> str:
        return "\n".join(
            f"{utterance.speaker.value}: {utterance.text}"
            for utterance in self.utterances
        )

    @property
    def text(self) -> str:
        return self.discussion


class SegmentBuilder:
    """
    Converts candidate breakpoints into contiguous conversation segments.
    """

    @staticmethod
    def _is_valid_breakpoint(
    utterances: list[AggregatedUtterance],
    split_index: int,
) -> bool:

        if split_index <= 0:
            return False

        if split_index >= len(utterances):
            return False

        left = utterances[split_index - 1]
        right = utterances[split_index]

    # Never split an interviewer question from
    # the candidate's immediate response.
        if (
        left.speaker == MessageRole.ai
        and right.speaker == MessageRole.candidate):
            return False

        return True

    @staticmethod
    def build(
        utterances: list[AggregatedUtterance],
        breakpoints: list[BreakpointCandidate],
    ) -> list[ConversationSegment]:

        if not utterances:
            return []

        # No breakpoints means the entire interview
        # belongs to one segment.
        if not breakpoints:
            return [
                ConversationSegment(
                    segment_index=1,
                    utterances=utterances,
                    start_index=0,
                    end_index=len(utterances) - 1,
                )
            ]

        segments: list[ConversationSegment] = []

        start_index = 0

        # boundary_index is 1-based.
        #
        # Example:
        #
        # U1 U2 | U3
        #       ^
        # boundary_index = 3
        #
        # Therefore Python split index = 2.
        split_indices = sorted(
    candidate.boundary_index - 1
    for candidate in breakpoints
)

        split_indices = [
    split_index
    for split_index in split_indices
    if SegmentBuilder._is_valid_breakpoint(
        utterances,
        split_index,
    )
    ]

        for split_index in split_indices:

            if split_index <= start_index:
                continue

            segments.append(
                ConversationSegment(
                    segment_index=len(segments) + 1,
                    utterances=utterances[
                        start_index:split_index
                    ],
                    start_index=start_index,
                    end_index=split_index - 1,
                )
            )

            start_index = split_index

        # Add the final segment.
        if start_index < len(utterances):
            segments.append(
                ConversationSegment(
                    segment_index=len(segments) + 1,
                    utterances=utterances[start_index:],
                    start_index=start_index,
                    end_index=len(utterances) - 1,
                )
            )

        return segments