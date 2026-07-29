import {Server} from 'socket.io'
import {Server as HttpServerType} from "node:http"
import RedisService from '../../common/services/redis.service.js'
import {decodeToken} from '../../common/services/token.security.js'
import {chatGatway} from '../chat/index.js'
export class RealtimeGateway{
    private io!:Server
    private redisService:typeof RedisService
    private ChatGatway:typeof chatGatway
    constructor(){
this.redisService = RedisService
this.ChatGatway =chatGatway
    }
    authentication =async(socket,next)=>{
  try{
  const {user,decoded} = await decodeToken({token:socket.handshake.auth.authorization || socket.handshake.headers.authorization})
console.log({user:user._id,socketId:socket.id})
socket.data={user,decoded}
await RedisService.addSocket(user._id,socket.id)
next()
  }catch(error){
    next(error)
  }
}
    intializeIo = (httpserver:HttpServerType)=>{
       this.io = new Server(httpserver,{
  cors:{
    origin:"*"

  }
}
)
this.io.use(this.authentication)
this.io.on("connection",async (socket)=>{
console.log({connections:await this.redisService.getSockets(socket.data.user._id)})
 this.ChatGatway.registerEvents(socket,this.io)
socket.on("disconnect", async (reason) => {
  console.log("Disconnected:", socket.id)
  console.log("Reason:", reason)

  const userId = socket.data?.user?._id
  if (!userId) return

  await this.redisService.removeSocket(userId, socket.id)

  const connections: string[] =
    await this.redisService.getSockets(userId)
    console.log({connections})

  if (connections.length < 1) {
    this.io.emit("offline_user", { userId })
  }
})
})
    }
    getIo(){
return this.io
    }
}
export const realTimeGateway =new RealtimeGateway()