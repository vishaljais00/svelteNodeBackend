const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const fileUpload = require("express-fileupload");
const cors = require('cors')
const todoRoutes = require('./routes/todoRoutes')
const gqlTodoRoutes = require('./routes/gqlTodoRoutes')
const path = require('path')
const prisma  = require('./prisma/client')
// var { graphqlHTTP } = require("express-graphql")
// var { buildSchema } = require("graphql")


const app = express()
dotenv.config();
app.use(express.json({ limit: "200kb" }));
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024,
      useTempFiles: true,
      tempFileDir: "/tmp/",
    },
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
// app.use(morgan("common"));

app.use(
  cors({
    origin: "*",
  })
);


// mongoose
// .connect(process.env.MONGO_URL)
// .then(console.log("Connected to MongoDB"))
// .catch(err=>console.log(err));


// app.use("/images", express.static(path.join(__dirname, "public/images")))
//middleware


// var schema = buildSchema(`
//     type Todo {
//       task: String
//       done: Boolean
//       id: String
//     }

//     type Query {
//       todos: [Todo]!
//       todo(id: String!): Todo
//     }
// `)


// const root = {
//   todos: () => {
//     return prisma.todos.findMany();
//   },

//   todo: ({ id }) => {
//     return prisma.todos.findUnique({
//       where: {
//         id: id,
//       },
//     });
//   },
// };

// app.use(
//   '/api/gql',
//   graphqlHTTP({
//     schema: schema,
//     rootValue: root,
//     graphiql: true,
//   })
// );


app.use('/api/todo', todoRoutes);
app.use('/api/gql', gqlTodoRoutes);

// if no route found then return common responce 
app.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    message: 'Route not found',
    data: null
  });
});




app.listen(8700, ()=>{
    console.log('backend is running');
})

module.exports = app