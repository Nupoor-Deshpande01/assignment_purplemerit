const userService = require('../services/userService');

const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data && { data })
  });
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    sendResponse(res, 200, 'Users retrieved successfully', result);
  } catch (error) {
    sendResponse(res, 500, 'Server Error', error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }
    sendResponse(res, 200, 'User retrieved successfully', { user });
  } catch (error) {
    sendResponse(res, 500, 'Server Error', error.message);
  }
};

const createUser = async (req, res) => {
  try {
    // Only Admin can access this route (handled by middleware)
    const user = await userService.createUser(req.body, req.user._id);
    sendResponse(res, 201, 'User created successfully', { user });
  } catch (error) {
    const statusCode = error.message.includes('already exists') ? 400 : 500;
    sendResponse(res, statusCode, 'Error creating user', error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const authUser = req.user;

    // Permissions logic
    if (authUser.role === 'user') {
      // Users can only update their own profile
      if (authUser._id.toString() !== targetUserId) {
        return sendResponse(res, 403, 'You are not authorized to update this profile');
      }
      // Users cannot elevate their own role or active status
      delete req.body.role;
      delete req.body.isActive;
    } else if (authUser.role === 'manager') {
      // Managers can only update non-admins
      const targetUser = await userService.getUserById(targetUserId);
      if (!targetUser) return sendResponse(res, 404, 'User not found');
      
      if (targetUser.role === 'admin') {
        return sendResponse(res, 403, 'Managers cannot update admin profiles');
      }
      // Managers cannot grant admin roles
      if (req.body.role === 'admin') {
        return sendResponse(res, 403, 'Managers cannot grant admin role');
      }
    }
    // Admins can update anyone (no restriction)

    const updatedUser = await userService.updateUser(targetUserId, req.body, authUser._id);
    sendResponse(res, 200, 'User updated successfully', { user: updatedUser });
  } catch (error) {
    const statusCode = error.message.includes('already exists') || error.message.includes('not found') ? 400 : 500;
    sendResponse(res, statusCode, 'Error updating user', error.message);
  }
};

const softDeleteUser = async (req, res) => {
  try {
    // Admin only route
    const targetUserId = req.params.id;
    
    if (req.user._id.toString() === targetUserId) {
      return sendResponse(res, 400, 'Admins cannot delete their own profile');
    }

    const user = await userService.softDeleteUser(targetUserId, req.user._id);
    sendResponse(res, 200, 'User disabled successfully', { user });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    sendResponse(res, statusCode, 'Error deleting user', error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  softDeleteUser
};
