import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";

import {
  startConversation,
  sendMessage,
  evaluateInterview,
} from "@/features/conversationInterview/conversationInterviewThunk";
import {
  addCandidateMessage,
  setSessionId,
} from "@/features/conversationInterview/conversationInterviewSlice";
import { useVoiceConversation } from "@/hooks/useVoiceConversation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, Loader2, CheckCircle2 } from "lucide-react";

export default function ConversationalWorkspace() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const numericSessionId = Number(sessionId);
  const dispatch = useDispatch<AppDispatch>();
  const initializedRef = useRef(false);
  const handleTranscriptFinalizedRef = useRef<(text: string) => void>(() => { });

  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { messages, completed, loading, sendingMessage, evaluating, evaluation, error } =
    useSelector((state: RootState) => state.conversationInterview);

  const { isListening, transcript, isSupported, startListening, stopListening, speakText } =
    useVoiceConversation({
      onTranscriptFinalized: useCallback((text: string) => {
        handleTranscriptFinalizedRef.current(text);
      }, []),
      isAiSpeaking,
      isProcessing: sendingMessage,
    });

  // Auto-scroll chat window to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler triggered when silence is detected
  useEffect(() => {
    handleTranscriptFinalizedRef.current = async (text: string) => {
      if (!text || sendingMessage || completed) return;
      dispatch(addCandidateMessage(text));
      const resultAction = await dispatch(sendMessage({ sessionId: numericSessionId, message: text }));
      if (sendMessage.fulfilled.match(resultAction)) {
        const aiReply = resultAction.payload.message.content;
        setIsAiSpeaking(true);
        speakText(aiReply, () => {
          setIsAiSpeaking(false);
          if (!resultAction.payload.completed) startListening();
        });
      }
    };
  }, [speakText, startListening, sendingMessage, completed, dispatch, numericSessionId]);



  // Start the session on initial load
  useEffect(() => {
    if (numericSessionId && !initializedRef.current) {
      initializedRef.current = true;
      dispatch(setSessionId(numericSessionId));
      dispatch(startConversation(numericSessionId)).then((resultAction) => {
        if (startConversation.fulfilled.match(resultAction)) {
          const firstMessage = resultAction.payload.content;
          setIsAiSpeaking(true);
          speakText(firstMessage, () => {
            setIsAiSpeaking(false);
            startListening();
          });
        }
      });
    }
  }, [numericSessionId, dispatch, speakText, startListening]);

  // Evaluate when the interview ends
  const handleCompleteInterview = () => {
    if (numericSessionId) {
      dispatch(evaluateInterview(numericSessionId));
    }
  };

  if (!isSupported) {
    return (
      <div className="p-6 text-center text-red-500">
        Your browser does not support Web Speech API. Please use Google Chrome or Microsoft Edge.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card className="flex flex-col h-[75vh]">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">AI Conversational Interview</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Session #{numericSessionId}</p>
          </div>
          <Badge variant={completed ? "destructive" : "default"}>
            {completed ? "Completed" : "In Progress"}
          </Badge>
        </CardHeader>

        {/* Message Stream */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Starting interview session...
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.role === "candidate" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === "candidate"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
                  }`}
              >
                <div className="font-semibold text-xs mb-1 opacity-70">
                  {msg.role === "candidate" ? "You" : "Interviewer AI"}
                </div>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Real-time speech transcript preview */}
          {isListening && transcript && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg p-3 text-sm bg-primary/40 text-primary-foreground italic animate-pulse">
                {transcript} ...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Audio Control Footer */}
        <CardFooter className="border-t p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            {/* Status indicator */}
            <div className="flex items-center gap-2 text-sm font-medium">
              {isAiSpeaking && (
                <span className="flex items-center gap-1.5 text-blue-600 animate-pulse">
                  <Volume2 className="h-4 w-4" /> AI is speaking...
                </span>
              )}
              {sendingMessage && (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing answer...
                </span>
              )}
              {isListening && (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Listening... Speak now
                </span>
              )}
              {!isListening && !isAiSpeaking && !sendingMessage && !completed && (
                <span className="text-muted-foreground">Paused</span>
              )}
            </div>

            {/* Mic toggle */}
            {!completed && (
              <Button
                variant={isListening ? "destructive" : "default"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                disabled={isAiSpeaking || sendingMessage}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" /> Stop Mic
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" /> Start Mic
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Completion state / Evaluation trigger */}
          {completed && (
            <div className="w-full pt-2">
              {!evaluation ? (
                <Button
                  className="w-full"
                  onClick={handleCompleteInterview}
                  disabled={evaluating}
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Evaluating Session...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Finish & View Evaluation
                    </>
                  )}
                </Button>
              ) : (
                <div className="p-4 bg-muted rounded-md space-y-2">
                  <h4 className="font-semibold text-md">
                    Overall Score: {evaluation.overall_score}/100
                  </h4>
                  <p className="text-sm">{evaluation.overall_feedback}</p>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}