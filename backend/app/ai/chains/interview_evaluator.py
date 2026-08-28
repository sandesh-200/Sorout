from ai.segmentation.pipeline import InterviewSegmentationPipeline
from ai.chains.segment_evaluator import evaluate_segments
from ai.chains.evaluation_synthesizer import synthesize_evaluation


class InterviewEvaluator:

    @staticmethod
    def evaluate_new(
        position: str,
        level: str,
        messages,
        pipeline: InterviewSegmentationPipeline,
    ):
        segmentation = pipeline.segment(messages)

        segment_evaluations = evaluate_segments(
            segments=segmentation.segments,
            position=position,
            level=level,
        )

        synthesis = synthesize_evaluation(
            segments=segmentation.segments,
            evaluations=segment_evaluations,
            position=position,
            level=level,
        )

        return {
            "segments": segmentation.segments,
            "evaluations": segment_evaluations,
            "synthesis": synthesis,
        }