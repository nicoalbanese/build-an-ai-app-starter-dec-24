"use client";

import { useChat } from "@ai-sdk/react";
import Weather from "./weather";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: "weather",
    maxSteps: 5,
  });
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.parts.map((p, i) => {
            switch (p.type) {
              case "tool-invocation":
                if (
                  p.toolInvocation.toolName === "getWeather" &&
                  p.toolInvocation.state === "result"
                ) {
                  return (
                    <Weather
                      key={p.toolInvocation.toolCallId}
                      weatherData={p.toolInvocation.result}
                    />
                  );
                }
              case "text":
                return <p key={m.id + "-" + p.type + "-" + i}>{m.content}</p>;
              default:
                null;
            }
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
