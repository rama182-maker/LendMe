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
