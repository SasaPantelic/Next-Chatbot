import { authOptions } from '@lib/next-api-utils/auth-options';
import bcrypt from 'bcrypt'
import { prisma } from '@db/client'
import { NextResponse } from 'next/server';
import { isJSONParsable } from '@lib/utils';
import { unstable_getServerSession } from 'next-auth';
const saltRounds = 10;


export async function POST(req: Request) {
    const body = await new Promise((resolve, reject) => {
        let reader = req.body?.getReader().read();
        if (!reader) reject('No reader');
        let data = '';
        reader!.then((result) => {
            data = new TextDecoder("utf-8").decode(result.value);
            resolve(data);
        })
    }) as string;

    console.log('body', body)

    if (!body || !isJSONParsable(body)) {
        return NextResponse.json({ error: "Please fill in all fields" }, {
            status: 400
        })
    }
    const {
        email,
        password,
        birthday,
        username,
        image,
        description,
        gender,
    } = JSON.parse(body)
    console.log('body', body)
    const searchParms = new URLSearchParams(req.url.split('?')[1])
    const oauth = searchParms.get('oauth')
    console.log(oauth)
    if (!email || (!password && !oauth)) {
        
        return NextResponse.json({ error: "Please fill in all fields" }, {
            status: 400
        })
    }
    

    if (oauth) {
        const session = await unstable_getServerSession(authOptions)
        if(session.user?.email !== email) {
            return NextResponse.json({ error: "Not authorized" }, {
                status: 401
            })
        }
        const user = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                signupCompleted: true,
                birthday: birthday,
                username: username,
                image: image,
                description: description,
                gender:gender,
            }
        })
        delete user.passwordhash
        return NextResponse.json(user)
    }
    const confirmationCode = Math.floor(Math.random() * 899999 + 100000)
    const hash = await bcrypt.hash(password, saltRounds);
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (user) {
            return NextResponse.json({ message: "An account with that email already exists" }, {
                status: 409
            })
        }
        else {
            const createResult = await prisma.user.create({
                data: {
                    email: email,
                    passwordhash: hash,
                    confirmationCode: confirmationCode,
                    authMethod: 'password',
                    birthday: birthday,
                    username: username,
                    image: image,
                    description: description,
                    gender:gender,
                    signupCompleted:true
                },
            })
            // sendConfirmationEmail(email, name, confirmationCode)
            // @ts-ignore
            delete createResult?.passwordhash
            return NextResponse.json(createResult)
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Something went wrong" }, {
            status: 500
        })

    }
}