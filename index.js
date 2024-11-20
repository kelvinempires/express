import express from "express";
import dbConnection from "./db/conn.js";
import userRoute from "./routes/UserRoute.js";

dbConnection();
const app = express();
const port = 5000;

app.use(express.json());

app.use("/users", userRoute);


app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});
