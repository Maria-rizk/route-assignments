import { Router } from 'express'
import {  signup } from './auth.service.js';
import {  login } from './auth.service.js';
import { successResponse } from "../../common/utils/index.js"
const router = Router(); 

router.post("/signup", async (req, res, next) => {
    const account = await signup(req.body)
    return successResponse({res, status: 201, message: 'User created successfully', data: account })
})


router.post("/login", async (req, res, next) => {
    const account = await login(req.body)
    return successResponse({res, data: {account} })
})

export default router