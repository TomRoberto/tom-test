require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { createAgent } = require("@forestadmin/agent");
const {
  createMongooseDataSource,
} = require("@forestadmin/datasource-mongoose");

// DB setup
const mongoDb = mongoose.createConnection(process.env.MONGODB_URI);
const users = mongoDb.model(
  "users",
  new mongoose.Schema({
    email: String,
  })
);

const app = express();

createAgent({
  authSecret: process.env.FOREST_AUTH_SECRET,
  envSecret: process.env.FOREST_ENV_SECRET,
  isProduction: process.env.NODE_ENV === "production",
})
  .addDataSource(createMongooseDataSource(mongoDb, { flattenMode: "none" }))
  .mountOnExpress(app)
  .start();

app.use(express.json());

// GET /user
app.get("/user", async (req, res) => {
  const allUsers = await users.find();
  res.json(allUsers);
});

// POST /user
app.post("/user", async (req, res) => {
  const newUser = await users.create({
    email: req.body.email,
  });
  res.json(newUser);
});

app.listen(process.env.PORT, () => {
  console.log(`Server has started on port ${process.env.PORT} !`);
});
