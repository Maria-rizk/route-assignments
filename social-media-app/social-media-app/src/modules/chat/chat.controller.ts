import {Router} from 'express'
import { authentication } from '../../middleware/authentication.middleware.js'
import { successResponse } from '../../common/response/success.response.js';
import { chatService } from './chat.service.js';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../common/interfaces/user.interface.js';
import { cloudFileUpload, fileFieldValidation } from '../../common/utils/index.js';
const router = Router({mergeParams:true})

router.get('/',authentication(),async(req,res,next)=>{
    const chat = await chatService.getChat(req.params.userId as string,req.query,req.user as HydratedDocument<IUser>);
    return successResponse({res,data:{chat}})
}
)
router.get('/group/:groupId',authentication(),async(req,res,next)=>{
    const chat = await chatService.getChatGroup(req.params.groupId as string,req.query,req.user as HydratedDocument<IUser>);
    return successResponse({res,data:{chat}})
}
)
router.post('/group',authentication(),
cloudFileUpload({validation:fileFieldValidation.Image}).single('attachment'),
async(req,res,next)=>{
    const chat = await chatService.createGroup(req.body,req.user as HydratedDocument<IUser>,req.file as Express.Multer.File);
    return successResponse({res,data:{chat}})
}
)
export default router



