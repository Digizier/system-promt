export interface PromptHeader {
  id: number;
  label: string;
  required: boolean;
  selected: boolean;
  requiresInput?: boolean;
  inputValue?: string; // For things like Output Parser details
}

export interface FormData {
  // Step 1
  buildIntent: string;
  workflowJson: string;
  model: string;
  characterCount: string;
  tools: string;
  expectedInput: string;
  expectedOutput: string;

  // Step 2
  aiQuestions: string[];
  userAnswers: Record<number, string>;

  // Step 3
  selectedHeaders: PromptHeader[];
  
  // Step 4 (AI Plan)
  aiPlan: string[];
}

export enum AppStep {
  INITIAL_DETAILS = 1,
  AI_QUESTIONS = 2,
  HEADER_SELECTION = 3,
  CONFIRMATION = 4,
  RESULT = 5
}

export const INITIAL_HEADERS: PromptHeader[] = [
  { id: 1, label: "Role / Identity", required: true, selected: true },
  { id: 2, label: "Objective", required: true, selected: true },
  { id: 3, label: "Scope of Work", required: false, selected: false },
  { id: 4, label: "Context Awareness", required: false, selected: false },
  { id: 5, label: "Decision Logic", required: false, selected: false },
  { id: 6, label: "Data Sources", required: false, selected: false },
  { id: 7, label: "Tool Usage Instructions", required: true, selected: true },
  { id: 8, label: "Rules & Constraints", required: true, selected: true },
  { id: 9, label: "Input Understanding", required: true, selected: true },
  { id: 10, label: "Language Handling", required: false, selected: false },
  { id: 11, label: "Time & Date Handling", required: true, selected: true },
  { id: 12, label: "Data Validation", required: false, selected: false },
  { id: 13, label: "Response Style & Tone", required: false, selected: false },
  { id: 14, label: "Output Format", required: true, selected: true },
  { id: 15, label: "Error Handling", required: false, selected: false },
  { id: 16, label: "Fallback Behavior", required: false, selected: false },
  { id: 17, label: "Escalation Rules", required: false, selected: false },
  { id: 18, label: "Performance Optimization", required: false, selected: false },
  { id: 19, label: "Security & Privacy", required: false, selected: false },
  { id: 20, label: "Prohibited Content", required: false, selected: false },
  { id: 21, label: "Confidence Calibration", required: false, selected: false },
  { id: 22, label: "Examples", required: false, selected: false },
  { id: 23, label: "Output Structure Parser", required: false, selected: false, requiresInput: true, inputValue: "" },
];