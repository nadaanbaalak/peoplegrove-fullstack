const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const error = require("./middleware/error");
const User = require("./routes/users");
const Appointment = require("./routes/appointment");
const Auth = require("./routes/auth");

const app = express();

mongoose
  .connect(config.get("dbUrl"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to db..");
  })
  .catch(() => {
    console.log("Connection to db failed!!");
  });

app.use(express.json());
app.use("/api/users", User);
app.use("/api/auth", Auth);
app.use("/api/appointments", Appointment);
app.use(error);

app.get("/", (req, res) => {
  res.send("Welcome to pg Project!!");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
