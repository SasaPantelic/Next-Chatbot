"use client"
import Head from 'next/head'
import Chat from './components/chat/Chat'
import { useStore } from '../stores/UserStore'
import { useRouter } from 'next/navigation'




export default function Home() {

  const router = useRouter()
  const [user,setUser] = useStore((state) => [state.user, state.setUser])

  if(user && user.signupCompleted === false){
    router.push('/signup')
  }

  return (
    <div
    className='chatbot'
    >
           <head>
        <title>SynapMe</title>
      </head>
      <Chat />
    </div>
  )
}





