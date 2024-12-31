import SubTodo from "../models/subTodo.model.js";
import Todo from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";

async function handleSubTodoCreation(req, res) {
    try {
        const { content, id } = req.body
        
        if (!content) {
            throw new ApiError(401, "Content is required")
        }
    
        const subTodo = await SubTodo.create({
            content,
            createdBy: req.user._id
        })
    
        await Todo.findByIdAndUpdate(id, {
            $push: {
                subTodos: subTodo._id
            } 
        })
    
        if (!subTodo) {
            throw new ApiError(401, "Problem occured while creating the subTodo")
        }
    
        return res
            .status(200)
            .redirect(`/todo/st/${id}`)
    } catch (err) {
        return res.status(err.statusCode || 500).send(err.message || 'Something went wrong!')
    }
}

async function handleSubTodoUpdation(req, res) {
    try {
        const { content, isCompleted } = req.body
        const id = req.params.id

        if (!content && !isCompleted) {
            throw new ApiError(401, "A field is Required")
        }

        let updatedSubTodo = {}

        if (content) updatedSubTodo.content = content
        if (isCompleted) updatedSubTodo.isCompleted = isCompleted
    
        const subTodo = await SubTodo.findByIdAndUpdate(id, {
            $set: updatedSubTodo
        }, {
            new: true
        })
    
        if (!subTodo) {
            return new ApiError(404, "SubTodo not found")
        }
    
        return res
            .status(200)
            .json({ message: updatedSubTodo })
    } catch (err) {
        return res.status(err.statusCode || 500).send(err.message || 'Something went wrong!')
    }
}

async function handleSubTodoDeletion(req, res) {
    try {
        const { id } = req.body
        const _id = req.params.id
    
        await SubTodo.findByIdAndDelete(_id)
    
        return res
            .status(200)
            .redirect(`/todo/st/${id}`)
    } catch (err) {
        return res.status(err.statusCode || 500).send(err.message || 'Something went wrong!')
    }
}

export {
    handleSubTodoCreation,
    handleSubTodoUpdation,
    handleSubTodoDeletion
}