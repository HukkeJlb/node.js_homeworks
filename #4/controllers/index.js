const fs = require("fs");
const path = require("path");
const db = require("../models/db");
const nodemailer = require("nodemailer");
const mailConfig = require("../config/mailConfig.json");
const goods = db.getState().goods || [];
const stats = db.getState().stats || [];

module.exports.index = async ctx => {
  const loggedIn = ctx.session.isAdmin;
  const msgemail = (await ctx.flash.get()) ? ctx.flash.get().msgemail : null;
  const anchor = (await ctx.flash.get()) ? ctx.flash.get().anchor : null;
  ctx.render("./pages/index", { goods, stats, loggedIn, msgemail, anchor });
};

module.exports.sendMail = async ctx => {
  if (
    !ctx.request.body.name ||
    !ctx.request.body.email ||
    !ctx.request.body.message
  ) {
    ctx.flash.set({ msgemail: "Все поля необходимо заполнить", anchor: '#email' });
    return ctx.redirect("/");
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
  await transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      ctx.flash.set({ msgemail: "Что-то пошло не так...", anchor: '#email' });
      return ctx.redirect("/");
    }
  });
  await ctx.flash.set({ msgemail: "Письмо отправлено", anchor: '#email' });
  ctx.redirect("/");
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

module.exports.admin = async ctx => {
  const stats = db.getState().stats || [];
  const msgfile = (await ctx.flash.get()) ? ctx.flash.get().msgfile : null;
  const msgskill = (await ctx.flash.get()) ? ctx.flash.get().msgskill : null;
  ctx.render("./pages/admin", { stats, msgskill, msgfile });
};

module.exports.createProduct = async ctx => {
  const productName = ctx.request.body.name;
  const productPrice = ctx.request.body.price;
  const uploadDir = path.join("./public", "upload");
  const { name, size } = ctx.request.files.photo;
  const filePath = ctx.request.files.photo.path;
  const valid = validation(productName, productPrice, name, size);

  if (valid.err) {
    fs.unlinkSync(filePath);
    ctx.flash.set({ msgfile: valid.status });
    return ctx.redirect("/admin/");
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
    ctx.flash.set({ msgfile: "Информация обновлена" });
    ctx.status = 201;
    ctx.redirect("/admin");
  });
};

module.exports.updateStats = async ctx => {
  db.unset("stats").write();
  await db
    .set("stats", [
      {
        number: ctx.request.body.age,
        text: "Возраст начала занятий на скрипке"
      },
      { number: ctx.request.body.concerts, text: "Концертов отыграл" },
      {
        number: ctx.request.body.cities,
        text: "Максимальное число городов в туре"
      },
      {
        number: ctx.request.body.years,
        text: "Лет на сцене в качестве скрипача"
      }
    ])
    .write();
  await ctx.flash.set({ msgskill: "Информация обновлена" });
  ctx.redirect("/admin");
};

const validation = (productName, price, name, size) => {
  if (productName === "") {
    return { status: "Не указано имя товара!", err: true };
  }

  if (price === "") {
    return { status: "Не указана цена товара!", err: true };
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
