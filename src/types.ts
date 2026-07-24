export interface TutorialChapter {
  id: string;
  title: string;
  category: "basics" | "circuits" | "standards" | "safety";
  summary: string;
  content: string;
  duration: string; // e.g. "۱۰ دقیقه"
  difficulty: "مقدماتی" | "متوسط" | "پیشرفته";
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CircuitState {
  switch1: boolean;
  switch2: boolean;
  switch3?: boolean;
}
