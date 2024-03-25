const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const morgan = require('morgan')
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const dbConnect = require('./config/dbConnect')
const PORT = 3000 || process.env.PORT;

const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
// Data BaseConnection
dbConnect();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'))
app.use(
session({
    secret:process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
    cookie:{
      maxAge:86400000
    }
})
);

app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
  });

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
