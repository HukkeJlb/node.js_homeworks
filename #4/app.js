const Koa = require("koa");
const app = new Koa();
const static = require("koa-static");
const session = require("koa-session");
const router = require("./routes");
const errorHandler = require("./helpers/error");
const config = require("./config/mainConfig.json");

const Pug = require("koa-pug");
const pug = new Pug({
  viewPath: "./views",
  pretty: false,
  noCache: true,
  basedir: "./views",
  app: app // equals to pug.use(app) and app.use(pug.middleware)
});

app.use(static("./public"));

app.use(errorHandler);
app.on("error", (err, ctx) => {
  ctx.render("./pages/error", {
    status: ctx.response.status,
    error: ctx.response.message,
    stack: err
  });
});

app
  .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port " + server.address().port);
});
