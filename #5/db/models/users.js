const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  surName: {
    type: String,
    default: ""
  },
  firstName: {
    type: String,
    default: ""
  },
  middleName: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  permissionId: {
    type: Number,
    default: Math.random()
  },
  permission: {
    chat: {
      C: { type: Boolean, required: true },
      D: { type: Boolean, required: true },
      R: { type: Boolean, required: true },
      U: { type: Boolean, required: true }
    },
    news: {
      C: { type: Boolean, required: true },
      D: { type: Boolean, required: true },
      R: { type: Boolean, required: true },
      U: { type: Boolean, required: true }
    },
    setting: {
      C: { type: Boolean, required: true },
      D: { type: Boolean, required: true },
      R: { type: Boolean, required: true },
      U: { type: Boolean, required: true }
    }
  }
});

module.exports = mongoose.model("User", userSchema);
