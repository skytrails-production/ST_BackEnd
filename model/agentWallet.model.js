const mongoose=require('mongoose');
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const AgentWallet=new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "userb2bs",
    },
    paymentId : {
        type:String,
    },
    easepayid:{
        type:String,
    },
    amount :{
        type:Number,
    },
    bookingType :{
        type:String,
    },
    transactionStatus: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    }      
},
{
    timestamps: true,
  }
)

AgentWallet.plugin(mongoosePaginate);
AgentWallet.plugin(aggregatePaginate)
module.exports=mongoose.model('agentWallets', AgentWallet);