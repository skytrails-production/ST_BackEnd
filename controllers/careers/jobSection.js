const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
/**********************************SERVICES********************************** */
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");

//*****************************************SERVICES************************************************/
const {
  jobSectionServices,
} = require("../../services/careerServices/jobSectionServices");
const {
  createjobSection,
  findjobSectionData,
  deletejobSection,
  jobSectionList,
  updatejobSection,
  countTotaljobSection,
  getjobSection,
} = jobSectionServices;
const {
  jobCategoryServices,
} = require("../../services/careerServices/jobCategoriesServices");
const {
  createJobCategory,
  findjJobCategoryData,
  deleteJobCategory,
  jobCategoryList,
  updateJobCategory,
  countTotalJobCategory,
  getJobCategory,
} = jobCategoryServices;
//***************API'S************************************/
exports.createOpenings = async (req, res, next) => {
  try {
    const {
      skyJobCategoriesId,
      designation,
      aboutCompany,
      jobDescription,
      desiredProfile,
      preferredIndustry,
      jobFunctions,
      responsibilities,
      expirience,
      description,
      jobType,
      locationType,
      country,
      state,
      city,
      openingAt,
      skills,
    } = req.body;
    const isExist = await findjJobCategoryData({ _id: skyJobCategoriesId });
    if (!isExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.JOB_CATEGORY_NOT_FOUND,
      });
    }
    // req.body.skills = skillsArray.map((skill, index) => ({
    //   key: `tech${index + 1}`,
    //   value: skill,
    // }));
    const result = await createjobSection(req.body);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to create opening", error);
    return next(error);
  }
};
exports.getOpening = async (req, res, next) => {
  try {
    const { id } = req.query;
    const result = await findjobSectionData({ _id: id, isHiring: true });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get all openings", error);
    return next(error);
  }
};

exports.getAllOpening = async (req, res, next) => {
  try {
    const result = await jobSectionList({ isHiring: true });
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("error while trying to get all openings", error);
    return next(error);
  }
};

exports.deleteOpening = async (req, res, next) => {
  try {
    const { id } = req.body;
    const isExist = await findjobSectionData({ _id: id });
    if (!isExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.NOT_FOUND,
      });
    }
    const deletedData = await deletejobSection({ _id: id });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DELETE_SUCCESS,
      result: deletedData,
    });
  } catch (error) {
    console.log("error while trying to delete openneing", error);
    return next(error);
  }
};
