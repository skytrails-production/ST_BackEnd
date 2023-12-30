const {forexWithme,forexWithcustomer} =  require( "../model/forex.model");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");


  exports.createForex = async (req,res)=>{
   const {enterCity,enterLocation,services,amount,currency,commissionType,mobile} = req.body;
 
   try {
    const response = await forexWithme.create({enterCity,enterLocation,services,amount,currency,commissionType,mobile});
    const msg = "forex created successfully"
    actionCompleteResponse(res,response,msg)
   } catch (error) {
    sendActionFailedResponse(res,{},error.message);
   }
}; 
exports.updateForex = async (req,res)=>{
  const {enterCity,enterLocation,services,amount,currency,commissionType,mobile} = req.body;
  try {
   const response = await forexWithme.findOneAndUpdate({_id:req.body.forexId},{enterCity,enterLocation,services,amount,currency,commissionType,mobile});
   const msg = "forex created successfully"
   actionCompleteResponse(res,response,msg)
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
};
exports.getAllForex = async (req,res)=>{
  try {
   const response = await forexWithme.find();
   const msg = "forex get successfully"
   actionCompleteResponse(res,response,msg)
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
};
exports.deleteForex = async (req,res)=>{
  const {forexId} = req.body;
  try {
   const response = await forexWithme.findOneAndDelete({_id:forexId});
   const msg = "forex deleted successfully"
   actionCompleteResponse(res,response,msg)
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
}; 
exports.createCustomerforex = async (req,res)=> {
  const {name,mobile,service,amount,currency,commissionType,myCommission} = req.body;
   try {
    const response = await forexWithcustomer.create({name,mobile,service,amount,currency,commissionType,myCommission});
    const msg = " Custemor forex created successfully"
    actionCompleteResponse(res,response,msg)
   } catch (error) {
    sendActionFailedResponse(res,{},error.message);
   }
};
exports.getAllCustomerforex = async (req,res)=> {
   try {
    const response = await forexWithcustomer.find();
    const msg = " Custemor forex get successfully"
    actionCompleteResponse(res,response,msg)
   } catch (error) {
    sendActionFailedResponse(res,{},error.message);
   }
};

exports.deleteCustomerforex = async (req,res)=>{
  const {coustomerForexId} = req.body;
  try {
   const response = await forexWithcustomer.findByIdAndRemove(coustomerForexId);
   const msg = " Custemor forex deleted successfully"
   actionCompleteResponse(res,response,msg)
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
}; 
exports.updateCustomerforex = async (req,res)=>{
  const  {name,mobile,service,amount,currency,commissionType,myCommission} = req.body;
  try {
   const response = await forexWithme.findOneAndUpdate({_id:req.body.coustomerForexId},{name,mobile,service,amount,currency,commissionType,myCommission});
   const msg = "forex created successfully"
   actionCompleteResponse(res,response,msg)
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
};