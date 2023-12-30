const mongoose = require('mongoose');
const status = require('../enums/status')
const staticContentsType = require('../enums/staticContentType');
const subStaticContentType = require('../enums/subStaticContentType');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.pluralize(null)
const faqSchema = new mongoose.Schema({
    Q: {
        type: String
    },
    A: {
        type: String
    },
    category: {
        type: String,
        enums:{
        values:[staticContentsType.ABOUTTHESITE,staticContentsType.ABOUTUS,staticContentsType.BOOKINGPOLICY,staticContentsType.BUSES,staticContentsType.CABS,staticContentsType.CORPORATETRAVEL,staticContentsType.FLIGHTS,staticContentsType.FORXCARD,staticContentsType.HOLIDAYPACKAGE,staticContentsType.HOTELS,staticContentsType.IMPORTANTLINKS,staticContentsType.PRIVACYPOLICY,staticContentsType.PRODUCTOFFERING,staticContentsType.QUICKLINKS,staticContentsType.RETURNPOLICY,staticContentsType.staticContentsType,staticContentsType.TRAINS,staticContentsType.TRAVELINSURENCE],
        message:"{type supported example:--'FLIGHTS','HOTELS','BUSES','TRAINS','HOLIDAYPACKAGE','CABS','FORXCARD','ABOUTTHESITE','QUICKLINKS','IMPORTANTLINKS',CORPORATETRAVEL:'CORPORATETRAVEL','TNC','PRIVACYPOLICY','ABOUTUS','RETURNPOLICY','BOOKINGPOLICY','CORPORATETRAVEL','QUESTION',}"   }
        }
}, { timestamps: true })
faqSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("fAQModel", faqSchema);


mongoose.model("fAQModel", faqSchema).find({}, async (err, result) => {
    if (err) {
        console.log("DEFAULT faqs ERROR", err);
    }
    else if (result.length != 0) {
        console.log("Default faqs already created.");
    } else {
        var obj1 = {
            category: staticContentsType.FLIGHTS,
            Q: "- How do I make a flight booking on TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget"
        };
        var obj2 = {
            category: staticContentsType.FLIGHTS,
            Q: "- Can I avail domestic flight offers on TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
        };
        var obj3 = {
            category: staticContentsType.FLIGHTS,
            Q: "- How can I avail budget air tickets on TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj4 = {
            category: staticContentsType.FLIGHTS,
            Q: "- Why could I not avail the flight booking offers at the time of checkout?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj5 = {
            category: staticContentsType.HOTELS,
            Q: "- How to book a hotel online with  TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget"
        };
        var obj6 = {
            category: staticContentsType.HOTELS,
            Q: "- How to find the cheapest hotel deals in any city?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
        };
        var obj7 = {
            category: staticContentsType.HOTELS,
            Q: "- Where can I find current deals and offers of TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj8 = {
            category: staticContentsType.HOTELS,
            Q: "-  How to find the best hotels near me?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj5 = {
            category: staticContentsType.HOTELS,
            Q: "- How to book a hotel online with  TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget"
        };
        var obj6 = {
            category: staticContentsType.HOTELS,
            Q: "- How to find the cheapest hotel deals in any city?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
        };
        var obj7 = {
            category: staticContentsType.HOTELS,
            Q: "- Where can I find current deals and offers of TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj8 = {
            category: staticContentsType.HOTELS,
            Q: "-  How to find the best hotels near me?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj9 = {
            category: staticContentsType.HOLIDAYPACKAGE,
            Q: "-  Why Book Holidays with TheSkyTrails?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj10 = {
            category: staticContentsType.HOLIDAYPACKAGE,
            Q: "- What does TheSkyTrails Holidays offer  ?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget"
        };
        var obj11 = {
            category: staticContentsType.BUSES,
            Q: "- Make Your Bus Booking Smoother With TheSkyTrails",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
        };
        var obj12 = {
            category: staticContentsType.BUSES,
            Q: "- Reasons to Choose TheSkyTrails for Bus Booking:",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj13 = {
            category: staticContentsType.BUSES,
            Q: "- What’s more?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj14 = {
            category: staticContentsType.BUSES,
            Q: "-  How to Book Bus Online on TheSkyTrails:",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj15 = {
            category: staticContentsType.BUSES,
            Q: "-  MySafety Assurance on Bus Bookings:",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        var obj16 = {
            category: staticContentsType.BUSES,
            Q: "- Why TheSkyTrails for Bus Booking?",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget"
        };
        var obj17 = {
            category: staticContentsType.TRAINS,
            Q: "- Book Train Tickets Without Any Hassle",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget."
        };
        var obj18 = {
            category: staticContentsType.TRAINS,
            Q: "- Easy IRCTC Train Booking",
            A: "- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.",
        };
        mongoose.model("fAQModel", faqSchema).create(obj1, obj2, obj3, obj4,obj5,obj6,obj7,obj8,obj9,obj10,obj11,obj12,obj13,obj14,obj15,obj16,obj17,obj18, (staticErr, staticResult) => {
            if (staticErr) {
                console.log("Static faqs error.", staticErr);
            }
            else {
                console.log("Static faqs created.", staticResult);
            }
        })
    }
})

