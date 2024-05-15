import { isJSONParsable } from '@lib/utils';
import { NextResponse } from "next/server";
import { ChatMessage } from '../../../types';
// import { fetchEventSource } from '@microsoft/fetch-event-source';
import fetch from 'node-fetch'
import { automaticPostBumping, getUserSummary, multiplePostsSummarization, postSummarization } from './prompt-system';

// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function POST(req: Request,response: Response) {
    const body = await new Promise((resolve, reject) => {
        let reader = req.body?.getReader().read();
        if(!reader) reject('No reader');
        let data = '';
        reader!.then((result) => {
            data = new TextDecoder("utf-8").decode(result.value);
            resolve(data);
        })
    }) as string;
    if(!body || !isJSONParsable(body)) {
        NextResponse.json({ error: "Please fill in all fields" },{
            status: 400
        })
        return
    }
    const data = JSON.parse(body);

    let messages = data.messages;
    console.log('Messages', messages)

    const lastMessage = messages[messages.length - 1].content;
    console.log('Last message', lastMessage)
    if(lastMessage.includes('user description')){
      messages.push({
        content: getUserSummary(),
        role: "user"
      })
    }
    if(lastMessage.includes('post summary')){
      messages.push({
        content: postSummarization(),
        role: "user"
      })
    }
    if(lastMessage.includes('simulate dialogue')){
      messages.push({
        content: automaticPostBumping(),
        role: "user"
      })
    }
    if(lastMessage.includes('posts summary')){
      messages.push({
        content: multiplePostsSummarization(),
        role: "user"
      })
    }

   
    var es = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        // signal: signal,
        body: JSON.stringify({
          // stream: true,
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 200,
        }),
      }
    );
    
    
    let json = await es.json();
    let allText = json.choices[0].message.content

      


    // const stream = iteratorToStream(makeIterator())

    // let allText = await new Promise((resolve, reject) => {
    //   let allText = '';
    
    // es.body?.on('data', (chunk) => {
    //   chunk = chunk.toString().replace('data: ', '')
    //   try{
    //     let data = JSON.parse(chunk);
       
    //     if(data.choices) {
    //       let choice = data.choices[0];
    //       let text = choice.delta.content
    //       console.log('Text', text)
    //       if(text){
    //       allText += text;
    //     }
    //       console.log('All text', allText)
    //     }
    //   }
    //   catch(e) {
    //     console.log('Error', e)
    //   }
    // })
    // es.body?.on('end', () => {
    //   console.log('End')
    //   resolve(allText)
    // })
    // })

    console.log('All text', allText)
    return new Response(allText)
   
  }


