import {DatabaseRepository} from "./database.repository.js";
import { IChat} from "../../common/interfaces/index.js";
import {ChatModel} from '../model/chat.model.js'
import { QueryFilter, ProjectionType, QueryOptions } from 'mongoose'
import { HydratedDocument, FlattenMaps } from 'mongoose'
export class ChatRepository extends DatabaseRepository<IChat>{
constructor(){
    super(ChatModel)
}
async findOneChat({filter,projection,options,page,
      size}:
    {
  filter?: QueryFilter<IChat>,
      projection?: ProjectionType<IChat> | null | undefined,
      options?: QueryOptions<IChat> & {lean:false} | null | undefined,
      page?:string,
      size?:string
    }):Promise<HydratedDocument<IChat> | null >;

    async findOneChat({filter,projection,options,page,size}:
    {
  filter?: QueryFilter<IChat>,
      projection?: ProjectionType<IChat> | null | undefined,
      options?: QueryOptions<IChat> & {lean?:true} | null | undefined,
         page?:string,
      size?:string
    }):Promise<  null | FlattenMaps<IChat>>;
async findOneChat({filter,projection,options,page="1",
      size="5"}:
    {
  filter?: QueryFilter<IChat>,
      projection?: ProjectionType<IChat> | null | undefined,
      options?: QueryOptions<IChat> | null | undefined
   ,   page?:string |number,
      size?:string|number }):Promise<HydratedDocument<IChat> | null | FlattenMaps<IChat>>{
        page = parseInt(page as string) 
       size = parseInt(size as string) 
 const doc =  this.model.findOne(filter,{
    messages:{$slice:[-(page * size),size]},
 })
 if(options?.lean) doc.lean(options.lean)
    if(options?.populate){
    doc.populate(options.populate as any)
  }
    return await doc.exec()
}

}