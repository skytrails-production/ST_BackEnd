const partenerHotelModel = require('../../model/inventory/hotelPartener');
const userType = require("../../enums/userType");
const status = require("../../enums/status");
const approvalStatus=require("../../enums/approveStatus")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//**************************************WORK BY****************/
//**********CHARU YADAV*****************//
//**********NODE JS DEVELOPER, This is a services which we need mongodb queries to perform operation on db********//

const partenerHotelServices={
    createPartenerHotel: async (insertObj) => {
        return await partenerHotelModel.create(insertObj);
    },

    findPartenerHotelData: async (query) => {
        return await partenerHotelModel.findOne(query)
    },

    deletePartenerHotel: async (query) => {
        return await partenerHotelModel.deleteOne(query);
    },

    partenerHotelList: async (query) => {
        // .populate({path: 'documentTypesId'})
        return await partenerHotelModel.find(query)
    },
    updatePartenerHotel: async (query, updateObj) => {
        return await partenerHotelModel.findOneAndUpdate(query, updateObj, { new: true });
    },

    countTotalpartenerHotel: async (body) => {
        return await partenerHotelModel.countDocuments(body)
    },
    getPartenerHotel:async(body)=>{
        const {page,limit}=body;
        const currentDate = new Date().toISOString();
        let query={status:status.ACTIVE,endDate: { $gt: currentDate }}
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 8,
            sort: { createdAt: -1 },
            populate: {
                path: 'partnerId', // The key to populate, e.g., 'hotelOwner'
                select: 'channelMngrName managerName partnerId email phoneNumber', // The fields to include from the populated key
            },
        };
        return await partenerHotelModel.paginate(query, options);
    },
    paginateHotelData: async (body) => {
        // userType: { $ne: [userType.ADMIN,userType.SUBADMIN] }
        let query = {};
        const { page, limit, search } = body;
        if (search) {
          const searchRegex = new RegExp(search, 'i');
          query.$or = [
            { hotelName: searchRegex },
            { hotelCity: searchRegex },
            { status: searchRegex },
            { hotelCountry: searchRegex },
            { locality: searchRegex },
            { hotelAddress: searchRegex },
          ];
        }
        let options = {
          page: Number(page) || 1,
          limit: Number(limit) || 15,
          populate: {
                path: 'partnerId', // The key to populate, e.g., 'hotelOwner'
                select: 'channelMngrName managerName partnerId email phoneNumber', // The fields to include from the populated key
            },
          sort: { createdAt: -1 },
        };
        return await partenerHotelModel.paginate(query, options);
      },
}
module.exports ={partenerHotelServices}