"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is ChatterBot! How can I help you today?",
    },
  ]);

  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const callGetResponse = async () => {
    setIsLoading(true);
    let temp = messages;
    temp.push({ role: "user", content: theInput });
    setTheInput("");
    console.log("Calling OpenAI...");

    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.content);

    setMessages((prevMessages) => [...prevMessages, output]);
    setIsLoading(false);

    // scrollToRef.current.scrollIntoView()
  };
  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      callGetResponse();
    }
  };
  return (
    <main className="flex flex-col min-h-screen items-center justify-between px-6 py-5 lg:px-24">
  <h1 className="text-5xl font-sans">ChatterBot</h1>

  <div className="flex h-auto lg:h-[35rem] w-full lg:w-[40rem] flex-col items-center bg-gray-600 rounded-xl shadow-xl">
    <div className="flex flex-col gap-2 overflow-y-auto p-8 w-full">
      {messages.map((message) => (
        <div // Assuming each message has a unique 'id'
          className={`max-w-xs lg:max-w-md px-4 py-3 my-1 rounded-md ${
            message.role === "assistant"
              ? "self-start bg-gray-200 text-gray-800"
              : "self-end bg-blue-500 text-white"
          }`}
        >
          {message.content}
        </div>
      ))}

      {isLoading && (
        <div className="self-start bg-gray-200 text-gray-800 max-w-xs lg:max-w-md rounded-md px-4 py-3 my-1">
          *loading*
        </div>
      )}
    </div>
    <div className="flex w-full lg:w-5/6 justify-between space-x-3 px-4 lg:px-0 absolute bottom-4">
      <textarea
        value={theInput}
        onChange={(event) => setTheInput(event.target.value)}
        className="flex-1 h-10 px-3 py-2 text-black bg-gray-300 rounded-md overflow-y-auto resize-none"
        onKeyDown={Submit}
        placeholder="Type your message here..."
      />
      <button
        onClick={callGetResponse}
        className="w-1/4 lg:w-1/6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition-colors duration-200"
      >
        Send
      </button>
    </div>
  </div>

  <div></div>
</main>

  );
}
