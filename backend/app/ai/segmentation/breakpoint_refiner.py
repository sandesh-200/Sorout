from models.conversation_message import MessageRole

from ai.segmentation.depth_scoring import BreakpointCandidate

from ai.segmentation.similarity import (
    SemanticSimilarity,
    SimilarityMeasurement,
)

from ai.segmentation.utterance_aggregator import (
    AggregatedUtterance,
)


class BreakpointRefiner:
    """
    Refines semantic breakpoint candidates using broader context.

    A candidate breakpoint is retained when:
    1. The similarity across the boundary is sufficiently lower
       than the surrounding context.
    2. The interviewer question after the boundary represents
       a new topic rather than a continuation of the previous question.
    """

    def __init__(
        self,
        similarity: SemanticSimilarity,
        context_size: int = 2,
        min_context_drop: float = 0.10,
        min_question_similarity: float = 0.50,
    ):
        if context_size < 1:
            raise ValueError(
                "context_size must be at least 1"
            )

        if min_context_drop < 0:
            raise ValueError(
                "min_context_drop must be non-negative"
            )

        if not 0 <= min_question_similarity <= 1:
            raise ValueError(
                "min_question_similarity must be between 0 and 1"
            )

        self.similarity = similarity
        self.context_size = context_size
        self.min_context_drop = min_context_drop
        self.min_question_similarity = min_question_similarity

    def refine(
        self,
        candidates: list[BreakpointCandidate],
        similarities: list[SimilarityMeasurement],
        utterances: list[AggregatedUtterance],
    ) -> list[BreakpointCandidate]:

        if not candidates:
            return []

        refined: list[BreakpointCandidate] = []

        for candidate in candidates:

            # -----------------------------------------------------
            # 1. Convert boundary index to similarity index
            # -----------------------------------------------------

            # boundary_index is 1-based.
            #
            # U1 U2 | U3
            #       ^
            # boundary_index = 3
            #
            # Similarity:
            # U2 -> U3 = similarity index 1

            boundary_similarity_index = (
                candidate.boundary_index - 2
            )

            if (
                boundary_similarity_index < 0
                or boundary_similarity_index >= len(similarities)
            ):
                continue

            boundary_similarity = similarities[
                boundary_similarity_index
            ].similarity

            # -----------------------------------------------------
            # 2. Calculate surrounding context similarity
            # -----------------------------------------------------

            left_start = max(
                0,
                boundary_similarity_index - self.context_size,
            )

            left_end = boundary_similarity_index

            right_start = boundary_similarity_index + 1

            right_end = min(
                len(similarities),
                right_start + self.context_size,
            )

            left_values = [
                measurement.similarity
                for measurement in similarities[
                    left_start:left_end
                ]
            ]

            right_values = [
                measurement.similarity
                for measurement in similarities[
                    right_start:right_end
                ]
            ]

            if not left_values or not right_values:
                # Not enough surrounding context.
                # Keep the original candidate rather than
                # making an unsupported decision.
                refined.append(candidate)
                continue

            left_context_similarity = (
                sum(left_values) / len(left_values)
            )

            right_context_similarity = (
                sum(right_values) / len(right_values)
            )

            context_similarity = (
                left_context_similarity
                + right_context_similarity
            ) / 2

            context_drop = (
                context_similarity
                - boundary_similarity
            )

            if context_drop < self.min_context_drop:
                continue

            # -----------------------------------------------------
            # 3. Check interviewer question continuity
            # -----------------------------------------------------

            previous_question_index = None
            current_question_index = None

            # Find the interviewer question immediately before
            # the candidate boundary.

            for index in range(
                boundary_similarity_index,
                -1,
                -1,
            ):
                if utterances[index].speaker == MessageRole.ai:
                    previous_question_index = index
                    break

            # Find the interviewer question immediately after
            # the candidate boundary.

            for index in range(
                boundary_similarity_index,
                len(utterances),
            ):
                if utterances[index].speaker == MessageRole.ai:
                    current_question_index = index
                    break

            # -----------------------------------------------------
            # 4. Compare the two interviewer questions
            # -----------------------------------------------------

            if (
                previous_question_index is not None
                and current_question_index is not None
                and previous_question_index
                != current_question_index
            ):

                previous_question = utterances[
                    previous_question_index
                ]

                current_question = utterances[
                    current_question_index
                ]

                question_similarity = self.similarity.compare(
                    previous_question.text,
                    current_question.text,
                )

                # High similarity means the new question is likely
                # a continuation/subtopic of the previous question.
                #
                # Therefore, do NOT create a breakpoint.

                if (
                    question_similarity
                    >= self.min_question_similarity
                ):
                    continue

            # -----------------------------------------------------
            # 5. Keep candidate
            # -----------------------------------------------------

            refined.append(candidate)

        return refined