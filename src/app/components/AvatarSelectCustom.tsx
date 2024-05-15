import React from "react"
import FileUploadWrapper from "./FileUploadWrapper"
import { RxPencil2, RxPlus } from "react-icons/rx"

type Props = {
  onUpload: (url: string) => void
  inputRef: React.RefObject<HTMLInputElement>
  img: string
  onSelect: (url: string) => void
  avatar: {
    image: string
    name: string
  }
}

const AvatarSelectCustom = ({ 
    onSelect,
    inputRef,
    onUpload
  }: Props) => {
        const [avatarHover, setAvatarHover] = React.useState(false)
  return (
    <div
    className="w-fit items-center flex flex-col"
    >
            <FileUploadWrapper
        onUpload={async (url) => {
          onUpload(url)
        }}
        inputRef={inputRef}
      />
      <div
        onClick={() => {
          inputRef.current?.click()
          // onSelect(avatar.image)
        }}
        onMouseEnter={() => {
            setAvatarHover(true)
        }}
        onMouseLeave={() => {
            setAvatarHover(false)
        }}
        className={`relative cursor-pointer w-fit`}
      >
            <div
            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-full flex items-center justify-center"
            >
                <RxPlus className="text-white w-10 h-10" />
            </div>
        <div
          className="w-24 h-24 rounded-full"
          alt="avatar"
        ></div>
      </div>
      <div
        className="text-center text-base font-semibold"
        >
          {'Choose Custom Profile'}
        </div>
    </div>
  )
}

export default AvatarSelectCustom
