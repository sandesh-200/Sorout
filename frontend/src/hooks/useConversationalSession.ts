import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  startConversation,
  sendMessage,
} from "@/features/conversationInterview/conversationInterviewThunk";
import {
  addCandidateMessage,
  setSessionId,
  resetConversation,
} from "@/features/conversationInterview/conversationInterviewSlice";
import { clearEvaluation } from "@/features/evaluation/evaluationSlice";
import { useVoiceConversation } from "@/hooks/useVoiceConversation";

export function useConversationalSession(numericSessionId: number) {
  const dispatch = useDispatch<AppDispatch>();
  const initializedRef = useRef(false);

  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [streamingAiText, setStreamingAiText] = useState<string | null>(null);

  const { messages, completed, loading, sendingMessage } = useSelector(
    (state: RootState) => state.conversationInterview
  );

  // Refs for voice action callbacks to avoid dependency cycles
  const speakTextRef = useRef<((text: string, onEnd?: () => void, onProgress?: (p: number) => void) => Promise<void>) | null>(null);
  const startListeningRef = useRef<(() => Promise<void>) | null>(null);

  const processCandidateAnswer = useCallback(
    async (text: string) => {
      const cleanText = text.trim();
      if (!cleanText || sendingMessage || completed) return;

      dispatch(addCandidateMessage(cleanText));

      const resultAction = await dispatch(
        sendMessage({ sessionId: numericSessionId, message: cleanText })
      );

      if (sendMessage.fulfilled.match(resultAction)) {
        const fullReply = resultAction.payload.message.content;
        setIsAiSpeaking(true);
        setStreamingAiText("");

        if (speakTextRef.current) {
          await speakTextRef.current(
            fullReply,
            () => {
              setIsAiSpeaking(false);
              setStreamingAiText(null);
              if (!resultAction.payload.completed && startListeningRef.current) {
                startListeningRef.current();
              }
            },
            (progressFraction) => {
              const charsToShow = Math.max(1, Math.floor(progressFraction * fullReply.length));
              setStreamingAiText(fullReply.slice(0, charsToShow));
            }
          );
        }
      }
    },
    [sendingMessage, completed, dispatch, numericSessionId]
  );

  const voice = useVoiceConversation({
    onTranscriptFinalized: processCandidateAnswer,
    isAiSpeaking,
    isProcessing: sendingMessage,
    ttsApiEndpoint: `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/tts`,
  });

  const { speakText, startListening } = voice;

  // Keep refs up-to-date with latest voice hook outputs
  useEffect(() => {
    speakTextRef.current = speakText;
    startListeningRef.current = startListening;
  }, [speakText, startListening]);

  useEffect(() => {
    dispatch(resetConversation());
    dispatch(clearEvaluation());

    if (numericSessionId && !initializedRef.current) {
      initializedRef.current = true;
      dispatch(setSessionId(numericSessionId));

      dispatch(startConversation(numericSessionId)).then(async (resultAction) => {
        if (startConversation.fulfilled.match(resultAction)) {
          const firstMessage = resultAction.payload.content;
          setIsAiSpeaking(true);
          setStreamingAiText("");

          if (speakTextRef.current) {
            await speakTextRef.current(
              firstMessage,
              () => {
                setIsAiSpeaking(false);
                setStreamingAiText(null);
                if (startListeningRef.current) {
                  startListeningRef.current();
                }
              },
              (progressFraction) => {
                const charsToShow = Math.max(1, Math.floor(progressFraction * firstMessage.length));
                setStreamingAiText(firstMessage.slice(0, charsToShow));
              }
            );
          }
        }
      });
    }

    return () => {
      dispatch(resetConversation());
    };
  }, [numericSessionId, dispatch]);

  return {
    voice,
    messages,
    completed,
    loading,
    sendingMessage,
    isAiSpeaking,
    streamingAiText,
    processCandidateAnswer,
  };
}