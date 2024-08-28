const {TboHotelCityList}=require("../model/grnconnectModel")


const tboHotelCityListServices={
    createtboHotelCityList: async (insertObj) => {
        return await TboHotelCityList.create(insertObj);
    },

    findtboHotelCityList: async (query) => {
        // .select('-status -createdAt -updatedAt')
        return await TboHotelCityList.findOne(query);
    },

    findtboHotelCityList: async (query) => {
        return await TboHotelCityList.find(query);
    },

    deletetboHotelCityListData: async (query) => {
        return await TboHotelCityList.deleteOne(query);
    },

   
    updatetboHotelCityList: async (query, updateObj) => {
        return await TboHotelCityList.findOneAndUpdate(query, updateObj, { new: true });
    },
}

module.exports={tboHotelCityListServices}