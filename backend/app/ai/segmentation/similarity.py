from dataclasses import dataclass

import numpy as np
from sentence_transformers import SentenceTransformer

from ai.segmentation.utterance_aggregator import AggregatedUtterance


@dataclass
class SimilarityMeasurement:
    """
    Semantic relationship between two consecutive utterances.
    """

    previous_index: int
    current_index: int
    similarity: float
    distance: float


class SemanticSimilarity:
    """
    Generates embeddings and calculates semantic similarity.
    """

    def __init__(
        self,
        model: SentenceTransformer,
    ):
        self.model = model

    def compare(
        self,
        text_a: str,
        text_b: str,
    ) -> float:
        """
        Calculate semantic similarity between two texts.
        """

        embeddings = self.model.encode(
            [text_a, text_b],
            normalize_embeddings=True,
        )

        return float(
            np.dot(
                embeddings[0],
                embeddings[1],
            )
        )

    def measure(
        self,
        utterances: list[AggregatedUtterance],
    ) -> list[SimilarityMeasurement]:

        if len(utterances) < 2:
            return []

        texts = [
            utterance.text
            for utterance in utterances
        ]

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
        )

        measurements: list[SimilarityMeasurement] = []

        for index in range(1, len(utterances)):

            previous_embedding = embeddings[index - 1]
            current_embedding = embeddings[index]

            similarity = float(
                np.dot(
                    previous_embedding,
                    current_embedding,
                )
            )

            distance = 1.0 - similarity

            measurements.append(
                SimilarityMeasurement(
                    previous_index=index - 1,
                    current_index=index,
                    similarity=similarity,
                    distance=distance,
                )
            )

        return measurements