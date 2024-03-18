const { User, Thought } = require('../models');
const { validationResult } = require('express-validator');

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      logger.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      logger.error('Error fetching single user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      logger.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // update a user
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      logger.error('Error updating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thoughts deleted successfully' });
    } catch (err) {
      logger.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // add a friend to user's friend list
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      logger.error('Error adding friend:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // remove a friend from user's friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      logger.error('Error removing friend:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};