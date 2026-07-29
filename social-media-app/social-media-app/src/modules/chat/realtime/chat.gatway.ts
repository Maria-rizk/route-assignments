import {chatEvent} from "./chat.event.js"
export class ChatGatway {
private chatEvent:typeof chatEvent
    constructor(){
this.chatEvent = chatEvent
    }
 registerEvents = (socket, io) => {
  console.log("REGISTER EVENTS CALLED ✔")

  console.log("ABOUT TO CALL SAYHI ✔")

  this.chatEvent.sayHi(socket)

  console.log("SAYHI CALLED ✔")
  this.chatEvent.SendMessage(socket, io)
  this.chatEvent.SendGroupMessage(socket, io)
    this.chatEvent.join_room(socket, io)

}
}
export const chatGatway = new ChatGatway()