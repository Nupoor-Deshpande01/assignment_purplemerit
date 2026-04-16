const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers(options) {
    const { page = 1, limit = 10, role, isActive, search } = options;
    
    let query = {};
    
    // Filters
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const paginationOptions = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      select: '-password',
      sort: { createdAt: -1 },
      populate: [
        { path: 'createdBy', select: 'name email role' },
        { path: 'updatedBy', select: 'name email role' }
      ]
    };

    return await User.paginate(query, paginationOptions);
  }

  async getUserById(id) {
    return await User.findById(id)
      .select('-password')
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');
  }

  async createUser(userData, authUserId) {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
      throw new Error('User with this email already exists');
    }

    // Set auditing fields
    if (authUserId) {
      userData.createdBy = authUserId;
      userData.updatedBy = authUserId;
    }

    const user = await User.create(userData);
    
    // Never return the password
    const userObj = user.toObject();
    delete userObj.password;
    
    return userObj;
  }

  async updateUser(id, updateData, authUserId) {
    // If updating email, check for conflicts
    if (updateData.email) {
      const emailConflict = await User.findOne({ email: updateData.email, _id: { $ne: id } });
      if (emailConflict) {
        throw new Error('User with this email already exists');
      }
    }

    // Track the person who updated the user
    updateData.updatedBy = authUserId;

    // Handle password update explicitly since pre-save hooks only trigger on save() 
    // when using findByIdAndUpdate, so we'll fetch, update, and save.
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateData);
    await user.save();

    return this.getUserById(user._id);
  }

  async softDeleteUser(id, authUserId) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    user.updatedBy = authUserId;
    
    await user.save();
    return this.getUserById(user._id);
  }
}

module.exports = new UserService();
