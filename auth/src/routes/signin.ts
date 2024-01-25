import express, { Request, Response } from "express"
import { User } from "../models/users";
import { body } from "express-validator"
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/Errors";
import { Password } from "../utils/password";

const router = express.Router()

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email Must be Valid'),
    body('password').trim().notEmpty().withMessage('Password must be provided'),
    validateRequest
], async (req:Request, res:Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError("Invalid login credentials");
    }
    if (await Password.compare(existingUser.password, password)) {

        //sign a new JWT
        const payload = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_SECRET!);

        //store in sessions object
        req.session = {
            jwt: payload
        }
        console.log(`User Logged in with email: ${email}`);
        res.status(200).send(existingUser);
    }
    else {
        
        throw new BadRequestError("Invalid login credentials");
    }
});

export { router as SigninRouter };