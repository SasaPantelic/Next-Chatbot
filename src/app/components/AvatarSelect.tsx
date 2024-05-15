import React from "react"
import FileUploadWrapper from "./FileUploadWrapper"
import { RxPencil2 } from "react-icons/rx"

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

const AvatarSelect = ({ 
    avatar,
    onSelect
  }: Props) => {
        const [avatarHover, setAvatarHover] = React.useState(false)
  return (
    <div>
      {/* <FileUploadWrapper
        onUpload={async (url) => {
          onUpload(url)
        }}
        inputRef={inputRef}
      /> */}
      <div
        onClick={() => {
          onSelect(avatar.image)
        }}
        onMouseEnter={() => {
            setAvatarHover(true)
        }}
        onMouseLeave={() => {
            setAvatarHover(false)
        }}
        className={`relative cursor-pointer w-fit`}
      >
        {avatarHover && (
            <div
            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-full flex items-center justify-center"
            >
            </div>
        )}
        <img
          src={avatar.image}
          className="w-24 h-24 rounded-full"
          alt="avatar"
        />
      </div>
      <div
        className="text-center text-base font-semibold"
        >
          {avatar.name}
        </div>
    </div>
  )
}

export default AvatarSelect
