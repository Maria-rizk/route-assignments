import { Types } from "mongoose";
import { IUser } from "./index.js";
import {ChatEnum  } from "../enums/index.js";
export interface IMessage{
content?:string;
attachments?:string[];
likes?:Types.ObjectId[] | IUser[];
tags?:Types.ObjectId[] | IUser[];
createdBy?:Types.ObjectId[] |IUser;

createdAt?:Date;
updatedAt?:Date;
restoredAt?:Date;
deletedAt?:Date;
}
export interface IChat {
  participants:Types.ObjectId[] | IUser[];
createdBy?:Types.ObjectId[] |IUser;
messages:IMessage[];
type:ChatEnum;
//OVM
group:string;
group_image:string;
roomId:string

createdAt?:Date;
updatedAt?:Date;
restoredAt?:Date;
deletedAt?:Date;
}