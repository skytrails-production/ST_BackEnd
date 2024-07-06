const userPassportEnquiryModel = require('../../model/btocModel/userPassportEnquiry');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const userPassportEnquiryServices={
    createUserPassportEnquiry: async (insertObj) => {
        return await userPassportEnquiryModel.create(insertObj);
    },

    findUserPassportEnquiryData: async (query) => {
        return await userPassportEnquiryModel.findOne(query)
    },

    deleteUserPassportEnquiry: async (query) => {
        return await userPassportEnquiryModel.deleteOne(query);
    },

    userPassportEnquiryList: async (query) => {
        return await userPassportEnquiryModel.find(query)
    },
    userPassportEnquiryListSorted: async (query) => { 
        return await userPassportEnquiryModel.aggregate([
          { $match: query },
          {
            $addFields: {
              statusOrder: {
                $cond: { if: { $eq: ["$resolveStatus", "PENDING"] }, then: 1, else: 2 }
              }
            }
          },
          { $sort: { statusOrder: 1, createdAt: -1 } },
          { $project: { statusOrder: 0 } }
        ]);
      },
      
    updateUserPassportEnquiry: async (query, updateObj) => {
        return await userPassportEnquiryModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalUserPassportEnquiry: async (body) => {
        return await userPassportEnquiryModel.countDocuments(body)
    },
    getUserPassportEnquiry:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
        };
        return await userPassportEnquiryModel.paginate(query, options);
    },
    // getEventPopulate1:async(body)=>{
    //     const { page, limit, search } = body;
    //     const currentDate = new Date().toISOString();
        
    //     // Construct the initial query
    //     let query = {
    //         status: status.ACTIVE,
    //     };
        
    //     // Check if the search parameter is provided
    //     // if (search) {
    //     //     query.$or = [
    //     //         { profession: { $regex: search, $options: 'i' } },
    //     //         { name: { $regex: search, $options: 'i' } },
    //     //         { city: { $regex: search, $options: 'i' } },
    //     //         { 'contactNo.mobile_number': { $regex: search, $options: 'i' } },
    //     //     ];
    //     // }
        
    //     // Add additional criteria for filtering events based on the current date
    //     // query.endDate = { $gt: currentDate };
        
    //     // Set up pagination options
    //     let options = {
    //         page: Number(page) || 1,
    //         limit: Number(limit) || 10,
    //         sort: { createdAt: -1 },
    //     };
        
    //     // Now, retrieve the events using the constructed query and options
    //     const data = await userPassportEnquiryModel.paginate(query, options);
        
    //     return data;
        
    // },
    // getEventPopulate: async (body) => {
    //     const { page, limit, search } = body;
    //     let query = {status:status.ACTIVE,}
    //     if (search) {
    //         query.$or = [
    //             { profession: { $regex: search, $options: 'i' } },
    //             { name: { $regex: search, $options: 'i' } },
    //             { city: { $regex: search, $options: 'i' } },
    //             { 'contactNo.mobile_number': { $regex: search, $options: 'i' } },
    //         ]
    //     }
    //     const currentDate = new Date().toISOString();
    //     query.eventDate = { $gte: currentDate }; 
    //     let pipeline = [
    //         {
    //             $lookup: {
    //                 from: "userBtoC",
    //                 localField: 'userId',
    //                 foreignField: '_id',
    //                 as: "userDetails",
    //             }
    //         },
    //         {
    //             $unwind: {
    //                 path: "$userDetails",
    //                 preserveNullAndEmptyArrays: true
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "skyTrailsEvents",
    //                 localField: 'eventId',
    //                 foreignField: '_id',
    //                 as: "eventDetails",
    //             }
    //         },
    //         {
    //             $unwind: {
    //                 path: "$eventDetails",
    //                 preserveNullAndEmptyArrays: true
    //             }
    //         },
    //         {
    //             $match:query
    //         },
    //         {$project: {
    //             "userDetails.username": 1,
    //             "userDetails.email": 1,
    //             "userDetails.phone.mobile_number": 1,
    //             "eventDetails.title": 1,
    //             "eventDetails.venue": 1,
    //             "eventDetails.isPaid": 1,
    //             name: 1,
    //             city: 1,
    //             profession: 1,
    //             'contactNo.mobile_number': 1,
    //             tickets: 1,
    //             isluckyUser: 1,
    //             deviceType: 1,
    //             eventDate: 1,
    //             createdAt:1
    //           },},
    //           {$sort:{createdAt:-1}}

    //     ];
    //    const aggregate=  userPassportEnquiryModel.aggregate(pipeline);
    //     let options = {
    //         page: Number(page) || 1,
    //         limit: Number(limit) || 10,
    //         sort: { createdAt: -1 },
    //     };
    //     return await userPassportEnquiryModel.aggregatePaginate(aggregate, options);
    //   },
    
}
module.exports ={userPassportEnquiryServices}