import { useEffect, useState } from "react";
import { ChatMessage, ChatSession } from "../types";
import { generateUUID } from "../utils";




export function getRolePrompt(tools: string) {
  const rolePrompt = `I want you to act as an expert in the field of AI, Neuroscience, Machine Learning, and ethics. You will be used on a website called SynapMe where users can make posts and ask questions about these fields. You will help guide users to learn about concepts in these fields and answer questions they have.
`
  return rolePrompt;
}

const introductionMessage = `Hi, I'm Gilbert. I'm a chatbot that will help you learn about AI, Neuroscience, Machine Learning, and ethics. I'll be your guide for SynapMe. Let me know if you have any questions.
`


export const useChatSession = () => {
  const [chatSession, setChatSession] = useState<ChatSession>({
    messages: [
      {
        text: getRolePrompt("React, Next.js, TypeScript, TailwindCSS"),
        role: "system",
        timestamp: new Date().toISOString(),
        choices: [],
        visible: "API"
      },
      {
        text: introductionMessage,
        role: "assistant",
        timestamp: new Date().toISOString(),
        choices: [],
        visible: "BOTH"

      }
    ],
    createdAt: new Date().toISOString(),
    id: generateUUID(),
  });

  useEffect(() => {
    console.log('chatSession', chatSession)
  }, [chatSession]);

  return [chatSession, setChatSession]
}