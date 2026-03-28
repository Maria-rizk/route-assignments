import mongoose from "mongoose"
import { UserModel, createOne, findOne } from "../../DB/index.js"
import { ConflictException, generateHash, NotFoundException, UnauthorizedException } from "../../common/utils/index.js"
import { HashApproachEnum } from "../../common/enums/security.enum.js"
import { compareHash, generateEncryption, generateDecryption } from "../../common/utils/index.js"

export const signup = async (inputs) => {
    const {username, email, password, phone} = inputs;

    const checkUserExist = await findOne({
        model: UserModel,
        filter: {email}
    })
    if(checkUserExist){
        throw ConflictException({message: "Email already exists"})
    }
    const user = await createOne({
        model: UserModel,
        data: {
            username,
            email,
            password: await generateHash({plaintext: password, approach:HashApproachEnum.argon2}),
            phone: await generateEncryption(phone)
        }
    })
    return user;

}


export const login = async (inputs) => {
   
    const {email, password} = inputs;

    const user = await findOne({
        model: UserModel,
        filter: {email},
        options: {lean: true}
    })
    if(!user){
        throw NotFoundException({message: "Invalid email or password"})
    }   
    if(! await compareHash({plaintext: password, ciphertext: user.password , approach:HashApproachEnum.argon2})){
        throw UnauthorizedException({message: "Invalid email or password"})
    }
    user.phone = await generateDecryption(user.phone)
    return user;

}

