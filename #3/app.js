const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "homeworkNodeJS",
    key: "sessionkey",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 60 * 1000
    },
    saveUninitialized: false,
    resave: false
  })
);

app.use("/", require("./routes/index"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render("./pages/error", { message: err.message, error: err });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port " + server.address().port);
});
