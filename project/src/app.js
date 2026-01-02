import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
//routes ddeclaration
app.use("/api/v1/users", userRouter);
//this will be like a prefix to the url like
//https://localhost:8000/api/v1/users
//and then the control will be transferred to userRouter
export { app };
