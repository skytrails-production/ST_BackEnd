const status = require("../enums/status");
const agentStaticContentModel=require("../model/agentStaticContentModel")


//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const agentStaticContentServices={
    createAgentStaticContent: async (insertObj) => {
        return await agentStaticContentModel.create(insertObj);
    },

    findAgentStaticContent: async (query) => {
        return await agentStaticContentModel.findOne(query);
    },

    findAgentStaticContentData: async (query) => {
        return await agentStaticContentModel.find(query);
    },

    deleteAgentStaticContentStatic: async (query) => {
        return await agentStaticContentModel.deleteOne(query);
    },

    updateAgentStaticContentStatic: async (query, updateObj) => {
        return await agentStaticContentModel.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={agentStaticContentServices}