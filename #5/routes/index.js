const express = require("express");
const path = require('path');
const router = express.Router();

const UserCtrl = require("../controllers/users");
const NewsCtrl = require("../controllers/news");

router.get('*', async (req, res, next) =>{
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
    next();
});

router.get("/", function(req, res, next) {
  res.json({ success: true });
});

/** 
 * User routes
*/
// router.get("/getUsers", UserCtrl.getUsers);
router.post("/saveNewUser", UserCtrl.saveNewUser);
router.post("/login", UserCtrl.login);
// router.post("/authFromToken", UserCtrl.authFromToken);
// router.post("/saveUserImage/:id", UserCtrl.saveUserImage);
router.put('/updateUser/:id', UserCtrl.updateUser);
// router.put("/updateUserPermission/:id", UserCtrl.updateUserPermission);
router.delete('/deleteUser/:id', UserCtrl.deleteUser);


/**
 * News routes
 */
router.get("/getNews", NewsCtrl.getNews);
router.post("/newNews", NewsCtrl.newNews);
router.put("/updateNews/:id", NewsCtrl.updateNews);
router.delete("/deleteNews/:id", NewsCtrl.deleteNews);
module.exports = router;
