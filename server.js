const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoute = require("./routes/auth");
const ticketRoute = require("./routes/ticket");
const app = express();

dotenv.config();

// Connecting to our database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

//Middleware
app.use(express.json());
app.use(morgan("common"));

// Api Endpoints
app.use("/api/auth", authRoute);
app.use("/api/ticket", ticketRoute);

// Start the server
const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
