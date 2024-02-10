const {Responce} = require('../helper/sendResponce');
const Todo = require("../model/todo");
const mongoose = require('mongoose');

// create a todo
exports.createTodo = async(req, res) => {
    try {
        const {task} = req.body
        if(!task) return await Responce(res, 400 , 'No Task Found')
        const newTodo = new Todo({task})
        const saveTodo = await newTodo.save();
        return await Responce(res, 200 , 'Todo created successfully',saveTodo)

    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

//update a todo 
exports.updateTodo = async (req, res) => {
    try {

          // Check if the provided ID is a valid ObjectId
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return await Responce(res, 400, 'Invalid todo ID');
        }

        const todoData = await Todo.findById(req.params.id);
        if (!todoData)  return await Responce(res, 400, 'No data found');

        // Use the mongoose model's update method to update the document
        await Todo.findByIdAndUpdate(req.params.id, { $set: req.body });

        return  await Responce(res, 200, 'Todo updated successfully');
    } catch (error) {
        console.error(error);
        return await Responce(res, 500, 'Something went wrong', error);
    }
};

// delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return await Responce(res, 400, 'Invalid todo ID');
        }

        const todo = await Todo.findById(req.params.id);

        if (todo) {
            await todo.deleteOne();
            return await Responce(res, 200, 'Todo deleted successfully');
        } else {
            return await Responce(res, 404, 'No todo found');
        }
    } catch (error) {
        console.log(error);
        return await Responce(res, 500, 'Something went wrong', error);
    }
};


// get All Todo

exports.getAllTodo = async(req, res) => {
    try {
        const todoList = await Todo.find();
        if(todoList.length > 0) return await Responce(res, 200 , 'All todos fetched successfully', todoList)
        return await Responce(res, 200 , 'No Data Found', [])
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

//  get single todo
exports.getTodo = async(req, res) => {
    try {

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return await Responce(res, 400, 'Invalid todo ID');
        }

        const todo = await Todo.findById(req.params.id);
        if(!todo)  return await Responce(res, 400 , 'No data found')
        return await Responce(res, 200 , 'Todo fetched successfully', todo)
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}
