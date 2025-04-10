export type InputMethod = 'text' | 'image'

export interface Prompt {
  task: string;
  inputMethod: InputMethod;
  code: string;
}

export const prompts: Prompt[] = [
  // {task: "Rate my fit", inputMethod: "image", code: "RFIT"},
  // {task: "Rate my music taste", inputMethod: "text", code: "RMUS"},
  // {task: "Predict my next co-op", inputMethod: "text", code: "COOP"},
  // {task: "Fortune telling", inputMethod: "image", code: "FORT"},
  {task: "Rate my fit", inputMethod: "text", code: "RMUS"},
  {task: "Rate my music taste", inputMethod: "text", code: "RMUS"},
  {task: "Predict my next co-op", inputMethod: "text", code: "RMUS"},
  {task: "Fortune telling", inputMethod: "text", code: "RMUS"},
]