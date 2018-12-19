const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  userId: {
    ref: "users",
    type: Schema.Types.ObjectId
  },
  theme: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true }
});

newsSchema.methods.getNews = function() {
  return this.model("news").find({});
};

module.exports = mongoose.model("news", newsSchema);
