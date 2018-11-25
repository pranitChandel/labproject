const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("./keys");

const connection = require("../dbconnection");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      connection.query(
        "SELECT * from User where Userid = ?",
        [jwt_payload.Userid],
        (err, result) => {
          if (err) console.log(err);
          else if (result) return done(null, result);
          else return done(null, false);
        }
      );
    })
  );
};
