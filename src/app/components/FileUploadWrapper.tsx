import React from 'react'

type Props = {
  inputRef: React.RefObject<HTMLInputElement>
  onUpload: (url: string) => void
}




const FileUploadWrapper = ({
  inputRef,
  onUpload,
  s3Path = 'public/avatars'
}: Props) => {
  return (
    <div>
        <input
                onClick={() => {
                  inputRef.current.value = null
                }}
                onChange={async (e) => {
                  if (e.target.files) {
                    const file = e.target.files[0]
                    const formData = new FormData()
                    formData.append("file", file)
                    const req = await fetch("/api/assets?path="+s3Path, {
                      method: "POST",
                      // headers,
                      body: formData,
                    })
                    const res = await req.json()
                    const url = res.url
                    console.log('url', url)
                    onUpload(url)

                  }
                }}
                ref={inputRef}
                type="file"
                className="hidden"
              />
    </div>
  )
}

export default FileUploadWrapper