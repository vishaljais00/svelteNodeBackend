const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const prisma = require('../prisma/client');
const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
  type Todo {
    task: String
    done: Boolean
    id: String
  }

  type Query {
    todos: [Todo]!
    todoById(id: String!): Todo
  }
`);

const root = {
  todos: async () => {
    try {
      const todos = await prisma.todos.findMany();
      return todos;
    } catch (error) {
      console.error(error);
     
      throw new Error('Something went wrong');
    }
  },
  
  todoById: async ({ id }) => {
    try {
      const todo = await prisma.todos.findUnique({
        where: {
          id: id,
        },
      });
      return todo;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2023") {
        // Handle the specific ObjectID error
        throw new Error('Invalid Id');
      }
      throw new Error('Something went wrong');
    }
  },
};

exports.graphqlHandler = async (req, res) => {
  try {
    const result = await graphql({
      schema: schema,
      rootValue: root,
      source: req.body.query,
    });

    
    if(result.errors){
        return res.status(400).json({
            status: 400,
            message: result.errors[0].message,
            data: null,
          });
    }
    let key = Object.keys(result.data)[0]
    return res.status(200).json({
      status: 200,
      message: 'Todo Fetched Successfully',
      data: result.data[key],
      errors: result.errors,
    });

  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: 'Something went wrong',
      data: null,
    });
  }
};
