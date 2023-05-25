const mongoose = require('mongoose');
const { isEmail } =require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
    },
    phoneNumber: { type: String },
    email:{
        type:String,
        required: [true, "Please enter your email"],
        unique:true,
        lowercase:true,
        validate:[isEmail, "Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true, "Please Enter the password"],
        minlength:[6, "Minimum password length is 6 characters"]
    },
    connections:[
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            email:String,
            name:String,
        }
    ],
    pending:[
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            email:String,
            name:String,
        }
    ],
})

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next()
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if(user){
        const auth = bcrypt.compare(password,user.password);
        if(auth) {
            return user;
        }
        throw Error("Incorrect Password");
    }
    throw Error("incorrect Email");
}

module.exports = mongoose.model("User", userSchema);