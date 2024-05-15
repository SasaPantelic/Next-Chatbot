import { NextApiRequest } from 'next'
import bcrypt from 'bcrypt'
import { prisma } from '@db/client'
const saltRounds = 10;


export default async function handler(req: NextApiRequest, res) {
    // await runMiddleware(req, res, cors)
    const { email, password } = JSON.parse(req.body)
    if (!email || !password) {
        res.json({ error: "Please fill in all fields" })
        return
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
            res.status(400).json({ message: "An account with that email already exists" })
            return
        }
        else {
            const createResult = await prisma.user.create({
                data: {
                    email: email,
                    passwordhash: hash,
                    confirmationCode: confirmationCode,
                    authMethod: 'password'
                },
            })
            // sendConfirmationEmail(email, name, confirmationCode)
            delete createResult.passwordhash
            res.status(200).json(createResult)
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}