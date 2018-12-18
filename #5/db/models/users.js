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
    type: String,
    default: Math.random()
  },
  permission: {
    chat: {
      C: { type: Boolean, default: false },
      R: { type: Boolean, default: true },
      U: { type: Boolean, default: true },
      D: { type: Boolean, default: false },
    },
    news: {
      C: { type: Boolean, default: false },
      R: { type: Boolean, default: true },
      U: { type: Boolean, default: false },
      D: { type: Boolean, default: false },
    },
    setting: {
      C: { type: Boolean, default: false },
      R: { type: Boolean, default: false },
      U: { type: Boolean, default: false },
      D: { type: Boolean, default: false },
    }
  },
  access_token: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model("User", userSchema);