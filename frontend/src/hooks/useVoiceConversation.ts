import { useState, useEffect, useRef, useCallback } from "react";

interface UseVoiceConversationProps {
  onTranscriptFinalized: (transcript: string) => void;
  isAiSpeaking: boolean;
  isProcessing: boolean;
  ttsApiEndpoint?: string;
}

export function useVoiceConversation({
  onTranscriptFinalized,
  isAiSpeaking,
  isProcessing,
  ttsApiEndpoint = "http://localhost:8000/api/tts",
}: UseVoiceConversationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestTranscriptRef = useRef("");
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  const userIntentToListenRef = useRef(false);
  const isAiSpeakingRef = useRef(isAiSpeaking);
  const isProcessingRef = useRef(isProcessing);
  const onTranscriptFinalizedRef = useRef(onTranscriptFinalized);

  // Keep refs up-to-date without re-binding recognition callbacks
  useEffect(() => {
    onTranscriptFinalizedRef.current = onTranscriptFinalized;
  }, [onTranscriptFinalized]);

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    latestTranscriptRef.current = transcript;
  }, [transcript]);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.ontimeupdate = null;
      currentAudioRef.current.onended = null;
      currentAudioRef.current.onerror = null;
      currentAudioRef.current = null;
    }
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    userIntentToListenRef.current = false;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe cleanup
      }
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // Auto-finalize speech after 1.8 seconds of continuous silence
      silenceTimerRef.current = setTimeout(() => {
        const finalSpeech = latestTranscriptRef.current.trim();
        if (finalSpeech) {
          stopListening();
          onTranscriptFinalizedRef.current(finalSpeech);
          setTranscript("");
        }
      }, 1800);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }
      console.warn("[Voice] Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      if (
        userIntentToListenRef.current &&
        !isAiSpeakingRef.current &&
        !isProcessingRef.current
      ) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      userIntentToListenRef.current = false;
      stopAudio();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Safe cleanup
        }
      }
    };
  }, [stopListening, stopAudio]);

  const startListening = useCallback(() => {
    stopAudio();
    isAiSpeakingRef.current = false;
    userIntentToListenRef.current = true;

    if (recognitionRef.current && !isProcessingRef.current) {
      try {
        setTranscript("");
        recognitionRef.current.start();
      } catch (err: any) {
        if (err.name !== "InvalidStateError") {
          console.error("[Voice] Failed to start recognition:", err);
        }
      }
    }
  }, [stopAudio]);

  /**
   * Fetches audio from FastAPI `/api/tts` endpoint and syncs text progress with playback.
   */
  const speakText = useCallback(
    async (
      text: string,
      onEnd?: () => void,
      onProgress?: (progressFraction: number) => void
    ) => {
      stopListening();
      stopAudio();

      if (!text || text.trim() === "") {
        if (onProgress) onProgress(1);
        if (onEnd) onEnd();
        return;
      }

      isAiSpeakingRef.current = true;

      try {
        const response = await fetch(ttsApiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error(`TTS API failed with status ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        currentObjectUrlRef.current = audioUrl;

        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        audio.ontimeupdate = () => {
          if (audio.duration && onProgress) {
            const progress = Math.min(audio.currentTime / audio.duration, 1);
            onProgress(progress);
          }
        };

        const handleAudioPlaybackEnd = () => {
          if (onProgress) onProgress(1);
          stopAudio();
          isAiSpeakingRef.current = false;
          if (onEnd) onEnd();
        };

        audio.onended = handleAudioPlaybackEnd;

        audio.onerror = (e) => {
          console.error("[Voice] Audio playback error:", e);
          handleAudioPlaybackEnd();
        };

        await audio.play();
      } catch (error) {
        console.error("[Voice] Failed to fetch or play TTS audio:", error);
        isAiSpeakingRef.current = false;
        if (onProgress) onProgress(1);
        if (onEnd) onEnd();
      }
    },
    [stopListening, stopAudio, ttsApiEndpoint]
  );

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speakText,
  };
}