import time
import logging
from langchain_core.runnables import Runnable

logger = logging.getLogger(__name__)

def invoke_with_fallback(
    primary_chain: Runnable,
    fallback_chain: Runnable,
    inputs: dict,
    max_retries: int = 2,
) -> any:
    """
    Invoke a LangChain chain with automatic retry and provider fallback.
    - First tries primary_chain up to max_retries times
    - On failure, falls back to fallback_chain (once)
    """
    last_error = None
    
    for attempt in range(max_retries):
        try:
            return primary_chain.invoke(inputs)
        except Exception as e:
            last_error = e
            wait = 2 ** attempt  # 1s, 2s backoff
            logger.warning(f"LLM primary attempt {attempt+1} failed: {e}. Retrying in {wait}s...")
            time.sleep(wait)
    
    # Try fallback
    try:
        logger.warning("Primary LLM failed. Trying fallback provider...")
        return fallback_chain.invoke(inputs)
    except Exception as e:
        logger.error(f"Fallback LLM also failed: {e}")
        raise RuntimeError(
            f"All LLM providers failed. Last error: {last_error}"
        ) from last_error
