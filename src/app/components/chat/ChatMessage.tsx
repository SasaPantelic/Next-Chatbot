import React from "react"
import { ChatMessage } from "../../types"
import Editor from "@monaco-editor/react"
import { getMessageCodeText } from "./chatFunctions"
type Props = {
  message: ChatMessage
}

const ChatMessageText = ({ message }: Props) => {

  return (
    <div>
      <div
        className={`${
          message.role == "user"
            ? "max-w-11/12 inline-block float-right mr-2 ml-4 shadow-sm text-sm p-2 rounded-md bg-red-500 my-2 text-white"
            : "inline-flex whitespace-pre-wrap ml-2 mr-4 shadow-sm bg-white text-sm p-2 rounded-md my-2 w-[90%]"
        }`}
      >
        <div className="flex flex-col w-full">
          {message.text}
        </div>
      </div>
      <hr className="w-full border-0"></hr>
    </div>
  )
}

export default ChatMessageText
