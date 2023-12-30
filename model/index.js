const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.airport = require("./airport.model");
db.userb2b = require("./brbuser.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
