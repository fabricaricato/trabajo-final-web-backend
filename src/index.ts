import express, { Request, Response } from "express"
import cors from "cors"
import { config } from "dotenv"
import { connectDb } from "./config/database"
import { bookRouter } from "./routes/bookRouter"
import { authRouter } from "./routes/authRouter"
import { validateToken } from "./middleware/authMiddleware"
config()
connectDb()

const PORT = process.env.PORT

const server = express()

server.use(cors())
server.use(express.json())

server.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>RESTful API Running! 🚀</h1>
    <p>Welcome to the Book Management API.</p>
    <p>Main Endpoints:</p>
    <ul>
      <li>POST /api/auth/register (Register user)</li>
      <li>POST /api/auth/login (Login / Get Token)</li>
      <li>GET /api/books (View books - Token Required)</li>
    </ul>
    <h4>Please check the project's README.md file to get started!</h4>
    <p>Developed by Fabrizio Caricato</p>
  `)
})

server.use('/api/books', validateToken, bookRouter)
server.use('/api/auth', authRouter)

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    try {
      console.log(`Server listening on port: ${PORT}`)
    } catch (error) {
      const err = error as Error
      console.log(`Port listening failure, error message: ${err.message}`)
    }
  })
}

export default server