const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const { errorResponse } = require("./ErrorHandler");

module.exports.checkAccessToken = (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return errorResponse(res, "authorization header is not provided", 401);
      }
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token,'secret');
      req.userData = decoded;
      next();
    } catch (err) {
      console.log("Access JWT is not valid");
      return errorResponse(res, "Authentiation Failed", 401, { error: err });
    }
};