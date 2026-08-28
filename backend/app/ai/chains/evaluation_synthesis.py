from ai.chains.interview_evaluator import synthesis_chain
from ai.schemas.evaluation_schema import (
    SegmentEvaluationResult,
    SynthesisResult,
    ConversationSegment,
)


def synthesize_evaluation(
    segments: list[ConversationSegment],
    evaluations: list[SegmentEvaluationResult],
    position: str,
    level: str,
) -> SynthesisResult:

    segment_evaluations = []

    for segment, evaluation in zip(segments, evaluations):
        segment_evaluations.append(
            (
                f"Topic: {segment.topic}\n"
                f"Score: {evaluation.score}/10\n"
                f"Feedback: {evaluation.feedback}"
            )
        )

    evaluation_text = "\n\n".join(segment_evaluations)

    return synthesis_chain.invoke(
        {
            "position": position,
            "level": level,
            "segment_evaluations": evaluation_text,
        }
    )