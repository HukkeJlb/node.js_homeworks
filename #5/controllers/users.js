const Users = require("../db/models/users");
const bcrypt = require("bcryptjs");
const uuid = require("uuid-v4");

module.exports.saveNewUser = async (req, res, next) => {
  const findUser = await Users.findOne({ username: req.body.username });

  if (findUser) {
    res.status(406).json({ error: "Данное имя уже используется" });
  } else {
    console.log('req body', req.body);
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new Users({
      username: req.body.username,
      surName: req.body.surName,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      password: '123',
    //   password: bcrypt.hashSync(password, salt),
      image: req.body.image,
      permissionId: uuid(),
      access_token: uuid()
    });
    try {
      await user.save();
    //   req.logIn(user, err => {
    //     if (err) {
    //       next(err);
    //     }
    //     res.status(200).json(user);
    //   });
    } catch (err) {
      next(err);
    }
  }
};
