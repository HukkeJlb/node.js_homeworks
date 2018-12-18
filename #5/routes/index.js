const express = require("express");
const path = require('path');
const router = express.Router();

const UserCtrl = require("../controllers/users");

router.get("*", (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

router.get("/", function(req, res, next) {
  res.json({ success: true });
});

router.post("/saveNewUser", UserCtrl.saveNewUser);

module.exports = router;
