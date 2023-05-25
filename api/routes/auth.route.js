const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');

router.get('/signup',authController.GetSignUp);
router.post('/signup',authController.SignUp);
router.get('/login',authController.GetLogin);
router.post('/login',authController.Login);

module.exports = router