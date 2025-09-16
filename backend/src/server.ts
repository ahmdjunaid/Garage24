import express from "express"
import dotenv from "dotenv"
import logger from "./logger"
import connectDB from "./config/db"
import http from 'http'
import cors from 'cors'

dotenv.config()
const app = express()
const server = http.createServer(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ["http://localhost:5173", "http://13.204.5.195:5173"],
        credentials: true,
    })
);


app.get('/',(req,res)=>{
    res.send('Hii')
})

connectDB()

const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>{
    logger.info(`Server is running at ${PORT}`)
})