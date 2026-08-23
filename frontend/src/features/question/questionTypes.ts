export interface InterviewQuestion {
  id: number;
  question_text: string;
  category: "Technical" | "Behavioral" | "Situational";
  order_sequence: number;
}

export interface QuestionState {
  questions: InterviewQuestion[];
  generatingId: number | null;
  loading: boolean;
  error: string | null;
}