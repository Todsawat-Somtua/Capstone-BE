const express = require("express");
const app = express();
const cors = require("cors");
const ImageRouter = require("./routers/ImageRouter");

require("dotenv").config();
require("./config/db").connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/images", ImageRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log("listening on port 3000");
});