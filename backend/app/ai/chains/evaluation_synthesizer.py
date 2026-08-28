from ai.schemas.evaluation_schema import (
    ConversationSegment,
    SegmentEvaluationResult,
    SynthesisResult,
)

from ai.prompts.interview_evaluation import SYNTHESIS_PROMPT
from ai.llm import llm


synthesis_chain = (
    SYNTHESIS_PROMPT
    | llm.with_structured_output(SynthesisResult)
)


def synthesize_evaluation(
    segments: list[ConversationSegment],
    evaluations: list[SegmentEvaluationResult],
    position: str,
    level: str,
) -> SynthesisResult:

    evaluations_text = "\n\n".join(
        f"""Segment {index}:
Discussion:
{segment.discussion}
Score: {evaluation.score}
Strengths: {", ".join(evaluation.strengths)}
Weaknesses: {", ".join(evaluation.weaknesses)}
Feedback: {evaluation.feedback}"""
        for index, (segment, evaluation)
        in enumerate(zip(segments, evaluations), start=1)
    )

    return synthesis_chain.invoke(
        {
            "position": position,
            "level": level,
            "segment_evaluations": evaluations_text,
        }
    )