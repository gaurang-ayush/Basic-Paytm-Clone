const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const mainRouter = require("../backend/routes/index");

app.use("/api/v1",mainRouter);
app.listen(3000,()=>{
    console.log("Server Running on port 3000")
});
