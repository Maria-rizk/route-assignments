import {chatService} from '../chat.service.js'
import {SocketValidation} from '../../../middleware/index.js'
import * as validation from '../chat.validation.js'
import redis from "../../../common/services/redis.service.js";
export class ChatEvent{
  private redisService : typeof redis
    private chatservice: typeof chatService
    constructor(){
      this.redisService = redis
this.chatservice= chatService
    }
sayHi = (socket) => {
  socket.on("sayHi", async (data) => {
    try {
      await SocketValidation(validation.SayHi, data)

      console.log("Received:", data)

      const result = this.chatservice.SayHi()

      socket.emit("sayHi", result)

    } catch (error: any) {
      socket.emit("custom_error", {
        message: error.message || "Error",
        details: error.issues || null
      })
    }
  })
}
SendMessage=(socket,io)=>{
return socket.on("sendMessage",async({sendTo,content}:{sendTo:string,content:string})=>{
  try{
    console.log({sendTo,content})
await this.chatservice.sendMessage({sendTo,content},socket.data.user)

io.to(await this.redisService.getSockets(socket.data.user._id)).emit("successMessage",{content,sendTo})
const receiverSocketIds = await this.redisService.getSockets(sendTo)
if(receiverSocketIds.length){
  socket.to(receiverSocketIds).emit("newMessage",{content,from:socket.data.user})
}
}catch(error){
    console.log(error)
    socket.emit("custom_error",error)
  }
})
}
SendGroupMessage=(socket,io)=>{
return socket.on("sendGroupMessage",async({groupId,content}:{groupId:string,content:string})=>{
  try{
    console.log({groupId,content})
const roomId =await this.chatservice.sendGroupMessage({groupId,content},socket.data.user)

io.to(await this.redisService.getSockets(socket.data.user._id)).emit("successMessage",{content,sendTo:groupId})

  socket.to(roomId).emit("newMessage",{content,groupId,from:socket.data.user})

}catch(error){
    console.log(error)
    socket.emit("custom_error",error)
  }
})
}
join_room(socket,io){
return socket.on("join_room",async({roomId}:{roomId:string})=>{
  try{
    socket.join(roomId)
  }catch(error){
    socket.emit("custom_error",error)
  }
})
}
}
export const chatEvent = new ChatEvent()