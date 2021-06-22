const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const hpp = require("hpp");
const cors = require("cors");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/error");

// load env variables
dotenv.config({ path: "./.env" });

// route files
const auth = require("./routes/auth");

//Connect to db
connectDb();

const app = express();

// Body parser
app.use(express.json());

// Prevent http param polution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/v1/auth", auth);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
      .yellow.bold
  )
);
