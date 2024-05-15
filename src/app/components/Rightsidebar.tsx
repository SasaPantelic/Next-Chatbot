"use client"

import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useStore } from "../../stores/UserStore"
import { useTour } from "@reactour/tour"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import TopbarDropdown from "./Dropdown"
import Link from "next/link"

export interface RightSidebarProps {
  session: Session
}
function RightSidebar({}: RightSidebarProps) {
  const { data: session, status } = useSession()
  const [user, setUser] = useStore((state) => [state.user, state.setUser])
  const { setIsOpen } = useTour()
  const router = useRouter()

  useEffect(() => {
    console.log("session", session, status)
    if (status === "authenticated") {
      if(!user){
      useStore.setState({
        user: session.user,
      })
    }
      if (session.user.signupCompleted === false && !(user && user.signupCompleted === true)) {
        router.push("/signup")
      }
      if (session.user.tutorialCompleted === false && session.user.signupCompleted === true) {
        useStore.setState({
          tourOpen: true,
        })
        setIsOpen(true)
      }
    }
  }, [session])

  return (
    <div className="flex flex-col ml-auto">
      {session?.user ? (
        <TopbarDropdown
          button={user?.image? (
            <img
              className="w-16 h-16 rounded-full profile"
              src={user?.image}
              alt="SynapMe Logo"
            />
          ):< ></>
          }
        />
      ) : (
        <div className="flex flex-row">
          <Link
            href="/signin"
            className="border border-red-300 hover:border-red-500 text-black font-bold py-2 px-4 rounded-lg"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 ml-2 px-4 rounded-lg"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  )
}

export default RightSidebar
