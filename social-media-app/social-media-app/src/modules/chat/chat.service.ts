import { HydratedDocument } from "mongoose"
import { IChat, IUser } from "../../common/interfaces/index.js"
import {ChatRepository,UserRepository} from "../../DB/repository/index.js"
import {toObjectId}from "../../common/utils/objectId.js";
import { NotFoundException } from "../../common/exception/domain.exception.js";
import {ChatEnum} from "../../common/enums/index.js"
import {Types} from "mongoose"
import { storageService } from '../../common/services/storage.service.js'
import { randomUUID } from "node:crypto";
class ChatService{
    private chatRepository: ChatRepository
    private userRepository: UserRepository
        private storageService: typeof storageService

    constructor(){
        this.chatRepository = new ChatRepository()
        this.userRepository = new UserRepository()
        this.storageService =  storageService
    }
        SayHi=()=>{
            return "done"
        
    }
   async getChat(participantId: string,{page="1",size="5"}, user:HydratedDocument<IUser>):Promise<IChat>{
    const chat = await this.chatRepository.findOneChat(
        {filter:{participants:
            {$all:[user._id,toObjectId(participantId)]}},
        options:{
            lean:false,
            populate:[{path:'participants',select:'name profilePicture'}]
        },page,size})
if(!chat){
    throw new NotFoundException("fail to find Matching")
}
        return chat.toJSON()
    }
    async sendMessage({sendTo,content}:{sendTo:string,content:string},sender:HydratedDocument<IUser>){
      let chat = await this.chatRepository.findOneAndUpdate({
        filter:{participants:{$all:[sender._id,toObjectId(sendTo)]},
    type:ChatEnum.ovo},
        update:{
            $addToSet:{
                messages:{
                    content,
                    createdBy:sender._id
                }
            }
        }
      })  
      if(!chat){
        chat = await this.chatRepository.createOne({
            data:{
                createdBy:sender._id,
                type:ChatEnum.ovo,
                participants:[sender._id,toObjectId(sendTo)],
                messages:[
                    {
                        content,
                        createdBy:sender._id
                    }
                ]
            }
        })
      }
    }
      async sendGroupMessage({groupId,content}:{groupId:string,content:string},sender:HydratedDocument<IUser>){
      let chat = await this.chatRepository.findOneAndUpdate({
        filter:{participants:{$in:[sender._id]},
    type:ChatEnum.ovm},
        update:{
            $addToSet:{
                messages:{
                    content,
                    createdBy:sender._id
                }
            }
        }
      })  
      if(!chat){
       throw new NotFoundException("fail to find matching group")
      }
     return chat.roomId
    }
    async createGroup({group, participantsIds=[]}: {group: string, participantsIds: string[]| Types.ObjectId[]}, user?: HydratedDocument<IUser>,file?: Express.Multer.File){
participantsIds = [...new Set(participantsIds.map(ele=>toObjectId(ele)))]
 const users=await this.userRepository.find({
    filter:{_id:{$in:participantsIds},
friends:{$in:[user._id]}}
 })
 console.log(users)
 if(users.length != participantsIds.length){
    throw new NotFoundException("one or more participants not found or not your friend")
 }
 let group_image!:string|undefined
 const room_Id = randomUUID()
const path = `Chat/group/${room_Id}`
 if(file){
    group_image= await this.storageService.uploadAsset({file,
        path,
        })
 }
    const chatgroup= await this.chatRepository.createOne({
        data:{
            createdBy:user._id,
            group,
            participants:[...participantsIds,user._id],
            type:ChatEnum.ovm,
            roomId:room_Id,
            group_image
        }
    })
    return chatgroup.toJSON()
}
   async getChatGroup(groupId: string,{page="1",size="5"}, user:HydratedDocument<IUser>):Promise<IChat>{
    const chat = await this.chatRepository.findOneChat(
        {
            filter:{
            type:ChatEnum.ovm,
            _id:toObjectId(groupId),
            participants:
            {$all:[user._id]}},
        options:{
            lean:false,
            populate:[{path:'participants',select:'name profilePicture'},{path:"messages.createdBy"}]
        },page,size})
if(!chat){
    throw new NotFoundException("fail to find Matching")
}
        return chat.toJSON()
    }
} 
export const chatService = new ChatService()