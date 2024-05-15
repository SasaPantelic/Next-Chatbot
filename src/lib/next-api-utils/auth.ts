import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from './get-session';


export async function isAuthenticated(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession({
        req,
        res,
    });
    if (!session) {
        res.status(401).send({ message: 'Unauthorized' });
    }
    return session;
}