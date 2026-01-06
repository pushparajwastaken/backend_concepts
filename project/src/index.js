import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import ConnectDB from "./db/index.js";
ConnectDB()
  .then(() => {
    try {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is running at ${port}`);
      });
    } catch (error) {
      console.log("App didn't listen", error);
    }
  })
  .catch((error) => {
    console.log("MongoDB Connect Fail", error);
  });

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
