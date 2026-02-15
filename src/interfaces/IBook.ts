import { Types } from "mongoose"

interface IBook {
  _id: Types.ObjectId
  title: string,
  author: string,
  date: Date,
  genre: string[],
  pages: number,
  editorial: string
}

export {IBook}