const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

//middleware

app.use(express.json()); //req body
app.use(cors());

//ROUTES//

//register and login

app.use("/auth", require("./server/routes/RoAuth"));

// dashboard

app.use("/dashboard", require("./server/routes/dashboard"));

app.listen(PORT, () => {
  console.log(`server port ${PORT}`);
});

console.log("☻");
