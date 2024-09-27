const visadata =  require( "../model/visadata.model");
const axios = require('axios');
const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");


  exports.createVisa= async (req,res)=>{
   const {name,email,mobile,destination,visaType} = req.body;
 
   try {
    const response = await visadata.create({name,email,mobile,destination,visaType});
    const sendMail = await commonFunction.VisaApplyConfirmationMail(response);
    const msg = "visa created successfully"
    actionCompleteResponse(res,response,msg)
   } catch (error) {
    sendActionFailedResponse(res,{},error.message);
   }
}; 

exports.getAllVisa = async (req,res)=>{
  try {
   const response = await visadata.find();
   const msg = "visa get successfully"
   actionCompleteResponse(res,response,msg)
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
};

// Get VisaCountry

exports.VisaCountry = async (req,res)=>{
  try {
    const response = await axios.get('https://crm.theskytrails.com/Api/VisaCountry/?format=json');
    const countries = response.data; // Assuming the response contains country data

    res.status(200).json({ countries });
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
};

// Get VisaCategory

exports.VisaCategory=async (req,res)=>{
  try {
    const response = await axios.get('https://crm.theskytrails.com/Api/VisaCategory/?format=json');
    const categories = response.data; // Assuming the response contains country data

    res.status(200).json({ categories });
  } catch (error) {
   sendActionFailedResponse(res,{},error.message);
  }
};
// delete particular visa detail with id
exports.deleteVisa = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await visadata.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Item not found" });
    }
    actionCompleteResponse(res,response,"deleted successfully");    
  } catch (error) {
    sendActionFailedResponse(res,{},error.message);
  }
}







