const status = require("../enums/status");
const forumQueAnsCommModel = require("../model/forum/forumQueAnsComm")

//**************************************WORK BY */
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const forumQueAnsCommServices = {
    createforumQueAnsComm: async (insertObj) => {
        return await forumQueAnsCommModel.create(insertObj);
    },

    findforumQueAnsComm: async (query) => {
        return await forumQueAnsCommModel.findOne(query);
    },

    findforumQueAnsCommData: async (query) => {
        return await forumQueAnsCommModel.find(query).populate('questionId');
    },

    deleteforumQueAnsComm: async (query) => {
        return await forumQueAnsCommModel.deleteOne(query);
    },


    updateforumQueAnsComm: async (query, updateObj) => {
        return await forumQueAnsCommModel.findOneAndUpdate(query, updateObj, { new: true });
    },


    forumListLookUp: async (body) => {
        const { search, page, limit, questionId, userId } = body;
        if (search) {
            var filter = search;
        }
        let data = filter || ""
        let searchData = [
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: "userDetail",
                }
            },
            {
                $lookup: {
                    from: "forumQue",
                    localField: 'questionId',
                    foreignField: '_id',
                    as: "questionsData",
                }
            },
            {
                $unwind: {
                    path: "$userDetail",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$questionsData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "questionsData.content": { $regex: data, $options: "i" }
                }
            }
        ]
        if (questionId) {
            searchData.push({
                $match: { "questionsData.questionId": mongoose.Types.ObjectId(questionId) }
            })
        }
        if (userId) {
            searchData.push({
                $match: { "userDetail.userId": mongoose.Types.ObjectId(userId) }
            })
        }
        let aggregate = forumQueAnsCommModel.aggregate(searchData)
        let options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            sort: { createdAt: -1 },
        };
        return await forumQueAnsCommModel.aggregatePaginate(aggregate, options)
    }
}

module.exports = { forumQueAnsCommServices }