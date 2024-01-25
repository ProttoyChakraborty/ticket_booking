import mongoose, { Mongoose } from "mongoose";
import { Password } from "../utils/password";

// User interface for passing correct attributes
interface UserAttrs{
    email: string,
    password:string
}

// interface UserModel

interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

//interface UserDocument
interface UserDoc extends mongoose.Document{
    email: string,
    password: string
}

//Schema 
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
            
        }
    }
});


//pre save hook for hashing passwords
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPass = await Password.toHash(this.get('password'));
        this.set('password', hashedPass);
    }
    done();
});


//static custom build method
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}
const User = mongoose.model<UserDoc,UserModel>('User', userSchema);
export { User };