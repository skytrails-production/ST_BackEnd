const userModel = require("../model/user.model");
const userType = require("../enums/userType");
const status = require("../enums/status");
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userServices = {
  createUser: async (insertObj) => {
    return await userModel.create(insertObj);
  },

  findUser: async (query) => {
    return await userModel.findOne(query);
  },

  getUser: async (query) => {
    return await userModel
      .findOne(query)
      .select(
        "-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime"
      );
  },

  findUserData: async (query) => {
    return await userModel
      .findOne(query)
      .select(
        "-createdAt -updatedAt -roles -password -isOnline -firstTime -isApproved"
      );
  },

  deleteUser: async (query) => {
    return await userModel.deleteOne(query);
  },

  userList: async (query) => {
    return await userModel
      .find(query)
      .select(
        "-otp -location -isOnline -coinBalance -isChange -otpExpireTime -firstTime -approveStatus -socialLinks -confirmPassword -password  -isApprove -createdAt -updatedAt"
      );
  },
  updateUser: async (query, updateObj) => {
    return await userModel.findOneAndUpdate(query, updateObj, { new: true });
  },

  paginateUserSearch: async (body) => {
    // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
    let query = { userType: { $nin: [userType.ADMIN, userType.SUBADMIN] } };
    const { page, limit, usersType1, search } = body;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { _id: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }
    if (usersType1) {
      query.userType = usersType1;
    }

    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 8,
      sort: { createdAt: -1 },
    };
    return await userModel.paginate(query, options);
  },
  countTotalUser: async (body) => {
    return await userModel.countDocuments(body);
  },

  aggregatePaginateUser: async (body) => {
    const { page, limit, search, userType } = body;
    if (search) {
      var filter = search;
    }
    let data = filter || "";
  
    let pipeline = [
      {
        $match: {
          userType: 'USER',
          $or: [
            { username: { $regex: data, $options: 'i' } },
            { 'phone.mobile_number': { $regex: data, $options: 'i' } },
            { dob: { $regex: data, $options: 'i' } },
            { City: { $regex: data, $options: 'i' } },
            { State: parseInt(data) },
          ],
        },
      },
    ];
  
    let aggregate = userModel.aggregate(pipeline);
    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: { createdAt: -1 },
    };
    return await userModel.paginate(aggregate, options);
  },
  
  
};

module.exports = { userServices };
