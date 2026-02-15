import express from "express"
import { config } from "dotenv"
import { connectDb } from "./config/database"
config()

const PORT = process.env.PORT

const server = express()

server.listen(PORT, () => {
  try {
    connectDb()
    console.log(`Server listening on port: ${PORT}`)
  } catch (error) {
    console.log(`Port listening failure`)
  }
})