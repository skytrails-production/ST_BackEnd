const mongoose = require("mongoose");
const aws = require("aws-sdk");
const inventoryModel = require("../../model/inventory/hotelinventoryAuth"); // Correct import path
const inventoryHotelForm = require("../../model/inventory/hotelForm");
const hotelInventory = require("../../model/inventory/hotelPartener");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const commonFunction = require("../../utilities/commonFunctions");
//********************************Services******************************************************/
const {
  partenerHotelServices,
} = require("../../services/inventory/partenerHotelServices");
const {
  createPartenerHotel,
  findPartenerHotelData,
  deletePartenerHotel,
  partenerHotelList,
  updatePartenerHotel,
  countTotalpartenerHotel,
  getPartenerHotel,
} = partenerHotelServices;
const {
  hotelinventoryAuthServices,
} = require("../../services/inventory/partnerAuthServices");
const approveStatus = require("../../enums/approveStatus");
const {
  createhotelinventoryAuth,
  findhotelinventoryAuthData,
  deletehotelinventoryAuth,
  hotelinventoryAuthList,
  updatehotelinventoryAuth,
  countTotalhotelinventoryAuth,
  gethotelinventoryAuth,
} = hotelinventoryAuthServices;

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    }

    // Fetch user from the database
    const user = await inventoryModel.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    // If authentication is successful (no password check as per your requirement)
    res.status(200).json({ message: "Login successful.", user });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, hotelName, hotelCity, hotelState } = req.body;

    // Check if the user already exists
    const isUserExist = await inventoryModel.findOne({ email: email });
    if (isUserExist) {
      return res.status(409).send({
        status: 409,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new inventoryModel({
      email: email,
      password: hashedPassword,
      hotelName: hotelName,
      hotelCity: hotelCity,
      hotelState: hotelState,
    });

    // Save the user to the database
    const result = await newUser.save();

    // Send success response
    return res.status(200).send({
      status: 200,
      message: "User registered successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return next(error);
  }
};

exports.createHotelForm1 = async (req, res) => {
  const reqData = JSON.parse(req.body.data);
  const hotelImageFiles = req.files.hotelImages || [];
  const roomImageFiles = req.files.roomsImages || [];

  const hotelImageUrls = [];
  const roomImageUrls = [];
  // Create a new hotel form object
  const {
    hotelName,
    hotelCity,
    hotelAddress,
    hotelCountry,
    hotelState,
    panCard,
    Rating,
    Price,
    addFacility,
  } = reqData;

  for (const file of files[0]) {
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `inventoryImages/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    try {
      // Upload file to S3
      const data = await s3.upload(s3Params).promise();
      // Store the URL of the uploaded image
      imageUrls.push(data.Location);
    } catch (err) {
      console.error("Error uploading file to S3:", err);
      return res.status(500).send(err);
    }
  }

  try {
    // Save the new hotel form to the database

    const newHotelForm = new inventoryHotelForm({
      hotelName,
      hotelAddress,
      hotelCity,
      hotelCountry,
      hotelState,
      panCard,
      Rating,
      Price,
      addFacility,
      hotelImages: imageUrls,
    });

    const formResult = await newHotelForm.save();
    res.status(200).send({
      status: 200,
      message: "Hotel Form created successfully",
      result: formResult,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createHotelForm = async (req, res) => {
  const reqData = JSON.parse(req.body.data);
  console.log("req.files==============", req.files);
  const hotelImageFiles = req.files.hotelImages || [];
  const roomImageFiles = req.files.roomsImages || [];

  const hotelImageUrls = [];
  const roomImageUrls = [];

  // Extract data from the request
  const {
    hotelName,
    hotelCity,
    hotelAddress,
    hotelCountry,
    hotelState,
    panCard,
    Rating,
    Price,
    addFacility,
  } = reqData;

  // Upload hotel images to S3
  for (const file of hotelImageFiles) {
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `hotelImages/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    try {
      const data = await s3.upload(s3Params).promise();
      hotelImageUrls.push(data.Location);
    } catch (err) {
      console.error("Error uploading hotel image to S3:", err);
      return res.status(500).send(err);
    }
  }

  // Upload room images to S3
  for (const file of roomImageFiles) {
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `roomImages/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    try {
      const data = await s3.upload(s3Params).promise();
      roomImageUrls.push(data.Location);
    } catch (err) {
      console.error("Error uploading room image to S3:", err);
      return res.status(500).send(err);
    }
  }

  try {
    // Create a new hotel form object
    const newHotelForm = new inventoryHotelForm({
      hotelName,
      hotelAddress,
      hotelCity,
      hotelCountry,
      hotelState,
      panCard,
      Rating,
      Price,
      addFacility,
      hotelImages: hotelImageUrls,
      rooms: roomImageUrls.map((url, index) => ({
        roomImage: url,
        roomDetails: reqData.rooms[index], // Assuming room details are included in the request data
      })),
    });

    const formResult = await newHotelForm.save();
    res.status(200).send({
      status: 200,
      message: "Hotel Form created successfully",
      result: formResult,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.createhotelinventory = async (req, res, next) => {
//   try {
//     let {
//       hotelName,
//       description,
//       hotelCity,
//       hotelCountry,
//       hotelState,
//       panCard,
//       rating,
//       typeOfRoom,
//       meal,
//       mealType,
//       cityCode,
//       amenities,
//       hotelAddress,
//       availableRooms,
//       totalRooms,
//       location,
//       locality,
//       hotelCode,
//       facilities,
//       bookingPolicy,
//       priceDetails,
//       roomArr,
//       safe2Stay,
//       hotelPolicy,
//       availableDate,
//       startFrom,
//     } = req.body;
//     console.log("req.body==============",req.body);
//     const isUserExist = await findhotelinventoryAuthData({ _id: req.userId });
//     if (!isUserExist) {
//       return res.status(statusCode.OK).send({
//         statusCode: statusCode.NotFound,
//         responseMessage: responseMessage.PARTNER_NOT_FOUND,
//       });
//     }
//     console.log("isUserExist======", isUserExist);
//     req.body.partnerId = isUserExist._id;
//     // return;

//     if (typeof roomArr === "string") {
//       roomArr = JSON.parse(roomArr);
//     }
//     if (typeof mealType === "string") {
//       mealType = JSON.parse(mealType);
//     }

//     if (typeof location === "string") {
//       location = JSON.parse(location);
//     }

//     if (typeof facilities === "string") {
//       facilities = JSON.parse(facilities);
//     }
//     if (typeof amenities === "string") {
//       amenities = JSON.parse(amenities);
//     }

//     if (typeof hotelPolicy === "string") {
//       hotelPolicy = JSON.parse(hotelPolicy);
//     }
//     let rooms;
//     let hotelImageUrls;
//     // hotelPolicy
//     if(req.files){
//       const hotelImageFiles = req.files.hotelImages || [];
//     const roomImageFiles = req.files.roomsImages || [];

//      hotelImageUrls = await Promise.all(
//       hotelImageFiles.map(async (file) => {
//         const imageUrl = await commonFunction.getImageUrlAWS(file); // Adjust to your upload function
//         return imageUrl;
//       })
//     );
//     const roomImageUrls = await Promise.all(
//       roomImageFiles.map(async (file) => {
//         const imageUrl = await commonFunction.getImageUrlAWS(file);
//         return imageUrl;
//       })
//     );
//     // Distribute room images to each room
//     const imagesPerRoom = Math.ceil(roomImageUrls.length / roomArr.length);
//      rooms = roomArr.map((room, index) => {
//       const start = index * imagesPerRoom;
//       const end = start + imagesPerRoom;
//       return {
//         ...room,
//         roomsImages: roomImageUrls.slice(start, end),
//       };
//     });
//     }
    

//     const obj = {
//       partnerId: isUserExist._id,
//       hotelName,
//       description,
//       hotelCity,
//       hotelCountry,
//       hotelState,
//       panCard,
//       rating,
//       hotelImages: hotelImageUrls,
//       typeOfRoom,
//       locality,
//       meal,
//       mealType,
//       cityCode,
//       amenities,
//       hotelAddress,
//       availableRooms,
//       totalRooms,
//       location,
//       hotelCode,
//       facilities,
//       bookingPolicy,
//       priceDetails,
//       rooms: rooms,
//       hotelPolicy,
//       safe2Stay,
//       availableDate,
//       startFrom,
//     };
//     const result = await createPartenerHotel(obj);
//     return res.status(statusCode.OK).send({
//       statusCode: statusCode.OK,
//       responseMessage: responseMessage.CREATED_SUCCESS,
//       result: result,
//     });
//   } catch (error) {
//     console.log("error while trying to create details", error);
//     return next(error);
//   }
// };

exports.createhotelinventory = async (req, res, next) => {
  try {
    let {
      hotelName,
      description,
      hotelCity,
      hotelCountry,
      hotelState,
      panCard,
      CompanyName,
      gstNo,
      rating,
      typeOfRoom,
      meal,
      mealType,
      cityCode,
      amenities,
      hotelAddress,
      availableRooms,
      totalRooms,
      location,
      locality,
      hotelCode,
      facilities,
      bookingPolicy,
      priceDetails,
      roomArr,
      safe2Stay,
      hotelPolicy,
      availableDate,
      startFrom,
    } = req.body;
    const isUserExist = await findhotelinventoryAuthData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }

    req.body.partnerId = isUserExist._id;

    // Helper function to parse fields if they are strings
    const parseField = (field) => (typeof field === "string" ? JSON.parse(field) : field);

    roomArr = parseField(roomArr);
    mealType = parseField(mealType);
    location = parseField(location);
    facilities = parseField(facilities);
    amenities = parseField(amenities);
    hotelPolicy = parseField(hotelPolicy);
    safe2Stay =parseField(safe2Stay);
    bookingPolicy  = parseField(bookingPolicy);
    typeOfRoom =parseField(typeOfRoom);
    let hotelImageUrls = [];
    let rooms = roomArr || [];
    // Process file uploads if present
    if (req.files) {
      const hotelImageFiles = req.files.hotelImages || [];
      const roomImageFiles = req.files.roomsImages || [];

      hotelImageUrls = await Promise.all(
        hotelImageFiles.map(async (file) => await commonFunction.getInventoryImageUrlAWS(file))
      );

      const roomImageUrls = await Promise.all(
        roomImageFiles.map(async (file) => await commonFunction.getInventoryImageUrlAWS(file))
      );

      // Distribute room images to each room
      if (roomArr && roomArr.length > 0) {
        const imagesPerRoom = Math.ceil(roomImageUrls.length / roomArr.length);
        rooms = roomArr.map((room, index) => {
          const start = index * imagesPerRoom;
          const end = start + imagesPerRoom;
          return {
            ...room,
            roomsImages: roomImageUrls.slice(start, end),
          };
        });
      }
    }

    const obj = {
      partnerId: isUserExist._id,
      hotelName,
      description,
      hotelCity,
      hotelCountry,CompanyName,
      gstNo,
      hotelState,
      panCard,
      rating,
      hotelImages: hotelImageUrls,
      typeOfRoom: typeOfRoom || [],
      locality,
      meal,
      mealType: mealType || [],
      cityCode,
      amenities: amenities || [],
      hotelAddress,
      availableRooms,
      totalRooms,
      location: location || { type: "Point", coordinates: [0, 0] },
      hotelCode,
      facilities: facilities || [],
      bookingPolicy: bookingPolicy || [],
      priceDetails,
      rooms,
      hotelPolicy: hotelPolicy || [],
      safe2Stay: safe2Stay || [],
      availableDate,
      startFrom,
    };

    const result = await createPartenerHotel(obj);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.CREATED_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to create details:", error);
    return next(error);
  }
};


exports.getAllHotelInventory = async (req, res, next) => {
  try {
    // Get the current date in ISO format
    const currentDate = new Date().toISOString();
    const result = await partenerHotelList({
      status: status.ACTIVE,
      availableRooms: { $gte: 1 },
      availableDate: { $gte: currentDate },
    });
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    const finalResult = {
      result,
      Arrlength: result.length,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: finalResult,
    });
  } catch (error) {
    console.log("Error while trying to get all inventory data", error);
    return next(error);
  }
};

exports.getHotelInventoryById = async (req, res, next) => {
  try {
    const { hotelId } = req.query;
    const result = await findPartenerHotelData({ _id: hotelId });
    if (!result) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to get all inventory data", error);
    return next(error);
  }
};

exports.updatePartnerHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.query;
    const {
      hotelName,
      description,
      hotelCity,
      hotelCountry,
      hotelState,
      panCard,
      rating,
      status,
      typeOfRoom,
      meal,
      mealType,
      cityCode,
      amenities,
      hotelAddress,
      availableRooms,
      totalRooms,
      location,
      locality,
      hotelCode,
      facilities,
      bookingPolicy,
      priceDetails,
      roomArr,
      safe2Stay,
      hotelPolicy,
    } = req.body;

    const isHotelExist = await findPartenerHotelData({ _id: hotelId });
    if (!isHotelExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.HOTEL_NOT_FOUND,
      });
    }
    const updateData = await updatePartenerHotel(
      { _id: isHotelExist._id },
      req.body
    );
    if (updateData) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.UPDATE_SUCCESS,
        result: updateData,
      });
    }
  } catch (error) {
    console.log("Error while trying to update hotel Details", error);
    return next(error);
  }
};

exports.changeHotelPrice = async (req, res, next) => {
  try {
    const { amount, hotelId, roomId, netName } = req.body;
    const isHotelExist = await findPartenerHotelData({ _id: hotelId });

    if (!isHotelExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.HOTEL_NOT_FOUND,
      });
    }

    // Find the room within the hotel's rooms array and update the price
    const room = isHotelExist.rooms.id(roomId);
    if (!room) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: "Room not found",
      });
    }

    // Find the specific net item by netName and update its amount
    const netItemToUpdate = room.priceDetails.net.find(
      (net) => net.name === netName
    );
    if (!netItemToUpdate) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: "Net item not found",
      });
    }

    // Update the amount of the found net item
    netItemToUpdate.amount = amount;

    // Update query to set the net prices
    const result = await updatePartenerHotel(
      { _id: hotelId, "rooms._id": roomId },
      { $set: { "rooms.$.priceDetails.net": room.priceDetails.net } }
    );

    console.log("Updated room:", room);

    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
  } catch (error) {
    console.log("Error while trying to update price:", error);
    return next(error);
  }
};

exports.changeHotelPrice1 = async (req, res, next) => {
  try {
    const { amount, hotelId, roomId, netName } = req.body;

    // Check if the hotel exists
    const isHotelExist = await findPartenerHotelData({ _id: hotelId });
    if (!isHotelExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.HOTEL_NOT_FOUND,
      });
    }

    // Find the room within the hotel's rooms array
    const room = isHotelExist.rooms.id(roomId);
    if (!room) {
      return res.status(404).send({
        statusCode: 404,
        responseMessage: "Room not found",
      });
    }

    // Find the specific net item by netName and get its index
    const netIndex = room.priceDetails.net.findIndex(
      (net) => net.name === netName
    );
    if (netIndex === -1) {
      return res.status(404).send({
        statusCode: 404,
        responseMessage: "Net item not found",
      });
    }

    // Construct the update path dynamically
    const updatePath = `rooms.$.priceDetails.net.${netIndex}.amount`;

    // Update the hotel document in the database
    const result = await updatePartenerHotel(
      { _id: hotelId, "rooms._id": roomId },
      { $set: { [updatePath]: amount } }
    );

    // Log the updated room for debugging purposes
    console.log("Updated room:", room);

    // Return a success response
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.UPDATE_SUCCESS,
      result: result,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.log("Error while trying to update price:", error);
    return next(error);
  }
};

exports.deleteInventoryData = async (req, res, next) => {
  try {
    const { hotelInventoryId } = req.body;
    const isExis = await deletePartenerHotel({ _id: hotelInventoryId });
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DELETE_SUCCESS,
      result: isExis,
    });
  } catch (error) {
    console.log("error while trying to delete", error);
    return next(error);
  }
};

exports.getAllHotelInventoryofPartner = async (req, res, next) => {
  try {
    // Get the current date in ISO format
    // const currentDate = new Date().toISOString();
    const isUserExist = await findhotelinventoryAuthData({
      _id: req.userId,
    });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    const result = await partenerHotelList({partnerId:isUserExist._id,
      status: status.ACTIVE,
      // availableRooms: { $gte: 1 },
    });
    if (result.length < 1) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.DATA_NOT_FOUND,
        result: result,
      });
    }
    const finalResult = {
      result,
      Arrlength: result.length,
    };
    return res.status(statusCode.OK).send({
      statusCode: statusCode.OK,
      responseMessage: responseMessage.DATA_FOUND,
      result: finalResult,
    });
  } catch (error) {
    console.log("Error while trying to get all inventory data", error);
    return next(error);
  }
};


exports.uploadImagesOfInventory = async (req, res, next) => {
  try {
    const { hotelId } = req.body;

    const isUserExist = await findhotelinventoryAuthData({ _id: req.userId });
    if (!isUserExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.PARTNER_NOT_FOUND,
      });
    }
    console.log("isUserExist===========", isUserExist._id);

    const isHotelExist = await findPartenerHotelData({ _id: hotelId, partnerId: isUserExist._id });
    if (!isHotelExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.HOTEL_NOT_FOUND,
      });
    }
    console.log("isHotelExist===========", isHotelExist._id);

    let hotelImageUrls = [];
    let roomImageUrls = [];
    let rooms = isHotelExist.rooms || [];

    if (req.files) {
      const hotelImageFiles = req.files.hotelImages || [];
      const roomImageFiles = req.files.roomsImages || [];

      hotelImageUrls = await Promise.all(
        hotelImageFiles.map(async (file) => {
          const url = await commonFunction.getImageUrlAWS(file);
          return url;
        })
      );

      roomImageUrls = await Promise.all(
        roomImageFiles.map(async (file) => {
          const url = await commonFunction.getImageUrlAWS(file);
          return url;
        })
      );

      console.log("roomImageUrls===========", roomImageUrls);
      // console.log("hotelImageUrls===========", hotelImageUrls);

      if (rooms.length > 0) {
        const imagesPerRoom = Math.ceil(roomImageUrls.length / rooms.length);
        console.log("imagesPerRoom===========", imagesPerRoom);

        rooms = rooms.map((room, index) => {
          const start = index * imagesPerRoom;
          const end = start + imagesPerRoom;
          const updatedRoom = {
            ...room,
            roomsImages: room.roomsImages ? room.roomsImages.concat(roomImageUrls.slice(start, end)) : roomImageUrls.slice(start, end),
          };
          // console.log(`updatedRoom [${index}]==========`, updatedRoom);
          return updatedRoom;
        });
      }
    }

    // console.log("rooms before update===========", rooms);

    const obj = {
      hotelImages: hotelImageUrls,
      rooms: rooms
    };

    console.log("obj to update===========", obj);

    const result = await updatePartenerHotel({ _id: isHotelExist._id }, obj);

    // console.log("update result===========", result);
    return res.status(statusCode.OK).send({
      statusCode: statusCode.ACCEPTED,
      responseMessage: responseMessage.UPLOAD_SUCCESS,
      result: result,
    });

  } catch (error) {
    console.log("error while trying to upload images", error);
    return next(error);
  }
};

exports.uploadImagesOfRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.body; // Assuming roomId is passed in the body
    // Check if user exists
    // const isUserExist = await findhotelinventoryAuthData({ _id: req.userId });
    // if (!isUserExist) {
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.NotFound,
    //     responseMessage: responseMessage.PARTNER_NOT_FOUND,
    //   });
    // }
    // partnerId: isUserExist._id
    // Check if hotel exists for the partner
    const isHotelExist = await findPartenerHotelData({ _id: hotelId, });
    if (!isHotelExist) {
      return res.status(statusCode.OK).send({
        statusCode: statusCode.NotFound,
        responseMessage: responseMessage.HOTEL_NOT_FOUND,
      });
    }
const roomData=isHotelExist.rooms
    // Upload images to AWS and collect URLs
    let imageUrls = [];
    if(req.files||req.file){
      // const imageUrl = await commonFunction.getImageUrlAWS(file);
      const roomImageFiles = req.files || [];
      const roomImageUrls = await Promise.all(
        roomImageFiles.map(async (file) => await commonFunction.getInventoryImageUrlAWS(file))
      );      
      imageUrls=roomImageUrls;
      console.log("imageUrls==========",imageUrls);
      
    }
    console.log("roomData==========",roomData.length);
    
    for(var i=0;i<=roomData.length;i++){
      console.log("0987654fgnm,.mnbvcxzxcvbnm,",roomData);
       
      const imagesPerRoom = Math.ceil(imageUrls.length / roomData.length);
      console.log("imagesPerRoom=============",imagesPerRoom);r                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    }
    // if (roomData.length > 0) {
    //   for (const file of isHotelExist.rooms) {
    //     const imageUrl = await commonFunction.getImageUrlAWS(file);
    //     imageUrls.push(imageUrl);
    //   }

    //   // Update hotel document with new image URLs
    //   await updatePartenerHotel(  { _id: hotelId, "rooms._id": roomId },{ $push: { "rooms.$.roomImages": { $each: imageUrls } } })
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.Success,
    //     responseMessage: responseMessage.IMAGES_UPLOADED_SUCCESSFULLY,
    //     data: imageUrls,
    //   });
    // } else {
    //   return res.status(statusCode.OK).send({
    //     statusCode: statusCode.BadRequest,
    //     responseMessage: responseMessage.NO_IMAGES_PROVIDED,
    //   });
    // }

    // if(roomData.length>0){
    //   const  imageUrl=await commonFunction.getImageUrlAWS(file)
    // }
  } catch (error) {
    console.log("Error while trying to upload room images", error);
    return next(error);
  }
};

// Function to update the hotel document with new image URLs
// const updateHotelWithRoomImages = async (hotelId, imageUrls) => {
//   // Assuming Hotel is your hotel model
//   await Hotel.updateOne({ _id: hotelId }, { $push: { roomImages: { $each: imageUrls } } });
// };


// exports.uploadImagesOfInventory = async (req, res, next) => {
//   try {
//     const { hotelId } = req.body;

//     const isUserExist = await findhotelinventoryAuthData({ _id: req.userId });
//     if (!isUserExist) {
//       return res.status(statusCode.OK).send({
//         statusCode: statusCode.NotFound,
//         responseMessage: responseMessage.PARTNER_NOT_FOUND,
//       });
//     }
//     console.log("isUserExist===========", isUserExist._id);

//     const isHotelExist = await findPartenerHotelData({ _id: hotelId, partnerId: isUserExist._id });
//     if (!isHotelExist) {
//       return res.status(statusCode.OK).send({
//         statusCode: statusCode.NotFound,
//         responseMessage: responseMessage.HOTEL_NOT_FOUND,
//       });
//     }
//     console.log("isHotelExist===========", isHotelExist._id);

//     let hotelImageUrls = [];
//     let roomImageUrls = [];
//     let rooms = isHotelExist.rooms || [];

//     if (req.files) {
//       const hotelImageFiles = req.files.hotelImages || [];
//       const roomImageFiles = req.files.roomsImages || [];
//       console.log("============req.files", req.files);
//       hotelImageUrls = await Promise.all(
//         hotelImageFiles.map(async (file) => {
//           const url = await commonFunction.getImageUrlAWS(file);
//           console.log("hotelImage URL===========", url);
//           return url;
//         })
//       );
//       roomImageUrls = await Promise.all(
//         roomImageFiles.map(async (file) => {
//           const url = await commonFunction.getImageUrlAWS(file);
//           console.log("roomImage URL===========", url);
//           return url;
//         })
//       );
//       if (rooms.length > 0) {
//         const imagesPerRoom = Math.ceil(roomImageUrls.length / rooms.length);
//         console.log("imagesPerRoom===========", imagesPerRoom);

//         rooms = rooms.map((room, index) => {
//           const start = index * imagesPerRoom;
//           const end = start + imagesPerRoom;
//           const updatedRoom = {
//             ...room,
//             roomsImages: room.roomsImages.concat(roomImageUrls.slice(start, end)),
//           };
//           console.log(roomImageUrls.slice(start, end),`updatedRoom [${index}]==========`, updatedRoom,"=========",room.roomsImages);
//           return updatedRoom;
//         });
//       }
//     }

//     const obj = {
//       hotelImages: hotelImageUrls,
//       rooms: rooms
//     };

//     console.log("obj to update===========", obj);

//     const result = await updatePartenerHotel({ _id: isHotelExist._id }, obj);

//     console.log("update result===========", result);

//     return res.status(statusCode.OK).send({
//       statusCode: statusCode.ACCEPTED,
//       responseMessage: responseMessage.UPLOAD_SUCCESS,
//       result: result,
//     });

//   } catch (error) {
//     console.log("error while trying to upload images", error);
//     return next(error);
//   }
// };
