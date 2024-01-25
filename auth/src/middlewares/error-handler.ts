import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/Errors";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("something went wrong", err);
    res.status(err.statusCode).send({ errors : err.serialize() });
};
