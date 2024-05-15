import * as fs from "fs";
import * as path from "path";
import * as AWS from "aws-sdk";
import { lookup } from 'mime-types'

// Configure the AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export interface Asset {
    name: string;
    path: string;
    url: string;
    type: string;
}
const putObjectWrapper = (params) => {
    return new Promise((resolve, reject) => {
        s3.putObject(params, function (err, result) {
            if (err) reject(err);
            if (result) resolve(result);
        });
    })
}


export async function uploadFileS3(localPath: string, s3Path: string) {
    const bucket: string = process.env.BUCKET_NAME
    // Read the file
    // const s3Path = path.join(s3Dir, localPath);
    const data = fs.readFileSync(localPath);
    // Get the file type
    const mimeType = lookup(localPath);
    // Upload the file to S3
    // Wrap in a promise so we can use async/await
    var metadata = {}
    if (mimeType) {
        metadata = {
            'Content-Type': mimeType
        }
    }
    await s3.putObject({
        Bucket: bucket,
        Key: s3Path,
        Body: data,
        ContentType: mimeType || undefined,
    }, (err) => {
        if (err) {
            throw err;
        }
        // console.log(`Successfully uploaded '${path}' to '${s3Path}'`);
    }).promise()
    return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Path}`
}
// Recursively upload all files in a directory to an S3 bucket
export async function uploadDirectoryS3(localDir: string, bucket: string, s3Dir: string, projectId: string) {
    // if (!fs.existsSync('./projects/' + projectId)) {
    //     fs.mkdirSync('./projects/' + projectId);
    // }
    // Get a list of all files in the directory
    const files = fs.readdirSync(localDir);
    const assets: Asset[] = []
    // Loop over the files
    for (const file of files) {
        // Get the full path of the file
        const localPath = path.join(localDir, file);
        // Check if the file is a directory
        if (fs.statSync(localPath).isDirectory()) {
            // If it's a directory, upload it recursively
            var dirAssets = await uploadDirectory(localPath, bucket, path.join(s3Dir, file), projectId);
            assets.push(...dirAssets)

        } else {
            // If it's a file, upload it to S3
            const s3Path = path.join(s3Dir, file);
            const data = fs.readFileSync(localPath)
            // console.log('err', err)
            // if (err) {
            //     throw err;
            // }
            let type: string
            if (file.includes('.png') || file.includes('.jpg') || file.includes('.jpeg') || file.includes('.gif')) {
                type = 'img'
            } else if (file.includes('.svg')) {
                type = 'svg'
            }
            const asset: Asset = {
                name: file,
                path: localPath,
                url: `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Path}`,
            }
            if (type) {
                asset.type = type
            }
            // console.log('asset', asset)
            assets.push(asset)

            const mimeType = lookup(localPath)
            // Upload the file to S3
            // Wrap in a promise so we can use async/await
            var metadata = {}
            if (mimeType) {
                metadata = {
                    'Content-Type': mimeType
                }
            }
            await s3.putObject({
                Bucket: bucket,
                Key: s3Path,
                Body: data,
                ContentType: mimeType || undefined,
            }, (err) => {
                if (err) {
                    throw err;
                }
            }).promise()
            // Set the mime type of the files metadata


        }
    }
    return assets
}
