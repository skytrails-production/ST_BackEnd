const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

const SsdcModel =require("../model/ssdcModel")



exports.ssdcRegistration = async (req, res) => {

  try {   
       const data=req.body;

       const response=await SsdcModel.create(data);
    msg = "Registration Successfully Submit!";
    actionCompleteResponse(res, response, msg);
  } catch (err) {
    // console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};


exports.ssdcLeads =async (req, res) =>{

    try {
        const response = await SsdcModel.find({});
        const msg="Data Search Successfully";
        actionCompleteResponse(res, response, msg);
    } catch (err) {
      sendActionFailedResponse(res, {}, err.message);
    }
}
