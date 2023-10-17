require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./db/connectDB");
const userRoutes = require("./routes/users-routes");
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);

const port = process.env.PORT || 4001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, (req, res) => {
      console.log(`mconnecti l DB, o listening on http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
