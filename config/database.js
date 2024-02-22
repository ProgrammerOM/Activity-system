const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://omagency:g0EKgRS5XhAjkHvG@om-agency.ljgithc.mongodb.net/Activitys?retryWrites=true&w=majority"
    );
    console.log("DB connect");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
