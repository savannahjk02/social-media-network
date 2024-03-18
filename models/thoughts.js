const { Schema, model } = require('mongoose');
const reactionSchema = require('./reaction');

const thoughtSchema = newSchema (
  {
thoughtText: {
  type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
},
createdAt: {
  type: Date,
      default: Date.now,
      get: timestamp => new Date(timestamp).toLocaleDateString(),
},
username: {
  type: String,
      required: true,
},
reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  },
);
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;