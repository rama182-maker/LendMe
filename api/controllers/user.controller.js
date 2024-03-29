const { errorResponse } = require('../middleware/ErrorHandler');
const User = require('../models/user.schema');

module.exports.RequestConnection = async (req, res) => {
    try {
        let otherUserId = req.body.otherUserId;
    
        // Find the user sending the request
        let loggedInUserId = req.userData.id;
        let loggedInUser = await User.findById(loggedInUserId);
    
        // Find the user to whom the connection request is being sent
        let requestedUser = await User.findById(otherUserId);
    
        // Check if both users exist
        if (!loggedInUser || !requestedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Add the connection request to the requested user's pending list
        requestedUser.pending.push({ email: loggedInUser.email, name: loggedInUser.name });
        await requestedUser.save();
    
        return res.status(200).json({ message: 'Connection request sent successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.RespondToRequest = async (req, res) => {
    try {
        // const { email, name, accept } = req.body; // Assuming email, name, and accept (boolean) are provided in the request body
        let otherUserId = req.body.otherUserId;
        let accept = req.body.accept;
        // Find the user responding to the request
        // const respondingUser = await User.findOne({ email });
        let loggedInUserId = req.userData.id;
        let loggedInUser = await User.findById(loggedInUserId);
    
        // Find the user who sent the connection request
        let otherUser = await User.findById(otherUserId);
    
        // Check if both users exist
        if (!loggedInUser || !otherUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Remove the connection request from the responding user's pending list
        loggedInUser.pending = loggedInUser.pending.filter((request) => request.email !== otherUser.email);
        
        if (accept) {
          // Add the requesting user to the responding user's connections list
          loggedInUser.connections.push({ email: otherUser.email, name: otherUser.name });
          
          // Add the responding user to the requesting user's connections list
          otherUser.connections.push({ email: loggedInUser.email, name: loggedInUser.name });
        }
    
        await Promise.all([loggedInUser.save(), otherUser.save()]);
    
        return res.status(200).json({ message: 'Connection request responded successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.WithdrawConnection = async (req, res) => {
    try {
      let otherUserId = req.body.otherUserId;
  
      // Find the user withdrawing the connection request
      let loggedInUserId = req.userData.id;
      let loggedInUser = await User.findById(loggedInUserId);
  
      // Find the user to whom the connection request was sent
      let requestedUser = await User.findById(otherUserId);
  
      // Check if both users exist
      if (!loggedInUser || !requestedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the connection request from the requested user's pending list
      requestedUser.pending = requestedUser.pending.filter((request) => request.email !== loggedInUser.email);
      await requestedUser.save();
  
      return res.status(200).json({ message: 'Connection request withdrawn successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.GetAllConnections = async (req, res) => {
    try {
        let otherUserId = req.body.otherUserId;
        // Find the user to whom the connection request was sent
        let otherUser = await User.findById(otherUserId);
        return res.status(200).json({
            no_of_connections: otherUser.connections.length,
            connections_data: otherUser.connections,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.GetPendingRequests = async (req, res) => {
  try {
    let userId = req.userData.id;
    let user = await User.findById(userId);
    return res.status(200).json({
        no_of_pending_connections: user.pending.length,
        pending_connections_data: user.pending,
    });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

// See how/when this endpoint need to be triggered ... 
module.exports.GetEligibleRewards = async (req, res) => {
  try {
    let userId = req.userData.id;
    let user = await User.findById(userId);
    let connections = user.connections.length;
    if(connections < 50) {
      user.activityLevel = 0;
      user.save();
    } else if(connections > 50 && connections < 100) {
      user.activityLevel = 5;
      user.save();
    } else if(connections > 100 && connections < 200) {
      user.activityLevel = 10;
      user.save();
    } else if (connections > 200 && connections < 300) {
      user.activityLevel = 20;
      user.save();
    } else if (connections > 300 && connections < 500) {
      user.activityLevel = 50;
      user.save();
    } else if (connections > 500 && connections < 1000) {
      user.activityLevel = 80;
      user.save();
    } else if (connections > 1000) {
      user.activityLevel = 100;
      user.save();
    }

    const activityWeight = 0.3;
    const transactionWeight = 0.7;
    // Calculate the reward based on activity level
    const activityReward = user.activityLevel * activityWeight;
    // Calculate the reward based on transaction history
    const transactionReward = user.totalTransactions * transactionWeight;
    const totalReward = activityReward + transactionReward;
    
    return res.status(200).json({
        activityReward : activityReward,
        transactionReward: transactionReward,
        totalReward: totalReward,
    });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.SetLendingStatus = async (req, res) => {
  try {
    let userId = req.userData.id;
    let lend = req.body.canLend;
    let Amount = req.body.Amount;
    let user = await User.findById(userId);

    let message = null;
    if(lend == true && Amount > 0) {
      message = "Able to Lend!";
      user.canLend = lend;
      user.lendAmount = Amount;
      user.save();
    } else if (lend == true && Amount <= 0) {
      message = "Change lending status as lending amount is 0!";
    } else if (lend == false && Amount == 0) {
      message = "Not Able to Lend!";
      user.canLend = lend;
      user.lendAmount = Amount;
      user.save();
    } else if (lend == false && Amount > 0) {
      message = "Change lending status as lending amount is greater than 0!";
    }

    return res.status(200).json({
        message : message,
        canLend: user.canLend,
        lendAmount: user.lendAmount,
    });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.SearchConnections = async (req, res) => {
  try {
    let userId = req.userData.id;
    let searchTerm = req.body.searchTerm;
    let user = await User.findById(userId);
    // Search connections by the searchTerm
    const connections = user.connections.filter(connection =>
      connection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return res.status(200).json({
        message: "Fetched results for the search",
        searchResult : connections
    });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.LoadFunds = async (req, res) => {
  // open paypal send to page send to merchant businees email id 
  // when this transaction is success receive the amount transacted and status 
  // if status is ok then update the wallet of that amount tansacted
};