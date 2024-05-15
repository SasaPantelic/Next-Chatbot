'use client'

import { useSession } from "next-auth/react"
import { capitalize } from "@lib/utils"
import { useEffect, useRef, useState } from "react"
import { User } from "next-auth"
import FileUploadWrapper from "../../components/FileUploadWrapper"
import { useStore, useUserStore } from "../../../stores/UserStore"
import TripleDotLoader from "../../components/TripleDotLoader"
import AvatarEditable from "../../components/AvatarEditable"

type Props = {}

const Page = ({ params, searchParams }) => {
    const { data: session, status } = useSession()
    const [user, setUser] = useState(null as User)
    const [description, setDescription] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const [avatarHover, setAvatarHover] = useState(false)

    useEffect(() => {
        let request = fetch('/api/users?username=' + params.username)
        request.then(res => res.json()).then(data => {
            setUser(data)
            setDescription(data.description)
        })
    }, []);

    // Get age from birthday
    const getAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const isUsersPage = session?.user?.username === params.username

    if(!user){
        return (<>
        <head>
        <title>
            User Profile
        </title>
      </head>
        <TripleDotLoader
            className="w-20 h-20 mt-6"
         />
        </>)
    }

    return (
        <div
            className="mt-6"
        >
        <head>
        <title>
            {user.username}
        </title>
      </head>
            {user ? (
            <div
                className="flex flex-col p-5 bg-white shadow-md rounded-lg"
            >
                {isUsersPage ? (
                <AvatarEditable 
                img={user.image}
                inputRef={inputRef}
                onUpload={async (url) => {
                    setUser({
                        ...user, image: url
                    })
                    useStore.setState({
                        user: {
                            ...user, image: url
                        }
                    })
                    await fetch('/api/users', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...user,
                            image: url
                        })
                    })
                }} />
                ): (
                    <img
                            src={user.image}
                            className="w-32 h-32 rounded-full"
                            alt="avatar"
                        />
                )}
                <div>
                    <h1 className="text-3xl font-bold mt-4">{user.username}</h1>
                    {/* Gender */}
                    <div className="flex flex-row mt-2 items-center">
                        <h3
                            className="text-gray-500 font-semibold text-lg"
                        >
                            {capitalize(user?.gender || '')}
                        </h3>
                        <h3
                            className="text-gray-500 font-semibold text-lg ml-2"
                        >
                            {getAge(user?.birthday)}
                        </h3>
                    </div>
                    {/* University */}
                    <h3
                        className="text-gray-500 font-semibold text-lg mt-2"
                    >
                        {user?.university}
                    </h3>
                    

                    {/* Descriptioin */}
                    <div
                        className="flex flex-col"
                    >
                        <textarea
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                            value={description}
                            readOnly={isUsersPage ? false : true}
                            className={`text-gray-500 h-24 mt-2 border rounded-md w-[672px] ${isUsersPage ? 'focus-visible:outline-red-500 ' : 'outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none '} resize-none p-2`}
                        ></textarea>
                        {(user.description !== description && isUsersPage) && (
                            <button
                                onClick={async () => {
                                    const req = await fetch('/api/users', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            ...user,
                                            description: description
                                        })
                                    })

                                    if (req.status === 200) {
                                        const res = await req.json()
                                        console.log('res', res)
                                        session.user.description = description
                                        setUser({
                                            ...user, description: description
                                        })
                                    }
                                }}
                                className="bg-red-500 w-fit text-white font-semibold rounded-lg px-4 py-1.5 mt-4"
                            >
                                Save
                            </button>
                        )}
                    </div>
                </div>
            </div>
            ) : (
                <TripleDotLoader
                    className="w-20 h-20"
                 />
            )}
        </div>
    )
}

export default Page