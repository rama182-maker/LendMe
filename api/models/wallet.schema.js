const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Wallet", walletSchema);