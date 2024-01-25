import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const currentUser = (req: Request, res: Response, next: NextFunction) =>{
     if (!req.session?.jwt) {
        console.log("session cookie does not exsist");
         return next();
    }
    else {
        try {
            const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!);
            req.body['currentuser'] = payload;
        }
        catch (err) {
            console.log("Invalid JWT");
        }
         next();
    }
};

