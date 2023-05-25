const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const { checkAccessToken } = require('../middleware/auth.middleware');

router.post("/requestconnection",checkAccessToken, userController.RequestConnection);
router.post("/withdrawrequest",checkAccessToken, userController.WithdrawConnection);
router.post("/respondtorequest",checkAccessToken, userController.RespondToRequest);
router.get("/getallconnections",checkAccessToken, userController.GetAllConnections);


module.exports = router