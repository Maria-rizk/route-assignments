import { Router } from "express";
import { profile, updateProfile } from "./user.service.js";
const router=Router()

router.get("/:userId" , async (req,res,next)=>{
    const result  = await profile(req.params.userId)
    return res.status(200).json({message:"Profile" , result})
})

router.patch("/:userId" , async (req,res,next)=>{
    const user = await updateProfile(req.params.userId, req.body)
    return res.status(200).json({message:"profile updated", user})
})

export default router