import { Router } from "express";
import { handleSubTodoCreation, handleSubTodoUpdation, handleSubTodoDeletion } from "../controllers/subTodo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/create", verifyJWT, handleSubTodoCreation)
router.patch("/update/:id", verifyJWT, handleSubTodoUpdation)
router.post("/delete/:id", verifyJWT, handleSubTodoDeletion)

export default router