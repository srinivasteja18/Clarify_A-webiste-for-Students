require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//importing routes
const authRoutes = require("./Routes/auth.js");
const questionRoutes = require("./Routes/question.js");
const userRoutes = require("./Routes/user.js");
const answerRoutes = require("./Routes/answer.js");

const app = express();

//Middle wares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("ERROR", err);
  });

app.use("/api", authRoutes);
app.use("/api", questionRoutes);
app.use("/api", userRoutes);
app.use("/api", answerRoutes);

//Accessing React files in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//server
app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log(`App is running at 8080`);
});
