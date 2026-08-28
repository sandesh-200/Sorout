from dataclasses import dataclass
from ai.segmentation.similarity import SimilarityMeasurement


@dataclass
class DepthMeasurement:
    """
    Measures how deep a semantic similarity valley is around
    a potential topic boundary.
    """

    boundary_index: int
    left_similarity: float
    boundary_similarity: float
    right_similarity: float
    depth_score: float


@dataclass
class BreakpointCandidate:
    """
    Represents a locally prominent semantic valley that is
    worth investigating as a potential topic boundary.
    """

    boundary_index: int
    depth_score: float


class DepthScorer:
    """
    Detects semantic valleys in consecutive utterance similarity
    and identifies locally prominent valleys as breakpoint candidates.
    """

    def __init__(
        self,
        window_size: int = 1,
        min_depth: float = 0.1,
    ):
        if window_size < 1:
            raise ValueError("window_size must be at least 1")

        if min_depth < 0:
            raise ValueError("min_depth must be non-negative")

        self.window_size = window_size
        self.min_depth = min_depth


    def score(
    self,
    measurements: list[SimilarityMeasurement],
) -> list[DepthMeasurement]:

        if len(measurements) < 2:
            return []

        depth_measurements: list[DepthMeasurement] = []

        for index in range(len(measurements)):

            left_start = max(
            0,
            index - self.window_size,
        )

            right_end = min(
            len(measurements),
            index + self.window_size + 1,
        )

            left_values = [
            measurement.similarity
            for measurement in measurements[left_start:index]
        ]

            right_values = [
            measurement.similarity
            for measurement in measurements[index + 1:right_end]
        ]

            if not left_values or not right_values:
                continue

            left_similarity = sum(left_values) / len(left_values)

            right_similarity = sum(right_values) / len(right_values)

            boundary_similarity = measurements[index].similarity

            depth_score = (
            (left_similarity - boundary_similarity)
            + (right_similarity - boundary_similarity)
        ) / 2

            depth_measurements.append(
            DepthMeasurement(
                boundary_index=measurements[index].current_index + 1,
                left_similarity=left_similarity,
                boundary_similarity=boundary_similarity,
                right_similarity=right_similarity,
                depth_score=depth_score,
            )
        )

        return depth_measurements

    def find_candidates(
    self,
    depth_measurements: list[DepthMeasurement],
) -> list[BreakpointCandidate]:

        if not depth_measurements:
            return []

        candidates: list[BreakpointCandidate] = []

        for index, measurement in enumerate(depth_measurements):

            current_depth = measurement.depth_score

        # ---------------------------------------------------------
        # Stage B - Thresholding
        # ---------------------------------------------------------

            if current_depth < self.min_depth:
                continue

        # ---------------------------------------------------------
        # Stage C - Peak Detection
        # ---------------------------------------------------------

        # Only one measurable boundary.
        # There are no neighbors, so use absolute depth.
            if len(depth_measurements) == 1:

                is_peak = True

        # First boundary
            elif index == 0:

                is_peak = (
                current_depth
                >= depth_measurements[index + 1].depth_score
            )

        # Last boundary
            elif index == len(depth_measurements) - 1:

                is_peak = (
                current_depth
                > depth_measurements[index - 1].depth_score
            )

        # Interior boundary
            else:

                previous_depth = (
                depth_measurements[index - 1].depth_score
            )

                next_depth = (
                depth_measurements[index + 1].depth_score
            )

                is_peak = (
                current_depth > previous_depth
                and current_depth >= next_depth
            )

            if not is_peak:
                continue

            candidates.append(
            BreakpointCandidate(
                boundary_index=measurement.boundary_index,
                depth_score=current_depth,
            )
        )

        return candidates