const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 5000;
const { MONGOURI } = require("./config/keys");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("mongodb connected");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   )
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

//   next()
// })
app.use(cors());

app.use(express.json());
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/post"));
app.use("/api", require("./routes/user"));
app.use("/admin", require("./routes/admin"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/dist"));
  const path = require("path");
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
