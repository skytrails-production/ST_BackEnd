const status = require("../enums/status");
const agentRewardModel=require("../model/agentRewardModel")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const agentRewardServices = {
    createAgentReward: async (insertObj) => {
        return await agentRewardModel.create(insertObj);
    },

    findAgentReward: async (query) => {
        return await agentRewardModel.findOne(query);
    },

    deleteAgentReward: async (query) => {
        return await agentRewardModel.deleteOne(query);
    },

    AgentRewardList:async(query)=>{
        return await agentRewardModel.find(query);
    },
    updateAgentReward: async (query, updateObj) => {
        return await agentRewardModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    AgentRewardListPaginate: async (validatedBody) => {
        let query = { status:status.ACTIVE};
        const { page, limit} = validatedBody;
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { createdAt: -1 ,},
        };
        return await agentRewardModel.paginate(query, options);
    },
}

module.exports = { agentRewardServices };