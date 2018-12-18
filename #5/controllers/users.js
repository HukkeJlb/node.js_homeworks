const Users = require("../db/models/users");
const bcrypt = require("bcryptjs");
const uuid = require("uuid-v4");
const passport = require('passport')
const formDataParser = require("../helpers/formDataParser");

module.exports.saveNewUser = (req, res, next) => {
  const formData = formDataParser(req.text);
  Users.find({ username: formData.username }, function(err, users) {
    if (users.length) {
      return res.status(406).json({ error: "Данное имя уже используется" });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const password = formData.password;
      const user = new Users({
        username: formData.username,
        surName: formData.surName,
        firstName: formData.firstName,
        middleName: formData.middleName,
        password: bcrypt.hashSync(password, salt),
        image: formData.image,
        permissionId: uuid(),
        access_token: uuid()
      });
      try {
        user.save();
        // res.status(200).json(user);
        req.logIn(user, err => {
          if (err) {
            next(err);
          }
          res.status(200).send(user);
        });
      } catch (err) {
        next(err);
      }
    }
  });
};

module.exports.login = async (req, res, next) => {
  passport.authenticate("local", async (err, user) => {
    try {
      if (!user) {
        res.json({ error: "Пользователь не найден" });
      } else {
        const formData = formDataParser(req.text);
        if (formData.remembered) {
          const token = uuidv4();
          user.setToken(token);
          await user.save();
          res.cookie("auth_token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 7 * 60 * 60 * 1000
          });
        }

        req.logIn(user, err => {
          if (err) {
            next(err);
          }
          res.json(user);
        });
      }
    } catch (err) {
      next(err);
    }
  })(req, res, next);
};
