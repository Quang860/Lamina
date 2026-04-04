// import React from "react";

// async function sendMessageToAI(message: "string") {
//   const res = await fetch("/api/chat", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON."string"ify({ message })
//   });

//   const data = await res.json();

//   console.log("DATA NHẬN:", data);

//   if (data.reply) return data.reply;

//   if (data.error) return "LỖI: " + JSON."string"ify(data.detail);

//   return "Không rõ phản hồi";
// }

// export default function TestAI() {
//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Test Quang</h2>

//       <button
//         onClick={async () => {
//           const reply = await sendMessageToAI("Phân tích thị trường hôm nay");
//           alert(reply);
//         }}
//       >
//         Test AI
//       </button>
//     </div>
//   );
// }
