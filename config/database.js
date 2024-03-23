const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@dms-cluster.jzqhzmc.mongodb.net/?retryWrites=true&w=majority&appName=dms-cluster`;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const connectDB = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    console.log(
      "Successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connectDB };
