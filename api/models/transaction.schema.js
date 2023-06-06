const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    timeStamp: { 
        type: Date, 
        default: mongoose.now()
    },
})

module.exports = mongoose.model("Transaction", transactionSchema);

