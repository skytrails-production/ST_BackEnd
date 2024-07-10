const app = express();
app.use(cors());
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const flightRoutes = require("./routes/flight.routes");
const hotelRoutes = require("./routes/hotel.routes");
const busRoutes = require("./routes/bus.routes");
const b2bAuthRoutes = require("./routes/b2bauth.routes");
const internationalRoutes = require("./routes/international.routes");
const walletRoutes = require("./routes/wallet.routes");
const flightBookingDataRoutes = require("./routes/flightBookingData.routes");
const forexRoutes = require("./routes/forex.routes");
const cityRoutes = require("./routes/city.routes");
const sightSeeingRoutes = require("./routes/sightSeeting.routes");
const universalTransferRoutes = require("./routes/universalTransfer.routes");
const visaRoutes = require("./routes/visa.routes");
const utilityRoutes = require("./routes/utility.routes");
const visaRoutesCategory = require("./routes/visaRoutes/visaRoutes");
const staticContentRoutes = require("./routes/staticContentRoutes");
const busBookingDataRoutes = require("./routes/busBookingData.routes");
const hotelBookingDataRoutes = require("./routes/hotelBookingData.routes");
const faqRoutes = require("./routes/faqRoutes");
const amadeusRoutes = require("./routes/amadeus.routes");
const ssdcRoutes = require("./routes/ssdc.routes");
const mihuruRoutes = require("./routes/mihuru.routes");
const grnConnectRoutes = require("./routes/grnconnect.routes");
const inventoryRoutes = require("./routes/inventoryRoutes/inventoryLoginRoutes");
const careerRoutes = require("./routes/career.routes");
const forumQueRoutes = require("./routes/forumRoutes/forumQueRoutes");
const forumQueAnsCommRoutes = require("./routes/forumRoutes/forumQueAnsComm");
const offerRoutes = require("./routes/offerRoutes/offer.routes");
const visaEnquiryRoutes = require("./routes/visaEnquiry.routes");
const btocUserRoutes = require("./routes/btocRoutes/btocRoutes");
const subAdminRoutes = require("./routes/subAdminRoutes");
const offlineQueryRoutes = require("./routes/offlinequeryRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");
const transactionRoutes = require("./routes/btocRoutes/transactionRoutes");
const eventRoutes = require("./routes/eventRoutes");
const eventBookingRoutes = require("./routes/btocRoutes/eventBookingRoutes");
const documentCategoryRoutes = require("./routes/visaRoutes/documentCategory");
const documentTypeRoutes = require("./routes/visaRoutes/documentType");
const visaCategoryRoutes = require("./routes/visaRoutes/visaCategoryRoutes");
const createRequireDocumentRoutes = require("./routes/visaRoutes/createRequireDocumentRoutes");
const createCouponRoutes = require("./routes/createCouponRoutes");
const packageBannerRoutes = require("./routes/packageBannerRoutes");
const quizRoutes = require("./routes/btocRoutes/quizRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const relationshipManagerRoutes = require("./routes/relationshipManagerRoutes");
const blogRoutes = require("./routes/blogRoutes");
const amadeusFlightBookingRoutes = require("./routes/amadeusRoutes/amadeusFlightBookingRoutes");
const grnRoutes = require("./routes/grnRoutes/grnRoutes");
const itineraryRoutes = require("./routes/Itinerary/ItineraryRoutes");
const passportEnquiryRoutes = require("./routes/btocRoutes/passportEnquiryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const initializeRoutes = (app) => {
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/flights", flightRoutes);
  app.use("/hotels", hotelRoutes);
  app.use("/buses", busRoutes);
  app.use("/b2b-auth", b2bAuthRoutes);
  app.use("/international", internationalRoutes);
  app.use("/wallet", walletRoutes);
  app.use("/flight-booking", flightBookingDataRoutes);
  app.use("/forex", forexRoutes);
  app.use("/cities", cityRoutes);
  app.use("/sightseeing", sightSeeingRoutes);
  app.use("/universal-transfer", universalTransferRoutes);
  app.use("/visa", visaRoutes);
  app.use("/utilities", utilityRoutes);
  app.use("/visa-categories", visaRoutesCategory);
  app.use("/static-content", staticContentRoutes);
  app.use("/bus-booking", busBookingDataRoutes);
  app.use("/hotel-booking", hotelBookingDataRoutes);
  app.use("/faqs", faqRoutes);
  app.use("/amadeus", amadeusRoutes);
  app.use("/ssdc", ssdcRoutes);
  app.use("/mihuru", mihuruRoutes);
  app.use("/grn-connect", grnConnectRoutes);
  app.use("/inventory", inventoryRoutes);
  app.use("/careers", careerRoutes);
  app.use("/forum-questions", forumQueRoutes);
  app.use("/forum-answers", forumQueAnsCommRoutes);
  app.use("/offers", offerRoutes);
  app.use("/visa-enquiry", visaEnquiryRoutes);
  app.use("/btoc-users", btocUserRoutes);
  app.use("/sub-admin", subAdminRoutes);
  app.use("/offline-queries", offlineQueryRoutes);
  app.use("/razorpay", razorpayRoutes);
  app.use("/transactions", transactionRoutes);
  app.use("/events", eventRoutes);
  app.use("/event-bookings", eventBookingRoutes);
  app.use("/document-categories", documentCategoryRoutes);
  app.use("/document-types", documentTypeRoutes);
  app.use("/visa-category", visaCategoryRoutes);
  app.use("/required-documents", createRequireDocumentRoutes);
  app.use("/coupons", createCouponRoutes);
  app.use("/package-banners", packageBannerRoutes);
  app.use("/quizzes", quizRoutes);
  app.use("/ratings", ratingRoutes);
  app.use("/relationship-managers", relationshipManagerRoutes);
  app.use("/blogs", blogRoutes);
  app.use("/amadeus-flight-booking", amadeusFlightBookingRoutes);
  app.use("/grn", grnRoutes);
  app.use("/itinerary", itineraryRoutes);
  app.use("/passport-enquiry", passportEnquiryRoutes);
  app.use("/notifications", notificationRoutes);
};

module.exports = initializeRoutes;
