import { Router } from "express";
import { createBook, deleteBook, getBooks, updateBook } from "../controllers/book.controller";

const bookRouter = Router()

bookRouter.get("/", getBooks)
bookRouter.post("/", createBook)
bookRouter.patch("/:id", updateBook)
bookRouter.delete("/:id", deleteBook)

export {bookRouter}