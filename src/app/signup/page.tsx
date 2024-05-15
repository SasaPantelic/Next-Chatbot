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
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import FileUploadWrapper from "../components/FileUploadWrapper"
import TripleDotLoader from "../components/TripleDotLoader"
import AvatarEditable from "../components/AvatarEditable"
import AvatarSelect from "../components/AvatarSelect"
import UsernameField from "./form/UsernameField"
import SocialLogin from "../signin/SocialLogin"
import { useStore } from "../../stores/UserStore"
import { useRouter } from "next/navigation"
import AvatarSelectCustom from "../components/AvatarSelectCustom"

const SignupPage = () => {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [username, setUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState(
    "https://synap-me.s3.amazonaws.com/public/avatars/avatar1.webp"
  )
  const [avatarName, setAvatarName] = useState("Turing")
  const [description, setDescription] = useState("")
  const [gender, setGender] = useState("")
  const [step, setStep] = useState(1)
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [university, setUniversity] = useState("")
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if(!username || !year || !month || !day || !gender){
      setError({
        ...error,
        username: !username ? "Username is required" : "",
        birthdate: !year || !month || !day ? "Birthdate is required" : "",
        gender: !gender ? "Gender is required" : "",
      })
    }
    setLoader(true)
    console.log("submit")
    // Create iso datae from day, month, year
    const isoDate = new Date(`${year}-${month}-${day}`).toISOString()
    let oauth = false
    let body = {
      email,
      password,
      birthday: isoDate,
      username,
      image: avatarUrl,
      description,
      gender,
    }
    if(session?.user?.signupCompleted===false){
      oauth = true
      body.email = session.user.email
    }
    console.log("oauth", oauth)
    
    // handle signup logic here
    const req = await fetch("/api/auth/register?oauth="+oauth, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const res = await req.json()
    if (req.status == 200) {
      if(oauth){
        console.log('res', res)
        useStore.setState({
          user: res
        })
        router.push('/')
      }else{
      await signIn("email-login", {
        email,
        password,
        redirect: true,
        callbackUrl: "/",
      })
    }
    } else if (req.status == 409) {
      console.log("409")
      setError({
        general: res.message,
      })
      // await signIn("email-login", {
      //   email,
      //   password,
      //   redirect: true,
      //   callbackUrl: "/",
      // })
    } else {
      setError({
        general: res.message,
        ...res.errors,
      })
    }
    setLoader(false)
  }

  useEffect(() => {
    if(status === "authenticated") {
      if(session.user.signupCompleted===false){
        setStep(2)
      }
    }
  }, [status]);
  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value)
  }
  const [showSelectAvatar, setShowSelectAvatar] = useState(false)

  

  return (
    <div className="flex justify-center items-center">
      <head>
        <title>Sign Up</title>
      </head>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-3xl font-semibold text-center mb-2">Sign Up</h2>
        <div className="text-[#585860] mb-6 h-[fit-content] flex text-[14px] text-center justify-center font-medium leading-[150%] flex-row">
          Already have an account?&nbsp;{" "}
          <Link
            href="/signin"
            className="text-red-600 text-primary w-[fit-content] h-[fit-content] flex text-[14px] text-left font-medium leading-[150%] flex-row"
          >
            Sign In
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
          {/* <UsernameField
            username={username}
            setUsername={setUsername}
           /> */}
            {error.username && (
              <ErrorMessage
                className="mb-4"
                message={error.username}
              />
            )}
            <div className="mb-1">
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
              <PasswordGenerator
                error={error}
                setError={setError}
                passwordConfirmation={passwordConfirmation}
                setPasswordConfirmation={setPasswordConfirmation}
                password={password}
                setPassword={setPassword}
              />
            </div>

            <SocialLogin 
              signUp={true}
            />
          </>
        )}

        {step === 2 && (
          <>
          <UsernameField 
              setUsername={setUsername}
              username={username}
              />
            <div className="mb-4">
              <label
                htmlFor="avatar"
                className="block text-gray-700 font-medium mb-2"
              >
                Avatar (optional)
              </label>
             
              <div className="flex flex-row space-x-10">
                <AvatarEditable
                  onUpload={(url) => {
                    setAvatarUrl(url)
                    setAvatarName("")
                  }}
                  img={avatarUrl}
                  inputRef={inputRef}
                />
              </div>
              <div
                className="text-[16] font-semibold text-left mb-[2px]"
              >
                {avatarName}
              </div>
              <Button
              size="small"
              onClick={() => setShowSelectAvatar(!showSelectAvatar)}
              type="button"
              >
              {showSelectAvatar ? "Cancel" : "Select an Avatar"}
              </Button>
            </div>

            
            {/* <button
              onClick={() => setShowSelectAvatar(!showSelectAvatar)}
              type="button"
              className="text-red-600 mt-[-8px] border p-2 rounded-lg hover:text-red-700 text-primary w-[fit-content] h-[fit-content] flex text-[14px] text-left font-medium leading-[150%] flex-row"
            >
              {showSelectAvatar ? "Cancel" : "Select an Avatar"}
            </button> */}
            {showSelectAvatar && (
              <div className="flex flex-row space-x-10">
                {avatars.map((avatar) => {
                  return (
                    <AvatarSelect
                     onSelect={(url) => {
                      setAvatarUrl(url)
                      setAvatarName(avatar.name)
                     }}
                     avatar={avatar}
                      />
                  )
                })}
                <AvatarSelectCustom  
                inputRef={inputRef}
                onUpload={(url) => {
                  console.log('uploading', url)
                  setAvatarUrl(url)
                  setAvatarName("")
                }}
                 />
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                STEM and Ethics Experience (optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none w-full p-1 border rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                University (optional)
              </label>
              <input
                id="university"
                name="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="resize-none w-full p-1 border rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="gender"
                className="block text-gray-700 font-medium mb-2"
              >
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={handleGenderChange}
                  className="w-full border p-2 border-gray-300 rounded-lg transition-colors appearance-none duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <span className="inline-flex items-center justify-center absolute right-0 top-0 h-full w-10 text-gray-600">
                  <IoIosArrowDown />
                </span>
              </div>
            </div>
            <BirthdateInput
              day={day}
              setDay={setDay}
              month={month}
              setMonth={setMonth}
              year={year}
              setYear={setYear}
            />
            {/* <div className="mb-6">
              <label
                htmlFor="birthdate"
                className="block text-gray-700 font-medium mb-2"
              >
                Birthdate
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full border p-2 border-gray-300 rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
                required
              />
            </div> */}
          </>
        )}
        {loader ? (
          <TripleDotLoader />
        ) : (
          <div>
            {step > 1 && (
              <Button
                onClick={() => {
                  setStep(step - 1)
                }}
              >
                Previous
              </Button>
            )}
            <Button
              type={step === 2 ? "submit" : "button"}
              className={"ml-2"}
              onClick={() => {
                if (step === 1) {
                  if (!email || !password || !passwordConfirmation) {
                    setError({
                      ...error,
                      email: !email ? "Email is required" : "",
                      password: !password ? "Password is required" : "",
                      passwordConfirmation: !passwordConfirmation ? "Password confirmation is required" : "",
                    })
                    return
                  }
                  if (password !== passwordConfirmation) {
                    setError({
                      ...error,
                      password: "Passwords do not match",
                      passwordConfirmation: "Passwords do not match",
                    })
                    return
                  }
                  setStep(step + 1)
                }
              }}
            >
              {step === 2 ? "Sign Up" : "Next"}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default SignupPage

const avatars = [{
  image: "https://synap-me.s3.amazonaws.com/public/avatars/avatar1.webp",
  name: "Turing"
}, {
  image: "https://synap-me.s3.amazonaws.com/public/avatars/avatar2.webp",
  name: "Ramon"
}]
