import mongoose from 'mongoose';
import {DB_URL} from '../config/config.service.js'
import {PostModel} from './model/post.model.js'
import {CommentModel} from './model/comment.model.js'
import {ChatModel} from './model/chat.model.js'

export const connectDB = async () => {

    try{
        await mongoose.connect(DB_URL,{serverSelectionTimeoutMS:30000});
        console.log(`DB connected success`)

        await Promise.all([
            PostModel.syncIndexes(),
            CommentModel.syncIndexes(),
            ChatModel.syncIndexes(),
        ])

    }catch(error){
        console.error(`Failed to connect to MongoDB: ${error}`)
        throw error
    }
}
