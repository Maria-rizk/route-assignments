import {UserModel, users} from '../../DB/models/index.js'
export const profile   = async (id)=>{
    const user = await UserModel.findById(id)
   // const user = await UserModel.findOne({_id:id})  same as findById
    return user
}

export const updateProfile = async (id, inputs) => {
    const {gender} = inputs;
    const user = await UserModel.updateOne(
        {},
        {
            $set: {gender}
        }
    )
    return user
};