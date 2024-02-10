const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodoSchema = Schema(
  {
        task: {
            type:String,
            max: 500
        },

        done: {
            type:Boolean,
            default: false
        },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", TodoSchema);