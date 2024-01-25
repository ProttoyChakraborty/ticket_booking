import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken";
import {User} from "../models/users"
import 'express-async-errors'
import {  DatabaseOperationError,  BadRequestError } from "../errors/Errors";
import { validateRequest } from "../middlewares/validate-request";
const router = express.Router()

router.post('/api/users/signup', [ 
    body('email').isEmail().withMessage('Email is Invalid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage("Password should be between 4 and 20 characters long"),
    validateRequest
], async (req: Request, res: Response) => {
    
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError("Email already in use")
    }
    try {
        const user = User.build({ email, password });
        await user.save();
        //generate jwt
        const payload = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET!);
        //store in sessions object
        req.session = {
            jwt: payload
        }
        console.log(`created User with email: ${email}`);
        res.status(201).send(user);
    } catch (err: any) {
        throw new DatabaseOperationError(err,"Could Not create User");
    }
   
});

export { router as SignupRouter };