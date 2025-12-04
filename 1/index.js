import "dotenv/config.js";
import express from "express";
const app = express();
app.get("/", (req, res) => {
  res.send("Lavanyaaaa");
});
app.get("/twitter", (req, res) => {
  res.send("Click Me");
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
