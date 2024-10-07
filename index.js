import express from 'express'
import { usersRouter } from './Routes/user.js'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 1822

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use('/user', usersRouter)



app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
