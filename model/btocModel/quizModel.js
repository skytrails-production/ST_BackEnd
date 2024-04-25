const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");

const approveStatus = require("../../enums/approveStatus");
const errorType=require("../../enums/errorType")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
const { date } = require("joi");
mongoose.pluralize(null);

const QuizSchema = new mongoose.Schema({
    question: {
        type: String
    },
    answer: {
        type: String
    },
    options:{
        opt1:String,
        opt2:String,
        opt3:String,
        opt4:String
    },
    status:{
        type:String,
        enum:[status.ACTIVE,status.BLOCK,status.DELETE],
        default:status.ACTIVE
    },
    quizDate:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})

QuizSchema.plugin(mongoosePaginate);
  
  QuizSchema.plugin(aggregatePaginate);
  const quiz = mongoose.model(
    "quiz",
    QuizSchema
  );
  
  module.exports = quiz;