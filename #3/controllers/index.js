const formidable = require("formidable");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const db = require("../models/db");
const mailConfig = require("../config/mailConfig.json");
const goods = db.getState().goods || [];
const stats = db.getState().stats || [];

module.exports.index = (req, res) => {
  res.render("./pages/index", { goods, stats });
};

module.exports.sendMail = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.message) {
    return res.render("./pages/index", {
      msgsemail: "Все поля нужно заполнить!",
      status: "Error",
      goods,
      stats,
      anchor: "email"
    });
  }
  const transporter = nodemailer.createTransport(mailConfig.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: mailConfig.mail.smtp.auth.user,
    subject: mailConfig.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return res.render("./pages/index", {
        msgsemail: "Что-то пошло не так...",
        status: "Error",
        goods,
        stats,
        anchor: "email"
      });
    }
    res.render("./pages/index", {
      msgsemail: "Письмо успешно отправлено!",
      status: "Error",
      goods,
      stats,
      anchor: "email"
    });
  });
};

module.exports.login = (req, res) => {
  res.render("./pages/login");
};

module.exports.auth = (req, res) => {
  const email = db.getState().user.email;
  const password = db.getState().user.password;

  if (email === req.body.email && password === req.body.password) {
    req.session.isAdmin = true;
    res.redirect("/admin");
  } else {
    const msgslogin = "Неверный логин/пароль";
    res.render("./pages/login", { msgslogin });
  }
};

module.exports.admin = (req, res) => {
  const stats = db.getState().stats || [];
  const msgskill = req.query.msgskill;
  const msgfile = req.query.msgfile;
  res.render("./pages/admin", { stats, msgskill, msgfile });
};

module.exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  let upload = path.join("./public", "upload");

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }

    const valid = validation(fields, files);

    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      return res.redirect(`/admin/?msgfile=${valid.status}`);
    }

    const fileName = path.join(upload, generateNewFilename(files.photo.name));

    fs.rename(files.photo.path, fileName, function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
      let dir = fileName.substr(fileName.indexOf("/"));

      db.get("goods")
        .push({
          photo: dir,
          name: fields.name,
          price: fields.price
        })
        .write();
      return res.redirect("/admin/?msgfile=Товар добавлен");
    });
  });
};

module.exports.updateStats = (req, res) => {
  db.unset("stats").write();
  db.set("stats", [
    { number: req.body.age, text: "Возраст начала занятий на скрипке" },
    { number: req.body.concerts, text: "Концертов отыграл" },
    { number: req.body.cities, text: "Максимальное число городов в туре" },
    { number: req.body.years, text: "Лет на сцене в качестве скрипача" }
  ]).write();
  return res.redirect("/admin/?msgskill=Информация обновлена");
};

const validation = (fields, files) => {
  if (files.photo.name === "" || files.photo.size === 0) {
    return { status: "Не загружена картинка!", err: true };
  }
  if (!fields.name) {
    return { status: "Не указано имя товара!", err: true };
  }
  if (!fields.price) {
    return { status: "Не указано цена товара!", err: true };
  }
  return { status: "Ok", err: false };
};

const generateNewFilename = filename => {
  var string = "";
  var extension = path.extname(filename);
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  var newFilename = string + extension;

  return newFilename;
};
