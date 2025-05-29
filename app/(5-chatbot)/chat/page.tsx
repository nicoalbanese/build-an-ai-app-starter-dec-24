"use client";

import { useChat } from "@ai-sdk/react";
import Weather from "./weather";
import { defaultChatStoreOptions } from "ai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    chatId: "weather",
    chatStore: defaultChatStoreOptions({
      api: "/api/chat",
      chats: { weather: { messages: [] } },
    }),
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
                      append={(message: string) =>
                        append({
                          role: "user",
                          parts: [{ type: "text", text: message }],
                        })
                      }
                      key={p.toolInvocation.toolCallId}
                      weatherData={p.toolInvocation.result}
                    />
                  );
                } else return null;
              case "text":
                return <p key={m.id + "-" + p.type + "-" + i}>{p.text}</p>;
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
