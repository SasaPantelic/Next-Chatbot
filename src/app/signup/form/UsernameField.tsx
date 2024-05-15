import React from 'react'
import { FaUserAlt } from 'react-icons/fa'

type Props = {
    username: string
    setUsername: (username: string) => void
}

const UsernameField = ({
    username,
    setUsername,
}: Props) => {
  return (
    <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <div className="relative">
                <span className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-600">
                  <FaUserAlt />
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 pr-4 py-2 w-full border border-gray-300 rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
                  required
                />
              </div>
            </div>
  )
}

export default UsernameField