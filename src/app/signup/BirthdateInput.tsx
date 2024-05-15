import React, { useState } from "react"

export interface BirthdateInputProps {
  day: string
  month: string
  year: string
  setDay: (day: string) => void
  setMonth: (month: string) => void
  setYear: (year: string) => void
}
const BirthdateInput = ({ day, month, year, setDay, setMonth, setYear }: BirthdateInputProps) => {
  const handleDayChange = (event) => {
    setDay(event.target.value)
  }

  const handleMonthChange = (event) => {
    setMonth(event.target.value)
  }

  const handleYearChange = (event) => {
    setYear(event.target.value)
  }

  return (
    <>
    <label
        htmlFor="gender"
        className="block text-gray-700 font-medium mb-2"
      >
        Birthdate
      </label>
    <div className="flex flex-wrap mb-4 space-x-3">
      
      <div className="w-full sm:w-[30%] mb-2 sm:mb-0">
        <label
          htmlFor="birthdateDay"
          className="block text-gray-700 font-medium mb-2"
        >
          Day
        </label>
        <div className="relative">
          <select
            id="birthdateDay"
            name="birthdateDay"
            value={day}
            onChange={handleDayChange}
            className="pl-3 pr-10 py-2 w-full border border-gray-300 rounded-lg appearance-none transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
            required
          >
            <option value="">--</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option
                key={day}
                value={day}
              >
                {day}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
              />
              <path
                fillRule="evenodd"
                d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-[30%] mb-2 sm:mb-0">
        <label
          htmlFor="birthdateMonth"
          className="block text-gray-700 font-medium mb-2"
        >
          Month
        </label>
        <div className="relative">
          <select
            id="birthdateMonth"
            name="birthdateMonth"
            value={month}
            onChange={handleMonthChange}
            className="pl-3 pr-10 py-2 w-full border border-gray-300 rounded-lg appearance-none transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
            required
          >
            <option value="">---</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
              />
              <path
                fillRule="evenodd"
                d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-[30%]">
        <label
          htmlFor="birthdateYear"
          className="block text-gray-700 font-medium mb-2"
        >
          Year
        </label>
        <input
          type="number"
          id="birthdateYear"
          name="birthdateYear"
          value={year}
          onChange={handleYearChange}
          min="1900"
          max={new Date().getFullYear()}
          className="pl-3 pr-10 py-2 w-full border border-gray-300 rounded-lg appearance-none transition-colors duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 ring-indigo-200"
          placeholder="YYYY"
          required
        />
      </div>
    </div>
    </>
  )
}

export default BirthdateInput
