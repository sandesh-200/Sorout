from ai.schemas.evaluation_schema import (
    ConversationSegment,
    SegmentEvaluationResult,
)

from ai.prompts.interview_evaluation import (
    SEGMENT_EVALUATION_PROMPT,
)

from ai.llm import llm


segment_evaluation_chain = (
    SEGMENT_EVALUATION_PROMPT
    | llm.with_structured_output(SegmentEvaluationResult)
)



def evaluate_segments(
    segments: list[ConversationSegment],
    position: str,
    level: str,
) -> list[SegmentEvaluationResult]:

    inputs = [
        {
            "position": position,
            "level": level,
            "discussion": segment.discussion,
        }
        for segment in segments
    ]

    return segment_evaluation_chain.batch(
        inputs,
        config={
            "max_concurrency": 2,
        },
    )