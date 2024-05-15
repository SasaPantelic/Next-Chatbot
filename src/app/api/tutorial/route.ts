import { isJSONParsable } from '@lib/utils';
import { unstable_getServerSession } from 'next-auth';
import { NextResponse } from "next/server";
import { authOptions } from '@lib/next-api-utils/auth-options';
export async function POST(req: Request) {
    const session = await unstable_getServerSession(authOptions)

    await prisma?.user.update({
        where: {
            username: session?.user?.username
        },
        data: {
            tutorialCompleted: true
        }
    })

    return NextResponse.json({ success: true })
  }