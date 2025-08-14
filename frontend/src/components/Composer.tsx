import React, { useState } from "react";
import TagButton from "./TagButton";

export default function Composer({
  sending,
  selectedTags,
  onToggleTag,
  onClearTags,
  onSend,
}: {
  sending: boolean;
  selectedTags: Array<"@gpt" | "@claude">;
  onToggleTag: (tag: "@gpt" | "@claude") => void;
  onClearTags: () => void;
  onSend: (content: string) => void;
}) {
  const [text, setText] = useState("");

  const canSend = text.trim().length > 0 && selectedTags.length > 0 && !sending;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TagButton
          tag="@gpt"
          active={selectedTags.includes("@gpt")}
          onClick={() => onToggleTag("@gpt")}
        />
        <TagButton
          tag="@claude"
          active={selectedTags.includes("@claude")}
          onClick={() => onToggleTag("@claude")}
        />
        <div className="text-xs text-gray-500 ml-2">
          Order: {selectedTags.length ? selectedTags.join(" → ") : "None"}
        </div>
        {selectedTags.length > 0 && (
          <button
            className="ml-auto text-xs text-gray-600 hover:underline"
            onClick={onClearTags}
            type="button"
          >
            Clear tags
          </button>
        )}
      </div>

      <textarea
        className="w-full border rounded-lg p-3 min-h-[90px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder='Type a message. Example: "Give me 3 startup ideas"'
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={sending}
      />

      <div className="flex justify-end">
        <button
          className={`px-4 py-2 rounded-lg text-white ${canSend ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!canSend}
          onClick={() => {
            if (!canSend) return;
            onSend(text);
            setText("");
          }}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}