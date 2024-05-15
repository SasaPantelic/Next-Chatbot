"use client"
import { signIn } from 'next-auth/react'
import React from 'react'

type Props = {
    signUp?: boolean
}

const SocialLogin = ({
    signUp = false
}: Props) => {
  return (
    <>
    <div className="flex flex-row justify-center items-center mt-4">
          <div className="h-[1px] w-full bg-gray-300"></div>
          <span className="text-gray-500 text-[14px] w-fit whitespace-pre font-medium mx-2">Or Sign {signUp ? 'Up': "In"} with</span>
          <div className="h-[1px] w-full bg-gray-300"></div>
        </div>

        <div className="flex flex-row justify-center items-center mt-4">
          {/* Sign in with Google */}
          <button
          type='button'
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="bg-white text-black border hover:bg-gray-100 border-gray-300 rounded-md px-4 py-2 flex flex-row justify-center items-center  font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google Logo"
              className="w-5 h-5 mr-2"
            />
            <span>Sign {signUp ? 'Up' : "In"} with Google</span>
          </button>
        </div>
    </>
  )
}

export default SocialLogin