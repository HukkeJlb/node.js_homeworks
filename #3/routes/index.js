const express = require("express");
const router = express.Router();
const controllers = require("../controllers");

router.get("/", controllers.index);

router.post("/", controllers.sendMail);

router.get("/login", controllers.login);

router.post("/login", controllers.auth);

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect("/login");
};

router.get("/admin", isAdmin, controllers.admin);

router.post("/admin/upload", controllers.createProduct);

router.post("/admin/skills", controllers.updateStats);

module.exports = router;
