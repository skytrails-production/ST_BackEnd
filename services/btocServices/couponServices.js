const Coupon = require('../../model/btocModel/couponModel');
const status = require('../../enums/status');
const approvalStatus = require('../../enums/approveStatus');

const couponServices = {
  createCoupon: async (insertObj) => {
    return await Coupon.create(insertObj);
  },

  findCoupon: async (query) => {
    return await Coupon.findOne(query).select('-createdAt -updatedAt');
  },

  getCoupon: async (query) => {
    return await Coupon.findOne(query).select('-createdAt -updatedAt');
  },

  findCouponData: async (query) => {
    return await Coupon.find(query).select('-createdAt -updatedAt ');
  },

  deleteCoupon: async (query) => {
    return await Coupon.deleteOne(query);
  },

  couponList: async (query) => {
    return await Coupon.find(query).populate('userApplied').select('-createdAt -updatedAt');
  },

  updateCoupon: async (query, updateObj) => {
    return await Coupon.findOneAndUpdate(query, updateObj, { new: true }).select('-createdAt -updatedAt');
  },

  paginateCouponSearch: async (body) => {
    let query = {};
    const { page, limit, search } = body;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        // Add more fields as needed
      ];
    }

    let options = {
      page: Number(page) || 1,
      limit: Number(limit) || 8,
      sort: { createdAt: -1 },
    };
    return await Coupon.paginate(query, options);
  },

  // Add more coupon-related services as needed

};

module.exports = { couponServices };
