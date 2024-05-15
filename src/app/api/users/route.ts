import { NextResponse } from "next/server"
import { prisma } from "@db/client"
import { isJSONParsable } from "../../../lib/utils"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/next-api-utils/auth-options"

export async function GET(request: Request) {
    const searchParms = new URLSearchParams(request.url.split('?')[1])
    const username = searchParms.get('username')
    if(!username) {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                image: true,
                description: true,
                birthday: true,
                gender: true,
            }
        })
        return NextResponse.json(users)
    }
    const user = await prisma.user.findFirst({
        where: {
            username
        },
        select: {
            id: true,
            username: true,
            name: true,
            image: true,
            description: true,
            birthday: true,
            gender: true,
        }
    })

    return NextResponse.json(user)
  }

  export async function PUT(req:Request) {
    const body = await new Promise((resolve, reject) => {
        let reader = req.body?.getReader().read();
        if (!reader) reject('No reader');
        let data = '';
        reader!.then((result) => {
            data = new TextDecoder("utf-8").decode(result.value);
            resolve(data);
        })
    }) as string;

    if (!body || !isJSONParsable(body)) {
        NextResponse.json({ error: "Please fill in all fields" }, {
            status: 400
        })
        return
    }
    const session = await unstable_getServerSession(authOptions)
    const user = JSON.parse(body)
    if(!session) {
        return NextResponse.json({ error: "Not authorized" }, {
            status: 401
        })
    }
    if(session.user?.username !== user.username) {
        return NextResponse.json({ error: "Not authorized" }, {
            status: 401
        })
    }
    const updatedUser = await prisma.user.update({
        where: {
            username: user.username
        },
        data: {
            name: user.name,
            image: user.image,
            description: user.description,
            birthday: user.birthday,
            username: user.username,
            gender: user.gender,
        }
    })
    return NextResponse.json(updatedUser)
    
  }