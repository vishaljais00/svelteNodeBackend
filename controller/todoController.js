const {Responce} = require('../helper/sendResponce');
const prisma = require('../prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

// create a todo
exports.createTodo = async(req, res) => {
    try {
        const {task} = req.body
        if(!task) return await Responce(res, 400 , 'No Task Found')
        const saveTodo = await prisma.todos.create({
            data: {task}
          })
        return await Responce(res, 200 , 'Todo created successfully',saveTodo)

    } catch (error) {
        return await Responce(res, 400 , 'something went wrong',null)
    }
}

exports.updateTodo = async (req, res) => {
    try {

        const todo = await prisma.todos.findFirst({
            where: {
                id: req.params.id
            }
        });
        
        await prisma.todos.update({
            data: req.body,
            where: {
                id: req.params.id
            }
        });

        return await Responce(res, 200, 'Todo updated successfully');
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") {
            // Handle the specific ObjectID error
            return await Responce(res, 400, 'Invalid Id');
        }
        return await Responce(res, 400, 'Error updating todo');
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        
        await prisma.todos.findFirst({
            where: {
                id: req.params.id
            }
        })

        await prisma.todos.delete({
            where: {
                id: req.params.id
            }
        });

        return await Responce(res, 200, 'Todo deleted successfully');
    } catch (error) {
       
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") {
            // Handle the specific ObjectID error
            return await Responce(res, 400, 'Invalid Id');
        }

        return await Responce(res, 400, 'Something went wrong', error);
    }
};

// get All Todo

exports.getAllTodo = async(req, res) => {
    try {
        const todoList = await prisma.todos.findMany()
        if(todoList.length > 0) return await Responce(res, 200 , 'All todos fetched successfully', todoList)
        return await Responce(res, 200 , 'No Data Found', [])
    } catch (error) {
        return await Responce(res, 400 , 'something went wrong',error)
    }
}

//  get single todo
exports.getTodo = async(req, res) => {
    try {
        const todo = await prisma.todos.findFirst({
            where: {
                id: req.params.id
            }
        });
        return await Responce(res, 200 , 'Todo fetched successfully', todo)
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") {
            // Handle the specific ObjectID error
            return await Responce(res, 400, 'Invalid Id');
        }
        return await Responce(res, 400 , 'something went wrong',error)
    }
}


