// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { type RootState } from "@/app/store";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Progress } from "@/components/ui/progress";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Loader2, CheckCircle2 } from "lucide-react";

// export default function InterviewWorkspace() {
//   const { sessionId } = useParams<{ sessionId: string }>();
//   const navigate = useNavigate();
//   const parsedSessionId = Number(sessionId);

//   // Grab metadata context from global store
//   const interview = useSelector((state: RootState) =>
//     state.candidate.interviews.find((i) => i.session_id === parsedSessionId)
//   );

//   // UI state management hooks
//   const [answer, setAnswer] = useState("");
//   const [secondsElapsed, setSecondsElapsed] = useState(522); // Mock initial time 08:42
//   const [currentQuestionIdx, setCurrentQuestionIdx] = useState(3);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEvaluating, setIsEvaluating] = useState(false);

//   const totalQuestions = interview?.max_questions ?? 10;
//   const progressPercentage = (currentQuestionIdx / totalQuestions) * 100;

//   // Running interval counter tracking session duration metrics
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setSecondsElapsed((prev) => prev + 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (totalSeconds: number) => {
//     const mins = Math.floor(totalSeconds / 60);
//     const secs = totalSeconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleSubmitAnswer = async () => {
//     if (currentQuestionIdx < totalQuestions) {
//       // Step to next question locally for now
//       setCurrentQuestionIdx((prev) => prev + 1);
//       setAnswer("");
//     } else {
//       // Final question lifecycle execution
//       setIsSubmitting(true);
      
//       // Stage A: Simulating submission transaction lag
//       setTimeout(() => {
//         setIsSubmitting(false);
//         setIsEvaluating(true);

//         // Stage B: Simulating remote AI model scoring evaluation window
//         setTimeout(() => {
//           navigate(`/candidate/result/${parsedSessionId}`);
//         }, 4000);
//       }, 1500);
//     }
//   };

//   // --- RENDERING STRATEGIES ---

//   // Evaluation Screen UI View Variant
//   if (isEvaluating) {
//     return (
//       <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background animate-fade-in">
//         <div className="text-center max-w-sm space-y-6">
//           <div className="flex justify-center">
//             <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-scale-in" />
//           </div>
//           <div className="space-y-2">
//             <h2 className="text-2xl font-bold tracking-tight">Interview Completed</h2>
//             <p className="text-sm text-muted-foreground">
//               Your responses are being evaluated. This may take a few seconds.
//             </p>
//           </div>
//           <div className="flex items-center justify-center pt-2">
//             <Loader2 className="h-8 w-8 text-primary animate-spin" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Submission Processing Screen UI View Variant
//   if (isSubmitting) {
//     return (
//       <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="h-10 w-10 text-primary animate-spin" />
//           <p className="text-sm font-medium text-muted-foreground">Submitting final response...</p>
//         </div>
//       </div>
//     );
//   }

//   // Default Standard Screening Application Frame
//   return (
//     <div className="flex min-h-screen w-full flex-col bg-background">
//       {/* Platform Header Navigation Bar Component Zone */}
//       <header className="flex h-16 w-full items-center border-b px-6 bg-card">
//         <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
//           <span className="font-bold tracking-tight text-lg text-primary">AI Interview Platform</span>
//           <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full">
//             {interview ? `${interview.seniority_level} ${interview.job_position}` : "Assessment"}
//           </span>
//         </div>
//       </header>

//       {/* Main Container Layout Workspace Viewport */}
//       <main className="flex-1 w-full mx-auto max-w-4xl px-4 py-8 md:py-12">
//         <div className="space-y-6">
          
//           {/* Progress Metrics Display Header Card Layer */}
//           <div className="space-y-3">
//             <div className="flex justify-between text-sm font-medium text-muted-foreground">
//               <span>Question {currentQuestionIdx} of {totalQuestions}</span>
//               <span className="tabular-nums">Time Elapsed: {formatTime(secondsElapsed)}</span>
//             </div>
//             <Progress value={progressPercentage} className="h-2 w-full" />
//           </div>

//           {/* Question Text Prompt Interactive Presentation Panel Component */}
//           <Card className="border-muted shadow-sm bg-card">
//             <CardHeader className="pb-3">
//               <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//                 Technical Context
//               </span>
//             </CardHeader>
//             <CardContent>
//               <p className="text-xl font-medium tracking-tight text-foreground leading-relaxed">
//                 Explain the difference between dependency injection and inversion of control.
//               </p>
//             </CardContent>
//           </Card>

//           {/* Text Input Management Area Sub-system Component Block */}
//           <div className="space-y-3">
//             <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
//               Your Answer
//             </label>
//             <Textarea
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               placeholder="Type your structured engineering response details here..."
//               className="min-h-60 text-base resize-none focus-visible:ring-1 border-muted bg-card shadow-sm p-4"
//             />
//             <div className="flex justify-between items-center pt-1">
//               <span className="text-xs text-muted-foreground font-medium">
//                 Characters: {answer.length}
//               </span>
//               <Button 
//                 onClick={handleSubmitAnswer} 
//                 disabled={answer.trim().length === 0}
//                 className="px-6 font-semibold shadow-sm"
//               >
//                 {currentQuestionIdx === totalQuestions ? "Finish Interview" : "Submit Answer"}
//               </Button>
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { getCurrentQuestion, submitAnswer } from "@/features/interviewSession/interviewSessionThunk";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function InterviewWorkspace() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const parsedSessionId = Number(sessionId);

  // 1. Grab states from both candidate and interviewSession state slices
  const interviewMeta = useSelector((state: RootState) =>
    state.candidate.interviews.find((i) => i.session_id === parsedSessionId)
  );
  
  const { currentQuestion, loading, submitting, error } = useSelector(
    (state: RootState) => state.interviewSession
  );

  // 2. Local UI Interaction State Hooks
  const [answer, setAnswer] = useState("");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // 3. Kick off real-time timer metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Load the active question state context immediately on component mount
  useEffect(() => {
    if (parsedSessionId) {
      dispatch(getCurrentQuestion(parsedSessionId));
    }
    
    // Cleanup workspace state when hitting back or escaping page
    return () => {
      dispatch({ type: "interviewSession/clearSession" });
    };
  }, [parsedSessionId, dispatch]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 5. Submit Handler coordinating API request dispatching logic
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !parsedSessionId) return;

    try {
      const response = await dispatch(
        submitAnswer({
          sessionId: parsedSessionId,
          data: {
            question_id: currentQuestion.question_id,
            answer_text: answer.trim(),
          },
        })
      ).unwrap();

      // Wipe current response viewport buffer clean for next prompt structure load
      setAnswer("");

      // If backend returns completed status flag, loop down evaluating page trigger hooks
      if (response.completed) {
        setIsEvaluating(true);
        // Stage a small viewing window for candidate summary before kicking back to metrics dashboard
        setTimeout(() => {
          navigate(`/candidate/result/${parsedSessionId}`);
        }, 4000);
      }
    } catch (err) {
      console.error("Failed to submit response structure:", err);
    }
  };

  // Safe layout fallbacks mapping numbers
  const currentQuestionIdx = currentQuestion?.order ?? 1;
  const totalQuestions = currentQuestion?.total_questions ?? interviewMeta?.max_questions ?? 10;
  const progressPercentage = (currentQuestionIdx / totalQuestions) * 100;

  // --- RENDERING STRATEGIES ---

  // Evaluation Screen UI View Variant
  if (isEvaluating) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background animate-fade-in">
        <div className="text-center max-w-sm space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-scale-in" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Interview Completed</h2>
            <p className="text-sm text-muted-foreground">
              Your responses are being evaluated. This may take a few seconds.
            </p>
          </div>
          <div className="flex items-center justify-center pt-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Submission Processing Screen UI View Variant
  if (submitting) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm font-medium text-muted-foreground">Submitting response...</p>
        </div>
      </div>
    );
  }

  // Main initial application loading context layout
  if (loading && !currentQuestion) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground mt-2">Loading next question context...</p>
      </div>
    );
  }

  // Error boundary view handling server fallback messaging exceptions
  if (error && !currentQuestion) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
        <div className="text-center max-w-sm space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-bold">Failed to load question context</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => dispatch(getCurrentQuestion(parsedSessionId))} className="w-full">
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Platform Header Navigation Bar Component Zone */}
      <header className="flex h-16 w-full items-center border-b px-6 bg-card">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <span className="font-bold tracking-tight text-lg text-primary">AI Interview Platform</span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full">
            {interviewMeta ? `${interviewMeta.seniority_level} ${interviewMeta.job_position}` : "Assessment"}
          </span>
        </div>
      </header>

      {/* Main Container Layout Workspace Viewport */}
      <main className="flex-1 w-full mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="space-y-6">
          
          {/* Progress Metrics Display Header Card Layer */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>Question {currentQuestionIdx} of {totalQuestions}</span>
              <span className="tabular-nums">Time Elapsed: {formatTime(secondsElapsed)}</span>
            </div>
            <Progress value={progressPercentage} className="h-2 w-full" />
          </div>

          {/* Question Text Prompt Interactive Presentation Panel Component */}
          <Card className="border-muted shadow-sm bg-card">
            <CardHeader className="pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {currentQuestion?.category ?? "Technical"}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-medium tracking-tight text-foreground leading-relaxed">
                {currentQuestion?.question_text ?? "No question text provided."}
              </p>
            </CardContent>
          </Card>

          {/* Text Input Management Area Sub-system Component Block */}
          <div className="space-y-3">
            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Your Answer
            </label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your structured engineering response details here..."
              className="min-h-60 text-base resize-none focus-visible:ring-1 border-muted bg-card shadow-sm p-4"
              disabled={submitting}
            />
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-muted-foreground font-medium">
                Characters: {answer.length}
              </span>
              <Button 
                onClick={handleSubmitAnswer} 
                disabled={answer.trim().length === 0 || submitting}
                className="px-6 font-semibold shadow-sm"
              >
                {currentQuestionIdx === totalQuestions ? "Finish Interview" : "Submit Answer"}
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}