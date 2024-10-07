import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    if (mongoose.connections && mongoose.connections[0].readyState) {
      console.log("ALREADY CONNECTED TO THE DATABASE");
      return;
    }
    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        dbName: "HushMailW3Credentials",
      }
    );
    console.log(`CONNECTED TO THE DATABASE: ${connection.host}`);
  } catch (error) {
    console.log(`ERROR WHILE CONNECTING TO DATABASE: ${error}`);
    throw new Error("Error while connecting to database");
  }
};
