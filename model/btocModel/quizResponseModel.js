const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");

const approveStatus = require("../../enums/approveStatus");
const errorType=require("../../enums/errorType")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);

const QuizRespSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "userBtoC", // Reference to the User model
      },
      questionId: {
        type: Schema.Types.ObjectId,
        ref: "quizResponseSchema", // Reference to the User model
      },
      question:{
        type:String
      },
      answer:{
        type:String
      },
      isWinner:{
        type:Boolean,
        default:false
      },
      isFirstResponse:{
        type:Boolean,
        default:false
      },
      reultDate:{
        type:Date,
        // default:new Date()
      }
},{timestamps:true})

QuizRespSchema.plugin(mongoosePaginate);
  
  QuizRespSchema.plugin(aggregatePaginate);
  const quiz = mongoose.model(
    "quizResponseSchema",
    QuizRespSchema
  );
  
  module.exports = quiz;