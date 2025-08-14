export type Author = "user" | "gpt" | "claude";
export type Role = "user" | "assistant";

export interface Msg {
  id: string;
  author: Author;
  role: Role;
  content: string;
  ts: number;
}

export interface SendRequest {
  content: string;
  tags: Array<"@gpt" | "@claude">;
}

export interface SendResponse {
  ok: boolean;
  userMessageId: string;
  replies: Array<{
    id: string;
    author: Author;
    content: string;
    ts: number;
  }>;
}

export interface HistoryResponse {
  history: Msg[];
}