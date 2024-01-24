const { required } = require("joi");
const mongoose = require("mongoose");
const { activeStatus } = require("../common/const");
const Schema = mongoose.Schema;


const workCategory = mongoose.model(
    "workCategorys",
    new Schema(
      {
        workName: { type: String },
      },
      {
        timestamps: true,
      }
    )
  );


  const workTaskSchema = new Schema({
    taskName: String,
  });
    

const workTask = mongoose.model(
    "workTasks",
    new Schema(
      {
        workCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "workCategorys",
            required: true,
          },
        workName: { type: String },
        workTask: [workTaskSchema],
        
      },
      {
        timestamps: true,
      }
    )
  );
 
  module.exports = { workCategory, workTask };
  