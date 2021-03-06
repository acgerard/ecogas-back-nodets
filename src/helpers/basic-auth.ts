import {Request, Response, NextFunction} from "express";
import {getUser} from "../user/user-repository";


export async function basicAuth(req: Request, res: Response, next: NextFunction) {
    try {
        // make authenticate path public
        if (req.path === '/ecogas/users/authenticate' || req.path === '/ecogas/health') {
            return next();
        }

        // check for basic auth header
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({ message: 'Missing Authorization Header' });
        }

        // verify auth credentials
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        const userId = await getUser(email, password);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }
        // set user in request
        req.userId = userId.id
        req.profile = userId.profile

        next();
    } catch (e) {
        console.log(e)
        return res.status(401).json({ message: 'Error authenticating' });
    }

}