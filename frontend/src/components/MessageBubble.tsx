import React from "react";
import { Msg } from "../types";

function authorStyle(author: Msg["author"]) {
  if (author === "user") return "bg-user";
  if (author === "gpt") return "bg-gpt";
  return "bg-claude";
}

function label(author: Msg["author"]) {
  if (author === "user") return "You";
  if (author === "gpt") return "GPT";
  return "Claude";
}

export default function MessageBubble({ msg }: { msg: Msg }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="shrink-0 mt-1">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-xs">
          {label(msg.author).slice(0,1)}
        </span>
      </div>
      <div className={`rounded-xl ${authorStyle(msg.author)} px-4 py-2 max-w-[80%]`}>
        <div className="text-xs text-gray-600 mb-1">{label(msg.author)}</div>
        <div className="whitespace-pre-wrap">{msg.content}</div>
      </div>
    </div>
  );
}