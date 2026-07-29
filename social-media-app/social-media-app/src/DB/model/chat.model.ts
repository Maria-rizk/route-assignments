import {  ChatEnum ,React} from '../../common/enums/index.js';
import { IChat , IMessage} from '../../common/interfaces/index.js';
import mongoose, { HydratedDocument, Types } from "mongoose";

const { Schema, model, models } = mongoose;

const messageSchema = new Schema<IMessage>({

content:{type:String,required:function(this){
    return !this.attachments.length 
}},
attachments:{type:[String]},
likes:[{react:{type:Number ,enum:React }}],
tags:[{type:Types.ObjectId,ref:'User'}],
deletedAt:{type:Date},
restoredAt:{type:Date},
createdBy:{type:Types.ObjectId,ref:'User',required:true}

},{
     timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    collection:"SOCAIL_APP_Message"
})
const ChatSchema = new Schema<IChat>({
 participants:[{type:Types.ObjectId,ref:'User',required:true}],
createdBy:{type:Types.ObjectId,ref:'User',required:true},
messages:{type:[messageSchema],required:true},
type:{type:String,enum:ChatEnum,default:ChatEnum.ovo},
//OVM

group:{type:String,required:function(this){
    return this.type == ChatEnum.ovm
}},
group_image:{type:String,required:function(this){
    return this.type == ChatEnum.ovm
}},
roomId:{type:String},

deletedAt:{type:Date},
restoredAt:{type:Date}
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    optimisticConcurrency:true
    ,collection:"SOCAIL_APP_ChatS"
}) 


ChatSchema.pre(['findOne','find', 'countDocuments'],function(){
    console.log(this.getFilter())
    const query = this.getQuery()
    if(query.paranoid === false){
        this.setQuery({...query})
    }
    else{

        this.setQuery({...query,deletedAt:null})
    }
        
})
ChatSchema.pre(['updateOne','findOneAndUpdate'],function(){
const update = this.getUpdate() as HydratedDocument<IChat>
console.log(update)

if(update.restoredAt){
    this.setUpdate({...update,$unset:{deletedAt:1}})
        this.setQuery({...this.getQuery(),deletedAt:{$exists:true}})

}
if(update.deletedAt){
    this.setUpdate({...update,$unset:{restoredAt:1}})
}
    const query = this.getQuery()
    if(query.paranoid === false){
        this.setQuery({...query})
    }
    else{

        this.setQuery({...query,deletedAt:{$exists: false}})
    }
        console.log(this.getQuery())
})
ChatSchema.pre(['deleteOne','findOneAndDelete'],function(){

    const query = this.getQuery()
    console.log(query.force)
    if(query.force === true){
        this.setQuery({...query})
    }
    else{

        this.setQuery({...query,deletedAt:{$exists: true}})
        
    }                                     
        console.log(this.getQuery())
})
export const ChatModel =
  (models.Chat as mongoose.Model<IChat>) ||
  model<IChat>('Chat', ChatSchema)
