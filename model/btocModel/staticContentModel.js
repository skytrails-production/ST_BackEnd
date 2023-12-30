const mongoose = require("mongoose");
const status = require("../../enums/status");
const staticContentsType = require("../../enums/staticContentType");
const subStaticContentType = require("../../enums/subStaticContentType");

const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);
const staticContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enums: [
        staticContentsType.ABOUTTHESITE,
        staticContentsType.ABOUTUS,
        staticContentsType.BOOKINGPOLICY,
        staticContentsType.BUSES,
        staticContentsType.CABS,
        staticContentsType.CORPORATETRAVEL,
        staticContentsType.FLIGHTS,
        staticContentsType.FORXCARD,
        staticContentsType.HOLIDAYPACKAGE,
        staticContentsType.HOTELS,
        staticContentsType.IMPORTANTLINKS,
        staticContentsType.PRIVACYPOLICY,
        staticContentsType.PRODUCTOFFERING,
        staticContentsType.QUICKLINKS,
        staticContentsType.RETURNPOLICY,
        staticContentsType.staticContentsType,
        staticContentsType.TRAINS,
        staticContentsType.TRAVELINSURENCE,
        staticContentsType.QUESTION,
      ],
    },
    // staticContentType: {
    //   type: String,
    //   enum:[subStaticContentType.ABOUTUS,subStaticContentType.BOOKINGPOLICY,subStaticContentType.CORPORATETRAVEL,subStaticContentType.RETURNPOLICY,subStaticContentType.TNC,subStaticContentType.PRIVACYPOLICY]
    // },
    status: {
      type: String,
      enum:[status.ACTIVE,status.BLOCK,status.BLOCK],
      default: status.ACTIVE,
    },
  },
  { timestamps: true }
);
staticContentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("AppStaticContent", staticContentSchema);

mongoose
  .model("staticContent", staticContentSchema)
  .find({}, async (err, result) => {
    if (err) {
      console.log("DEFAULT Static content ERROR", err);
    } else if (result.length != 0) {
      console.log("Default static content already created.");
    } else {
      var obj1 = {
        type: staticContentsType.TNC,
        title: "Terms & Conditions",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget",
      };
      var obj2 = {
        type: staticContentsType.PRIVACYPOLICY,
        title: "Privacy Policy - TheSkytrails",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
      };
      var obj3 = {
        type: staticContentsType.ABOUTUS,
        title: "About Us",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
      };
      var obj4 = {
        type: staticContentsType.ABOUTTHESITE,
        title: "About Site",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
      };
      var obj5 = {
        type: staticContentsType.IMPORTANTLINKS,
        title: "IMPORTANT LINKS",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
      };
      var obj6 = {
        type: staticContentsType.QUICKLINKS,
        title: "QUICK LINKS",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
      };
      var obj7 = {
        type: staticContentsType.PRODUCTOFFERING,
        title: "PRODUCT OFFERING",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
      };
      var obj8 = {
        type: staticContentsType.QUESTION,
        title: "How to find booking ID?",
        description:
          "You can find your booking ID in your registered email, SMS sent to mobile no. used for booking or in ‘My Trips’ section.",
      };
      mongoose
        .model("staticContent", staticContentSchema)
        .create(
          obj1,
          obj2,
          obj3,
          obj4,
          obj5,
          obj6,
          obj7,
          obj8,
          (staticErr, staticResult) => {
            if (staticErr) {
              console.log("Static content error.", staticErr);
            } else {
              console.log("Static content created.", staticResult);
            }
          }
        );
    }
  });
