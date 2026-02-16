import express from "express"
import cors from "cors"
import { config } from "dotenv"
import { connectDb } from "./config/database"
import { bookRouter } from "./routes/bookRouter"

config()

const PORT = process.env.PORT

const server = express()
server.use(cors())
server.use(express.json())

server.use('/api/books', bookRouter)

server.listen(PORT, () => {
  try {
    connectDb()
    console.log(`Server listening on port: ${PORT}`)
  } catch (error) {
    const err = error as Error
    console.log(`Port listening failure, error message: ${err.message}`)
  }
})