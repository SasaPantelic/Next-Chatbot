import React, { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { FiLock } from 'react-icons/fi';
import ErrorMessage, { IError } from "../components/ErrorMessage";
import Button from "../components/Button";


export interface PasswordGeneratorProps {
  password: string;
  setPassword: (password: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (passwordConfirmation: string) => void;
  error: IError;
  setError: (error: IError) => void;
}
const PasswordGenerator = ({
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  error,
  setError
}:PasswordGeneratorProps) => {
  const [length, setLength] = useState(14);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [showSuggestPassword, setShowSuggestPassword] = useState(false);
  const [suggestPassword, setSuggestPassword] = useState("");

  const handleGeneratePassword = () => {
    const symbols = "!@#$%^&*()_+-=";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (includeSymbols) {
      characters += symbols;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setSuggestPassword(generatedPassword);
    setPassword(generatedPassword);
    setPasswordConfirmation(generatedPassword);
  };
  

  return (
    <div className="">
      <label htmlFor="password-generator" className="block text-gray-700 font-medium mb-2">Password</label>
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
        <span
          className="inline-flex items-center justify-center absolute right-0 h-full w-10 text-gray-600 cursor-pointer"
          onClick={handleGeneratePassword}
        >
          <FiRefreshCw />
        </span>
      </div>
      {error.password && (
                <ErrorMessage
                    className="mb-4"
                    message={error.password} />
            )}
      <label htmlFor="password-generator" className="block text-gray-700 font-medium">Password Confirmation</label>

      <div className="relative mt-1">
      <span className="inline-flex items-center justify-center absolute left-0 h-full w-10 text-gray-600">
              <FiLock />
            </span>
        <input
        onChange={(e) => {
            setPasswordConfirmation(e.target.value)
        }}
          type="password"
          id="password-generator"
          name="password-generator"
          value={passwordConfirmation}
          className="pl-12 pr-4 py-2 w-full border border-gray-300 rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
        />
        <span
          className="inline-flex items-center justify-center absolute right-0 h-full w-10 text-gray-600 cursor-pointer"
          onClick={()=>{
            handleGeneratePassword()
            setShowSuggestPassword(true)
          }}
        >
          <FiRefreshCw />
        </span>
      </div>
      {error.passwordConfirmation && (
                <ErrorMessage
                    className="mb-4"
                    message={error.passwordConfirmation} />
            )}
      <div>
        <Button
              size="small"
              className={'my-2'}
              onClick={() => {
                setShowSuggestPassword(!showSuggestPassword)
                if(!showSuggestPassword && password === ''){
                  handleGeneratePassword()
                }
              }}
              type="button"
              >
              {showSuggestPassword ? "Suggested Password" : "Suggest a password"}
              </Button>
      </div>
      {showSuggestPassword && (
        <>
        <input
          type="text"
          id="password-generator"
          name="password-generator"
          value={suggestPassword}
          className="pl-4 first-letter:pr-4 py-2 w-full border border-gray-300 rounded-lg transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
          readOnly
        />
      <div className="mt-2">
        <label htmlFor="password-length" className="block text-gray-700 font-medium mb-2">Password Length</label>
        <input
          type="range"
          id="password-length"
          name="password-length"
          min="8"
          max="32"
          value={length}
          onChange={(e) => {
            setLength(parseInt(e.target.value))
            handleGeneratePassword()
          }}
          className="w-full accent-red-500"
        />
        <span className="text-gray-600 text-sm">{length}</span>
      </div>
      <div className="mt-2">
        <label htmlFor="include-symbols" className="flex items-center">
          <input
            type="checkbox"
            id="include-symbols"
            name="include-symbols"
            checked={includeSymbols}
            onChange={(e) => {
              setIncludeSymbols(e.target.checked)
              handleGeneratePassword()
            }}
            className="mr-2"
          />
          <span>Include Symbols</span>
        </label>
      </div>
      </>
      )}
    </div>
  );
};

export default PasswordGenerator;
