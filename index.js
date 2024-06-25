require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

app.use(cors({
    credentials:true,
    origin:true
}));

app.use(cookieParser());

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

main()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING);
}
