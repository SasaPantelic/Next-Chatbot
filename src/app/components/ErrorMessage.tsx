import React from 'react'
import { RxCross2 } from 'react-icons/rx'

type Props = {
    message: string
    className?: string
}

const ErrorMessage = ({
    message,
    className
}: Props) => {
    return (
        <div
            className={`bg-red-100 flex mt-2 text-sm px-4 py-2 rounded-md relative ${className}`}
        >
            <RxCross2 className=" mr-2 h-6 w-6 text-red-500" />
            <p className="text-black text-xs mb-1 mt-1">{message}</p>
        </div>
    )
}

export default ErrorMessage

export interface IError {
    username?: string
    email?: string
    password?: string
    passwordConfirmation?: string
    
}