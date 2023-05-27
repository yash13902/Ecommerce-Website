const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error")
const cookieParse = require("cookie-parser");

app.use(express.json());
app.use(cookieParse());
//Route Imports
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");

app.use("/api/v1", product);
app.use("/api/v1", user);

//Middleware for Error
app.use(errorMiddleware);


module.exports = app;