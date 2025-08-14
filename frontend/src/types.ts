export type Author = "user" | "gpt" | "claude";
export type Role = "user" | "assistant";

export type Msg = {
  id: string;
  author: Author;
  role: Role;
  content: string;
  ts: number;
};

export type HistoryResp = { history: Msg[] };

export type SendReq = { content: string; tags: Array<"@gpt" | "@claude"> };
export type SendResp = {
  ok: boolean;
  userMessageId: string;
  replies: Array<{ id: string; author: Author; content: string; ts: number }>;
};