import { Router } from "express";
import { handleUserSignup, handleUserLogin, handleUserLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllTodos } from "../controllers/todo.controller.js";

const router = Router()

router.post("/signup", handleUserSignup)
router.post("/login", handleUserLogin)
router.post("/logout", verifyJWT, handleUserLogout)

router.get("/:id/todos", verifyJWT, getAllTodos)

export default router