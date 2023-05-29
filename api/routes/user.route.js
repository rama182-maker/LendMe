const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const { checkAccessToken } = require('../middleware/auth.middleware');

// POST
router.post("/requestconnection",checkAccessToken, userController.RequestConnection);
router.post("/withdrawrequest",checkAccessToken, userController.WithdrawConnection);
router.post("/respondtorequest",checkAccessToken, userController.RespondToRequest);

// GET
router.get("/getallconnections",checkAccessToken, userController.GetAllConnections);
router.get("/getpendingrequests",checkAccessToken, userController.GetPendingRequests);
router.get("/geteligiblerewards",checkAccessToken, userController.GetEligibleRewards);

module.exports = router