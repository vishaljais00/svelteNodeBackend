const express = require("express");
const router = express.Router();
const todoGQLController = require('../controller/gqlTodoController')


router
    .route("/")
        .post(todoGQLController.graphqlHandler)


module.exports = router