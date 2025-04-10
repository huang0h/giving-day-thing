export type InputMethod = 'text' | 'image' | 'combo';

export interface Prompt {
  task: string;
  inputMethod: InputMethod;
  code: string;
}

export const prompts: Prompt[] = [
  {task: "Rate my fit", inputMethod: "image", code: "RFIT"},
  {task: "Rate my music taste", inputMethod: "text", code: "RMUS"},
  {task: "Predict my next co-op", inputMethod: "image", code: "COOP"},
  {task: "Fortune telling", inputMethod: "combo", code: "FORT"},
  {task: "Guess campus celebrity", inputMethod: 'combo', code: "CELB"}
]

export const fakeCoops = [
  "executive assistant to paws",
  "lakers coach",
  "cto of google",
  "oompa loompa at the willy wonka's chocolate factory",
  "cto of willy wonka's chocolate factory",
  "elmo's personal head chef",
  "owner of cat and dog sanctuary",
  "asmr tiktok influencer",
  "executive assistant to auon",
  "ai personal trainer",
  "just put the fries in the bag bro",
  "chief meme consultant",
  "certified napper",
  "energy drink tester",
  "squid game coach for beginners",
  "tiktok drama instigator",
  "head of meme distribution",
  "matcha barista",
  "twitch streamer",
  "tiktok live influencer",
];

export const fakeCelebs = [
  "prez aoun",
  "paws",
  "adrizzy",
  "dylan mitchell (centennial cyclist)",
  "the golden husky in ell hall",
];
