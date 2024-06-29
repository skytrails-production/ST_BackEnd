const mongoose = require("mongoose");
const aws = require("aws-sdk");
const inventoryModel = require("../../model/inventory/inventoryLogin"); // Correct import path
const inventoryHotelForm = require("../../model/inventory/hotelForm");
const bcrypt = require("bcryptjs");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

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

//inventory register
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
      Key: file.originalname,
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
      ACL: 'public-read',
    };

    try {
      const data = await s3.upload(s3Params).promise();
      hotelImageUrls.push(data.Location);
    } catch (err) {
      console.error('Error uploading hotel image to S3:', err);
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
      ACL: 'public-read',
    };

    try {
      const data = await s3.upload(s3Params).promise();
      roomImageUrls.push(data.Location);
    } catch (err) {
      console.error('Error uploading room image to S3:', err);
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
      message: 'Hotel Form created successfully',
      result: formResult,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};