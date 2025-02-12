const status = require("../../enums/status");
const schemas = require("../../utilities/schema.utilities");
const commentStatus = require("../../enums/commentStatus");
const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode');

//************************************SERVICES**********************************************************/

const { forumQueServices } = require("../../services/forumQueServices");
const {createforumQue,findforumQue,findforumQueData,deleteforumQue,updateforumQue,forumQueListLookUp,} = forumQueServices;
const { userServices } = require("../../services/userServices");
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;
const { forumReportServices } = require("../../services/forumReportServices");
const { createforumReport, findforumReport, findAllForumReports, deleteForumReport, updateForumReport,popolateForeignKeys } = forumReportServices;

exports.reportPost = async (req, res,next) => {
    try {
        const { postId } = req.params;
        const { reason } = req.body;
        const userExist=await findUser({ _id: req.userId,status:status.ACTIVE});
        if (!userExist) {
              return res.status(statusCode.OK).send({
                statusCode: statusCode.NotFound,
                responseMessage: responseMessage.USERS_NOT_FOUND,
              });
            }
        const postExists = await findforumQue({ _id: postId });
        if (!postExists) {
            return res.status(statusCode.OK).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.POST_NOT_FOUND})
        }
        const alreadyReported = await findforumReport({ postId, userId:userExist._id });
        if (alreadyReported) {
            return res.status(statusCode.OK).send({statusCode:statusCode.Conflict,responseMessage:responseMessage.ALREADY_REPORT})
        }
        const obj={ postId, userId:userExist._id, reason}
        const report = await createforumReport(obj);

        return res.status(statusCode.OK).send({
            statusCode: statusCode.OK,
            responseMessage: responseMessage.REPORT_SUCCESS,
            result: report,
        });

    } catch (error) {
        return next(error);
    }
};

exports.getReportedPosts=async(req,res,next)=>{
    try {
        const reports = await popolateForeignKeys({})
    } catch (error) {
        return next(error);
    }
}