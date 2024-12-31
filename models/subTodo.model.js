import { Schema, model } from "mongoose";

const subTodoSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        isCompleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const SubTodo = model("subTodo", subTodoSchema)

export default SubTodo