const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/posts")

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });


app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(2000, () => {
  console.log("sever is running on port 2000")
})

