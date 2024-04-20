import express from 'express'
import {config} from 'dotenv'
import authRouter from './routes/authRouter'
import cookieParser from 'cookie-parser'

config()
const app = express()
const PORT = process.env.PORT ?? 7000

app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)

app.listen(PORT, () => console.log(`Work on ${PORT}`))