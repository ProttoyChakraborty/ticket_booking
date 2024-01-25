import { ValidationError } from "express-validator";
import { MongooseError } from "mongoose";



export abstract class CustomError extends Error {
    constructor(public message: string) {
        super(message);
    }
    abstract statusCode: number
    abstract serialize(): {message:string,field?:string}[]
}

export class RequestValidationError extends CustomError{
    public statusCode = 400;
    constructor(private err:ValidationError[],public message:string) {
        super(message);
    }

    public serialize() {
        return this.err.map((err) => {
            return {
                message: err.msg,
                field:err.param
            }
        })
    }
}


export class InitializationError extends CustomError{
    public statusCode = 500;
    constructor(public message:string) {
        super(message);
    }

    public serialize() {
        return [
            {
                message: this.message,
            }
        ]
    }
}

export class ResourceNotFoundError extends CustomError{
    public statusCode = 404;
    constructor(public message:string) {
        super(message);
    }

    public serialize() {
        return [
            {
                message: "Resource not found",
            }
        ]
    }
}

export class DatabaseOperationError extends CustomError{
    public statusCode = 402;
    constructor(private error: MongooseError, public message: string) {
        super(message);
        
    }

    public serialize() {
        return [
            {
                message: this.error.message
            }
        ]
    }
}

export class BadRequestError extends CustomError{
    public statusCode = 400;
    constructor( public message: string) {
        super(message);
        
    }
    public serialize() {
        return [
            {
                message: this.message,
            }
        ]
    }
}

export class NotAuthorizedError extends CustomError{
    public statusCode = 401;
    constructor( public message: string) {
        super(message);
    }
    public serialize() {
        return [
            {
                message: this.message,
            }
        ]
    }
}