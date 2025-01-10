const chatBotPromptModel = require('../../model/chatBotModel/chatBotTrainingModel');

const chatBotPromptServices = {

  // ✅ Create a new prompt
  
  createPrompt: async (insertObj) => {
          return await chatBotPromptModel.create(insertObj);
      },
// ✅ Insert multiple prompts
insertManyPrompts: async (promptsArray) => {
    if (!Array.isArray(promptsArray) || promptsArray.length === 0) {
      throw new Error("The input must be a non-empty array of prompts.");
    }
    return await chatBotPromptModel.insertMany(promptsArray);
  },

  // ✅ Find a prompt by query
  findPrompt: async (query) => {
    return await chatBotPromptModel.findOne(query);
  },

  // ✅ Update a prompt by ID
  updatePromptById: async (promptId, updateObj) => {
    return await chatBotPromptModel.findByIdAndUpdate(promptId, updateObj, { new: true });
  },

  // ✅ Delete a prompt by ID
  deletePromptById: async (promptId) => {
    return await chatBotPromptModel.findByIdAndDelete(promptId);
  },

  // ✅ List all prompts with optional filters
  listPrompts: async (query) => {
    return await chatBotPromptModel.find(query).sort({ createdAt: -1 });
  },

  // ✅ Count total prompts
  countPrompts: async (query) => {
    return await chatBotPromptModel.countDocuments(query);
  },

  // ✅ Paginate prompts
  paginatePrompts: async (body) => {
    const { page, limit } = body;
    let query = { isActive: true };
    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    return await chatBotPromptModel.paginate(query, options);
  },

  // ✅ Get active prompts by category
  getPromptsByCategory: async (category) => {
    return await chatBotPromptModel.find({ category, isActive: true });
  },

  // ✅ Search prompts by keyword
  searchPrompts: async (keyword) => {
    const regex = new RegExp(keyword, "i");
    return await chatBotPromptModel.find({ 
      $or: [
        { prompt: regex },
        { response: regex },
        { tags: regex }
      ],
      isActive: true
    });
  }
};

module.exports ={chatBotPromptServices}
