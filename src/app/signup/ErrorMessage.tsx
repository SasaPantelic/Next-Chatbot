import { XCircleIcon } from '@heroicons/react/outline'
import React from 'react'

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
            className={`bg-red-100 flex  text-sm px-4 py-2 rounded-md relative ${className}`}
        >
            <XCircleIcon className=" mr-2 h-6 w-6 text-red-500" />
            <p className="text-black text-xs mb-1 mt-1">{message}</p>
        </div>
    )
}

export default ErrorMessage