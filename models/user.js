import mongoose, { STATES } from "mongoose";
const { Schema , model } = mongoose;
// import {createHmac, hash, randomBytes} from "crypto";
import {createHmac, randomBytes} from "crypto";
import auth from "../services/authentication.js";
const { createTokenForUser, validateToken } = auth;


const userSchema = new Schema({
    fullName:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    profileImageURL:{
        type:String,
        default: 'images/userImg.png'
    },   
    role:{
        type:String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
},
{
    timestamps:true
})

userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex")

    this.salt = salt
    this.password = hashedPassword

    next()
})

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email})
    if(!user) throw new Error("User not found!");
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest("hex");
    // console.log("user provided hash = "+userProvidedHash)
    // console.log("hashed password = ", hashedPassword)
    if(userProvidedHash !== hashedPassword) throw new Error("Incorrect password!")
    // return {user, password:undefined, salt:undefined}; here we are returning user
    
    const token = createTokenForUser(user)
    return token
})

const User = model('user', userSchema);
export default User;