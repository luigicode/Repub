const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;

//middleware

app.use(express.json()); //req body
app.use(cors());

if (process.env.NODE_ENV === "production") {
  //server static content
  //npm run build
  app.use(express.static(path.join(__dirname, "client/build")));
}

console.log(__dirname);
console.log(path.join(__dirname, "client/build"));

//ROUTES//

//register and login

app.use("/auth", require("./routes/RoAuth"));

// dashboard

app.use("/dashboard", require("./routes/dashboard"));

app.listen(PORT, () => {
  console.log(`server port ${PORT}`);
});

console.log("☻");
