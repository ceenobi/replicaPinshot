import dotenv from "dotenv"
import express, { json } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/user.js";
import pinRoutes from "./routes/pin.js";
import searchRoutes from "./routes/search.js";
import commentRoutes from "./routes/comment.js";

dotenv.config()
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Hello mongoose");
});

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/pin", pinRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/comment", commentRoutes);

//no routes error
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//general and specific errors
app.use((error, req, res, next) => {
  console.log(error);
  let errorMessage = "An unknown error has occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});
// app.use((error, req, res, next) => {
//   console.log(error);
//   let errorMessage = "An unknown error has occurred";
//   let statusCode = 500;
//   if (isHttpError(error)) {
//     statusCode = error.status;
//     errorMessage = error.message;
//   } else if (error.name === "UnauthorizedError") {
//     statusCode = 401;
//     errorMessage = "Unauthorized: Username or Password is incorrect";
//   } else if (error.name === "ValidationError") {
//     statusCode = 400;
//     errorMessage = error.message;
//   }
//   res.status(statusCode).json({ error: errorMessage });
// });

export default app;
