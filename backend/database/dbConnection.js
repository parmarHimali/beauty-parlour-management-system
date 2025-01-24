import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "beauty_parlour" })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(`Error in db :${err}`);
    });
};
