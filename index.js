const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const env = require("dotenv");

const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const subCategoryRoutes = require("./routes/subCategories");
const postRoutes = require("./routes/posts");
const farmaanRoutes = require("./routes/farmaans");

env.config();
const app = express();
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection is established");
  }
);

app.get("/", (req, res) => {
  res.send("<h1>Hello to See More Pakistan API</h1>");
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subCategories", subCategoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/farmaans", farmaanRoutes);

app.listen(
  process.env.PORT,
  console.log(`Server running on port: ${process.env.PORT}`)
);
