import React, { useEffect, useMemo, useState } from "react";
import { getHistory, resetChat, sendMessage } from "./api";
import { Msg } from "./types";
import ChatLog from "./components/ChatLog";
import Composer from "./components/Composer";

export default function App() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<"@gpt" | "@claude">>(["@gpt"]);

  useEffect(() => {
    (async () => {
      try {
        const { history } = await getHistory();
        setHistory(history);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onToggleTag = (tag: "@gpt" | "@claude") => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev; // no duplicates
      return [...prev, tag];
    });
  };

  const onClearTags = () => setSelectedTags([]);

  const send = async (content: string) => {
    if (!content.trim() || selectedTags.length === 0) return;
    setSending(true);
    try {
      const resp = await sendMessage({ content, tags: selectedTags });
      // Server already appended to its own history; we can just fetch again,
      // or optimistically append replies:
      setHistory((h) => [
        ...h,
        {
          id: resp.userMessageId,
          author: "user",
          role: "user",
          content,
          ts: Date.now(),
        },
        ...resp.replies.map((r) => ({
          id: r.id,
          author: r.author,
          role: "assistant" as const,
          content: r.content,
          ts: r.ts,
        })),
      ]);
    } finally {
      setSending(false);
    }
  };

  const doReset = async () => {
    await resetChat();
    setHistory([]);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">3-Person Chat</h1>
          <button
            className="text-sm text-red-600 hover:underline"
            onClick={doReset}
            disabled={sending}
            title="Dev helper"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {loading ? (
            <div className="text-gray-500">Loading history…</div>
          ) : (
            <ChatLog history={history} />
          )}
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Composer
            sending={sending}
            selectedTags={selectedTags}
            onToggleTag={onToggleTag}
            onClearTags={onClearTags}
            onSend={send}
          />
        </div>
      </footer>
    </div>
  );
}