import React from "react";
import { Msg } from "../types";
import MessageBubble from "./MessageBubble";

export default function ChatLog({ history }: { history: Msg[] }) {
  return (
    <div className="space-y-3">
      {history.map((m) => (
        <MessageBubble key={m.id} msg={m} />
      ))}
    </div>
  );
}