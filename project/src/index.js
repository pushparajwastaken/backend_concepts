import dotenv from "dotenv";
dotenv.config();

import ConnectDB from "./db/index.js";
ConnectDB()
  .then(() => {
    try {
      const port = process.env.PORT || 8000;
      app.listen(port, () => {
        console.log(`Server is runnig at ${port}`);
      });
    } catch (error) {
      console.log("App didn't listen", error);
    }
  })
  .catch((error) => {
    console.log("MongoDB Connect Fail", error);
  });

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
