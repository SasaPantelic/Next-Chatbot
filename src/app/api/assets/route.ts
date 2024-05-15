import { NextResponse } from 'next/server';
import fs from 'fs'
import { uploadFileS3 } from '@lib/next-api-utils/s3';

export const config = {
    api: {
        bodyParser: false
    }
};


export async function POST(request: Request) {
    const searchParms = new URLSearchParams(request.url.split('?')[1])
    const path = searchParms.get('path')
    let url = await uploadFile(request,path)
    return NextResponse.json({ url: url });
  }
  

  export async function uploadFile(req:Request,path:string) {
    return new Promise(async (resolve, reject) => {
    const formData = await req.formData()
    const files = formData.entries()
    for await (let entry of files) {
        let file = entry[1] as File
        // Write file to disk nodejs image
        let image = Buffer.from((await file.arrayBuffer()))
        const currentTime = new Date().getTime().toString()
        fs.writeFileSync(`/tmp/${currentTime}.png`, image)
        // Upload file to S3
        let url = await uploadFileS3(`/tmp/${currentTime}.png`, `${path}/${file.name}`)
        resolve(url)
    }
});
}