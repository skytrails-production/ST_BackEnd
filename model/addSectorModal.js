const mongoose=require('mongoose');

const SectorModal=new mongoose.Schema({
    Sector:{
        type:String,
    }, 
},
{
    timestamps: true,
  }
)


module.exports=mongoose.model('sectors', SectorModal);