import { Book } from "../models/bookModel"
import { Request, Response } from 'express'
import { bookValidate, partialBookValidate } from "../validators/bookValidate"
import mongoose from "mongoose"

const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find()
    return res.status(200).json({success: true, data: books})
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

const createBook = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const validation = bookValidate.safeParse(body)

    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.flatten().fieldErrors })
    } else {
      const newBook = await Book.create(validation.data)
      return res.status(201).json({success: true, data: newBook})
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

const updateBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const updates = req.body
    const validation = partialBookValidate.safeParse(updates)

    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.flatten().fieldErrors })
    } else {
      const updatedBook = await Book.findByIdAndUpdate(id, validation.data, { new: true })
      return res.status(201).json({success: true, data: updatedBook})
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID error, please verify your ID input"
      })
    } else {
      const deletedBook = await Book.findByIdAndDelete(id)

      if (!deletedBook) {
        return res.status(404).json({ success: false, error: "Book not found in database" })
      } else {
        return res.status(201).json({success: true, data: deletedBook})
      }
    }
  } catch (error) {
    const err = error as Error
    return res.status(500).json({success: false, error: err.message})
  }
}

export {getBooks, createBook, updateBook, deleteBook}