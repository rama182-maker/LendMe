const User = require('../models/user.schema');
const Wallet = require('../models/wallet.schema');

module.exports.CreateWallet = async (userId) => {
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Check if the user already has a wallet
    if (user.wallet) {
      throw new Error('User already has a wallet');
    }

    // Create a new wallet
    const wallet = new Wallet({ user: userId });

    // Save the wallet
    await wallet.save();

    // Update the user with the wallet reference
    user.wallet = wallet._id;
    await user.save();

    const message = "Wallet created successfully";
    console.log('Wallet created successfully');
    return message;
  } catch (error) {
    console.error('Error creating wallet:', error.message);
  }
};
