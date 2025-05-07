const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/total-customers", customerController.getTotalCustomers);
router.get("/total-locations", customerController.getTotalLocations);
router.get("/average-age", customerController.getAverageAge);
router.get("/login-trends", customerController.getLoginTrends);
router.get("/login-per-location", customerController.getLoginPerLocation);
router.get("/recent-logins", customerController.getRecentLogins);
router.get("/most-popular-location", customerController.getMostPopularLocation);
router.get("/most-used-device", customerController.getMostUsedDeviceBrand);
router.get("/top-digital-interest", customerController.getTopDigitalInterest);
router.get("/gender", customerController.getGenderDistribution);

module.exports = router;
