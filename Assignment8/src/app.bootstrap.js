
import { NODE_ENV, port } from '../config/config.service.js'
import { authenticationDB } from './DB/connection.db.js'
import authenticateToken from './middleware/authenticateToken.js';

import express from 'express'
import cors from 'cors'


import authRouter from './modules/auth/index.js';
import userRouter from './modules/user/index.js';
import noteRouter from './modules/note/index.js';



async function bootstrap() {
    const app = express()
    app.use(cors())

    //convert buffer data
    app.use(express.json())
    //DB
    await authenticationDB()
    //application routing
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/users', authRouter);
    app.use('/users', authenticateToken, userRouter); 
    app.use('/notes', authenticateToken, noteRouter);;


    //invalid routing (catch-all for unmatched routes)
    app.use((req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use((error, req, res, next) => {
        const status = error.cause?.status ?? 500
        return res.status(status).json({
            error_message:
                status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
            stack: NODE_ENV == "development" ? error.stack : undefined
        })
    })
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap