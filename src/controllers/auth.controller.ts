import { User } from '../models/userModel'
import { Request, Response } from 'express'
import { userValidate, partialUserValidate } from '../validators/userValidate'
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { config } from 'dotenv'
import { IPayload } from '../interfaces/IPayload'
config()

const JWT_SECRET = process.env.JWT_SECRET as string

const register = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const { email, username, password } = body
    const validation = userValidate.safeParse(body)
    
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.flatten().fieldErrors })
    } else {
      const foundUser = await User.findOne({ email })
      if (foundUser) {
        return res.status(400).json({success: false, message: "Email already registered, please login with it."})
      } else {
        const hash = await bcryptjs.hash(password, 10)
        const newUser = await User.create({ username, email, password: hash })
        return res.status(201).json({success: true, data: "User registered successfully!"})
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const { email, password } = body
    
    const foundUser = await User.findOne({ email })
    if (!foundUser) {
      return res.status(400).json({success: false, message: "User not found in database."})
    } else {
      const validatePassword = await bcryptjs.compare(password, foundUser.password)

      if (!validatePassword) {
        res.status(400).json({success: false, error: "Invalid login details, please try again"})
      } else {
        const payload: IPayload = { _id: foundUser._id, username: foundUser.username, email: foundUser.email, role: foundUser.role }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10m' })
        return res.status(200).json({success: true, token})
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

export {register, login}