const express = require("express");
const app = express();
const cors = require("cors");

//MIDDLEWARE
app.use(express.json()); //REQ.BODY
app.use(cors());

//ROUTES
//Dashboard Route
app.use("/auth", require("./routes/jwtAuth"));

app.listen(9999, () => {
    console.log("Application Running on port 9999")
});

//TEST