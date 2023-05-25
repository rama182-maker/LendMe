const User = require('../models/user.schema');
const { errorResponse } = require('../middleware/ErrorHandler');
const jwt = require('jsonwebtoken');

const  maxAge = 3*24*60*60;

const createToken = (id) => {
    return jwt.sign({id},'secret',{expiresIn: maxAge});
}

module.exports.GetSignUp = (req, res) => {
    res.send('signup');
};

module.exports.SignUp = async (req, res) => {
    try{
        let name = req.body.name;
        let phoneNumber = req.body.phoneNumber;
        let email = req.body.email;
        let password = req.body.password;

        const user = await User.create({
            name,phoneNumber,email,password
        });
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge});
        res.status(201).json({
            user:user._id
        });
    } catch (err) {
        console.error(err);
        return errorResponse(res, "Internal Server Error", 500, { error: err });
    }
};

module.exports.GetLogin = (req, res) => {
    res.send('login');
};

module.exports.Login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge});
        res.status(200).json({user:user._id});
    } catch (err) {
        console.error(err);
        return errorResponse(res, "Internal Server Error", 500, { error: err });
    }
};