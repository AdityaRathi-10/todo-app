import Todo from "../models/todo.model.js";
import SubTodo from "../models/subTodo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

async function handleTodoCreation(req, res) {
  try {
    const { title, content } = req.body;

    if (!title) {
      throw new ApiError(401, "Title is required");
    }

    const todo = await Todo.create({
      title,
      content,
      createdBy: req.user._id,
    });

    if (!todo) {
      throw new ApiError(401, "Problem occured while creating a todo");
    }

    return res.status(200).redirect(`/user/${req.user._id}/todos`);
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .send(err.message || "Something went wrong!");
  }
}

async function handleTodoUpdation(req, res) {
  try {
    const { title, content } = req.body;
    const id = req.params.id;

    const updatedTodo = {};
    if (title) updatedTodo.title = title;
    if (content) updatedTodo.content = content;

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        $set: updatedTodo,
      },
      {
        new: true,
      }
    );

    if (!todo) {
      return new ApiError(404, "Todo not found");
    }

    return res.status(200).json({ message: updatedTodo });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .send(err.message || "Something went wrong!");
  }
}

async function handleTodoDeletion(req, res) {
  try {
    const _id = req.params.id;

    await Todo.findByIdAndDelete(_id);

    return res.status(200).redirect(`/user/${req.user._id}/todos`);
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .send(err.message || "Something went wrong!");
  }
}

async function getAllTodos(req, res) {
  try {
    const id = req.user._id;

    const todos = await Todo.find({ createdBy: id });
    const user = await User.find({ _id: id });

    const dateWiseTodos = await Todo.aggregate([
      {
        $match: {
          createdBy: id,
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: {
              date: "$createdAt",
              format: "%d/%m/%Y",
              timezone: "Asia/Kolkata",
            },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          todos: {
            $push: {
              title: "$title",
              content: "$content",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              _id: "$_id",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          todos: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    return res.status(200).render("todos", {
      user,
      todos,
      dateWiseTodos,
    });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .send(err.message || "Something went wrong!");
  }
}

async function getAllSubTodos(req, res) {
  try {
    const todo = await Todo.find({ _id: req.params.id });

    let allSubTodos = await Promise.all(
      todo[0].subTodos.map(async (subTodoId) => {
        const subTodo = await SubTodo.findById(subTodoId);
        if (subTodo) {
          const { _id, content, createdAt, isCompleted } = subTodo;
          return { _id, content, createdAt, isCompleted };
        } else {
          return null;
        }
      })
    );

    allSubTodos = allSubTodos.filter((subTodo) => subTodo !== null);

    const groupedSubTodos = allSubTodos.reduce((acc, subTodo) => {
      const formattedDate = subTodo.createdAt.toLocaleDateString();

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }

      acc[formattedDate].push(subTodo);

      return acc;
    }, {});

    const groupedSubTodosArray = Object.keys(groupedSubTodos).map((date) => ({
      date,
      subTodos: groupedSubTodos[date],
    }));

    return res.status(200).render("subTodos", {
      subTodos: groupedSubTodosArray,
      title: todo[0].title,
      id: todo[0]._id,
    });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .send(err.message || "Something went wrong!");
  }
}

export {
  handleTodoCreation,
  handleTodoUpdation,
  handleTodoDeletion,
  getAllSubTodos,
  getAllTodos,
};
