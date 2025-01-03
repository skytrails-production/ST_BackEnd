// const status = require("../enums/status");
const forumQueModel=require("../model/forum/forumQue")
const status=require ('../enums/storyStatus')
const mongoose=require("mongoose")
//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const forumQueServices={
    createforumQue: async (insertObj) => {
        return await forumQueModel.create(insertObj);
    },

    findforumQue: async (query) => {
        return await forumQueModel.findOne(query);
    },

    findforumQueData: async (query) => {
        return await forumQueModel.find(query).sort({createdAt:-1});
    },

    deleteforumQue: async (query) => {
        return await forumQueModel.deleteOne(query);
    },

   
    updateforumQue: async (query, updateObj) => {
        return await forumQueModel.findOneAndUpdate(query, updateObj, { new: true });
    },
    forumQueListLookUp1: async (body) => {
      const { search, page, limit, questionId, userId } = body;
      if (search) {
        var filter = search;
      }
      let data = filter || ""
      let searchData = [
        {$match:{status:status.ACTIVE}},
        {
          $lookup: {
            from: "userBtoC",
            localField: 'userId',
            foreignField: '_id',
            as: "userDetail",
          }
        },
        {
          $unwind: {
            path: "$userDetail",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $sort: { updatedAt: -1 } 
        }
      ]
      if (questionId) {
        searchData.push({
          $match: { "questionsData.questionId": mongoose.Types.ObjectId(questionId) }
        })
      }
      let info = forumQueModel.aggregate(searchData)
      // let options = {
      //   page: parseInt(page)||1,
      //   limit: parseInt(limit)||100,
      //   sort: { createdAt: -1 },
      // };
      // const info = await forumQueModel.aggregatePaginate(aggregate, options);
      return info;
    },
    forumQueListLookUpOfUser: async (body) => {
      const { search, page, limit, questionId, userId } = body;
      if (search) {
        var filter = search;
      }
      let data = filter || ""
      let searchData = [
        {$match:{userId:userId,status:[status.ACTIVE,status.PENDING]}},
        {
          $lookup: {
            from: "userBtoC",
            localField: 'userId',
            foreignField: '_id',
            as: "userDetail",
          }
        },
        {
          $unwind: {
            path: "$userDetail",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            content: { $regex: data, $options: "i" }
          }
        },
  
  
      ]
      if (questionId) {
        searchData.push({
          $match: { "questionsData.questionId": mongoose.Types.ObjectId(questionId) }
        })
      }
     
      let aggregate = forumQueModel.aggregate(searchData)
      let options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 1000) || 1000,
        sort: { createdAt: -1 },
      };
      const info = await forumQueModel.aggregatePaginate(aggregate, options);
      return info;
    },
  
    getTopSTories: async (params) => {
      const { search, page, limit, questionId, } = params;
   
      const pipeline = [
        {
          $match: { "image": { $exists: true, $ne: null },"trending":true },
        },
        {
          $lookup: {
            from: "userBtoC",
            localField: "userId",
            foreignField: "_id",
            as: "userDetail",
          },
        },
        {
          $unwind: {
            path: "$userDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {$sort:{likesCount:-1}}
        // {
        //   $match: {
        //     $or: [
        //       { responseCount: { $gte: 0 } },
        //     ],
        //   },
        // },
      ];
   
      // if (questionId) {
      //   pipeline.push({
      //     $match: { "questionsData.questionId": mongoose.Types.ObjectId(questionId) },
      //   });
      // }
      // if (userId) {
      //   pipeline.push({
      //     $match: { "userDetail.userId": mongoose.Types.ObjectId(userId) },
      //   });
      // }
   
      // Sort by createdAt in descending order to get the most recent posts
      // pipeline.push({ $sort: { createdAt: -1 } });
   
      let aggregate = forumQueModel.aggregate(pipeline);
      let options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort:{createdAt:-1}
      };
   
      const result = await forumQueModel.aggregatePaginate(aggregate, options);
      return result;
    },
  
    forumQueListLookUp: async (body) => {
        const { search, page, limit, questionId,userId} = body;
        if (search) {
          var filter = search;
        }
        let data = filter || ""
        let searchData = [
          {
            $match:{isAnyComment:false}
          },
          {
            $lookup: {
              from: "userBtoC",
              localField: 'userId',
              foreignField: '_id',
              as: "userDetail",
            }
          },
          {
            $unwind: {
              path: "$userDetail",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
                content: { $regex: data, $options: "i" }
            }
          },
         
        ]
        if (questionId) {
          searchData.push({
            $match: { "questionsData.questionId": mongoose.Types.ObjectId(questionId) }
          })
        }
        if(userId){
            searchData.push({
                $match: { "userDetail.userId": mongoose.Types.ObjectId(userId) }
              })
        }
        let aggregate = forumQueModel.aggregate(searchData)
        let options = {
          page: parseInt(page, 10) || 1,
          limit: parseInt(limit, 10) || 10,
          sort: { updatedAt: -1 },
        };
        const info=await forumQueModel.aggregatePaginate(aggregate, options);
        return info;
      },
      forumQueListLookUpAdmin: async (body) => {
        const { search, page, limit, questionId, userId } = body;
        if (search) {
          var filter = search;
        }
        let data = filter || ""
        let searchData = [
          {
            $lookup: {
              from: "userBtoC",
              localField: 'userId',
              foreignField: '_id',
              as: "userDetail",
            }
          },
          {
            $unwind: {
              path: "$userDetail",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project:{
              _id:1,
              userId:1,
              likes:1,
              content:1,
              image:1,
              likesCount:1,
              trending:1,
              status:1,
              createdAt:1,
              "userDetail.username":1,

            }
          },
          {
            $sort: {createdAt: -1 }
          }
        ]
        if (questionId) {
          searchData.push({
            $match: { "questionsData.questionId": mongoose.Types.ObjectId(questionId) }
          })
        }
        let info = forumQueModel.aggregate(searchData)
        // let options = {
        //   page: parseInt(page)||1,
        //   limit: parseInt(limit)||100,
        //   sort: { createdAt: -1 },
        // };
        // const info = await forumQueModel.aggregatePaginate(aggregate, options);
        return info;
      },
      forumQueDataList: async (query) => {
        return await forumQueModel.find(query).sort({createdAt:-1}).populate('userId');
    },
}

module.exports={forumQueServices}