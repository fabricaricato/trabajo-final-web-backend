import { model, Schema } from "mongoose"
import { IBook } from "../interfaces/IBook"

const BookSchema = new Schema<IBook>({
  title: {
    type: String,
    trim: true,
    required: true
  },
  author: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  genre: {
    type: [String],
    required: true,
    trim: true
  },
  pages: {
    type: Number,
    min: 1
  },
  editorial: {
    type: String,
    trim: true
  }
}, {
  versionKey: false
})

const Book = model<IBook>('Book', BookSchema)

export {Book}