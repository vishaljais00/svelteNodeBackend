const {Responce} = require('../helper/sendResponce');
const Todo = require("../model/todo");

// create a post
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

//update a post 
exports.updateTodo = async (req, res) => {
    try {
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

// delete a post
exports.deleteTodo = async(req, res) => {
    try {
            const todo = await Todo.findById(req.params.id);
            if(todo){
                await todo.deleteOne();
                return await Responce(res, 200 , 'Todo deleted successfully')
            }else{
                return await Responce(res, 404 , 'No todo found')
            }
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}


// get a post

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

exports.getTodo = async(req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo)  return await Responce(res, 400 , 'No data found')
        return await Responce(res, 200 , 'Todo fetched successfully', todo)
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}
