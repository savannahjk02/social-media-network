const { Schema, model } = require('mongoose');

// Schema to create Student model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          // return (look into Mongoose's matching validation);
        }
    }
  },
    thoughts: [
      {
      type: Schema.Types.ObjectId,
      ref: thought,
    },
  ],
    friends: [
      {
      type: Schema.Types.ObjectId,
      ref: user,
    },
  ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual('friendCount').get(function() {
  return this.friends.length
});

const User = model('user', userSchema);

module.exports = User;