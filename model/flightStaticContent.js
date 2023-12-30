const mongoose = require('mongoose');
const status=require ('../../enums/status')
// const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null)
const flightStaticContent = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    type:{
        type:String
    },
  
},{timestamps: true})
// flightStaticContent.plugin(mongoosePaginate);
module.exports = mongoose.model("flightStaticContent", flightStaticContent);



const staticContens=mongoose.model("flightStaticContent", flightStaticContent).findOne({})