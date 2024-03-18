// Import necessary models
const { Thought, User } = require('../models');

// Controller methods for handling thought-related operations
module.exports = {
  // Retrieve all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error('Error getting thoughts:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Retrieve a single thought by its _id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id' });
      }
      res.json(thought);
    } catch (err) {
      console.error('Error getting single thought:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Create a new thought and update the associated user's thoughts array
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.updateOne({ _id: req.body.userId }, { $push: { thoughts: thought._id } });
      res.status(201).json(thought);
    } catch (err) {
      console.error('Error creating thought:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update a thought by its _id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id' });
      }
      res.json(thought);
    } catch (err) {
      console.error('Error updating thought:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete a thought by its _id and remove it from the associated user's thoughts array
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id' });
      }
      await User.updateOne({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } });
      res.json({ message: 'Thought deleted' });
    } catch (err) {
      console.error('Error deleting thought:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id' });
      }
      res.json(thought);
    } catch (err) {
      console.error('Error adding reaction:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Remove a reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id' });
      }
      res.json(thought);
    } catch (err) {
      console.error('Error removing reaction:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};