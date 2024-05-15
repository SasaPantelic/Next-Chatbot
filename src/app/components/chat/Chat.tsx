"use client"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
// import ElementBase from "@synesthesia/shared-cms/dist/tsc/element/ElementBase"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { useRerender } from "../../hooks/useRerender"
import { useChatSession } from "../../hooks/useChatSession"
import ChatMessageText from "./ChatMessage"

type Props = {}

import create, { StoreApi, UseBoundStore } from "zustand"
import { getMessageCodeText } from "./chatFunctions"
import { ChatMessage, ChatSession } from "../../../types"
import { useSession } from "next-auth/react"

export interface ChatStore {
}
export const useChatStore: UseBoundStore<StoreApi<ChatStore>> = create<ChatStore>(
  (set: StoreApi<ChatStore>["setState"], get: StoreApi<ChatStore>["getState"]) => ({
  })
)



const Chat = ({}: Props) => {
  const [chatSession, setChatSession] = useChatSession() as [ChatSession, Dispatch<SetStateAction<ChatSession>>]
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const rerender = useRerender()
  let [userMessage, setUserMessage] = useState("")
  const [loader, setLoader] = useState(false)
  const setMessages = (messages: ChatMessage[]) => {
    setChatSession({ ...chatSession, messages: messages })
  }
  const [chatInitalized, setChatInitalized] = useState(false)
  const messages = chatSession?.messages.filter((message) => message.visible == "USER" || message.visible == "BOTH") ?? []
  async function submitMessage(e: any, choice?: string) {
    console.log("submitMessage", e)
    // return
    e && e?.preventDefault()
    scrollToBottom()
    const time = new Date().toISOString()
    // if choice passed in then set it to the userMessage
    setLoader(true)
    userMessage = choice ?? userMessage
    const userResponse: ChatMessage = {
      text: userMessage,
      role: "user",
      timestamp: time,
      choices: [],
      visible: "BOTH",
    }
    chatSession.messages.push(userResponse)
    setUserMessage("")
    setChatInitalized(true)
    console.log("Making request to chat")
    const ctrl = new AbortController()
    const gptMessages = chatSession.messages
      .filter((m: ChatMessage) => {
        return m.visible == "BOTH" || m.visible == "API"
      })
      .map((m: ChatMessage) => {
        return {
          role: m.role,
          content: m.text,
        }
      })

      const res = await fetch('/api/chat',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: gptMessages
        })
      })
      const data = await res.text()

      console.log("Got response from chat", data)
      if(res.status===200){
        console.log("Got response from chat", data)
        const message: ChatMessage = {
          role: "assistant",
          text: data,
          timestamp: new Date().toISOString(),
          choices: [],
          visible: "BOTH",
        }
        const lastMessage = chatSession.messages[chatSession.messages.length - 1]
        if (lastMessage.role == "user") {
          chatSession.messages.push(message)
        } else {
          chatSession.messages[chatSession.messages.length - 1].text += message.text
        }
        // console.log("Got response from chat", JSON.parse(ev.data))
        setChatSession(chatSession)
        rerender()
        setLoader(false)
      }

  }
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [chatSession])

  // console.log(messages[messages.length - 1]?.data?.element as IElementNode)

  return (
    <div
    className="w-1/3 "
    >
    
    <div
        className="pt-3 mb-1 px-3 justify-center text-center w-full font-bold text-xl"
        >
          Gilbert AI Chatbot
        </div>
      <div className="flex flex-col  max-h-[75vh] overflow-y-scroll  rounded-lg border border-gray-300">
        
        <div className="flex flex-col bg-gray-100 w-full h-[100%] mt-auto pt-4 px-2 overflow-scroll">
          {/* Bot chat bubble */}
          {/* <div className='inline-flex ml-4 shadow-sm bg-white text-sm p-2 rounded-md my-2'>How are you feeling today?</div> */}
          {/* User chat bubble */}
          {/* <div className='inline-flex float-right mr-4 shadow-sm text-sm p-2 rounded-md bg-red-500 my-2 text-white'>I'm feeling anxious</div>
                <hr className='w-full border-0'></hr> */}
  
          {chatSession
            ? messages.map((message, index) => (
                <ChatMessageText
                  key={index}
                  message={message}
                />
              ))
            : messages.map((message, index) => (
                <div key={index}>
                  <div
                    className={`${
                      message.role == "user"
                        ? "block max-w-11/12  float-right mr-2 ml-4  shadow-sm text-sm p-2 rounded-md bg-red-500 my-2 text-white"
                        : "inline-flex whitespace-pre-wrap  ml-2 mr-4 shadow-sm bg-white text-sm p-2 rounded-md my-2"
                    }`}
                  >
                    {message.text}
                  </div>
                  <hr className="w-full border-0"></hr>
                </div>
              ))}
              {loader && (
                <div className="flex justify-start ml-4">
                <span className="circle animate-loader"></span>
                <span className="circle animate-loader animation-delay-200"></span>
                <span className="circle animate-loader animation-delay-400"></span>
              </div>
              
              )}
          {/* Choices */}
          <div className="flex flex-col-reverse h-full w-full mb-8 ">
            {messages.length > 0 && (
              <div className="w-3/4">
                {chatSession
                  ? messages[messages.length - 1].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setUserMessage(choice)
                          submitMessage(null, choice)
                        }}
                        className="inline-flex whitespace-pre-wrap my-2 p-2 ml-4 bg-white hover:bg-gray-50 text-sm rounded-xl border border-blue-500 text-blue-500"
                      >
                        {choice}
                      </button>
                    ))
                  : messages?.[messages.length - 1]?.choices?.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setUserMessage(choice)
                          submitMessage(null, choice)
                        }}
                        className="inline-flex whitespace-pre-wrap my-2 p-2 ml-4 bg-white hover:bg-gray-50 text-sm rounded-xl border border-blue-500 text-blue-500"
                      >
                        {choice}
                      </button>
                    ))}
              </div>
            )}
          </div>
          {/* <div className='inline-flex ml-4 shadow-sm bg-white text-sm p-2 rounded-md my-2'>How are you feeling today?</div> */}
          <div ref={messagesEndRef}></div>
        </div>

        <form
          onSubmit={(e) => {
            console.log("submitting")
            submitMessage(e)
          }}
          className="flex border-t border-gray-300 h-[12%]"
        >
          {/* {status === 'authenticated' && ()} */}
          <input
          readOnly={status !== 'authenticated'}
            onKeyDown={(e) => {
              console.log("e", e.key, e.shiftKey)
              if (e.key == "Enter" && !e.shiftKey) {
                console.log("submitting")
                submitMessage(e)
              } else if (e.key == "Enter" && e.shiftKey) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            onChange={(e) => setUserMessage(e.target.value)}
            value={userMessage}
            type="text"
            placeholder={status !== 'authenticated' ? 'Please sign in to chat' : 'Type your message here'}
            className="focus:outline-none text-sm p-4 w-5/6"
          ></input>
          <button
            type="submit"
            className="w-8 h-8 my-auto ml-auto mr-4 fill-red-400 hover:fill-red-500 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
            >
              <title>send</title>
              <g id="send">
                <path d="M27,5a3.31,3.31,0,0,0-3.42-.8L6.29,10a3.3,3.3,0,0,0-2.28,3,3.33,3.33,0,0,0,1.92,3.23l5.8,2.7,5.68-5.68a1,1,0,0,1,1.42,1.42l-5.68,5.68,2.7,5.8a3.33,3.33,0,0,0,3,1.93h.2a3.3,3.3,0,0,0,3-2.28L27.82,8.4A3.31,3.31,0,0,0,27,5Z"></path>
              </g>
            </svg>
          </button>
        </form>
      </div>
      <div
        className="text-xs mb-3 text-left mt-1 flex justify-center w-full "
        >
          <span
          className="mx-2 flex italic"
          >
            Information Gilbert provides isn’t always reliable and should be fact-checked before drawing conclusions.
          </span>
        
        </div>
    </div>
  )
}

export default Chat
