const mongoose = require("mongoose");
const { Schema } = mongoose;

const documentsSchema = new Schema({
  storagePath: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users", // Reference to the users collection
  },
  categories: [{ type: String }], // Array of category strings
  createdAt: { type: Date, default: Date.now },
});

const Document = mongoose.model("documents", documentsSchema);

module.exports = Document;
