import React from "react";

async function sendMessageToAI(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  return data.reply;
}

export default function TestAI() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Test AI</h2>

      <button
        onClick={async () => {
          const reply = await sendMessageToAI("Test thử AI");
          alert(reply);
        }}
      >
        Test AI
      </button>
    </div>
  );
}
