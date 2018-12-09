const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");
const controllers = require("../controllers");

router.get("/", controllers.index);

router.post("/", koaBody(), controllers.sendMail);

router.get("/login", controllers.login);

router.post("/login", koaBody(), controllers.auth);

const isAdmin = (ctx, next) => {
  if (ctx.session.isAdmin) {
    return next();
  }
  ctx.redirect("login");
};

router.get("/admin", isAdmin, controllers.admin);

router.post(
  "/admin/upload",
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + "/public/upload"
    },
    formLimit: 1000000
  }),
  controllers.createProduct
);

router.post("/admin/skills", koaBody(), controllers.updateStats);

module.exports = router;
