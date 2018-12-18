const Users = require("../db/models/users");
const LocalStrategy = require("passport-local").Strategy;

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    "local",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await Users.findOne({ username: username });
        
        if (user) {
          done(null, user);
        } else {
          done("Пользователь не найден", false);
        }
      } catch (err) {
        done(err);
      }
    })
  );
};
