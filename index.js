const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

app.use(cors())
app.use(express.json());
app.use('/users',userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})