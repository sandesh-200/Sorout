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
  ttsApiEndpoint = `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/tts`,
}: UseVoiceConversationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(""); 
  const [isSupported, setIsSupported] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isRecordingRef = useRef(false);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  const isAiSpeakingRef = useRef(isAiSpeaking);
  const isProcessingRef = useRef(isProcessing);
  const onTranscriptFinalizedRef = useRef(onTranscriptFinalized);

  const STT_ENDPOINT = `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/stt`;

  useEffect(() => {
    onTranscriptFinalizedRef.current = onTranscriptFinalized;
  }, [onTranscriptFinalized]);

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

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

  const cleanupRecording = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    isRecordingRef.current = false;
    setIsListening(false);
  }, []);

  const stopListening = useCallback(() => {
    cleanupRecording();
  }, [cleanupRecording]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
    }
    return () => {
      cleanupRecording();
      stopAudio();
    };
  }, [cleanupRecording, stopAudio]);

  const processAudioBlob = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      const response = await fetch(STT_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`STT API failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.transcript && data.transcript.trim() !== "") {
        onTranscriptFinalizedRef.current(data.transcript.trim());
      }
    } catch (error) {
      console.error("[Voice] Failed to process audio for STT:", error);
      setNetworkError(true);
    }
  }, [STT_ENDPOINT]);

  const startListening = useCallback(async () => {
    stopAudio();
    cleanupRecording();
    isAiSpeakingRef.current = false;
    setNetworkError(false);
    setTranscript(""); 

    if (isProcessingRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          processAudioBlob(audioBlob);
        }
      };

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.minDecibels = -60; // Silence threshold
      analyser.smoothingTimeConstant = 0.2;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let hasSpoken = false;
      let silenceStart: number | null = null;
      const SILENCE_DURATION_THRESHOLD = 1500; // 1.5 seconds of silence

      const checkSilence = () => {
        if (!isRecordingRef.current) return;

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // If the user starts speaking (volume spikes above threshold)
        if (average > 15) {
          if (!hasSpoken) {
            hasSpoken = true;
            setTranscript("Listening...");
          }
          silenceStart = null; // reset silence timer while they speak
        } else if (hasSpoken) {
          // If they have spoken, but are now quiet, start timing the silence
          if (silenceStart === null) {
            silenceStart = Date.now();
          } else if (Date.now() - silenceStart > SILENCE_DURATION_THRESHOLD) {
            // Stop recording due to silence
            cleanupRecording();
            return;
          }
        }

        requestAnimationFrame(checkSilence);
      };

      mediaRecorder.start(250); // record in chunks
      isRecordingRef.current = true;
      setIsListening(true);
      checkSilence();

    } catch (error) {
      console.error("[Voice] Failed to start media recorder:", error);
      setIsSupported(false);
    }
  }, [cleanupRecording, stopAudio, processAudioBlob]);

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
    networkError,
    startListening,
    stopListening,
    speakText,
  };
}