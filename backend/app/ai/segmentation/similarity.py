from dataclasses import dataclass

import numpy as np
from langchain_core.embeddings import Embeddings

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
    Calculates semantic similarity between utterances
    using a LangChain-compatible embedding model.
    """

    def __init__(
        self,
        embedding_model: Embeddings,
    ):
        self.embedding_model = embedding_model

    def _normalize_embeddings(
        self,
        embeddings: list[list[float]],
    ) -> np.ndarray:

        vectors = np.asarray(
            embeddings,
            dtype=np.float32,
        )

        norms = np.linalg.norm(
            vectors,
            axis=1,
            keepdims=True,
        )

        return vectors / norms

    def compare(
        self,
        text_a: str,
        text_b: str,
    ) -> float:
        """
        Calculate semantic similarity between two texts.
        """

        embeddings = self.embedding_model.embed_documents(
            [text_a, text_b]
        )

        normalized_embeddings = self._normalize_embeddings(
            embeddings
        )

        return float(
            np.dot(
                normalized_embeddings[0],
                normalized_embeddings[1],
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

        embeddings = self.embedding_model.embed_documents(
            texts
        )

        normalized_embeddings = self._normalize_embeddings(
            embeddings
        )

        measurements: list[SimilarityMeasurement] = []

        for index in range(1, len(utterances)):

            previous_embedding = normalized_embeddings[index - 1]
            current_embedding = normalized_embeddings[index]

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