const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { error } = require("node:console");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.jason());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Conneccted!"))
.catch(() => {
    console.error("MongoDB Eroor:", error.message);
    process.exit(1);
});

app.use("/api/auth",  require("./routes/authRoutes"));
app.use("/api/tasks",  require("./routes/taskRoutes"));
app.use("/api/categories",  require("./routes/categoryRoutes"));

app.get("/", (req,res) => {
    res.jason({success: true, message: "TaskFlow API is running"});

});


app.use((err, req, res, next) => {
    res.status(err,status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
