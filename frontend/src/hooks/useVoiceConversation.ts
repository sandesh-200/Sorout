// src/hooks/useVoiceConversation.ts
import { useState, useEffect, useRef, useCallback } from "react";

interface UseVoiceConversationProps {
  onTranscriptFinalized: (transcript: string) => void;
  isAiSpeaking: boolean;
  isProcessing: boolean;
}

export function useVoiceConversation({
  onTranscriptFinalized,
  isAiSpeaking,
  isProcessing,
}: UseVoiceConversationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestTranscriptRef = useRef("");

  // Tracks whether the user/system INTENDS for the mic to be active
  const userIntentToListenRef = useRef(false);
  const isAiSpeakingRef = useRef(isAiSpeaking);
  const isProcessingRef = useRef(isProcessing);
  const onTranscriptFinalizedRef = useRef(onTranscriptFinalized);
  useEffect(() => {
    onTranscriptFinalizedRef.current = onTranscriptFinalized;
  }, [onTranscriptFinalized]);

  // Keep refs synced with props to avoid stale closure issues in callbacks
  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  latestTranscriptRef.current = transcript;

  const stopListening = useCallback(() => {
    userIntentToListenRef.current = false;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
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

      // Reset silence timer on every new word detected
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // Finalize transcript after 1.8 seconds of continuous silence
      silenceTimerRef.current = setTimeout(() => {
        if (latestTranscriptRef.current.trim()) {
          const finalSpeech = latestTranscriptRef.current.trim();
          stopListening();
          onTranscriptFinalizedRef.current(finalSpeech);
          setTranscript("");
        }
      }, 1800);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        return; // Normal operational events
      }
      console.warn("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      // Key Fix: If Chrome prematurely killed recognition while the candidate was supposed to be speaking, restart it automatically!
      if (
        userIntentToListenRef.current &&
        !isAiSpeakingRef.current &&
        !isProcessingRef.current
      ) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      userIntentToListenRef.current = false;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Safe cleanup
        }
      }
    };
  }, [stopListening]);

  const startListening = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any leftover audio before turning on mic
    }

    userIntentToListenRef.current = true;

    if (recognitionRef.current && !isAiSpeakingRef.current && !isProcessingRef.current) {
      try {
        setTranscript("");
        recognitionRef.current.start();
      } catch (err: any) {
        // If already started, do not crash
        if (err.name !== "InvalidStateError") {
          console.error("Failed to start speech recognition:", err);
        }
      }
    }
  }, []);

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    stopListening();

    if (!("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }, [stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speakText,
  };
}