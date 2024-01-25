import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user';
import { SigninRouter } from './routes/signin';
import { SignoutRouter } from './routes/signout';
import { SignupRouter } from './routes/signup';
import {errorHandler} from './middlewares/error-handler'
import { InitializationError, ResourceNotFoundError } from './errors/Errors';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true,
}))
app.use(currentUserRouter);
app.use(SigninRouter);
app.use(SignoutRouter);
app.use(SignupRouter);

app.get("*", async (req,res) => {
    throw new ResourceNotFoundError("Resource not found");
})
app.use(errorHandler)

async function startup() {
    if (!process.env.JWT_SECRET) {
        throw new InitializationError("Environment variable JWT_SECRET Not defined");
    }
    try {
        await mongoose.connect("mongodb://mongo-auth-srv:27017/auth");   
    }
    catch (err) {
        throw new InitializationError("Database Connection failed");
    }
     
}
app.listen(3000, () => {
    startup();
    console.log("Connected to auth mongo db");
    console.log('Listening on port 3000 !!!!!');
});
