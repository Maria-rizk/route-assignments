export const users =[]
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { GenderEnum, ProviderEnum } from "../../common/enums/index.js"

const userSchema = new mongoose.Schema({
    fristName: {
        type: String,
        minlength: 2,
        maxlength: 25,
        required: [true, "firstname is required"]
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 20,  
        required:[true, "lastname is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.Male
    },
    password:{
        type: String,
        required:true
    },
    phone: {
        type: String,

    },
    confirmEmail: Date,
    changeCredentialsTime: Date,
    profilepic: String,
    coverprofilepic:[String],
    provider:{
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.System
    }


},{
    collection: "Route_Users",
    strict: true,
    timestamps: true,
    strictQuery: true,
    optimisticConcurrency: true,
    autoIndex: true,
    toJSON: {virtuals: true},
    toObject: {virtuals:true}
})

userSchema.virtual("username").set(function(value){
    const [fristName , lastName] =value.split(" ") || []; 
    this.set({fristName, lastName})
}).get(function(){
    return this.fristName + " " + this.lastName;
})


export const UserModel = mongoose.models.User || mongoose.model("user", userSchema)