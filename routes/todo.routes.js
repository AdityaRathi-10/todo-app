import { Router } from "express";
import { handleTodoCreation, handleTodoUpdation, handleTodoDeletion, getAllSubTodos } from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/create", verifyJWT, handleTodoCreation)
router.patch("/update/:id", verifyJWT, handleTodoUpdation)
router.post("/delete/:id", verifyJWT, handleTodoDeletion)

router.get("/st/:id", verifyJWT, getAllSubTodos)

export default router