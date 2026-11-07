"use client";

export default function OpenChatButton({ children, className }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("smilecare:open-chat"))}
    >
      {children}
    </button>
  );
}
