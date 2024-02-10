const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const fileUpload = require("express-fileupload");
const cors = require('cors')
const todoRoutes = require('./routes/todoRoutes')
const path = require('path')


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

mongoose
.connect(process.env.MONGO_URL)
.then(console.log("Connected to MongoDB"))
.catch(err=>console.log(err));


// app.use("/images", express.static(path.join(__dirname, "public/images")))
//middleware



app.use('/api/todo', todoRoutes);




app.listen(8700, ()=>{
    console.log('backend is running');
})

module.exports = app