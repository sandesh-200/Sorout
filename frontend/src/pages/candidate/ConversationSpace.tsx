import { useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { motion, AnimatePresence } from "framer-motion";

import { evaluateInterview } from "@/features/evaluation/evaluationThunk";
import { useConversationalSession } from "@/hooks/useConversationalSession";

import { Loader2, User } from "lucide-react";
import { InterviewerAvatar } from "@/components/interviewConversation/InterviewerAvatar";
import { InterviewerStatusHeader } from "@/components/interviewConversation/InterviewStatusHeader";
import { ConversationBubble } from "@/components/interviewConversation/ConversationBubble";
import { StreamingAiBubble } from "@/components/interviewConversation/StreamingAiBubble";
import { ResponseInputBar } from "@/components/interviewConversation/ResponseInputBar";
import { BrowserCompatibilityGate } from "@/components/interviewConversation/BrowserCompatibilityGate";

export default function ConversationalSpace() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const numericSessionId = Number(sessionId);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { status, evaluation } = useSelector((state: RootState) => state.evaluation);
  const evaluating = status === "loading" || status === "evaluating";

  const {
    voice,
    messages,
    completed,
    loading,
    sendingMessage,
    isAiSpeaking,
    streamingAiText,
    processCandidateAnswer,
  } = useConversationalSession(numericSessionId);

  const { isListening, transcript, isSupported, startListening, stopListening } = voice;

  // Jitter-free auto-scroll anchor
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isListening, isAiSpeaking, sendingMessage, scrollToBottom]);

  const handleCompleteInterview = async () => {
    if (!numericSessionId) return;
    const resultAction = await dispatch(evaluateInterview(numericSessionId));
    if (evaluateInterview.fulfilled.match(resultAction)) {
      navigate(`/candidate/result/${numericSessionId}`);
    }
  };

  if (!isSupported) return <BrowserCompatibilityGate />;

  const displayedHistoryMessages = isAiSpeaking ? messages.slice(0, -1) : messages;

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden antialiased selection:bg-primary/20">
      {/* Sticky Top Interview Header */}
      <InterviewerStatusHeader
        sessionId={numericSessionId}
        completed={completed}
        isSpeaking={isAiSpeaking}
        isThinking={sendingMessage}
      />

      {/* Main Container - Full viewport background continuity */}
      <main
        ref={scrollViewportRef}
        className="flex-1 overflow-y-auto w-full scrollbar-gutter-stable scroll-smooth"
        role="region"
        aria-label="Interview Conversation Stream"
      >
        {/* Centered Content Column */}
        <div className="max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-28">
          {/* Initial Loader State */}
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm font-medium">Initializing interview session...</p>
            </div>
          )}

          {/* Conversation History */}
          <div className="space-y-5">
            {displayedHistoryMessages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                layout="position"
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ConversationBubble
                  role={msg.role === "ai" ? "interviewer" : msg.role}
                  content={msg.content}
                />
              </motion.div>
            ))}
          </div>

          {/* Dynamic States */}
          <AnimatePresence mode="popLayout">
            {sendingMessage && !isAiSpeaking && (
              <motion.div
                key="thinking-state"
                layout="position"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-start gap-3 flex-row"
                role="status"
                aria-label="Sabrina is thinking"
              >
                <InterviewerAvatar size="sm" thinking />
                <div className="flex flex-col items-start space-y-1.5 max-w-[85%] sm:max-w-[75%]">
                  <div className="px-4 py-2.5 text-sm bg-muted/50 text-muted-foreground border border-border/60 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2">
                    <span className="text-xs font-medium">Thinking</span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {isAiSpeaking && streamingAiText !== null && (
              <motion.div
                key="streaming-state"
                layout="position"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <StreamingAiBubble text={streamingAiText} />
              </motion.div>
            )}

            {isListening && transcript && (
              <motion.div
                key="listening-state"
                layout="position"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-start gap-3 flex-row-reverse"
                role="status"
                aria-label="Live voice transcript"
              >
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs shadow-2xs">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-end space-y-1 max-w-[85%] sm:max-w-[75%]">
                  <div className="px-4 py-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap bg-primary/10 border border-primary/20 text-foreground rounded-2xl rounded-tr-xs shadow-2xs">
                    <span>{transcript}</span>
                    <span
                      className="inline-block w-1.5 h-3.5 ml-1 bg-primary animate-pulse align-baseline rounded-xs"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Invisible Scroll Anchor */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </main>

      {/* 
        ChatGPT-style Input Wrapper:
        - Completely transparent background
        - Smooth top fade gradient so text softly disappears when scrolling under
        - Centered pill input matching ChatGPT's design
      */}
      <div className="relative w-full bg-transparent">
        {/* Soft gradient mask overlay above composer */}
        <div className="pointer-events-none absolute -top-12 left-0 right-0 h-12 bg-linear-to-t from-background to-transparent" />
        
        <div className="max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <ResponseInputBar
            completed={completed}
            isListening={isListening}
            isAiSpeaking={isAiSpeaking}
            sendingMessage={sendingMessage}
            loading={loading}
            evaluating={evaluating}
            evaluation={evaluation}
            onStartListening={startListening}
            onStopListening={stopListening}
            onSubmitAnswer={processCandidateAnswer}
            onCompleteInterview={handleCompleteInterview}
          />
        </div>
      </div>
    </div>
  );
}