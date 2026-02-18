import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import { IPayload } from "../interfaces/IPayload"
import { IRequestWithUser } from '../interfaces/IRequestWithUser'
config()

const JWT_SECRET = process.env.JWT_SECRET as string

const validateToken = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  try {
    const header = req.header('Authorization')

    if (!header) {
      return res.status(401).json({success: false, message: "Access denied" })
    } else {

      if (!header.startsWith("Bearer")) {
        return res.status(401).json({ success: false, error: "The token must be in jwt format" })
      } else {
        const token = header.split(' ')[1]
        console.log(token)

        if (!token) {
          return res.status(401).json({ success: false, error: "Invalid token" })
        } else {
          const decoded = jwt.verify(token, JWT_SECRET)
          req.user = decoded as IPayload
          next()
        }
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

export {validateToken}