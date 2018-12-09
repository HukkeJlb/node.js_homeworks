const fs = require("fs");
const path = require("path");
const db = require("../models/db");
const nodemailer = require("nodemailer");
const mailConfig = require("../config/mailConfig.json");
const goods = db.getState().goods || [];
const stats = db.getState().stats || [];

module.exports.index = ctx => {
  const loggedIn = ctx.session.isAdmin;
  ctx.render("./pages/index", { goods, stats, loggedIn });
};

module.exports.sendMail = ctx => {
  if (
    !ctx.request.body.name ||
    !ctx.request.body.email ||
    !ctx.request.body.message
  ) {
    return ctx.render("./pages/index", {
      msgsemail: "Все поля нужно заполнить!",
      status: "Error",
      goods,
      stats,
      anchor: "email"
    });
  }
  const transporter = nodemailer.createTransport(mailConfig.mail.smtp);
  const mailOptions = {
    from: `"${ctx.request.body.name}" <${ctx.request.body.email}>`,
    to: mailConfig.mail.smtp.auth.user,
    subject: mailConfig.mail.subject,
    text:
      ctx.request.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${ctx.request.body.email}>`
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return ctx.render("./pages/index", {
        msgsemail: "Что-то пошло не так...",
        status: "Error",
        goods,
        stats,
        anchor: "email"
      });
    }
    ctx.render("./pages/index", {
      msgsemail: "Письмо успешно отправлено!",
      status: "OK",
      goods,
      stats,
      anchor: "email"
    });
  });
};

module.exports.login = ctx => {
  ctx.render("./pages/login");
};

module.exports.auth = ctx => {
  const email = db.getState().user.email;
  const password = db.getState().user.password;

  if (
    email === ctx.request.body.email &&
    password === ctx.request.body.password
  ) {
    ctx.session.isAdmin = true;
    ctx.redirect("/admin");
  } else {
    const msgslogin = "Неверный логин/пароль";
    ctx.render("./pages/login", { msgslogin });
  }
};

module.exports.admin = ctx => {
  const stats = db.getState().stats || [];
  const msgskill = ctx.query.msgskill;
  const msgfile = ctx.query.msgfile;
  ctx.render("./pages/admin", { stats, msgskill, msgfile });
};

module.exports.createProduct = ctx => {
  const productName = ctx.request.body.name;
  const productPrice = ctx.request.body.price;
  const uploadDir = path.join("./public", "upload");
  const { name, size } = ctx.request.files.photo;
  const filePath = ctx.request.files.photo.path;
  const valid = validation(productName, productPrice, name, size);

  if (valid.err) {
    fs.unlinkSync(filePath);
    return ctx.redirect(`/admin/?msgfile=${valid.status}`);
  }

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const fileName = path.join(uploadDir, generateNewFilename(name));

  fs.rename(filePath, fileName, function(err) {
    if (err) {
      console.error(err.message);
      return;
    }
    let dir = fileName.substr(fileName.indexOf("/"));

    db.get("goods")
      .push({
        photo: dir,
        name: productName,
        price: productPrice
      })
      .write();
    ctx.redirect("/admin/?msgfile=Товар добавлен");
  });
};

module.exports.updateStats = ctx => {
  db.unset("stats").write();
  db.set("stats", [
    { number: ctx.request.body.age, text: "Возраст начала занятий на скрипке" },
    { number: ctx.request.body.concerts, text: "Концертов отыграл" },
    {
      number: ctx.request.body.cities,
      text: "Максимальное число городов в туре"
    },
    { number: ctx.request.body.years, text: "Лет на сцене в качестве скрипача" }
  ]).write();
  return ctx.redirect("/admin/?msgskill=Информация обновлена");
};

const validation = (productName, price, name, size) => {
  if (productName === "") {
    return { status: "Не указано имя товара!", err: true };
  }

  if (price === "") {
    return { status: "Не указано цена товара!", err: true };
  }

  if (name === "" || size === 0) {
    return { status: "Не загружена картинка!", err: true };
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
