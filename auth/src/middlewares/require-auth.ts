import {
    Request, Response, NextFunction
} from "express";
import { NotAuthorizedError } from "../errors/Errors";
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.currentuser) {
        throw new NotAuthorizedError("Not authorized");
    }
    next();
}