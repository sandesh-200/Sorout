from dataclasses import dataclass

from ai.segmentation.segment_builder import ConversationSegment
from ai.segmentation.utterance_aggregator import AggregatedUtterance
from models.conversation_message import MessageRole


@dataclass
class ValidationResult:
    """
    Result of validating constructed conversation segments.
    """

    segments: list[ConversationSegment]
    warnings: list[str]


class SegmentValidator:
    """
    Validates segments produced by SegmentBuilder.

    This stage is deterministic and does not use an LLM.
    """

    @staticmethod
    def validate(
        segments: list[ConversationSegment],
        utterances: list[AggregatedUtterance],
    ) -> ValidationResult:

        warnings: list[str] = []

        if not segments:
            return ValidationResult(
                segments=[],
                warnings=["No segments were produced."],
            )

        # ---------------------------------------------------------
        # 1. Remove empty segments
        # ---------------------------------------------------------

        cleaned_segments = [
            segment
            for segment in segments
            if segment.utterances
        ]

        if len(cleaned_segments) != len(segments):
            warnings.append(
                "One or more empty segments were removed."
            )

        # ---------------------------------------------------------
        # 2. Validate utterance coverage
        # ---------------------------------------------------------

        expected_indices = set(range(len(utterances)))

        actual_indices = []

        for segment in cleaned_segments:
            actual_indices.extend(
                range(
                    segment.start_index,
                    segment.end_index + 1,
                )
            )

        actual_indices_set = set(actual_indices)

        missing_indices = (
            expected_indices - actual_indices_set
        )

        if missing_indices:
            warnings.append(
                f"Missing utterances: "
                f"{sorted(missing_indices)}"
            )

        # ---------------------------------------------------------
        # 3. Detect duplicated utterances
        # ---------------------------------------------------------

        duplicate_indices = {
            index
            for index in actual_indices
            if actual_indices.count(index) > 1
        }

        if duplicate_indices:
            warnings.append(
                f"Duplicated utterances: "
                f"{sorted(duplicate_indices)}"
            )

        # ---------------------------------------------------------
        # 4. Validate chronological order
        # ---------------------------------------------------------

        previous_end = -1

        for segment in cleaned_segments:

            if segment.start_index <= previous_end:
                warnings.append(
                    f"Segment {segment.segment_index} "
                    f"overlaps a previous segment."
                )

            if segment.start_index > segment.end_index:
                warnings.append(
                    f"Segment {segment.segment_index} "
                    f"has an invalid range."
                )

            previous_end = segment.end_index

        # ---------------------------------------------------------
        # 5. Validate segment contents
        # ---------------------------------------------------------

        for segment in cleaned_segments:

            speakers = {
                utterance.speaker
                for utterance in segment.utterances
            }

            if MessageRole.ai not in speakers:
                warnings.append(
                    f"Segment {segment.segment_index} "
                    f"contains no interviewer utterance."
                )

            if MessageRole.candidate not in speakers:
                warnings.append(
                    f"Segment {segment.segment_index} "
                    f"contains no candidate utterance."
                )

        # ---------------------------------------------------------
        # 6. Re-index segments after cleanup
        # ---------------------------------------------------------

        for index, segment in enumerate(
            cleaned_segments,
            start=1,
        ):
            segment.segment_index = index

        return ValidationResult(
            segments=cleaned_segments,
            warnings=warnings,
        )