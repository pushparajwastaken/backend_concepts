import dotenv from "dotenv";
dotenv.config();

import ConnectDB from "./db/index.js";
ConnectDB();

// import express from "express";
// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONOGODB_URL}`);
//     app.on("error", (error) => {
//       console.log("Galti se mistake : ", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`App is listening on PORT ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("Bhari mistake hogaya", error);
//     throw err;
//   }
// })();
