const chatBotModel = require('../../model/chatBotModel/chatBotModel');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//*NODE JS DEVELOPER,This's a services which we'ed mongodb queries to perform  operation on db*//

const chatBotServices = {
  
  // ✅ Create a new chatbot conversation
  createConversation: async (insertObj) => {
    return await chatBotModel.create(insertObj);
  },

  // ✅ Find a specific chatbot conversation by query
  findConversation: async (query) => {
    return await chatBotModel.findOne(query);
  },

  // ✅ Delete a chatbot conversation
  deleteConversation: async (query) => {
    return await chatBotModel.deleteOne(query);
  },

  // ✅ List all chatbot conversations with optional filters
  listConversations: async (query) => {
    return await chatBotModel.find(query).sort({ createdAt: -1 });
  },

  // ✅ Update a chatbot conversation by query
  updateConversation: async (query, updateObj) => {
    return await chatBotModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  // ✅ Count total chatbot conversations based on a filter
  countConversations: async (query) => {
    return await chatBotModel.countDocuments(query);
  },

  // ✅ Paginate chatbot conversations
  paginateConversations: async (body) => {
    const { page, limit } = body;
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    return await chatBotModel.paginate({}, options);
  },

  // ✅ Mark a conversation as a lead
  markAsLead: async (query) => {
    return await chatBotModel.findOneAndUpdate(query, { isLead: true, leadStatus: "NEW" }, { new: true });
  },

  // ✅ Update lead status (NEW, FOLLOW_UP, CLOSED)
  updateLeadStatus: async (query, newStatus) => {
    const validStatuses = ["NEW", "FOLLOW_UP", "CLOSED"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid lead status");
    }
    return await chatBotModel.findOneAndUpdate(query, { leadStatus: newStatus }, { new: true });
  },

  // ✅ Retrieve all leads
  getLeads: async (query) => {
    return await chatBotModel.find({ isLead: true, ...query }).sort({ updatedAt: -1 });
  }
};

module.exports = { chatBotServices };
