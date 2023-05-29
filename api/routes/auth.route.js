const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');

// POST
router.post('/signup',authController.SignUp);
router.post('/login',authController.Login);

module.exports = router