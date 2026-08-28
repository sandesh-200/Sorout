from dataclasses import dataclass

from models.conversation_message import ConversationMessage
from ai.segmentation.breakpoint_refiner import BreakpointRefiner

from ai.segmentation.utterance_aggregator import (
    AggregatedUtterance,
    UtteranceAggregator,
)

from ai.segmentation.similarity import (
    SemanticSimilarity,
    SimilarityMeasurement,
)

from ai.segmentation.depth_scoring import (
    BreakpointCandidate,
    DepthMeasurement,
    DepthScorer,
)

from ai.segmentation.segment_builder import (
    ConversationSegment,
    SegmentBuilder,
)

from ai.segmentation.segment_validator import (
    SegmentValidator,
)


@dataclass
class SegmentationResult:
    """
    Complete result of the deterministic segmentation pipeline.
    """

    utterances: list[AggregatedUtterance]
    similarities: list[SimilarityMeasurement]
    depth_measurements: list[DepthMeasurement]
    breakpoints: list[BreakpointCandidate]
    segments: list[ConversationSegment]
    warnings: list[str]


class InterviewSegmentationPipeline:
    """
    Runs the complete deterministic interview segmentation pipeline.

    Messages
        ↓
    Utterance aggregation
        ↓
    Semantic similarity
        ↓
    Depth scoring
        ↓
    Breakpoint detection
        ↓
    Segment construction
        ↓
    Validation
    """

    def __init__(
    self,
    similarity_model: SemanticSimilarity,
    depth_scorer: DepthScorer | None = None,
    breakpoint_refiner: BreakpointRefiner | None = None,
):
            self.aggregator = UtteranceAggregator()

            self.similarity = similarity_model

            self.depth_scorer = (
        depth_scorer
        or DepthScorer(window_size=1)
    )

            self.breakpoint_refiner = (
        breakpoint_refiner
        or BreakpointRefiner(
            similarity=self.similarity,
        )
    )

    def segment(
        self,
        messages: list[ConversationMessage],
    ) -> SegmentationResult:

        # =========================================================
        # Stage 1 - Utterance Aggregation
        # =========================================================

        utterances = self.aggregator.aggregate(
            messages
        )

        # =========================================================
        # Stage 2 - Semantic Similarity
        # =========================================================

        similarities = self.similarity.measure(
            utterances
        )

        # =========================================================
        # Stage 3 - Depth Scoring + Breakpoints
        # =========================================================

        depth_measurements = self.depth_scorer.score(
            similarities
        )

        candidates = self.depth_scorer.find_candidates(
    depth_measurements,
)

        breakpoints = self.breakpoint_refiner.refine(
    candidates,
    similarities,
    utterances,
)

        # =========================================================
        # Stage 4 - Segment Construction
        # =========================================================

        segments = SegmentBuilder.build(
            utterances=utterances,
            breakpoints=breakpoints,
        )

        # =========================================================
        # Stage 5 - Validation
        # =========================================================

        validation = SegmentValidator.validate(
            segments=segments,
            utterances=utterances,
        )

        result = SegmentationResult(
            utterances=utterances,
            similarities=similarities,
            depth_measurements=depth_measurements,
            breakpoints=breakpoints,
            segments=validation.segments,
            warnings=validation.warnings,
        )

        print("\n" + "=" * 80)
        print("SIMILARITY MEASUREMENTS")
        print("=" * 80)

        for measurement in result.similarities:
            print(
        f"\nU{measurement.previous_index + 1} → "
        f"U{measurement.current_index + 1}"
    )

            print(
        f"Similarity: {measurement.similarity:.4f}"
    )

            print(
        f"U{measurement.previous_index + 1}: "
        f"{result.utterances[measurement.previous_index].text}"
    )

            print(
        f"U{measurement.current_index + 1}: "
        f"{result.utterances[measurement.current_index].text}"
    )

        return result