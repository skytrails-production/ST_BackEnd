const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const issuedType = require("../../enums/issuedType");
const visaType=require("../../enums/visaType")
mongoose.pluralize(null);

const requiredDocumentSchema = new mongoose.Schema(
    {
      visaCountry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'visa',
        required: true,
      },
      visaType: {
        type:String,
        enum:[visaType.Tourist,visaType.Student,visaType.PR,visaType.Employment,visaType.Crewmember,visaType.Companion,visaType.Business]
      },
      visaCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisaCategory',
        required: true,
      },
      requiredDocumentCategories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DocumentCategory',
        },
      ],
      requiredDocCategory:[
       { type:String}
      ]
    },
    { timestamps: true }
  );
  requiredDocumentSchema.plugin(mongoosePaginate)
  module.exports = mongoose.model("RequiredDocument", requiredDocumentSchema);
  