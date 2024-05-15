import { ChatMessage } from "../../types"



export async function sendChatMessage(message:string){
    

}

export function getMessageCodeText(message:ChatMessage){
    let code = message.text.split("```") as any
  let text = message.text
  if (code.length > 1) {
    code = code[1]
    code = code.split("```")[0]
    const language = code.split("\n")[0]
    code = code.replace(language, "")
    // console.log("codeText", code)
    text = message.text.replace("```" + code + "```", "")
    text = message.text.replace(code, "").replaceAll("```", "")
  } else {
    code = null
  }
    return {text, code} 
}

// async function submitMessageNoStream(e:any, choice?: string) {
//     e && e?.preventDefault();
//     scrollToBottom();
//     let time = new Date().toISOString();
//     // if choice passed in then set it to the userMessage
//     userMessage = choice ?? userMessage;
//     let userResponse: ChatMessage = {
//         text: userMessage,
//         role: "user",
//         timestamp: time,
//         choices: [],
//         visible: "BOTH",
//     };
    
//     chatSession.messages.push(userResponse);
//     setUserMessage("");
//     let res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/chat", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(chatSession),
//         onmessage(ev) {
//             console.log(ev.data);
//         }
//     });
//     let data = await res.json();
//     console.log("POST", data);
//     setChatSession(data);
// }