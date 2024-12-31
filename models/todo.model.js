import { Schema, model } from "mongoose";

const todoSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        }, 
        content: {
            type: String
        },
        rating: {
            type: Number
        },
        subTodos: [
            {
                type: Schema.Types.ObjectId,
                ref: "subTodo"
            }
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    }, 
    {
        timestamps: true
    }
)

const Todo = model("todo", todoSchema)

export default Todo