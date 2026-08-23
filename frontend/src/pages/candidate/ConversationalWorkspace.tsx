import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { motion, AnimatePresence } from "framer-motion";

import {
  startConversation,
  sendMessage,
} from "@/features/conversationInterview/conversationInterviewThunk";

import { evaluateInterview } from '@/features/evaluation/evaluationThunk'
import {
  addCandidateMessage,
  setSessionId,
} from "@/features/conversationInterview/conversationInterviewSlice";
import { useVoiceConversation } from "@/hooks/useVoiceConversation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  MicOff,
  Volume2,
  Loader2,
  CheckCircle2,
  Bot,
  User,
  Send,
  AlertCircle,
  Award,
} from "lucide-react";

export default function ConversationalWorkspace() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const numericSessionId = Number(sessionId);
  const dispatch = useDispatch<AppDispatch>();

  const initializedRef = useRef(false);
  const handleTranscriptFinalizedRef = useRef<(text: string) => void>(() => {});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [streamingAiText, setStreamingAiText] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);

  const { messages, completed, loading, sendingMessage } =
    useSelector((state: RootState) => state.conversationInterview);

  const { loading: evaluating, evaluation } = useSelector((state: RootState) => state.evaluation);

  const { isListening, transcript, isSupported, startListening, stopListening, speakText } =
    useVoiceConversation({
      onTranscriptFinalized: useCallback((text: string) => {
        handleTranscriptFinalizedRef.current(text);
      }, []),
      isAiSpeaking,
      isProcessing: sendingMessage,
      ttsApiEndpoint: "http://localhost:8000/api/tts",
    });

  // Smooth scroll anchor function (prevents jitter during audio streaming or state changes)
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Trigger scroll on message count shifts, listening changes, or AI active states
  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages.length, isListening, isAiSpeaking, sendingMessage, scrollToBottom]);

  // Handler triggered when candidate silence is detected or manual answer is submitted
  const processCandidateAnswer = useCallback(
    async (text: string) => {
      const cleanText = text.trim();
      if (!cleanText || sendingMessage || completed) return;

      dispatch(addCandidateMessage(cleanText));
      setManualInput("");

      const resultAction = await dispatch(
        sendMessage({ sessionId: numericSessionId, message: cleanText })
      );

      if (sendMessage.fulfilled.match(resultAction)) {
        const fullReply = resultAction.payload.message.content;
        setIsAiSpeaking(true);
        setStreamingAiText("");

        await speakText(
          fullReply,
          () => {
            setIsAiSpeaking(false);
            setStreamingAiText(null);

            if (!resultAction.payload.completed) {
              startListening();
            }
          },
          (progressFraction) => {
            const charsToShow = Math.max(1, Math.floor(progressFraction * fullReply.length));
            setStreamingAiText(fullReply.slice(0, charsToShow));
          }
        );
      }
    },
    [sendingMessage, completed, dispatch, numericSessionId, speakText, startListening]
  );

  useEffect(() => {
    handleTranscriptFinalizedRef.current = processCandidateAnswer;
  }, [processCandidateAnswer]);

  // Start initial interview session on page mount
  useEffect(() => {
    if (numericSessionId && !initializedRef.current) {
      initializedRef.current = true;
      dispatch(setSessionId(numericSessionId));

      dispatch(startConversation(numericSessionId)).then(async (resultAction) => {
        if (startConversation.fulfilled.match(resultAction)) {
          const firstMessage = resultAction.payload.content;
          setIsAiSpeaking(true);
          setStreamingAiText("");

          await speakText(
            firstMessage,
            () => {
              setIsAiSpeaking(false);
              setStreamingAiText(null);
              startListening();
            },
            (progressFraction) => {
              const charsToShow = Math.max(1, Math.floor(progressFraction * firstMessage.length));
              setStreamingAiText(firstMessage.slice(0, charsToShow));
            }
          );
        }
      });
    }
  }, [numericSessionId, dispatch, speakText, startListening]);

  const handleCompleteInterview = () => {
    if (numericSessionId) {
      dispatch(evaluateInterview(numericSessionId));
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      processCandidateAnswer(manualInput);
    }
  };

  if (!isSupported) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Speech Recognition Unsupported</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Your browser does not support Web Speech APIs. Please switch to Google Chrome or Microsoft Edge to continue your interview session.
        </p>
      </div>
    );
  }

  // Hide the last Redux AI message while active voice streaming is typing it out
  const displayedHistoryMessages = isAiSpeaking ? messages.slice(0, -1) : messages;

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden antialiased selection:bg-primary/20">
      {/* Workspace Context Header */}
      <header className="h-16 border-b border-border/60 px-6 flex items-center justify-between bg-card/40 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight">Technical Interview Workspace</h1>
              <span className="text-xs text-muted-foreground font-mono">#{numericSessionId}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Sorout AI Assessment Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={completed ? "secondary" : "outline"}
            className="px-3 py-1 font-medium text-xs rounded-full flex items-center gap-1.5 border-border/80"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                completed ? "bg-muted-foreground" : "bg-emerald-500 animate-pulse"
              }`}
            />
            {completed ? "Session Completed" : "Live Session"}
          </Badge>
        </div>
      </header>

      {/* Main Conversation Canvas */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 max-w-4xl mx-auto w-full scroll-smooth"
      >
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm">Initializing interview environment...</p>
          </div>
        )}

        {/* Historical Conversation Stream */}
        {displayedHistoryMessages.map((msg, index) => {
          const isUser = msg.role === "candidate";
          return (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-sm border ${
                  isUser
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
              </div>

              <div className={`space-y-1.5 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className={`text-[11px] font-medium tracking-wide uppercase px-1 ${
                    isUser ? "text-right text-muted-foreground" : "text-muted-foreground"
                  }`}
                >
                  {isUser ? "Candidate Answer" : "Interviewer Question"}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-xs shadow-sm"
                      : "bg-card text-card-foreground border border-border/80 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Natural AI Interviewer "Thinking..." State */}
        {sendingMessage && !isAiSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
            aria-label="Interviewer is thinking"
            className="flex items-start gap-3.5 flex-row"
          >
            <div className="h-8 w-8 rounded-full bg-card text-foreground border border-border flex items-center justify-center shrink-0 text-xs shadow-xs">
              <Bot className="h-4 w-4 text-primary/70" />
            </div>

            <div className="space-y-1.5 max-w-[82%]">
              <div className="text-[11px] font-medium tracking-wide uppercase px-1 text-muted-foreground">
                Interviewer
              </div>

              <div className="rounded-2xl rounded-tl-xs px-4 py-3 text-sm bg-card text-muted-foreground border border-border/80 shadow-xs flex items-center gap-2">
                <span className="text-xs font-normal select-none">Thinking...</span>
                <span className="flex items-center gap-1 pl-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-[pulse_1.4s_infinite_0ms] motion-reduce:animate-none" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-[pulse_1.4s_infinite_300ms] motion-reduce:animate-none" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-[pulse_1.4s_infinite_600ms] motion-reduce:animate-none" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active AI Speaking Reveal Container */}
        {isAiSpeaking && streamingAiText !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3.5 flex-row"
          >
            <div className="h-8 w-8 rounded-full bg-card border border-primary/30 flex items-center justify-center shrink-0 text-xs shadow-xs text-primary">
              <Bot className="h-4 w-4 animate-pulse" />
            </div>

            <div className="space-y-1.5 max-w-[82%]">
              <div className="text-[11px] font-medium tracking-wide text-primary flex items-center gap-1.5 px-1">
                <Volume2 className="h-3 w-3 animate-bounce" />
                Interviewer Speaking...
              </div>

              <div className="rounded-2xl rounded-tl-xs px-4 py-3 text-sm leading-relaxed bg-card border border-primary/20 text-card-foreground shadow-sm">
                <p className="whitespace-pre-wrap inline">{streamingAiText}</p>
                <span className="inline-block w-1.5 h-4 ml-1 bg-primary/80 animate-pulse align-middle rounded-full" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Candidate Active Voice Preview */}
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3.5 flex-row-reverse"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
              <User className="h-4 w-4" />
            </div>

            <div className="space-y-1.5 max-w-[82%] text-right">
              <div className="text-[11px] font-medium tracking-wide text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1 px-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Candidate Speech
              </div>

              <div className="rounded-2xl rounded-tr-xs px-4 py-3 text-sm leading-relaxed bg-emerald-500/10 border border-emerald-500/30 text-foreground italic shadow-xs">
                {transcript}
                <span className="inline-block w-1 h-3.5 ml-1 bg-emerald-500 animate-pulse align-middle" />
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Primary Interaction Control Panel */}
      <footer className="border-t border-border/60 bg-card/40 backdrop-blur-md p-4 md:px-8 shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Status Bar & Mic Controls */}
          {!completed && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium">
                {isListening ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Listening for response...
                  </span>
                ) : isAiSpeaking ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <Volume2 className="h-3.5 w-3.5 animate-bounce" />
                    AI Interviewer speaking
                  </span>
                ) : sendingMessage ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-pulse" />
                    Interviewer considering response
                  </span>
                ) : (
                  <span className="text-muted-foreground">Microphone inactive</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setShowTextInput((prev) => !prev)}
                >
                  {showTextInput ? "Hide Text Fallback" : "Type Answer Instead"}
                </Button>

                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="default"
                  className="rounded-full px-6 shadow-sm transition-all font-medium"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isAiSpeaking || sendingMessage || loading}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" /> Stop Microphone
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" /> Answer with Voice
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Optional Text Input Fallback Form */}
          <AnimatePresence>
            {showTextInput && !completed && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleManualSubmit}
                className="pt-2"
              >
                <div className="flex items-end gap-2">
                  <Textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Type your structured answer here..."
                    className="min-h-17.5 max-h-35 resize-none text-sm bg-background/80"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleManualSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    disabled={!manualInput.trim() || sendingMessage || isAiSpeaking}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Interview Evaluation Summary Panel */}
          {completed && (
            <div className="pt-2">
              {!evaluation ? (
                <Button
                  className="w-full py-6 rounded-xl font-semibold text-sm shadow-sm"
                  onClick={handleCompleteInterview}
                  disabled={evaluating}
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Evaluating Session Performance...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Finalize Session & Generate Evaluation
                    </>
                  )}
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-card border border-border rounded-xl space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-sm">Evaluation Report</h4>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5">
                      Score: {evaluation.overall_score} / 100
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {evaluation.overall_feedback}
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}