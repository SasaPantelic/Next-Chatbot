import React from "react"
import FileUploadWrapper from "./FileUploadWrapper"
import { RxPencil2 } from "react-icons/rx"

type Props = {
  onUpload: (url: string) => void
  inputRef: React.RefObject<HTMLInputElement>
  img: string
}

const AvatarEditable = ({ 
    img,
    onUpload, inputRef }: Props) => {
        const [avatarHover, setAvatarHover] = React.useState(false)
  return (
    <div>
      <FileUploadWrapper
        onUpload={async (url) => {
          onUpload(url)
        }}
        inputRef={inputRef}
      />
      <div
        onClick={() => {
          inputRef.current?.click()
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
                <RxPencil2 className="text-white w-10 h-10" />
            </div>
        )}
        <img
          src={img}
          className="w-32 h-32 rounded-full"
          alt="avatar"
        />
      </div>
    </div>
  )
}

export default AvatarEditable
