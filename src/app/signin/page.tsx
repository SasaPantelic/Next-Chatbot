"use client"
import React, { useEffect, useState } from "react"
import { HiOutlineMail } from "react-icons/hi"
import { FiLock } from "react-icons/fi"
import { FaUserAlt } from "react-icons/fa"
import { IoIosArrowDown } from "react-icons/io"
import PasswordGenerator from "./PasswordGenerator"
import Button from "../components/Button"
import BirthdateInput from "./BirthdateInput"
import ErrorMessage from "../components/ErrorMessage"
import { signIn } from "next-auth/react"
import Link from "next/link"
import TripleDotLoader from "../components/TripleDotLoader"
import SocialLogin from "./SocialLogin"
import UsernameField from "../signup/form/UsernameField"
import { useRouter } from "next/navigation"

const SignupPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState("")
  const [step, setStep] = useState(1)
  const [error, setError] = useState({
    general: null,
    email: null,
    password: null,
    passwordConfirmation: null,
    username: null,
    gender: null,
    birthdate: null,
  })
  const [loader, setLoader] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    let path = window.location.pathname
    let queryParam = window.location.search.replace('?','').split("&").map((item)=>item.split("="))
    if(queryParam.find((item)=>item[0]==="error")) {
      let errorMessage = queryParam.find((item)=>item[0]==="error")?.[1]
      if(errorMessage==='CredentialsSignin'){
        setError({
          ...error,
          general: "Email or password is incorrect",
        })
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoader(true)
    console.log("submit")
    if (!email || !password) {
      setError({
        ...error,
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      })
      return
    }
    const req = await signIn("email-login", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    })
    console.log("req", req)
    if (req?.error) {
      setError({
        ...error,
        general: "Email or password is incorrect",
      })
    }
    setLoader(false)
  }

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value)
  }

  return (
    <div className="flex justify-center mt-16">
      <head>
        <title>Sign In</title>
      </head>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md h-fit pb-12 p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-3xl font-semibold text-center mb-2">Sign In</h2>
        <div className="text-[#585860] mb-6 h-[fit-content] flex text-[14px] text-center justify-center font-medium leading-[150%] flex-row">
          Don't have an account yet?&nbsp;{" "}
          <Link
            href="/signup"
            className="text-red-600 text-primary w-[fit-content] h-[fit-content] flex text-[14px] text-left font-medium leading-[150%] flex-row"
          >
            Sign Up
          </Link>
        </div>
        {error.general && (
          <ErrorMessage
            className="mb-4"
            message={error.general}
          />
        )}
        {step === 1 && (
          <>
          
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <div className="relative">
                <span className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-600">
                  <HiOutlineMail />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 py-2 w-full border border-gray-300 rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
                  required
                />
              </div>
            </div>
            {error.email && (
              <ErrorMessage
                className="mb-4"
                message={error.email}
              />
            )}
            <div className="mb-4">
              <div className="relative">
                <span className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-600">
                  <FiLock />
                </span>
                <input
                  type="password"
                  id="password-generator"
                  name="password-generator"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  className="pl-12 pr-4 py-2 w-full border border-gray-300 rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
                />
              </div>
              {error.password && (
                <ErrorMessage
                  className="mb-4"
                  message={error.password}
                />
              )}
            </div>
          </>
        )}
        <div>
          {loader ? (
            <TripleDotLoader />
          ) : (
            <Button
              type={"submit"}
              className={"ml-2"}
            >
              Sign In
            </Button>
          )}
        </div>

            <SocialLogin />
        
      </form>
    </div>
  )
}

export default SignupPage
