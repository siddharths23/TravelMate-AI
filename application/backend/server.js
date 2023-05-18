require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const saveRoute = require("./routes/saveRoute");
const completionRoute = require("./routes/completion");
const reviewsRouter = require("./routes/reviews");
var bodyParser = require("body-parser");
connection();

app.use(express.json());
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// routes
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/save", saveRoute);

app.use("/api", completionRoute);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening on port ${port}...`));
module.exports = app;
